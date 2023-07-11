import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/DistributionCenter',
  name: 'DistributionCenter',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.DistributionCenter',
    requiresAuth: true,
    icon: 'icon-list',
    order: 3,
  },
  children: [
    {
      path: 'WarehouseManagement',
      name: 'WarehouseManagement',
      component: () =>
        import('@/views/DistributionCenter/WarehouseManagement/index.vue'),
      meta: {
        locale: 'menu.DistributionCenter.WarehouseManagement',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
