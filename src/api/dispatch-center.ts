import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';
import { PageRes, Role } from '@/api/acl';
import { Pagination } from '@/types/global';
import { Region } from 'echarts/types/src/coord/geo/Region';
import { RegionList } from '@/mock/user';
import { Station } from '@/api/station';

export interface LSPPage {
  current: number;
  limit: number;
}

export interface WareHouseRecord {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  province: string;
  city: string;
  district: string;
  totalNumber: number;
  useNumber: number;
}
export interface ShuttleData {
  showDetailPage: boolean;
}

interface SumRecord {
  id: string;
  stock: number;
  maxStock: number;
}

// todo:重构
export async function queryWareHouseList(
  pageParam: LSPPage
): Promise<WareHouseRecord[]> {
  const res: WareHouseRecord[] = (
    await axios.post(
      `/admin/sys/ware/${pageParam.current}/${pageParam.limit}`,
      {}
    )
  ).data.records;
  // console.log(res);

  // 构造ids
  const ids: number[] = [];
  for (let i = 0; i < res.length; i += 1) {
    ids.push(Number(res[i].id));
  }

  // 处理请求成功的情况，获取返回的列表
  const resMap: { [key: number]: SumRecord } = (
    await axios.post('/admin/product/skuWare/sum', ids)
  ).data;
  // console.log(resMap);
  for (let i = 0; i < res.length; i += 1) {
    if (res[i].id in resMap) {
      // @ts-ignore
      res[i].useNumber = resMap[res[i].id].stock;
      // @ts-ignore
      res[i].totalNumber = resMap[res[i].id].maxStock;
    } else {
      res[i].useNumber = 0;
      res[i].totalNumber = 1;
    }
  }

  // console.log(res);
  return res;
}

export interface PostWareHouse {
  name: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  regionId: string;
}

export async function queryRegionList() {
  return axios.get<RegionList[]>('/api/region/getAll');
}

export async function queryRegionIdByKeyword(keyword: string) {
  return axios.get<Station[]>(
    `/admin/sys/station/findRegionStationByKeyword/${keyword}`
  );
}

export async function addWareHouse(param: PostWareHouse) {
  return axios.post<any>(`/admin/sys/ware`, param);
}
