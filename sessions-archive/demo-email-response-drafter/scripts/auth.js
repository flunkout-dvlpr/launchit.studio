// One-time OAuth authorization. Opens a browser, asks you to approve
// access, and saves the resulting token to token.json so future runs
// don't need to re-authorize.

const fs = require('fs').promises
const path = require('path')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

// gmail.compose is only needed for the stretch goal (saving real Gmail
// drafts). Add it here once you're ready for that step.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

const TOKEN_PATH = path.join(__dirname, '..', 'token.json')
const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json')

async function loadSavedCredentialsIfExist () {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials (client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

async function authorize () {
  let client = await loadSavedCredentialsIfExist()
  if (client) {
    console.log('Already authorized, token.json exists.')
    return client
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  })
  if (client.credentials) {
    await saveCredentials(client)
    console.log('Authorization complete, saved to token.json.')
  }
  return client
}

authorize().catch(err => {
  console.error('Authorization failed:', err.message)
  process.exit(1)
})
