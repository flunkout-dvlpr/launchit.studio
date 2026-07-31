const routes = [
  // Placeholder root — the rest of launchit.studio is being rebuilt on this
  // stack. Sessions is the first real section, at /sessions.
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  {
    path: '/sessions',
    component: () => import('layouts/SessionsLayout.vue'),
    children: [
      { path: '', name: 'sessions-home', component: () => import('pages/sessions/SessionsHome.vue') },
      { path: 'about', name: 'sessions-about', component: () => import('pages/sessions/AboutPage.vue') },
      { path: 'framework', name: 'sessions-framework', component: () => import('pages/sessions/FrameworkPage.vue') },
      { path: 'setup', name: 'sessions-setup', component: () => import('pages/sessions/SetupPage.vue') },
      { path: 'submit', name: 'sessions-submit', component: () => import('pages/sessions/SubmitPage.vue') },
      { path: 'prep', name: 'sessions-prep-index', component: () => import('pages/sessions/PrepIndexPage.vue') },
      { path: 'prep/:slug', name: 'sessions-prep-artifact', component: () => import('pages/sessions/PrepArtifactPage.vue'), props: true }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
