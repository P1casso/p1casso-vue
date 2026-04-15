// eslint-disable-next-line
import { BasicLayout } from '@/layouts'
import { csgo, game, log, playStation, setting, investment } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'index' },
    redirect: '/game/gameList',
    children: [
      {
        path: '/',
        name: 'game',
        component: RouteView,
        redirect: '/game/gameList',
        meta: { title: '游戏', icon: game },
        children: [
          {
            path: '/game/gameList',
            name: 'gameList',
            component: () => import('@/views/game/gameList.vue'),
            meta: { title: '游戏列表' },
          },
        ],
      },

      {
        path: '/playStation',
        name: 'PlayStation',
        component: RouteView,
        redirect: '/playStation/summary',
        meta: { title: 'playStation', icon: playStation },
        children: [
          {
            path: '/playStation/summary',
            name: 'PsGame',
            component: () => import('@/views/game/PsGame.vue'),
            meta: { title: '总览' },
          },
          {
            path: '/playStation/gameList',
            name: 'playStationGameList',
            component: () => import('@/views/playstation/GameList.vue'),
            meta: { title: '游戏列表' },
          },
          {
            path: '/playStation/game_details',
            name: 'GameDetails',
            component: () => import('@/views/playstation/GameDetail.vue'),
            hidden: true,
            meta: { title: '游戏详情' },
          },
          {
            path: '/game/trophy_details',
            name: 'trophy_details',
            component: () => import('@/views/game/TrophyDetails.vue'),
            hidden: true,
            meta: { title: 'PS成就明细' },
          },
        ],
      },

      {
        path: '/cs/skin',
        name: 'csSkin',
        component: RouteView,
        redirect: 'skin_tacking',
        meta: { title: 'CS 皮肤', icon: csgo },
        children: [
          {
            path: 'skin_tacking',
            name: 'SkinTracking',
            component: () => import('@/views/skin/SkinTracking.vue'),
            meta: { title: '正在监听', keepAlive: true },
          },
          {
            path: 'price/history',
            name: 'PriceHistory',
            component: () => import('@/views/skin/PriceHistory.vue'),
            meta: { title: '历史价格', keepAlive: true },
          },
        ],
      },

      {
        path: '/investment',
        name: 'Investment',
        component: RouteView,
        redirect: '/investment/dashboard',
        meta: { title: '投资管理', icon: investment },
        children: [
          {
            path: '/investment/stock',
            name: 'StockManagement',
            component: () => import('@/views/investment/StockManagement.vue'),
            meta: { title: '股票管理' },
          },
          {
            path: '/investment/dashboard',
            name: 'InvestmentDashboard',
            component: () => import('@/views/investment/InvestmentDashboard.vue'),
            meta: { title: '统计报表' },
          },
          {
            path: '/investment/records',
            name: 'InvestmentRecords',
            component: () => import('@/views/investment/InvestmentRecords.vue'),
            meta: { title: '投资记录' },
          },
          {
            path: '/investment/weekly',
            name: 'WeeklyStatistics',
            component: () => import('@/views/investment/WeeklyStatistics.vue'),
            meta: { title: '周统计' },
          },
        ],
      },

      // {
      //   path: '/list',
      //   name: 'list',
      //   component: RouteView,
      //   redirect: '/list/table-list',
      //   meta: { title: 'menu.list', icon: 'table', permission: ['table'] },
      //   children: [
      //     {
      //       path: '/list/table-list/:pageNo([1-9]\\d*)?',
      //       name: 'TableListWrapper',
      //       hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
      //       component: () => import('@/views/list/TableList'),
      //       meta: { title: 'menu.list.table-list', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'BasicList',
      //       component: () => import('@/views/list/BasicList'),
      //       meta: { title: 'menu.list.basic-list', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/list/card',
      //       name: 'CardList',
      //       component: () => import('@/views/list/CardList'),
      //       meta: { title: 'menu.list.card-list', keepAlive: true, permission: ['table'] }
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'SearchList',
      //       component: () => import('@/views/list/search/SearchLayout'),
      //       redirect: '/list/search/article',
      //       meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
      //       children: [
      //         {
      //           path: '/list/search/article',
      //           name: 'SearchArticles',
      //           component: () => import('../views/list/search/Article'),
      //           meta: { title: 'menu.list.search-list.articles', permission: ['table'] }
      //         },
      //         {
      //           path: '/list/search/project',
      //           name: 'SearchProjects',
      //           component: () => import('../views/list/search/Projects'),
      //           meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
      //         },
      //         {
      //           path: '/list/search/application',
      //           name: 'SearchApplications',
      //           component: () => import('../views/list/search/Applications'),
      //           meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   path: '/body',
      //   name: 'body',
      //   component: RouteView,
      //   redirect: '/body/data',
      //   meta: { title: '锻炼' },
      //   children: [
      //     {
      //       path: '/body/data',
      //       name: 'BodyData',
      //       component: () => import('@/views/body/physicalData.vue'),
      //       meta: { title: '身体数据', keepAlive: true },
      //     },
      //     {
      //       path: '/body/compare',
      //       name: 'PhysicalDataCompare',
      //       hidden: true,
      //       component: () => import('@/views/body/PhysicalDataCompare.vue'),
      //       meta: { title: '身体数据比较', keepAlive: true },
      //     },
      //   ],
      // },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting/index.vue'),
        meta: { title: '设置', keepAlive: true, icon: setting },
      },
      {
        path: '/log',
        name: 'log',
        component: () => import('@/views/log/log.vue'),
        meta: { title: '日志', keepAlive: true, icon: log },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]
