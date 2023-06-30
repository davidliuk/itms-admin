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
    {
      path: 'search-table', // The midline path complies with SEO specifications
      name: 'centerSearchTable',
      component: () => import('@/views/center/search-table/index.vue'),
      meta: {
        locale: 'menu.center.searchTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'project_stock', // The midline path complies with SEO specifications
      name: 'centerProjectStock',
      component: () => import('@/views/center/project/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.centerStock',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'transfer_order', // The midline path complies with SEO specifications
      name: 'centerTransferOrder',
      component: () => import('@/views/center/transfer_order/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.center.transferOrder',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
