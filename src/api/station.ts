import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { TableData } from '@arco-design/web-vue/es/table/interface';

export interface MissionRecord {
  id: string;
  user: string;
  courier: string;
  type: 'deliver' | 'payment' | 'return' | 'exchange';
  status:
    | 'dispatched'
    | 'assignable'
    | 'assigned'
    | 'received'
    | 'finished'
    | 'failed';
  createdTime: string;
}

export interface MissionParams extends Partial<MissionRecord> {
  current: number;
  pageSize: number;
}

export interface MissionListRes {
  list: MissionRecord[];
  total: number;
}

export function queryMissionList(params: MissionParams) {
  return axios.get<MissionListRes>('/api/station/missions', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface CourierRecord {
  id: string;
  user: string;
  courier: string;
  type: 'deliver' | 'payment' | 'return' | 'exchange';
  status:
    | 'dispatched'
    | 'assignable'
    | 'assigned'
    | 'received'
    | 'finished'
    | 'failed';
  createdTime: string;
}

export interface CourierParams extends Partial<CourierRecord> {
  current: number;
  pageSize: number;
}

export interface CourierListRes {
  list: CourierRecord[];
  total: number;
}

export function queryCourierList(params: CourierParams) {
  return axios.get<CourierListRes>('/api/station/couriers', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/station/content-data');
}
//
// export interface PopularRecord {
//   key: number;
//   clickNumber: string;
//   title: string;
//   increases: number;
// }
//
// export function queryStationDetail(params: { type: string }) {
//   return axios.get<TableData[]>('/api/detail', { params });
// }

export interface DetailRecord {
  province: string;
  city: string;
  district: string;
  name: string;
  contact: string;
  address: string;
  longitude: number;
  latitude: number;
  storePhoto: string;
  businessHours: string;
  businessStatus: 'open' | 'closed';
  createdTime: string;
  updatedTime: string;
}

export function queryStationDetail() {
  return axios.get<DetailRecord[]>('/api/station/detail');
}
