import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[0-9]/,
      'user|1': '@cname',
      'courier|1': '@cname',
      'type|1': ['deliver', 'payment', 'return', 'exchange'],
      'status|1': [
        'dispatched',
        'assignable',
        'assigned',
        'received',
        'finished',
        'failed',
      ],
      'createdTime': Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/station/missions'), (params: GetParams) => {
      const { current = 1, pageSize = 20 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
