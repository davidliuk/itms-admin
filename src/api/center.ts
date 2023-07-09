import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface StorageOrder {
  id: string;
  wareId: number;
  orderId: number;
  skuId: number;
  skuName: string;
  stationId: number;
  stationName: string;
  supplierId: number;
  supplierName: string; // 供货商
  storageType: string;
  // IN(0, "入库"),
  // OUT(1, "出库"),
  // RETURN_IN(2, "退货入库"),
  // RETURN_OUT(3, "退货出库");
  startTime: string;
  endTime: string;
}

export function queryStorageOrderList(
  current: number,
  limit: number,
  params: Partial<StorageOrder>
) {
  return axios.post<PageRes<StorageOrder>>(
    `/admin/sys/storageOrder/${current}/${limit}`,
    {
      params,
    }
  );
}

export interface SkuWare {
  // 中心库房库存
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

export interface WorkStatus {
  code: number;
  comment: string;
}
export interface WorkType {
  code: number;
  comment: string;
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
  // startTime: Date; // 开始时间
  // endTime: Date; // 结束时间
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

// 中心库房根据orderid 订单id 调拨出库
export function transferOutWareByOrderId(orderId: number) {
  return axios.get<any>(`/admin/sys/ware/out/${orderId}`);
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
