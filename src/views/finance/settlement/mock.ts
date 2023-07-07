import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'number|2-3': /[0-9]/,
      'price|1-2': /[0-9]/,
      'saleCount|1-3': /[0-9]/,
      'returnCount|1-2': /[0-9]/,
      'returnPayment|2-3': /[0-9]/,
      'payment|2-4': /[0-9]/,
      'category': /水果/,
      'productName|1': ['苹果', '香蕉', '水蜜桃'],
      'money|1-3': /[0-9]/,
      'contentType|1': ['img', 'horizontalVideo', 'verticalVideo'],
      'count|2-3': /[0-9]/,
      'status|1': ['online', 'offline'],
      'filterType|1': ['artificial', 'rules'],
      'start|8': /[0-9]/,
      'end|8': /[0-9]/,
      'courier': /张三/,
      'name': /沈阳分站/,
      'createdTime': Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/list/policy'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
