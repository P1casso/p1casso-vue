// eslint-disable-next-line
import { BasicLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/game/gameList',
    children: [
      {
        path: '/',
        name: 'game',
        component: RouteView,
        redirect: '/game/gameList',
        meta: { title: '游戏', icon: 'profile', permission: ['setting'] },
        children: [
          {
            path: '/game/gameList',
            name: 'gameList',
            component: () => import('@/views/game/gameList.vue'),
            meta: { title: '游戏列表', permission: ['setting'] }
          },
          {
            path: '/game/statistics',
            name: 'statistics',
            component: () => import('@/views/game/statistics.vue'),
            meta: { title: 'PS统计', permission: ['setting'] }
          },
          {
            path: '/game/trophy_details',
            name: 'trophy_details',
            component: () => import('@/views/game/TrophyDetails.vue'),
            hidden: true,
            meta: { title: 'PS成就明细', permission: ['setting'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
