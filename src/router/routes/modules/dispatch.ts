import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
    path: '/dispatch',
    name: 'dispatch',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.dispatch',
        requiresAuth: true,
        icon: 'icon-list',
        order: 8,
    },
    children: [
        {
            path: 'supply',
            name: 'supply',
            component: () => import('@/views/dispatch/goods/supply/index.vue'),
            meta: {
                locale: 'menu.dispatch.supplier',
                requiresAuth: true,
                roles: ['*'],
            },
        },

    ],
};

export default LIST;
