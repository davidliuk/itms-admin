import { defineStore } from 'pinia';
import { OrderState } from './types';
import useAppStore from '../app';

const useOrderInfoStore = defineStore('order_info', {
  state: (): OrderState => ({
    id: undefined,
    userId: undefined,
    nickName: undefined,
    orderNo: undefined,
    couponId: undefined,
    totalAmount: undefined,
    activityAmount: undefined,
    couponAmount: undefined,
    originalTotalAmount: undefined,
    freightFee: undefined,
    freightFeeReduce: undefined,
    refundableTime: undefined,
    payType: undefined,
    // payType: '微信' | '支付宝',
    sourceType: undefined,
    orderStatus: undefined,
    // orderStatus: '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消',
    processStatus: undefined,
    logisticsId: undefined,
    logisticsName: undefined,
    logisticsPhone: undefined,
    courierId: undefined,
    courierName: undefined,
    courierPhone: undefined,
    takeName: undefined,
    receiverName: undefined,
    receiverPhone: undefined,
    receiverPostCode: undefined,
    receiverProvince: undefined,
    receiverCity: undefined,
    receiverDistrict: undefined,
    receiverAddress: undefined,
    paymentTime: undefined,
    deliveryTime: undefined,
    takeTime: undefined,
    receiveTime: undefined,
    remark: undefined,
    cancelTime: undefined,
    cancelReason: undefined,
    wareId: undefined,
    stationId: undefined,
    commissionAmount: undefined,
    createTime: undefined,
    updateTime: undefined,
    isDeleted: undefined,
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
