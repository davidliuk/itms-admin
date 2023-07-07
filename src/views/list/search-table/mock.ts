import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams, PostData } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|+8': 8,
      'user_id|+1': 1,
      'nick_name': '@cname',
      'order_no': /[A-Z][a-z][-][0-9]/,
      'coupon_id': null,
      'total_amount|2-3': /[0-9]/,
      'activity_amount': 0,
      'coupon_amount': 0,
      'original_total_amount': 0,
      'freight_fee': 0,
      'freight_fee_reduce': 0,
      'refundable_time': '@datetime',
      'pay_type|1': /[0-1]/,
      'source_type': null,
      'order_status|1': () => Mock.Random.pick([-1, 0, 1, 2, 3, 4]),
      // 'order_status|1': ['待付款', '代发货', '已发货', '已完成', '已取消'],
      'process_status': 0,
      'logistics_id|+1': 1,
      'logistics_name': null,
      'logistics_phone': null,
      'courier_id|+1': 1,
      'courier_name': '@cname',
      'courier_phone|11': /[0-9]/,
      'take_name|4-8': /[A-Z]/,
      'receiver_name': '@cname',
      'receiver_phone|11': /[0-9]/,
      'receiver_post_code|6': /[0-9]/,
      'receiver_province': 'xx省',
      'receiver_city': 'xx市',
      'receiver_district': 'xx区',
      'receiver_address': 'xx路195号',
      'payment_time': '@datetime',
      'delivery_time': '@datetime',
      'take_time': '@datetime',
      'receive_time': '@datetime',
      'remark': '这是备注',
      'cancel_time': '@datetime',
      'cancel_reason': '这是取消理由',
      'ware_id|8': /[0-9]/,
      'station_id|8': /[0-9]/,
      'commission_amount': null,
      'create_time': '@datetime',
      'update_time': '@datetime',
      'is_deleted': 0,
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
