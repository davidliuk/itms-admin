import Mock from 'mockjs';
import qs from 'query-string';
import dayjs from 'dayjs';
import { GetParams } from '@/types/global';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

const { Random } = Mock;

// const data = {
//     province: '黑龙江省',
//     city: '双鸭山市',
//     district: '集贤县',
//     name: '幸福分站',
//     address: '吉祥小区',
//     longitude: 22,
//     latitude: 55,
//     contact: '16224602666',
//     storePhoto: '7777',
//     businessHours: '9:00 AM - 6:00 PM',
//     businessStatus: 'open',
//     createdTime: '2023-06-30',
//     updatedTime: '2026-06-30',
// }

const data = Mock.mock({
  // province: '黑龙江省',
  // city: '双鸭山市',
  // district: '集贤县',
  // name: '幸福分站',
  // address: '吉祥小区',
  // longitude: 22,
  // latitude: 55,
  // contact: '16224602666',
  // storePhoto: '7777',
  // businessHours: '9:00 AM - 6:00 PM',
  // businessStatus: 'open',
  // createdTime: '2023-06-30',
  // updatedTime: '2026-06-30',
  'province': '@province',
  'city': '@city',
  'district': '@county',
  'name': '@ctitle(5, 10)',
  'contact': '@string("number", 11)',
  'address': '@county(true)',
  'longitude': '@float(80, 120, 6, 8)',
  'latitude': '@float(20, 40, 6, 8)',
  'storePhoto': '@image("200x200", "#4A7BF7", "#FFF", "Mock Store")',
  'businessHours': '9:00 AM - 6:00 PM',
  'businessStatus|1': ['open', 'closed'],
  'createdTime': Random.datetime(),
  'updatedTime': Random.datetime(),
});

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/station/content-data'), () => {
      const presetData = [58, 81, 53, 90, 64, 88, 49, 79];
      const getLineData = () => {
        const count = 8;
        return new Array(count).fill(0).map((el, idx) => ({
          x: dayjs()
            .day(idx - 2)
            .format('YYYY-MM-DD'),
          y: presetData[idx],
        }));
      };
      return successResponseWrap([...getLineData()]);
    });
    Mock.mock(new RegExp('/api/station/detail'), () => {
      return successResponseWrap({ data });
    });
    //   Mock.mock(new RegExp('/api/station/detail'), () => {
    //       return successResponseWrap({
    //           province: '黑龙江省',
    //           city: '双鸭山市',
    //           district: '集贤县',
    //           name: '幸福分站',
    //           address: '吉祥小区',
    //           longitude: 22,
    //           latitude: 55,
    //           contact: '16224602666',
    //           storePhoto: '7777',
    //           businessHours: '9:00 AM - 6:00 PM',
    //           businessStatus: 'open',
    //           createdTime: '2023-06-30',
    //           updatedTime: '2026-06-30',
    //       });
    //   });
  },
});
