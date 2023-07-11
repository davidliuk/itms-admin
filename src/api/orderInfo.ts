import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';
import { PageRes, Role } from '@/api/acl';

// 调拨单

export interface CheckOrder {
  createTime?: string;
  id?: number;
  inTime?: string;
  orderId?: number;
  orderInfo?: object;
  outTime?: string;
  param?: object;
  stationId?: number;
  status?: string;
  updateTime?: string;
  wareId?: number;
  workOrderId?: number;
}

export interface Invoice {
  courierId?: number;
  courierName?: string;
  createTime?: string;
  id?: number;
  orderId?: number;
  param?: object;
  stationId?: number;
  status?: string;
  totalAmount?: number;
  updateTime?: string;
  userId?: number;
  userName?: string;
}

export interface OrderItemList {
  categoryId?: number;
  createTime?: string;
  id?: number;
  imgUrl?: string;
  orderId?: number;
  param?: object;
  skuId?: number;
  skuName?: string;
  skuNum?: number;
  skuPrice?: number;
  skuType?: string;
  splitActivityAmount?: number;
  splitCouponAmount?: number;
  splitTotalAmount?: number;
  updateTime?: string;
}

export interface Receipt {
  city?: string;
  createTime?: string;
  detailAddress?: string;
  district?: string;
  feedback?: string;
  id?: number;
  mark?: number;
  orderId?: number;
  param?: object;
  postCode?: string;
  province?: string;
  remark?: string;
  requirement?: string;
  stationId?: number;
  stationName?: string;
  stationPhone?: string;
  takeInvoice?: boolean;
  updateTime?: string;
  userId?: number;
  userName?: string;
  userPhone?: string;
}

export interface StorageOrder {
  createTime?: string;
  id?: number;
  imgUrl?: string;
  orderId?: number;
  param?: object;
  skuId?: number;
  skuName?: string;
  skuNum?: number;
  skuPrice?: number;
  stationId?: number;
  stationName?: string;
  storageType?: string;
  supplierId?: number;
  supplierName?: string;
  updateTime?: string;
  wareId?: number;
}

export interface TransferOrder {
  createTime?: string;
  id?: number;
  inTime?: string;
  logisticsId?: number;
  logisticsName?: string;
  logisticsPhone?: string;
  orderId?: number;
  outTime?: string;
  param?: object;
  stationId?: number;
  stationName?: string;
  status?: string;
  updateTime?: string;
  wareId?: number;
  workOrderId?: number;
}

export interface WorkOrder {
  city?: string;
  courierId?: number;
  createTime?: string;
  detailAddress?: string;
  district?: string;
  id?: number;
  logisticsId?: number;
  logisticsName?: string;
  logisticsPhone?: string;
  name?: string;
  orderId?: number;
  orderInfo?: object;
  param?: object;
  phone?: string;
  postCode?: string;
  province?: string;
  stationId?: number;
  stationName?: string;
  updateTime?: string;
  userId?: number;
  wareId?: number;
  workStatus?: string;
  workType?: string;
}

export interface OrderDetail {
  activityAmount?: number;
  assignTime?: string;
  cancelReason?: string;
  cancelTime?: string;
  checkOrder?: CheckOrder;
  commissionAmount?: number;
  couponAmount?: number;
  couponId?: number;
  courierId?: number;
  courierName?: string;
  courierPhone?: string;
  createTime?: string;
  dispatchTime?: string;
  freightFee?: number;
  freightFeeReduce?: number;
  id?: string;
  inTime?: string;
  invoice?: Invoice;
  logisticsId?: number;
  logisticsName?: string;
  logisticsPhone?: string;
  nickName?: string;
  orderItemList?: OrderItemList[];
  orderNo?: string;
  orderStatus?: string;
  orderType?: string;
  originalTotalAmount?: number;
  outTime?: string;
  param?: object;
  payType?: number;
  paymentTime?: string;
  processStatus?: string;
  receipt?: Receipt;
  receiveTime?: string;
  receiverAddress?: string;
  receiverCity?: string;
  receiverDistrict?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverPostCode?: string;
  receiverProvince?: string;
  refundableTime?: string;
  remark?: string;
  sourceType?: number;
  stationId?: number;
  stationName?: string;
  storageOrder?: StorageOrder;
  takeTime?: string;
  totalAmount?: number;
  transferOrder?: TransferOrder;
  updateTime?: string;
  userId?: number;
  wareId?: number;
  wareName?: string;
  workOrder?: WorkOrder;
}

export function queryOrderDetail(orderNo: string) {
  const res = axios.get<OrderDetail>(
    `/api/order/inner/getOrderInfo/${orderNo}`
  );
  console.log(res);
  return res;
}
