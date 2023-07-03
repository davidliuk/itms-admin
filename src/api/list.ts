import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';

export interface PolicyRecord {
  // order_no
  // nick_name
  // receiver_name
  // order_status
  // payment_time
  // take_name
  // total_amount
  // courier_name
  id: string;
  order_no: number;
  nick_name: string;
  receiver_name: string;
  order_status: '待付款' | '待发货' | '已发货' | '已完成' | '已取消';
  payment_time: string;
  take_name: string;
  total_amount: number;
  courier_name: string;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

export function queryPolicyList(params: PolicyParams) {
  return axios.post<PolicyListRes>('/api/list/policy', params);
  // return axios.get<PolicyListRes>('/api/list/policy', {
  //   params,
  //   paramsSerializer: (obj) => {
  //     return qs.stringify(obj);
  //   },
  // });
}

export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}
export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection');
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service');
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset');
}
