export interface OrderState {
  id?: string;
  userId?: number;
  nickName?: string;
  orderNo?: string;
  couponId?: number;
  totalAmount?: number;
  activityAmount?: number;
  couponAmount?: number;
  originalTotalAmount?: number;
  freightFee?: number;
  freightFeeReduce?: number;
  refundableTime?: string;
  payType?: number;
  // payType?: '微信' | '支付宝';
  sourceType?: number;
  orderStatus?: number;
  // orderStatus?: '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消';
  processStatus?: number;
  logisticsId?: number;
  logisticsName?: string;
  logisticsPhone?: string;
  courierId?: number;
  courierName?: string;
  courierPhone?: string;
  takeName?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverPostCode?: string;
  receiverProvince?: number;
  receiverCity?: number;
  receiverDistrict?: number;
  receiverAddress?: string;
  paymentTime?: string;
  deliveryTime?: string;
  takeTime?: string;
  receiveTime?: string;
  remark?: string;
  cancelTime?: string;
  cancelReason?: string;
  wareId?: number;
  stationId?: number;
  commissionAmount?: number;
  createTime?: string;
  updateTime?: string;
  isDeleted?: number;
}
