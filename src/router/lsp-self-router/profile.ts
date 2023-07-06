import { RouteRecordRaw } from 'vue-router';

const PROFILE: RouteRecordRaw = {
  path: '/list/order_info',
  name: 'order_info',
  component: () => import('@/views/order_info/basic/index.vue'),
  meta: {
    requiresAuth: false,
  },
};

export default PROFILE;
