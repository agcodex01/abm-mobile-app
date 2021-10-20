
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
        component: () => import('pages/Billers.vue')
      },
      {
        path: ':id',
        name: 'select_biller',
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
        component: () => import('pages/setup/Options.vue')
      },
      {
        path: 'options/config',
        name: 'set_device_config',
        component: () => import('src/pages/setup/Config.vue')
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
