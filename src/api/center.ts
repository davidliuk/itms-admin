import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { Admin } from '@/api/acl';

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
  stock: string;
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

export function addSkuWare(skuWare: SkuWare) {
  // 新增商品和修改都是这个
  return axios.post<any>('/admin/product/skuInfo/stock', skuWare);
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

export function updateCheckOrder(checkorder: CheckOrder) {
  return axios.put<any>('/admin/sys/checkOrder', checkorder);
}

export function deleteCheckOrder(id: number) {
  return axios.delete<any>(`/admin/sys/checkOrder/${id}`);
}

export interface OrderItem {
  categoryId: number;
  createTime: string;
  id: number;
  imgUrl: string;
  orderId: number;
  skuId: number;
  skuName: string;
  skuNum: number;
  skuPrice: number;
  skuType: string;
  splitActivityAmount: number;
  splitCouponAmount: number;
  splitTotalAmount: number;
  updateTime: string;
}

export interface OrderInfo {
  // 定义类型
  orderItemList: OrderItem[];
}

export function queryOrderInfo(orderId: number) {
  return axios.get<OrderInfo>(`/api/order/auth/getOrderInfoById/${orderId}`);
}

export interface TransferOrder {
  // 定义调拨单类型
  id: number; // 调拨单id
  orderId: number; // 订单ID
  wareId: number; // 仓库ID
  workOrderId: number; // 任务单ID
  stationId: number; // 分站ID，生成分发单之后
  stationName: string; // 分站名称
  logisticsId: number; // 物流公司id
  logisticsName: string; // 物流公司名称
  logisticsPhone: string; // 物流公司电话
  status: number; // 状态
  inTime: Date; // 入库时间
  outTime: Date; // 出库时间
  createTime: Date; // 创建时间
  updateTime: Date; // 更新时间

  // id: number;
  // imgUrl: string;
  // inTime: string;
  // orderId: number;
  // wareId: number;
  // outTime: string;
  // skuId: number;
  // skuName: string;
  // skuNum: number;
  // skuPrice: number;
  // stationId: number;
  // status: number;
  // // 0:未分发,1:已分发,2:已入库
  // updateTime: string;
  // createTime: string;
}

export function queryTransferOrderList(
  current: number,
  limit: number,
  params: Partial<TransferOrder>
) {
  return axios.post<PageRes<TransferOrder>>(
    `/admin/sys/transferOrder/${current}/${limit}`,
    {
      params,
    }
  );
}

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
