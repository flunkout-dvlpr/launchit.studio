import { boot } from 'quasar/wrappers'

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// No ID configured (local dev, or just not set up yet) — everything below
// silently no-ops rather than erroring, so this is always safe to leave
// unset.
let enabled = false

function gtag () {
  window.dataLayer.push(arguments)
}

export default boot(({ router }) => {
  if (!MEASUREMENT_ID) return

  window.dataLayer = window.dataLayer || []
  gtag('js', new Date())
  // send_page_view: false — gtag's own automatic pageview only fires once,
  // on the initial script load. Every navigation after that is client-side
  // routing that never reloads the page, so without this we'd only ever
  // see the very first page anyone lands on and nothing else. The router
  // hook below sends a page_view on every route change instead.
  gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  enabled = true

  router.afterEach((to) => {
    gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title,
      page_location: window.location.origin + to.fullPath
    })
  })
})

// Shared helper for CTA/click tracking elsewhere in the app — wraps the
// same gtag() used above so call sites don't need to know GA's specific
// API shape, and so tracking a click is one line: trackEvent('cta_click',
// { label: 'submit-a-use-case' }).
export function trackEvent (name, params = {}) {
  if (!enabled) return
  gtag('event', name, params)
}
