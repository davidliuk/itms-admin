import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { PostData } from '@/types/global';

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/data-chain-growth'), (params: PostData) => {
      const { quota } = JSON.parse(params.body);
      const getLineData = () => {
        return {
          xAxis: new Array(12).fill(0).map((_item, index) => `${index + 1}日`),
          data: {
            name: quota,
            value: new Array(12)
              .fill(0)
              .map(() => Mock.Random.natural(1000, 3000)),
          },
        };
      };
      return successResponseWrap({
        count: Mock.Random.natural(1000, 3000),
        growth: Mock.Random.float(20, 100, 2, 2),
        chartData: getLineData(),
      });
    });
    // v2
    Mock.mock(new RegExp('/api/data-overview'), () => {
      const generateLineData = (name: string) => {
        return {
          name,
          count: Mock.Random.natural(20, 200),
          value: new Array(8).fill(0).map(() => Mock.Random.natural(20, 200)),
        };
      };
      const xAxis = new Array(8).fill(0).map((_item, index) => {
        return `7.1${index}`;
      });
      return successResponseWrap({
        xAxis,
        data: [
          generateLineData('订单数量'),
          generateLineData('商品出库量'),
          generateLineData('商品入库量'),
          generateLineData('退货量'),
        ],
      });
    });
  },
});
