import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams, PostData } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'order_no|2-3': /[0-9]/,
      'nick_name|4-8': /[A-Z]/,
      'receiver_name|4-8': /[A-Z]/,
      'order_status|1': ['待付款', '待发货', '已发货', '已完成', '已取消'],
      'payment_time': '@datetime()',
      'take_name|4-8': /[A-Z]/,
      'total_amount|2-3': /[0-9]/,
      'courier_name|4-8': /[A-Z]/,
    },
  ],
});

// 注意，前端将数据传到这里之后，是连带着查询条件一起传过来的，需要后端进行条件查询
setupMock({
  setup() {
    Mock.mock(new RegExp('/api/list/policy'), (params: PostData) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      // console.log(params); // params里面有一个url，包含params的各种查询条件, params里面的body是一个string，到时候后端看看，应该需要修改这里的数据
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
