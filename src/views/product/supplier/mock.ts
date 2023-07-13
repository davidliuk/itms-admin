import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const data = Mock.mock({
  'supply|55': [
    {
      'stationId': /[0-9]/,
      'id|2-3': /[0-9]/,
      'orderId': '@oid',
      'courierId': '@cid',
      'userName': '@uname',
      'status|1': ['waste', 'using'],
      'userId': '@uid',
      'totalAmount': '@money',
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/finance/policy'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.invoice.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
