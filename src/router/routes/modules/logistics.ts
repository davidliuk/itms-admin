import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/logistics',
  name: 'logistics',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.logistics', // 一级菜单名
    requiresAuth: true, // 是否需要登录鉴权
    icon: 'icon-list', // 菜单配置icon
    order: 11, // 排序路由菜单项。如果设置该值，值越高，越靠前
  },
  children: [
    {
      path: 'logistics-check-order', // The midline path complies with SEO specifications
      name: 'logisticsCheckOrder',
      component: () =>
        import('@/views/logistics/logistics-check-order/index.vue'),
      meta: {
        locale: 'menu.logistics.LogCheckOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
