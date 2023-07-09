import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|4': /[0-9]/,
      'name|1': '@cname',
      'phone': /^1[3456789]\d{9}$/, // 模拟电话号码
      'idNo': /^\d{17}[\dXx]$/, // 模拟身份证号码
      // 'idNoUrl1': Mock.Random.image('200x100', '#50B347', '#FFF', 'Front'), // 模拟身份证正面图片
      'idNoUrl1': 'https://www.baidu.com',
      'idNoUrl2': Mock.Random.image('200x100', '#50B347', '#FFF', 'Back'), // 模拟身份证背面图片
      'missionCount|4': /[0-9]/,
      'createdTime': Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/station/couriers'), (params: GetParams) => {
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
