
const routes = [
  {
    path: '/',
    component: () => import('pages/LandingPage.vue')
  },
  {
    path: '/billers',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/Index.vue') },
      { path: '', name: 'billers', component: () => import('pages/Billers.vue') },
      { path: ':id', name: 'select_biller', component: () => import('pages/Biller.vue') }
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
        path: 'options/set-device-uuid',
        name: 'set_device_uuid',
        component: () => import('pages/setup/SetDeviceUuid.vue')
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
