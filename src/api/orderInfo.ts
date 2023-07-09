import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';
import { PageRes, Role } from '@/api/acl';

// 调拨单
export interface TransferOrder {
  id?: string;
  order_id?: string;
  work_order_id?: string;
  ware_id?: string;
  station_id?: string;
  station_name?: string;
  logistics_id?: string;
  logistics_name?: string;
  logistics_phone?: string;
  status?: number;
  out_time?: string;
  in_time?: string;
}

export function queryTransferOrder(orderId: string) {
  return axios.get<TransferOrder>(`/admin/sys/transferOrder/${orderId}`);
}

export interface CheckOrder {
  id: number;
  createTime: string;
  updateTime: string;
  orderId: number;
  workOrderId?: number;
  orderInfo?: any;
  wareId: number;
  stationId: number;
  status?: string;
  outTime?: string;
  inTime?: string;
}
export function queryCheckOrder(orderId: string) {
  return axios.get<CheckOrder>(`/admin/sys/checkOrder/${orderId}`);
}
