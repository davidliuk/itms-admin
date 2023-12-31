import { RouteRecordRaw } from 'vue-router';

const ORDER_INFO: RouteRecordRaw = {
  path: '/list/order-info',
  name: 'order_info',
  component: () => import('@/views/order_info/basic/index.vue'),
  meta: {
    requiresAuth: false,
  },
};

export default ORDER_INFO;
