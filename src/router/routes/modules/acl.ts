import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/acl',
  name: 'acl',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.acl', // 一级菜单名
    requiresAuth: true, // 是否需要登录鉴权
    icon: 'icon-command', // 菜单配置icon
    order: 1, // 排序路由菜单项。如果设置该值，值越高，越靠前
  },
  children: [
    {
      path: 'admin', // The midline path complies with SEO specifications
      name: 'admin',
      component: () => import('@/views/acl/admin/index.vue'),
      meta: {
        locale: 'menu.acl.admin',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'role', // The midline path complies with SEO specifications
      name: 'role',
      component: () => import('@/views/acl/role/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.acl.role',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'permission', // The midline path complies with SEO specifications
      name: 'permission',
      component: () => import('@/views/acl/permission/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.acl.permission',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
