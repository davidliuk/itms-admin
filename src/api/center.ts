import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PageRes<T> {
  records: T[];
  total: number;
}

// 商品详情
export interface SkuInfo {
  // 内容不影响
  id: string;
  categoryId: string;
  attrGroupId: string;
  skuType: number;
  skuName: string;
  imgUrl: string;
  publishStatus: number;
  checkStatus: number;
  isNewPerson: boolean;
  skuCode: string;
  sort: number;
  price: number;
  marketPrice: number;
  createTime: string;
  updateTime: string;
  skuWareList: any[];
}
export function getSkuInfoBySkuId(skuId: number) {
  return axios.get<any>(`/admin/product/skuInfo/${skuId}`);
}

// 分站
export interface Station {
  // 内容不影响
  id: number; // id
  regionId: number; // 地区Id
  wareId: number; // 库房id
  name: string; // 名称
  phone: string; // 联系方式
  province: string; // 省市
  city: string; // 城市编号
  district: string; // 区域
  detailAddress: string; // 详细地址
  latitude: number; // 维度
  longitude: number; // 经度
  storePath: string; // 门店照片
  workTime: string; // 营业时间
  workStatus: number; // 营业状态
  createTime: Date; // 创建日期
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
    params
  );
}

// 中心库房根据orderid 订单id 调拨出库
export function checkorderReturnInWareByOrderId(orderId: number) {
  return axios.get<any>(`/admin/sys/ware/returnOrder/in/${orderId}`);
}

export interface Logistics {
  id: number; //	id
  wareId: number; //	仓库id
  name: string; //	名称
  phone: string; //	手机
  createTime: string; //	创建时间
  updateTime: string; //	更新时间
}

export function queryLogisticsList(
  current: number,
  limit: number,
  params: Partial<Logistics>
) {
  return axios.post<PageRes<Logistics>>(
    `/admin/sys/logistics/${current}/${limit}`,
    params
  );
}
export function addLogistics(logistics: Logistics) {
  return axios.post<any>('/admin/sys/logistics', logistics);
}

export function updateLogistics(logistics: Logistics) {
  return axios.put<any>('/admin/sys/logistics', logistics);
}

export function getLogistics(id: number) {
  return axios.get<any>(`/admin/sys/logistics/${id}`);
}

export function deleteLogistics(id: number) {
  return axios.delete<any>(`/admin/sys/logistics/${id}`);
}

// 购货单
export interface PurchaseOrder {
  // 接口文档匹配 7.11
  id: number; //	id
  wareId: number;
  imgUrl: string; // 商品sku图片
  skuId: number; // 商品sku编号
  skuName: string; // 商品sku名字
  skuNum: number; //	商品购买的数量
  skuPrice: number; // 商品sku价格
  supplierId: number; // 供应商ID
  supplierName: string; // 供应商名称
  createTime: string; // 创建时间
  updateTime: string; //	更新时间
}

export function queryPurchaseOrderList(
  current: number,
  limit: number,
  params: Partial<PurchaseOrder>
) {
  return axios.post<PageRes<PurchaseOrder>>(
    `/admin/sys/purchaseOrder/${current}/${limit}`,
    params
  );
}

// 出库单
export interface StorageOrder {
  id: string; // 出库单编号
  wareId: number; // 区域中心库房编号
  orderId: number; // 订单编号
  skuId: number; //  商品编号
  skuName: string; // 商品名称
  stationId: number; // 分站编号
  stationName: string; // 分站名称
  supplierId: number; // 供应商编号
  supplierName: string; // 供货商名称
  storageType: string; // 库存单类型
  // IN(0, "入库"),
  // OUT(1, "出库"),
  // RETURN_IN(2, "退货入库"),
  // RETURN_OUT(3, "退货出库");
  createTime: string; // 创建时间;
  updateTime: string; // 更新时间
}

export function queryStorageOrderList(
  current: number,
  limit: number,
  params: Partial<StorageOrder>
) {
  return axios.post<PageRes<StorageOrder>>(
    `/admin/sys/storageOrder/${current}/${limit}`,
    params
  );
}

// 区域中心库房库存
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
  maxStock: number;
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
    params
  );
}
export function addSkuWare(skuWare: SkuWare) {
  // 新增商品和修改都是这个
  return axios.post<any>('/admin/product/skuWare/stock', skuWare);
}
export function returnSkuWareToSupplier(skuWare: SkuWare) {
  // 新增商品和修改都是这个
  return axios.post<any>('/admin/product/skuWare/returnStock', skuWare);
}

// 给运输公司的分发单，给分站的验货单
export interface CheckOrder {
  // 定义类型
  id: number;
  wareId: number; //	仓库ID
  orderId: number; //	订单ID
  stationId: number; //	分站ID
  status: string; //	状态,可用值:OUT,IN,CANCEL
  type: string; //	类型,可用值:DELIVERY,EXCHANGE,RETURN
  workOrderId: number; //	任务单ID
  inTime: string; //	入库时间
  outTime: string; //	出库时间
  createTime: string; //	创建时间
  updateTime: string; //	更新时间
}

export function queryCheckOrderList(
  current: number,
  limit: number,
  params: Partial<CheckOrder>
) {
  return axios.post<PageRes<CheckOrder>>(
    `/admin/sys/checkOrder/${current}/${limit}`,
    params
  );
}

export function updateCheckOrder(checkorder: CheckOrder) {
  return axios.put<any>('/admin/sys/checkOrder', checkorder);
}

export function deleteCheckOrder(id: number) {
  return axios.delete<any>(`/admin/sys/checkOrder/${id}`);
}

// 订单商品
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
  return axios.get<OrderInfo>(`/api/order/auth/getOrderDetailById/${orderId}`);
}

export interface TransferOrder {
  // 定义调拨单类型,接口的都更新完了
  id: number; // 调拨单id
  orderId: number; // 订单ID
  wareId: number; // 仓库ID
  workOrderId: number; // 任务单ID
  stationId: number; // 分站ID，生成分发单之后
  stationName: string; // 分站名称
  logisticsId: number; // 物流公司id
  logisticsName: string; // 物流公司名称
  logisticsPhone: string; // 物流公司电话
  status: string; // 状态
  type: string;
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
    params
  );
}

// 任务单
export interface WorkOrder {
  // 内容不影响
  id: number;
  orderId: number;
  userId: number; //	用户ID
  wareId: number; // 仓库ID
  courierId: number;
  stationId: number;
  stationName: string;
  workStatus:
    | 'DISPATCH'
    | 'OUT'
    | 'IN'
    | 'WAITING_ASSIGN'
    | 'ASSIGN'
    | 'WAITING_COURIER_TAKE'
    | 'WAITING_USER_TAKE'
    | 'FINISHED'
    | 'CANCEL'; //	状态,=>那些状态
  workType: string; // 配送类型 DELIVERY(0, "送货"),EXCHANGE(1, "换货"),RETURN(2, "退货");
  updateTime: string;
  createTime: string;
  name: string; //	姓名
  phone: string; // 电话号码
  postCode: string; //	邮编
  province: string; // 省
  city: string; // 市
  district: string; // 区
  detailAddress: string; //	详细地址
  // 物流
  logisticsId: number; //	物流公司id
  logisticsName: string; //	物流公司名称
  logisticsPhone: string; //	物流公司电话
}

export function queryWorkOrderList(
  current: number,
  limit: number,
  params: Partial<WorkOrder>
) {
  return axios.post<PageRes<WorkOrder>>(
    `/admin/sys/workOrder/${current}/${limit}`,
    params
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
