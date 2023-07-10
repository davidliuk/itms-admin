import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PageRes<T> {
  records: T[];
  total: number;
}

// 给运输公司的分发单，给分站的验货单
export interface LogCheckOrder {
  // 定义类型
  id: number;
  orderId: number;
  userId: number; //	用户ID
  wareId: number; // 仓库ID
  courierId: number;
  stationId: number;
  stationName: string;
  workStatus: string; //	状态,
  workType: string; // 配送类型
  // 0:未分发,1:已分发,2:已入库
  updateTime: string;
  createTime: string;
  // orderInfo
  // 个人信息
  name: string; //	姓名
  phone: string; // 电话号码
  postCode: string; //	邮编
  province: string; // 省
  city: string; // 市
  district: string; // 区
  detailAddress: string; //	详细地址
  // 物流
  logisticsId: number; //	物流公司id
  logisticsName: string; //	物流公司名称
  logisticsPhone: string; //	物流公司电话
}

export function queryLogCheckOrderList(
  current: number,
  limit: number,
  params: Partial<LogCheckOrder>
) {
  return axios.post<PageRes<LogCheckOrder>>(
    `/admin/sys/checkOrder/${current}/${limit}`,
    params
  );
}

export function deleteLogCheckOrder(id: number) {
  return axios.delete<any>(`/admin/sys/checkOrder/${id}`);
}

export interface OrderItem {
  categoryId: number;
  createTime: string;
  id: number;
  imgUrl: string;
  orderId: number;
  skuId: number;
  skuName: string;
  skuNum: number;
  skuPrice: number;
  skuType: string;
  splitActivityAmount: number;
  splitCouponAmount: number;
  splitTotalAmount: number;
  updateTime: string;
}

export interface OrderInfo {
  // 定义类型
  orderItemList: OrderItem[];
}

export function queryOrderInfo(orderId: number) {
  return axios.get<OrderInfo>(`/api/order/auth/getOrderInfoById/${orderId}`);
}
