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
  imgUrl: string;
  inTime: string;
  orderId: number;
  outTime: string;
  skuId: number;
  skuName: string;
  skuNum: number;
  skuPrice: number;
  stationId: number;
  status: number;
  // 0:未分发,1:已分发,2:已入库
  updateTime: string;
  createTime: string;
  wareId: number;
}

export function queryLogCheckOrderList(
  current: number,
  limit: number,
  params: Partial<LogCheckOrder>
) {
  return axios.post<PageRes<LogCheckOrder>>(
    `/admin/sys/checkOrder/${current}/${limit}`,
    {
      params,
    }
  );
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
