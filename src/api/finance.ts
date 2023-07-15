import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface Invoice {
  // 定义类型
  id: string;
  orderId: string;
  courierId: string;
  userId: string;
  userName: string;
  stationId: string;
  totalAmount: string;
  status: string;
}

export function addInvoice(invoice: Invoice) {
  return axios.post<any>('/admin/sys/invoice', invoice);
}
export function deleteInvoice(id: number) {
  return axios.delete<any>(`/admin/sys/invoice/${id}`);
}
export function getInvoiceById(id: number) {
  return axios.get<any>(`/admin/sys/invoice/{id}`);
}
export function updateInvoice(invoice: Invoice) {
  return axios.put<any>('/admin/sys/invoice', invoice);
}

export function queryInvoiceList(
  page: number,
  limit: number,
  params: Partial<Invoice>
) {
  return axios.post<PageRes<Invoice>>(`/admin/sys/invoice/${page}/${limit}`, {
    params,
  });
}

export function queryInvoiceListById(page: number, limit: number, id: number) {
  return axios.post<PageRes<Invoice>>(`/admin/sys/invoice/${page}/${limit}`, {
    id,
  });
}

export function searchInvoiceList(
  page: number,
  limit: number,
  id: string,
  userId: string
) {
  return axios.post<PageRes<Invoice>>(`/admin/sys/invoice/${page}/${limit}`, {
    id,
    userId,
  });
}

export interface Supplier {
  // 定义类型
  id: string;
  skuName: string;
  skuNum: string;
  skuPrice: string;
  supplierId: string;
  supplierName: string;
  wareId: string;
  stationName: string;
  storageType: string;
}
export function querySupplierList(
  page: number,
  limit: number,
  params: Partial<Supplier>
) {
  return axios.post<PageRes<Supplier>>(
    `/admin/sys/storageOrder/${page}/${limit}`,
    params
  );
}
export function searchSupplierList(
  page: number,
  limit: number,
  id: string,
  supplierName: string
) {
  return axios.post<PageRes<Supplier>>(
    `/admin/sys/storageOrder/${page}/${limit}`,
    {
      id,
      supplierName,
    }
  );
}

export function addSupplier(supplier: Supplier) {
  return axios.post<any>('/admin/sys/storageOrder', supplier);
}

export interface Settlement {
  // 定义类型
  id: string;
  orderId: string;
  courierId: string;
  userId: string;
  userName: string;
  stationId: string;
  totalAmount: string;
  status: string;
}

export function querySettlementList(
  page: number,
  limit: number,
  params: Partial<Invoice>
) {
  return axios.post<PageRes<Invoice>>(`/admin/sys/invoice/${page}/${limit}`, {
    params,
  });
}
export function searchSettlementList(
  page: number,
  limit: number,
  id: string,
  userName: string
) {
  return axios.post<PageRes<Invoice>>(`/admin/sys/invoice/${page}/${limit}`, {
    id,
    userName,
  });
}

export interface OrderDetail {
  // 定义类型
  id: string;
  nickName: string;
  orderNo: string;
  orderStatus: string;
  processStatus: string;
  payType: string;
  orderType: string;
  courierName: string;
  courierPhone: string;
  receiverAddress: string;
  receiverPhone: string;
  originalTotalAmount: string;
  couponId: string;
  totalAmount: string;
  cancelReason: string;
}

export function queryOrderDetailList(orderId: string) {
  return axios.get<OrderDetail>(
    `/admin/sys/dispatch/orderDetailById/${orderId}`
  );
}
