import { defineStore } from 'pinia';
import { OrderState } from './types';
import useAppStore from '../app';

const useOrderInfoStore = defineStore('order_info', {
  state: (): OrderState => ({
    id: undefined,
    user_id: undefined,
    nick_name: undefined,
    order_no: undefined,
    coupon_id: undefined,
    total_amount: undefined,
    activity_amount: undefined,
    coupon_amount: undefined,
    original_total_amount: undefined,
    freight_fee: undefined,
    freight_fee_reduce: undefined,
    refundable_time: undefined,
    pay_type: undefined,
    // pay_type: '微信' | '支付宝',
    source_type: undefined,
    order_status: undefined,
    // order_status: '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消',
    process_status: undefined,
    logistics_id: undefined,
    logistics_name: undefined,
    logistics_phone: undefined,
    courier_id: undefined,
    courier_name: undefined,
    courier_phone: undefined,
    take_name: undefined,
    receiver_name: undefined,
    receiver_phone: undefined,
    receiver_post_code: undefined,
    receiver_province: undefined,
    receiver_city: undefined,
    receiver_district: undefined,
    receiver_address: undefined,
    payment_time: undefined,
    delivery_time: undefined,
    take_time: undefined,
    receive_time: undefined,
    remark: undefined,
    cancel_time: undefined,
    cancel_reason: undefined,
    ware_id: undefined,
    station_id: undefined,
    commission_amount: undefined,
    create_time: undefined,
    update_time: undefined,
    is_deleted: undefined,
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
