import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface Supply {
  // 定义类型
  id: string;
  name: string;
  phone: string;
  postCode: string;
  province: string;
  city: string;
  detailAddress: string;
}

export function addSupply(supply: Supply) {
  return axios.post<any>('/admin/product/supplier', supply);
}
export function deleteSupply(id: number) {
  return axios.delete<any>(`/admin/product/supplier/${id}`);
}

export function updateSupply(supply: Supply) {
  return axios.put<any>('/admin/product/supplier', supply);
}

export function querySupplyList(
  page: number,
  limit: number,
  params: Partial<Supply>
) {
  return axios.post<PageRes<Supply>>(
    `/admin/product/supplier/${page}/${limit}`,
    {
      params,
    }
  );
}

export function searchSupplyList(
  page: number,
  limit: number,
  id: string,
  name: string,
  province: string
) {
  return axios.post<PageRes<Supply>>(
    `/admin/product/supplier/${page}/${limit}`,
    {
      id,
      name,
      province,
    }
  );
}
