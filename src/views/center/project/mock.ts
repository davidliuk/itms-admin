import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'center_stock|55': [
    {
      // `id` bigint(20) NOT NULL AUTO_INCREMENT,
      // `sku_id` varchar(30) DEFAULT NULL COMMENT 'sku',
      // `ware_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '仓库',
      // `stock` int(11) NOT NULL DEFAULT '0' COMMENT '库存',
      // `lock_stock` int(11) NOT NULL DEFAULT '0' COMMENT '锁定库存',
      // `low_stock` int(11) NOT NULL DEFAULT '0' COMMENT '预警库存，到达预警库存就会安排补货',
      // `sale` int(11) NOT NULL DEFAULT '0' COMMENT '销量',
      // `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      // `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

      'id|4': /[A-Z][a-z][-][0-9]/,
      'sku_id|4': /[A-Z][a-z][-][0-9]/,
      'sku_name|1': ['小熊玩具', '水杯', '耳机', '纸巾'],
      'ware_id|4': /[A-Z][a-z][-][0-9]/,
      'stock|2-3': /[0-9]/,

      'lock_stock|2-3': /[0-9]/,
      'low_stock|1': [0 - 9],
      'sale|2-3': /[0-9]/,
      'createdTime': Random.datetime(),
      'updatedTime': Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    // 定义之后要把mock引入到全局mock里
    Mock.mock(new RegExp('/api/center/policy'), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.center_stock.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
