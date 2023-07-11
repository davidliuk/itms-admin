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

export function findAllList() {
  return axios.get<Category[]>('/admin/product/category/findAllList');
}
export function addCategory(category: Category) {
  return axios.post<any>('/admin/product/category', category);
}
export function updateCategory(category: Category) {
  return axios.put<any>('/admin/product/category', category);
}

export function deleteCategory(category: Category) {
  return axios.post<any>('/admin/product/category', category);
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

export function addSkuInfo(skuInfo: SkuInfo) {
  return axios.post<any>('/admin/product/skuInfo', skuInfo);
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
  groupId: string;
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

export function getByGroupId(groupId: string) {
  return axios.get<Attr[]>(`/admin/product/attr/getByGroupId/${groupId}`);
}
