import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useOrderInfoStore from './modules/order_info';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useOrderInfoStore };
export default pinia;
