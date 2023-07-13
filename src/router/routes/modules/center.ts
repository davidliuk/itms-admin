import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/center',
  name: 'center',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.center', // 一级菜单名
    requiresAuth: true, // 是否需要登录鉴权
    icon: 'icon-list', // 菜单配置icon
    order: 10, // 排序路由菜单项。如果设置该值，值越高，越靠前
  },
  children: [
    // {
    //   path: 'search-table', // The midline path complies with SEO specifications
    //   name: 'centerSearchTable',
    //   components: () => import('@/views/center/search-table/index.vue'),
    //   meta: {
    //     locale: 'menu.center.searchTable',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'skuWare', // The midline path complies with SEO specifications
      name: 'centerSkuWare',
      component: () => import('@/views/center/skuware/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.skuWare',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'transfer_order', // The midline path complies with SEO specifications
    //   name: 'centerTransferOrder',
    //   components: () => import('@/views/center/transfer_order/index.vue'),
    //   meta: {
    //     // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
    //     locale: 'menu.center.transferOrder',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'checkOrder', // The midline path complies with SEO specifications
      name: 'centerCheckOrder',
      component: () => import('@/views/center/check-order/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.CheckOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'transferOrder',
      name: 'centerTransferOrder',
      component: () => import('@/views/center/transfer-order/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.TransferOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'workOrder',
    //   name: 'centerWorkOrder',
    //   components: () => import('@/views/center/work-order/index.vue'),
    //   meta: {
    //     // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
    //     locale: 'menu.center.WorkOrder',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'storageOrder',
      name: 'centerStorageOrder',
      component: () => import('@/views/center/storage-order/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.StorageOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'purchaseOrder',
      name: 'centerPurChaseOrder',
      component: () => import('@/views/center/purchase-order/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.PurchaseOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'logistics',
      name: 'centerLogistics',
      component: () => import('@/views/center/logistics-table/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.Logistics',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'station-table', // The midline path complies with SEO specifications
      name: 'StationTable',
      component: () => import('@/views/center/station-table/index.vue'),
      meta: {
        locale: 'menu.center.stationTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'skuListInWare', // The midline path complies with SEO specifications
      name: 'skuListInWare',
      component: () =>
        import('@/views/center/skuware/components/skuInWare.vue'),
      meta: {
        hideInMenu: true,
        locale: '批量进货',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
