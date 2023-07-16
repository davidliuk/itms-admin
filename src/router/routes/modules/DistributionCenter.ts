import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/distribution-center',
  name: 'DistributionCenter',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.DistributionCenter',
    requiresAuth: true,
    icon: 'icon-check-square',
    order: 3,
  },
  children: [
    {
      path: 'warehouse-management',
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
