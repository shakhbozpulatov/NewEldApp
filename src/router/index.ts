import { createWebHistory, createRouter } from 'vue-router'
// import AuthRoutes from '@/modules/Auth/router'
// import { checkRouteIsExist } from './middleware'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/Default/PIndex.vue'),
      children: [],
    },
    // {
    //   path: '/overview',
    //   name: 'overview',
    //   component: () => import('@/views/OverviewView.vue'),
    // },
    // {
    //   path: '/vehicles',
    //   name: 'vehicles',
    //   component: () => import('@/views/VehiclesView.vue'),
    // },
    // {
    //   path: '/drivers',
    //   name: 'drivers',
    //   component: () => import('@/views/DriversView.vue'),
    // },
    // ...AuthRoutes,
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('@/pages/PError.vue'),
    // },
  ],
})

// router.beforeEach(checkRouteIsExist)

export default router
