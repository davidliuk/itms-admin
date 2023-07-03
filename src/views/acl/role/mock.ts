import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const data = Mock.mock({
  'list|55': [
    {
      'id|2-3': /[0-9]/,
      'name': '@cname',
      'code|2-3': /[0-9]/,
      'remark|1': ['no_shipped', 'shipped', 'stocked'],
      'createTime': '@datetime',
      'updateTime': '@datetime',
      // 'sku_name':'@cname',
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/acl/role'), (params: GetParams) => {
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
