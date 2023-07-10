import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/supplier',
  name: 'supplier',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.supplier', // 一级菜单名
    requiresAuth: true, // 是否需要登录鉴权
    icon: 'icon-list', // 菜单配置icon
    order: 12, // 排序路由菜单项。如果设置该值，值越高，越靠前
  },
  children: [
    {
      path: 'purchaseOrder', // The midline path complies with SEO specifications
      name: 'supplierPurchaseOrder',
      component: () => import('@/views/supplier/purchase-order/index.vue'),
      meta: {
        locale: 'menu.supplier.PurchaseOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

// 这个不能忘
export default LIST;
