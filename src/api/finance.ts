import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';


export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface Invoice {
  // 定义类型
  id: string;
  orderId: string;
  courierId: string;
  userId: string;
  userName: string;
  stationId: string;
  totalAmount:string;
}

export function addInvoice(invoice: Invoice) {
  return axios.post<any>('/admin/sys/invoice', invoice);
}
export function deleteInvoice(id: number) {
  return axios.delete<any>(`/admin/sys/invoice/${id}`);
}
export function getInvoiceById(id: number) {
  return axios.get<any>(`/admin/sys/invoice/{id}`);
}
export function updateInvoice(invoice: Invoice) {
  return axios.put<any>('/admin/sys/invoice', invoice);
}


export function queryInvoiceList(
  page: number,
  limit: number,
  params: Partial<Invoice>
) {
  return axios.post<PageRes<Invoice>>(`/admin/sys/invoice/${page}/${limit}`, {
    params,
  });
}

export interface PolicyRecord {
  id: string;
  number: number;
  name: string;
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType: 'artificial' | 'rules';
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
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
  return axios.get<PolicyListRes>('/api/finance/policy', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
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

export function querList() {
  return axios.get('/api/finance/rules-preset');
}
