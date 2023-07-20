import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';
import { Admin, PageRes, Role } from '@/api/acl';
import { computed, Ref } from 'vue';

interface AddressAddOrder {
  city: string;
  detailAddress: string;
  district: string;
  isDefault: number;
  name: string;
  phone: string;
  postCode: string;
  province: string;
  regionId: number;
  stationId: number;
  userId: number;
  wareId: number;
}

interface AddOrder {
  address: AddressAddOrder;
  couponId: number;
  orderNo: string;
  receiverName: string;
  receiverPhone: string;
  stationId: number;
  userId: number;
  wareId: number;
}

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
  sourceType: number;
  orderStatus: number;
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

function convertPolicyRecordToAddOrder(policyRecord: PolicyRecord): AddOrder {
  const address: AddressAddOrder = {
    city: policyRecord.receiverCity.toString(), // Assuming receiverCity is a number in PolicyRecord
    detailAddress: policyRecord.receiverAddress,
    district: policyRecord.receiverDistrict.toString(), // Assuming receiverDistrict is a number in PolicyRecord
    isDefault: 0, // You can set a default value or use a different logic to populate this field
    name: policyRecord.takeName, // Assuming takeName is the same as name
    phone: policyRecord.receiverPhone,
    postCode: policyRecord.receiverPostCode,
    province: policyRecord.receiverProvince.toString(), // Assuming receiverProvince is a number in PolicyRecord
    regionId: 0, // You can set a default value or use a different logic to populate this field
    stationId: policyRecord.stationId,
    userId: policyRecord.userId,
    wareId: policyRecord.wareId,
  };

  const addOrder: AddOrder = {
    address,
    couponId: policyRecord.couponId,
    orderNo: policyRecord.orderNo,
    receiverName: policyRecord.receiverName,
    receiverPhone: policyRecord.receiverPhone,
    stationId: policyRecord.stationId,
    userId: policyRecord.userId,
    wareId: policyRecord.wareId,
  };

  return addOrder;
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

export interface PostParamsOnPageSearch {
  courierName?: string;
  logisticsName?: string;
  orderNo?: string;
  orderStatus?: string;
  orderType?: string;
  receiverName?: string;
  userId?: string;
}

export function queryPolicyList(
  current: number,
  limit: number,
  params: PostParamsOnPageSearch | null
) {
  console.log(params);

  if (params == null) params = {};
  else if (params.orderStatus === '') {
    delete params.orderStatus;
  }

  return axios.post<PolicyListRes>(`/admin/order/${current}/${limit}`, params);
}

export function AddOrder(admin: PolicyRecord) {
  return axios.post<any>(
    '/api/order/auth/submitOrder',
    convertPolicyRecordToAddOrder(admin)
  );
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
  return axios.delete(`/admin/order/${id}`, { params: { id } });
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

export function queryLogisticsBaseInfo(wareId: string) {
  return axios.get<LogisticsBaseInfo[]>(
    `/admin/sys/station/getByWareId/${wareId}`
  );
}

export function queryStationBaseInfo(wareId: string) {
  return axios.get<StationBaseInfo[]>(
    `/admin/sys/logistics/getByWareId/${wareId}`
  );
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
  return axios.get<any>(`/admin/sys/dispatch/manual`, {
    params: selfDispatchParam,
  });
}
