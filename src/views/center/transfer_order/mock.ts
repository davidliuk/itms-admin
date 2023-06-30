import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { ServiceRecord } from '@/api/center';

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

const theServiceList: ServiceRecord[] = [
  {
    id: 1,
    transferOrderId: 'aa1',
    orderId: 'orderid1',
    wareId: 'wareid1',
    stationId: 'stationid1',
    stationName: '分站名字',
    logisticsId: '运输公司id',
    logisticsName: '运输公司名字',
    logisticsPhone: '运输公司电话',
    transferOrderStatus: '配送单状态',
    outTime: '出库状态',
    inTime: '入库状态',
    icon: 'code',
    title: '调拨单1',
    description: '调拨单1的描述',
    enable: true,
    actionType: 'button',
  },
  {
    id: 2,
    icon: 'edit',
    title: '调拨单2',
    description: '调拨单2的描述',
    enable: true,
    actionType: 'button',
    expires: true,
  },
];

setupMock({
  setup() {
    // the service
    Mock.mock(new RegExp('/api/center/the-service'), () => {
      return successResponseWrap(
        theServiceList.map((_, index) => ({
          ...theServiceList[index % theServiceList.length],
          id: Mock.Random.guid(),
        }))
      );
    });
  },
});
