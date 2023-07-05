import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { TableData } from '@arco-design/web-vue/es/table/interface';

// export interface MissionRecord {
//   id: string;
//   user: string;
//   courier: string;
//   type: 'deliver' | 'payment' | 'return' | 'exchange';
//   status:
//     | 'dispatched'
//     | 'assignable'
//     | 'assigned'
//     | 'received'
//     | 'finished'
//     | 'failed';
//   createdTime: string;
// }
export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface  WorkOrder {
  // 内容不影响
  id: string;
  stationId: number; // 分站
  name: string; // 收货人
  userId: number; // 用户
  courierId: number; // 配送员
  orderId:number; // 订单id
  wareId: number; // 中心库房
  // 状态DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_COURIER_TAKE,WAITING_USER_TAKE,FINISHED,CANCEL
  workStatus: string;
  workType: string; // 类型DELIVERY,EXCHANGE,RETURN
  startTime: Date; // 开始时间
  endTime: Date; // 结束时间
}

export function queryWorkOrderList(
    page: number,
    limit: number,
    params: Partial<WorkOrder>
) {
  return axios.post<PageRes<WorkOrder>>(
      `/admin/sys/workOrder/${page}/${limit}`,
      {
        params,
      }
  );
}

// export interface MissionParams extends Partial<MissionRecord> {
//   current: number;
//   pageSize: number;
// }
//
// export interface MissionListRes {
//   list: MissionRecord[];
//   total: number;
// }
//
// export function queryMissionList(params: MissionParams) {
//   return axios.get<MissionListRes>('/api/station/missions', {
//     params,
//     paramsSerializer: (obj) => {
//       return qs.stringify(obj);
//     },
//   });
// }

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
  return axios.post<CourierListRes>('/api/station/couriers', {
    params
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
