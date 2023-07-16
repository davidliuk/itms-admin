import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

setupMock({
  setup() {
    // Mock.XHR.prototype.withCredentials = true;
    // const Mock = require('mockjs');

    // 创建模拟数据
    Mock.mock('/api/table', 'get', () => {
      // 省份数据
      const provinces = Mock.mock({
        'list|34': [
          {
            'id|+1': 1,
            'name': '@province',
            'children|1-10': [
              {
                'id|+1': 1,
                'name': '@city',
                'children|1-10': [
                  {
                    'id|+1': 1,
                    'name': '@county',
                  },
                ],
              },
            ],
          },
        ],
      }).list;

      // 城市数据
      const cities = provinces.reduce(
        (result: any[], province: { children: any[] }) => {
          province.children.forEach((city) => {
            result.push(city);
          });
          return result;
        },
        []
      );

      // 区县数据
      const districts = cities.reduce(
        (result: any[], city: { children: any[] }) => {
          city.children.forEach((district) => {
            result.push(district);
          });
          return result;
        },
        []
      );

      // 返回表格数据
      return {
        provinces,
        cities,
        districts,
      };
    });
  },
});
