import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface PolicyRecord {
  // 内容不影响

  id: string;
  ware_id: string;
  sku_id: string;
  station_id: string;
  sku_name: '小熊玩具' | '水杯' | '耳机' | '纸巾';
  sku_num: number;
  status: '未分发' | '已分发' | '已入库';
  createdTime: string;
  // number: number;
  // name: string;
  // count: number;

  // `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  // `order_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '订单id',
  // `ware_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '仓库id',
  // `station_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '分站id',
  // `station_name` varchar(100) DEFAULT NULL COMMENT '分站名称',
  // `logistics_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '物流公司id',
  // `logistics_name` varchar(20) DEFAULT NULL COMMENT '物流公司名称',
  // `logistics_phone` varchar(11) DEFAULT NULL COMMENT '物流公司电话',
  // `status` tinyint(4) DEFAULT NULL COMMENT '状态(0:未出库,1:已出库,2:已入库)',
  // `out_time` datetime DEFAULT NULL COMMENT '出库时间',
  // `in_time` datetime DEFAULT NULL COMMENT '入库时间',
  // `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  // `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/api/center/policy', {
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
