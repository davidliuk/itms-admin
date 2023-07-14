import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/product',
  name: 'product',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.product', // 一级菜单名
    requiresAuth: true, // 是否需要登录鉴权
    icon: 'icon-tags', // 菜单配置icon
    order: 1, // 排序路由菜单项。如果设置该值，值越高，越靠前
  },
  children: [
    {
      path: 'attr-group', // The midline path complies with SEO specifications
      name: 'attr-group',
      component: () => import('@/views/product/attr-group/index.vue'),
      meta: {
        locale: 'menu.product.attr-group',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'attr/:groupId', // The midline path complies with SEO specifications
      name: 'attr',
      component: () => import('@/views/product/attr/index.vue'),
      meta: {
        hideInMenu: true,
        locale: 'menu.product.attr',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'category', // The midline path complies with SEO specifications
      name: 'category',
      component: () => import('@/views/product/category/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.product.category',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sku', // The midline path complies with SEO specifications
      name: 'sku',
      component: () => import('@/views/product/sku/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.product.sku',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sku/create', // The midline path complies with SEO specifications
      name: 'skuCreate',
      component: () => import('@/views/product/sku-create/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        hideInMenu: true,
        locale: 'menu.product.sku',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'sku/edit/:skuId', // The midline path complies with SEO specifications
      name: 'skuEdit',
      component: () => import('@/views/product/sku-edit/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        hideInMenu: true,
        locale: 'menu.product.sku',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'supplier', // The midline path complies with SEO specifications
      name: 'supplier',
      component: () => import('@/views/product/supplier/index.vue'),
      meta: {
        // 这个名字定义在views的zhCN里，然后要把locale的zhCN引入全局locale
        locale: 'menu.product.supplier',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
