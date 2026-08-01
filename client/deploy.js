#!/usr/bin/env node
// Deploys client/dist/spa to S3 + CloudFront. Safe to re-run: reuses
// whatever it already created (bucket, OAC, distribution) rather than
// creating duplicates every time, tracked via deploy-state.json.
//
// Usage: node deploy.js

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const {
  S3Client, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand,
  PutPublicAccessBlockCommand, DeleteBucketWebsiteCommand,
  ListObjectsV2Command, PutObjectCommand, DeleteObjectsCommand
} = require('@aws-sdk/client-s3')
const {
  CloudFrontClient, ListOriginAccessControlsCommand, CreateOriginAccessControlCommand,
  CreateDistributionCommand, GetDistributionCommand, CreateInvalidationCommand
} = require('@aws-sdk/client-cloudfront')
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts')
const mime = require('mime-types')

const REGION = 'us-east-2' // where the www.launchit.studio bucket already lives
const BUCKET_NAME = 'www.launchit.studio'
const DOMAINS = ['launchit.studio', 'www.launchit.studio']
const CERT_ARN = 'arn:aws:acm:us-east-1:496660477431:certificate/06a09c48-006b-4b2a-88a9-b46c8fbc73e0'
const BUILD_DIR = path.join(__dirname, 'dist', 'spa')
const STATE_PATH = path.join(__dirname, 'deploy-state.json')

const s3 = new S3Client({ region: REGION })
const cloudfront = new CloudFrontClient({ region: 'us-east-1' }) // CloudFront API is always us-east-1
const sts = new STSClient({ region: REGION })

function loadState () {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'))
  } catch (err) {
    return {}
  }
}

function saveState (state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2))
}

async function ensureBucket () {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }))
    console.log(`Bucket ${BUCKET_NAME} already exists, reusing.`)
  } catch (err) {
    console.log(`Creating bucket ${BUCKET_NAME}...`)
    await s3.send(new CreateBucketCommand({
      Bucket: BUCKET_NAME,
      CreateBucketConfiguration: { LocationConstraint: REGION }
    }))
  }

  // This bucket previously served as a public S3 static website (no
  // CloudFront in front). Moving to a private bucket read only via
  // CloudFront OAC, so drop the website config and block public access.
  try {
    await s3.send(new DeleteBucketWebsiteCommand({ Bucket: BUCKET_NAME }))
    console.log('Removed legacy S3 static-website-hosting config.')
  } catch (err) {
    // Fine if it was already gone.
  }

  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: BUCKET_NAME,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      IgnorePublicAcls: true,
      BlockPublicPolicy: true,
      RestrictPublicBuckets: true
    }
  }))
}

async function ensureOac () {
  const existing = await cloudfront.send(new ListOriginAccessControlsCommand({}))
  const found = existing.OriginAccessControlList.Items?.find(o => o.Name === 'launchit-studio-oac')
  if (found) {
    console.log('OAC already exists, reusing.')
    return found.Id
  }
  console.log('Creating Origin Access Control...')
  const res = await cloudfront.send(new CreateOriginAccessControlCommand({
    OriginAccessControlConfig: {
      Name: 'launchit-studio-oac',
      OriginAccessControlOriginType: 's3',
      SigningBehavior: 'always',
      SigningProtocol: 'sigv4'
    }
  }))
  return res.OriginAccessControl.Id
}

