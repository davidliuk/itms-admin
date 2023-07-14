import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { LoginRes } from '@/api/user';
import { PageRes, Role } from '@/api/acl';
import { Pagination } from '@/types/global';


export interface LSPPage {
  current:number;
  limit:number;
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
  showDetailPage:boolean;
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
