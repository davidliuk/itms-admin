import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|2-3': /[0-9]/,
      'ware_id|2-3': /[0-9]/,
      'station_id|2-3': /[0-9]/,
      'sku_id|2-3': /[A-Z][a-z][-][0-9]/,
      'sku_name|1': ['小熊玩具', '水杯', '耳机', '纸巾'],
      'sku_num|2-3': /[0-9]/,
      'status|1': ['no_shipped', 'shipped', 'stocked'],
      'createdTime': Random.datetime(),
      // 'sku_name':'@cname',
    },
  ],
});

setupMock({
  setup() {
    // export interface GetParams {
    //   body: null;
    //   type: string;
    //   url: string;
    // }
    // Mock.mock(new RegExp('/api/center/policy'), (params: GetParams) => {
    //   const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
    //   const p = current as number;
    //   const ps = pageSize as number;
    //   return successResponseWrap({
    //     list: data.list.slice((p - 1) * ps, p * ps),
    //     total: 55,
    //   });
    // });
  },
});
