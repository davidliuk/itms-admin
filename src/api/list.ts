import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';
import { PageRes, Role } from '@/api/acl';

export interface PolicyRecord {
  id: string;
  userId: number;
  nickName: string;
  orderNo: string;
  couponId: number;
  totalAmount: number;
  activityAmount: number;
  couponAmount: number;
  originalTotalAmount: number;
  freightFee: number;
  freightFeeReduce: number;
  refundableTime: string;
  payType: number;
  // payType: '微信' | '支付宝';
  sourceType: number;
  orderStatus: number;
  // orderStatus: '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消';
  processStatus: number;
  logisticsId: number;
  logisticsName: string;
  logisticsPhone: string;
  courierId: number;
  courierName: string;
  courierPhone: string;
  takeName: string;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode: string;
  receiverProvince: number;
  receiverCity: number;
  receiverDistrict: number;
  receiverAddress: string;
  paymentTime: string;
  deliveryTime: string;
  takeTime: string;
  receiveTime: string;
  remark: string;
  cancelTime: string;
  cancelReason: string;
  wareId: number;
  stationId: number;
  commissionAmount: number;
  createTime: string;
  updateTime: string;
  isDeleted: number;
}

// export interface PolicyParams extends Partial<PolicyRecord> {
//   current: number;
//   limit: number;
// }

export interface PolicyListRes {
  records: PolicyRecord[];
  current: number;
  total: number;
}
export function queryPolicyList(
  current: number,
  limit: number,
  params: PolicyRecord | null
) {
  return axios.post<PolicyListRes>(`/admin/order/${current}/${limit}`, {
    params,
    // paramsSerializer: (obj) => {
    //   return qs.stringify(obj);
    // },
  });
}

// export function queryPolicyList(params: PolicyParams) {
//   console.log(params);
//   return axios.post<PolicyListRes>(
//     `http://localhost:8209/admin/order/${params.current}/${params.limit}`,
//     params
//   );
// return axios.get<PolicyListRes>(
//   '/api/order/auth/findUserOrderPage/{page}/{limit}',
//   {
//     params,
//     paramsSerializer: (obj) => {
//       return qs.stringify(obj);
//     },
//   }
// );
// return axios.post<PolicyListRes>(
//   'http://localhost:8209/admin/order/{page}/{limit}',
//   {
//     params,
//     paramsSerializer: (obj: Record<string, any>) => {
//       console.log(qs.stringify(obj));
//       return qs.stringify(obj);
//     },
//   }
// );
// }

export function deletePolicyList(id: string) {
  return axios.delete('/api/list/policy', { params: { id } });
  // return axios.get<PolicyListRes>('/api/list/policy', {
  //   params,
  //   paramsSerializer: (obj) => {
  //     return qs.stringify(obj);
  //   },
  // });
}

// 该函数用于获取订单详情，介于PolicyListRes已经足够详细，该函数于2023/6/29 16:15 废止
// export function queryOrderInfo(id: string) {
//   return axios.get<PolicyListRes>('/api/list/policy', { params: { id } });
//   // return axios.get<PolicyListRes>('/api/list/policy', {
//   //   params,
//   //   paramsSerializer: (obj) => {
//   //     return qs.stringify(obj);
//   //   },
//   // });
// }

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


export interface LogisticsBaseInfo {
  id: string;
  name: string;
  phone: string;
}

export interface StationBaseInfo {
  id: string;
  name: string;
}

export function queryLogisticsBaseInfo(wareId : string) {
  return axios.get<LogisticsBaseInfo[]>( `/admin/sys/station/getByWareId/${wareId}`);
}

export function queryStationBaseInfo(wareId : string) {
  return axios.get<StationBaseInfo[]>(`/admin/sys/logistics/getByWareId/${wareId}`);
}

export interface SelfDispatchParam {
  orderNo: string;
  stationId: string;
  stationName: string;
  logisticsId: string;
  logisticsName: string;
  logisticsPhone: string;
}

// 这个地方请求莫名其妙失效老是201
export function postSelfDispatch(selfDispatchParam: SelfDispatchParam) {
  return axios.get<any>(`/admin/sys/dispatch/manual`, { params:selfDispatchParam });
}

