import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { ServiceRecord } from '@/api/center';

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
