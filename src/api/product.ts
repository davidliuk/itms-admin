import axios from 'axios';

export interface Category {
  // 内容不影响
  id: string;
  name: string;
  imgUrl: string;
  status: number;
  sort: number;
  createTime: Date;
  updateTime: Date;
}

export interface PageRes<T> {
  records: T[];
  total: number;
}
export function allCategory() {
  return axios.get<Category[]>('/admin/product/category/findAllList');
}
export function queryCategoryList(
  current: number,
  limit: number,
  params: Category
) {
  return axios.post<PageRes<Category>>(
    `/admin/product/category/${current}/${limit}`,
    params
  );
}
export function addCategory(category: Category) {
  return axios.post<any>('/admin/product/category', category);
}
export function updateCategory(category: Category) {
  return axios.put<any>('/admin/product/category', category);
}
export function deleteCategory(id: number) {
  return axios.delete<any>(`/admin/product/category/${id}`);
}

export interface AttrGroup {
  id: string;
  name: string;
  sort: number;
  remark: string;
  createTime: Date;
  updateTime: Date;
}

export function queryAttrGroupList(
  current: number,
  limit: number,
  params: Partial<AttrGroup>
) {
  return axios.post<PageRes<AttrGroup>>(
    `/admin/product/attrGroup/${current}/${limit}`,
    params
  );
}
export function addAttrGroup(attrGroup: AttrGroup) {
  return axios.post<any>('/admin/product/attrGroup', attrGroup);
}
export function updateAttrGroup(attrGroup: AttrGroup) {
  return axios.put<any>('/admin/product/attrGroup', attrGroup);
}
export function deleteAttrGroup(id: number) {
  return axios.delete<any>(`/admin/product/attrGroup/${id}`);
}
export function allAttrGroup() {
  return axios.get<AttrGroup[]>(`/admin/product/attrGroup/findAllList`);
}

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

export function querySkuInfoList(
  current: number,
  limit: number,
  params: Partial<SkuInfo>
) {
  return axios.post<PageRes<SkuInfo>>(
    `/admin/product/skuInfo/${current}/${limit}`,
    params
  );
}
export function updateSkuInfo(skuInfo: SkuInfo) {
  return axios.put<any>('/admin/product/skuInfo', skuInfo);
}
export function deleteSkuInfo(id: number) {
  return axios.delete<any>(`/admin/product/skuInfo/${id}`);
}

export interface Attr {
  id: string;
  name: string;
  inputType: number;
  selectList: string;
  attrGroupId: string;
  createTime: Date;
  updateTime: Date;
}
export function queryAttrList(
  current: number,
  limit: number,
  params: Partial<Attr>
) {
  return axios.post<PageRes<Attr>>(
    `/admin/product/attr/${current}/${limit}`,
    params
  );
}

export function addAttr(attr: Attr) {
  return axios.post<any>('/admin/product/attr', attr);
}
export function updateAttr(attr: Attr) {
  return axios.put<any>('/admin/product/attr', attr);
}
export function deleteAttr(id: number) {
  return axios.delete<any>(`/admin/product/attr/${id}`);
}
export function getAttrByGroupId(groupId: string) {
  return axios.get<Attr[]>(`/admin/product/attr/getByGroupId/${groupId}`);
}

export interface SkuBasicInfo {
  id: string;
  skuName: string;
  categoryId: string;
  skuType: number;
  isNewPerson: number;
  skuCode: string;
  sort: number;
  price: number;
  marketPrice: number;
  supplierId: string;
  supplierName: string;
}

export interface SkuAttrValue {
  id: string;
  skuId: string;
  attrId: string;
  attrName: string;
  attrValue: string;
  sort: number;
}

export interface SkuPoster {
  id: string;
  skuId: string;
  imgName: string;
  imgUrl: string;
}

export interface SkuImage {
  id: string;
  skuId: string;
  imgName: string;
  imgUrl: string;
  sort: number;
}

export interface SkuAttrInfo {
  attrGroupId: string;
  skuAttrValueList: SkuAttrValue[];
}

export interface SkuImageInfo {
  imgUrl: string;
  skuImageList: SkuImage[];
}

export interface SkuPosterInfo {
  skuPosterList: SkuPoster[];
}

export type SkuImgInfo = SkuImageInfo & SkuPosterInfo;

export type SkuInfoVO = SkuBasicInfo &
  SkuAttrInfo &
  SkuImageInfo &
  SkuPosterInfo;

export function addSkuInfo(skuInfoVo: SkuInfoVO) {
  return axios.post<any>('/admin/product/skuInfo', skuInfoVo);
}

export interface Supplier {
  // 定义类型
  id: string;
  name: string;
  phone: string;
  postCode: string;
  province: string;
  city: string;
  detailAddress: string;
}

export function addSupplier(supplier: Supplier) {
  return axios.post<any>('/admin/product/supplier', supplier);
}
export function deleteSupplier(id: number) {
  return axios.delete<any>(`/admin/product/supplier/${id}`);
}
export function updateSupplier(supplier: Supplier) {
  return axios.put<any>('/admin/product/supplier', supplier);
}

export function querySupplierList(
  page: number,
  limit: number,
  params: Partial<Supplier>
) {
  return axios.post<PageRes<Supplier>>(
    `/admin/product/supplier/${page}/${limit}`,
    params
  );
}
export function allSupplier() {
  return axios.get<Supplier[]>('/admin/product/supplier/findAllList');
}
