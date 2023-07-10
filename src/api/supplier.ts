import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PageRes<T> {
  records: T[];
  total: number;
}

export interface PurchaseOrder {
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
