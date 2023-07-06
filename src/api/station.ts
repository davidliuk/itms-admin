import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { TableData } from '@arco-design/web-vue/es/table/interface';
import { Role } from '@/api/acl';

export interface PageRes<T> {
  records: T[];
  total: number;
}
// 任务单
export interface WorkOrder {
  // 内容不影响
  id: number;
  stationId: number; // 分站
  name: string; // 收货人
  userId: number; // 用户
  courierId: number; // 配送员
  orderId: number; // 订单id
  wareId: number; // 中心库房
  // 状态DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_COURIER_TAKE,WAITING_USER_TAKE,FINISHED,CANCEL
  workStatus:
    | 'DISPATCH'
    | 'OUT'
    | 'IN'
    | 'WAITING_ASSIGN'
    | 'ASSIGN'
    | 'WAITING_COURIER_TAKE'
    | 'WAITING_USER_TAKE'
    | 'FINISHED'
    | 'CANCEL';
  // workType: 'DELIVERY' | 'EXCHANGE' | 'RETURN'; // 类型DELIVERY,EXCHANGE,RETURN
  workType: string; // 类型DELIVERY,EXCHANGE,RETURN
  startTime: Date; // 开始时间
  endTime: Date; // 结束时间
}

export function queryWorkOrderList(
  current: number,
  limit: number,
  params: Partial<WorkOrder>
) {
  return axios.post<PageRes<WorkOrder>>(
    `/admin/sys/workOrder/${current}/${limit}`,
    {
      params,
    }
  );
}

export function getWorkOrder(id: number) {
  return axios.get<any>(`/admin/sys/station/${id}`);
}

export function assign(workOrderId: number, courierId: number) {
  return axios.get<any>(
    `/admin/sys/workOrder/assign/${workOrderId}/${courierId}`
  );
}

// 分站
export interface Station {
  // 内容不影响
  id: number; // id
  regionId: number; // 地区Id
  wareId: number; // 库房id
  name: string; // 名称
  phone: string; // 联系方式
  province: number; // 省市
  city: number; // 城市编号
  district: number; // 区域
  detailAddress: string; // 详细地址
  latitude: number; // 维度
  longitude: number; // 经度
  param: object;
  storePath: string; // 门店照片
  workTime: string; // 营业时间
  workStatus: 0 | 1; // 营业状态
  creatTime: Date; // 创建日期
  updateTime: Date; // 更新时间
}

export function addStation(station: Station) {
  return axios.post<any>('/admin/sys/station', station);
}

export function updateStation(station: Station) {
  return axios.put<any>('/admin/sys/station', station);
}

export function deleteStation(id: number) {
  return axios.delete<any>(`/admin/sys/station/${id}`);
}

export function getStation(id: number) {
  return axios.get<any>(`/admin/sys/station/${id}`);
}

export function queryStationList(
  current: number,
  limit: number,
  params: Partial<Station>
) {
  return axios.post<PageRes<Station>>(
    `/admin/sys/station/${current}/${limit}`,
    {
      params,
    }
  );
}

// 配送员
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
    params,
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
