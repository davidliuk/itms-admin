import axios from 'axios';

export interface PageRes<T> {
  records: T[];
  total: number;
}
// 任务单
export interface WorkOrder {
  // 内容不影响
  id: number;
  stationId: number; // 分站
  stationName: string; // 分站名称
  name: string; // 收货人姓名电话
  phone: string; // 收货人
  postCode: string; // 收货人邮编
  userId: number; // 用户
  courierId: number; // 配送员
  orderId: number; // 订单id
  wareId: number; // 中心库房
  // 状态DISPATCH,OUT,IN,ASSIGN,TAKE,RECEIVE,CANCEL
  workStatus: string;
  workType: string; // 类型DELIVERY,EXCHANGE,RETURN
  logisticsId: number; // 物流公司编号
  logisticsName: string; // 物流公司名称
  logisticsPhone: string; // 物流公司联系方式
  province: string; // 省
  city: string; // 市
  district: string; // 区
  detailAddress: string; // 详细地址
  remark: string; // 备注
  mark: number; // 满意度
  feedback: string; // 反馈
  orderInfo: object; // 订单
  createTime: Date; // 开始时间
  updateTime: Date; // 结束时间
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
// 获取任务单
export function getWorkOrder(id: number) {
  return axios.get<any>(`/admin/sys/station/${id}`);
}

// 修改任务单
export function changeWorkOrder(workOrder: WorkOrder) {
  return axios.put<any>(`/admin/sys/workOrder`, workOrder);
}
// 删除任务单
export function deleteWorkOrder(id: number) {
  return axios.delete<any>(`/admin/sys/workOrder/${id}`);
}

export function assign(workOrderId: number, courierId: number) {
  return axios.get<any>(
    `/admin/sys/workOrder/assign/${workOrderId}/${courierId}`
  );
}

export function returnAssign(workOrderId: number, courierId: number) {
  return axios.get<any>(
    `/admin/sys/workOrder/returnOrder/assign/${workOrderId}/${courierId}`
  );
}

// 配送员
export interface Courier {
  id: number;
  userId: number;
  name: string;
  phone: string;
  idNo: string;
  idNoUrl1: string;
  idNoUrl2: string;
  stationId: number;
  createTime: Date;
  updateTime: Date;
  workNum: number;
}
export function updateCourier(courier: Courier) {
  return axios.put<any>('/admin/user/courier/', courier);
}
export function deleteCourier(id: number) {
  return axios.delete<any>(`/admin/user/courier/${id}`);
}

export function queryCourierList(
  current: number,
  limit: number,
  params: Partial<Courier>
) {
  return axios.post<PageRes<Courier>>(
    `/admin/user/courier/${current}/${limit}`,
    params
  );
}

// 分发单入库
export function inCheckOrder(orderId: number) {
  return axios.get<any>(`/admin/sys/station/in/${orderId}`);
}

// 调拨入库
export function inTransferOrder(orderId: number) {
  return axios.get<any>(`/admin/sys/station/returnOrder/in/${orderId}`);
}
// 调拨出库
export function outTransferOrder(orderId: number) {
  return axios.get<any>(`/admin/sys/station/returnOrder/out/${orderId}`);
}

// 签收单
export interface Receipt {
  // 内容不影响
  id: number;
  orderId: number;
  userId: number;
  userName: string;
  userPhone: string;
  stationId: number; // 分站
  stationName: string; // 分站名称
  stationPhone: string; // 收货人
  postCode: string; // 收货人邮编
  requirement: string; // 要求
  remark: string; // 备注
  feedback: string; // 反馈
  takeInvoice: number; // 是否开具发票
  mark: number; // 客户满意度
  province: string; // 省
  city: string; // 市
  district: string; // 区
  detailAddress: string; // 详细地址
  createTime: Date; // 开始时间
  updateTime: Date; // 结束时间
}
export function addReceipt(receipt: Receipt) {
  return axios.post<any>('/admin/sys/receipt', receipt);
}

export function updateReceipt(receipt: Receipt) {
  return axios.put<any>('/admin/sys/receipt', receipt);
}

export function deleteReceipt(id: number) {
  return axios.delete<any>(`/admin/sys/receipt/${id}`);
}

export function getReceipt(id: number) {
  return axios.get<any>(`/admin/sys/receipt/${id}`);
}

export function queryReceiptList(
  current: number,
  limit: number,
  params: Partial<Receipt>
) {
  return axios.post<PageRes<Receipt>>(
    `/admin/sys/receipt/${current}/${limit}`,
    params
  );
}

// 分站信息
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
  // param: object;
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
