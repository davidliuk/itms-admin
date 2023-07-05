import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { Admin, Permission } from '@/api/acl';

export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface SkuWare {
  // 定义类型
  id: string;
  skuId: number;
  skuName: string;
  wareId: string;
  stock: number;
  lockStock: number;
  lowStock: number;
  sale: number;
  createTime: Date;
  updateTime: Date;
}

export function querySkuWareList(
  current: number,
  limit: number,
  params: Partial<SkuWare>
) {
  return axios.post<PageRes<SkuWare>>(
    `/admin/product/skuWare/${current}/${limit}`,
    {
      params,
    }
  );
}

// 给运输公司的分发单，给分站的验货单
export interface CheckOrder {
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

export function queryCheckOrderList(
  current: number,
  limit: number,
  params: Partial<CheckOrder>
) {
  return axios.post<PageRes<CheckOrder>>(
    `/admin/sys/checkOrder/${current}/${limit}`,
    {
      params,
    }
  );
}

// export interface PolicyParams extends Partial<PolicyRecord> {
//   current: number;
//   pageSize: number;
// }
export interface PolicyRecord {
  // 内容不影响,主要是定义类型
  id: string;
  sku_id: number;
  sku_name: '小熊玩具' | '水杯' | '耳机' | '纸巾';
  ware_id: string;
  sku_num: number;
  status: '未分发' | '已分发' | '已入库';
  createdTime: string;
}
export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

export function queryPolicyList(
  current: number,
  limit: number,
  params: Partial<PolicyRecord>
) {
  return axios.get<PolicyListRes>('/admin/sys/ware/findAllList', {
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
  // 调拨单
  transferOrderId?: string;
  orderId?: string;
  wareId?: string;
  stationId?: string;
  stationName?: string;
  logisticsId?: string;
  logisticsName?: string;
  logisticsPhone?: string;
  transferOrderStatus?: string;
  outTime?: string;
  inTime?: string;
}

export function queryTheServiceList() {
  return axios.get('/api/center/the-service');
}
