import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/finance',
  name: 'finance',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.finance',
    requiresAuth: true,
    icon: 'icon-list',
    order: 8,
  },

  children: [
    {
      path: 'invoice', // The midline path complies with SEO specifications
      name: 'invoice',
      component: () => import('@/views/finance/invoice/index.vue'),
      meta: {
        locale: 'menu.finance.invoice',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'supplierSettlement',
      name: 'supplierSettlement',
      component: () => import('@/views/finance/supplier/supplier.vue'),
      meta: {
        locale: 'menu.finance.supplier',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'settlement',
      name: 'settlement',
      component: () => import('@/views/finance/settlement/settlement.vue'),
      meta: {
        locale: 'menu.finance.settlement',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
