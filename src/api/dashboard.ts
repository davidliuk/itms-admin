import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import StationInfo from '@/views/station/station-info/index.vue';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface SkuItem {
  id: number;
  createTime: string;
  updateTime: string;
  param: Record<string, any>;
  categoryId: number;
  categoryName: string;
  attrGroupId: number;
  supplierId: number;
  supplierName: number;
  skuType: number;
  skuName: string;
  imgUrl: string;
  perLimit: number;
  publishStatus: number;
  checkStatus: number;
  isNewPerson: number;
  sort: number;
  skuCode: string;
  price: number;
  marketPrice: number;
  skuWareList: any[] | null;
}

export interface WareInfo {
  id: number;
  createTime: string;
  updateTime: string;
  param: Record<string, any>;
  skuId: number;
  skuInfo: SkuItem;
  skuName: string;
  wareId: number;
  stock: number;
  lockStock: number;
  lowStock: number;
  maxStock: number;
  sale: number;
}

export function queryWareList(wareId: string) {
  return axios.get<WareInfo[]>(`/admin/product/skuWare/getByWareId/${wareId}`);
}

export interface CategoriesMap {
  id: number;
  name: string;
}

export function queryCategoriesNameList() {
  return axios.get<CategoriesMap[]>(`/admin/product/category/findAllList`);
}

export interface StationInfo {
  regionId: number; // 分站ID
  name: string; // 名字
  phone: string; // 联系方式
  postCode: string | null; // 邮政编码
  province: string | null; // 省
  city: string | null; // 城市
  district: string | null; // 区
  detailAddress: string; // 详细地址
  longitude: number | null; // 保留,可能可以做地图
  latitude: number | null;
  storePath: string;
  workTime: string; // 营业时间
  workStatus: number; // 营业状态
}

export interface ShowStation {
  key: string;
  regionId: number;
  name: string;
  address: string;
  status: number;
  postCode: string;
  phone: string;
  workTime: string;
}

export function queryStationList(wareId: string) {
  // console.log(`/admin/sys/station/getByWareId/${wareId}`);
  const data = axios.get<StationInfo[]>(
    `/admin/sys/station/getByWareId/${wareId}`
  );
  // console.log(data);
  return data;
}

// 中心库房信息
export interface WarehouseInfo {
  id: number;
  createTime: string;
  updateTime: string;
  param: any; // 这里的 any 表示 param 可以是任意类型
  name: string;
  adminId: number;
  adminName: string;
  adminEmail: string;
  regionId: number;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  longitude: number | null;
  latitude: number | null;
}

export function getWareHouseInfo(wareId: string) {
  return axios.get<WarehouseInfo>(`/admin/sys/ware/${wareId}`);
}
export function updateWareHouseInfo(warehouseInfo: WarehouseInfo) {
  // console.log(`/admin/sys/station/getByWareId/${wareId}`);
  return axios.put<any>(`/admin/sys/ware`, warehouseInfo);
}

export function deleteWareHouse(warehouseId: string) {
  // console.log(`/admin/sys/station/getByWareId/${wareId}`);
  return axios.delete<any>(`/admin/sys/ware/${warehouseId}`);
}

export interface WareAdmins {
  id: number;
  createTime: string;
  updateTime: string;
  param: Record<string, any>;
  username: string;
  password: string;
  avatar: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  wareId: number;
  stationId: number | null;
  roles: string[] | null;
  permissions: string[] | null;
  shouldDelete: boolean;
}

export function queryWareAdmins(wareId: string) {
  return axios.get<WareAdmins[]>(`/admin/acl/user/ware/${wareId}`);
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

export function updateAdmin(admin: WareAdmins) {
  return axios.put<any>('/admin/acl/user', admin);
}
