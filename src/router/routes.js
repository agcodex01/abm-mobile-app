const routes = [
  {
    path: '/',
    name: 'landing_page',
    component: () => import('pages/LandingPage.vue')
  },
  {
    path: '/billers',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'billers',
        meta: {
          redirectTo: 'landing_page'
        },
        component: () => import('pages/Billers.vue')
      },
      {
        path: ':id',
        name: 'select_biller',
        meta: {
          redirectTo: 'billers'
        },
        component: () => import('pages/Biller.vue')
      }
    ]
  },
  {
    path: '/setup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'options',
        meta: {
          redirectTo: 'landing_page',
          requireAuth: true
        },
        component: () => import('pages/setup/Options.vue')
      },
      {
        path: 'options/config',
        name: 'set_device_config',
        meta: {
          redirectTo: 'options',
          requireAuth: true
        },
        component: () => import('src/pages/setup/Config.vue')
      },
      {
        path: 'options/history/transactions',
        name: 'view_transaction_logs',
        meta: {
          redirectTo: 'options',
          requireAuth: true
        },
        component: () => import('src/pages/setup/History.vue')
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
