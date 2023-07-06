import { defineStore } from 'pinia';
import { OrderState } from './types';
import useAppStore from '../app';

const useOrderInfoStore = defineStore('order_info', {
  state: (): OrderState => ({
    id: undefined,
    order_no: undefined,
    nick_name: undefined,
    receiver_name: undefined,
    order_status: undefined,
    payment_time: undefined,
    take_name: undefined,
    total_amount: undefined,
    courier_name: undefined,
    // 高级功能
    user_id: undefined,
    fight_fee: undefined,
    refundable_time: undefined,
    courier_id: undefined,
    courier_phone: undefined,
    receiver_phone: undefined,
    receiver_post_code: undefined,
    receiver_province: undefined,
    receiver_city: undefined,
    receiver_district: undefined,
    receiver_address: undefined,
    delivery_time: undefined,
    take_time: undefined,
    receive_time: undefined,
    ware_id: undefined,
  }),

  getters: {
    orderInfo(state: OrderState): OrderState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<OrderState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },
  },
});

export default useOrderInfoStore;