async function ensureDistribution (oacId, state) {
  if (state.distributionId) {
    console.log(`Distribution ${state.distributionId} already exists, reusing.`)
    const res = await cloudfront.send(new GetDistributionCommand({ Id: state.distributionId }))
    return { id: state.distributionId, domain: res.Distribution.DomainName }
  }

  const originDomain = `${BUCKET_NAME}.s3.${REGION}.amazonaws.com`
  console.log('Creating CloudFront distribution...')
  const res = await cloudfront.send(new CreateDistributionCommand({
    DistributionConfig: {
      CallerReference: `launchit-studio-${Date.now()}`,
      Comment: 'launchit.studio',
      Enabled: true,
      Aliases: { Quantity: DOMAINS.length, Items: DOMAINS },
      DefaultRootObject: 'index.html',
      Origins: {
        Quantity: 1,
        Items: [{
          Id: 'launchit-studio-origin',
          DomainName: originDomain,
          OriginAccessControlId: oacId,
          S3OriginConfig: { OriginAccessIdentity: '' }
        }]
      },
      DefaultCacheBehavior: {
        TargetOriginId: 'launchit-studio-origin',
        ViewerProtocolPolicy: 'redirect-to-https',
        // Managed CachingOptimized policy id (same for every AWS account).
        CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
        Compress: true
      },
      CustomErrorResponses: {
        Quantity: 2,
        Items: [
          { ErrorCode: 403, ResponseCode: '200', ResponsePagePath: '/index.html', ErrorCachingMinTTL: 10 },
          { ErrorCode: 404, ResponseCode: '200', ResponsePagePath: '/index.html', ErrorCachingMinTTL: 10 }
        ]
      },
      ViewerCertificate: {
        ACMCertificateArn: CERT_ARN,
        SSLSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1.2_2021'
      },
      PriceClass: 'PriceClass_100'
    }
  }))
  return { id: res.Distribution.Id, domain: res.Distribution.DomainName }
}

async function ensureBucketPolicy (distributionId) {
  const account = await sts.send(new GetCallerIdentityCommand({}))
  const policy = {
    Version: '2012-10-17',
    Statement: [{
      Sid: 'AllowCloudFrontServicePrincipal',
      Effect: 'Allow',
      Principal: { Service: 'cloudfront.amazonaws.com' },
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
      Condition: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${account.Account}:distribution/${distributionId}`
        }
      }
    }]
  }
  await s3.send(new PutBucketPolicyCommand({ Bucket: BUCKET_NAME, Policy: JSON.stringify(policy) }))
  console.log('Bucket policy scoped to this distribution.')
}

function walk (dir, base = dir) {
  let files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(walk(full, base))
    } else {
      files.push(path.relative(base, full).replace(/\\/g, '/'))
    }
  }
  return files
}

async function syncFiles () {
  const localFiles = walk(BUILD_DIR)
  console.log(`Uploading ${localFiles.length} files...`)

  for (const key of localFiles) {
    const filePath = path.join(BUILD_DIR, key)
    const isIndex = key === 'index.html'
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fs.readFileSync(filePath),
      ContentType: mime.lookup(filePath) || 'application/octet-stream',
      CacheControl: isIndex ? 'no-cache' : 'public, max-age=31536000, immutable'
    }))
  }

  // Delete anything in the bucket that isn't part of this build.
  const existing = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }))
  const remoteKeys = (existing.Contents || []).map(o => o.Key)
  const stale = remoteKeys.filter(k => !localFiles.includes(k))
  if (stale.length > 0) {
    console.log(`Removing ${stale.length} stale file(s)...`)
    await s3.send(new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: { Objects: stale.map(Key => ({ Key })) }
    }))
  }
}

async function invalidate (distributionId) {
  console.log('Invalidating CloudFront cache...')
  await cloudfront.send(new CreateInvalidationCommand({
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: `invalidate-${Date.now()}`,
      Paths: { Quantity: 1, Items: ['/*'] }
    }
  }))
}

async function main () {
  console.log('Building app...')
  execSync('npx quasar build', { stdio: 'inherit', cwd: __dirname })

  const state = loadState()

  await ensureBucket()
  const oacId = await ensureOac()
  const { id: distributionId, domain: distributionDomain } = await ensureDistribution(oacId, state)
  await ensureBucketPolicy(distributionId)
  await syncFiles()
  await invalidate(distributionId)

  saveState({ ...state, bucket: BUCKET_NAME, oacId, distributionId, distributionDomain })

  console.log('\nDone.')
  console.log(`CloudFront domain: https://${distributionDomain}`)
  if (!state.distributionId) {
    console.log('\nThis was a first-time deploy. The distribution can take 10-15 minutes to')
    console.log('finish propagating. Test against the CloudFront domain above before pointing')
    console.log('DNS at it.')
  }
}

main().catch(err => {
  console.error('Deploy failed:', err)
  process.exit(1)
})
