import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

import localeSearchTable from '@/views/list/search-table/locale/zh-CN';
import localeCardList from '@/views/list/card/locale/zh-CN';

import localeStepForm from '@/views/form/step/locale/zh-CN';
import localeGroupForm from '@/views/form/group/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

import localeDataAnalysis from '@/views/visualization/data-analysis/locale/zh-CN';
import localeMultiDAnalysis from '@/views/visualization/multi-dimension-data-analysis/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import localeeSearchTable from '@/views/center/search-table/locale/zh-CN';
import localeCenterProjectStock from '@/views/center/skuware/locale/zh-CN';
import localeCenterTransferOrder from '@/views/center/transfer_order/locale/zh-CN';

import localeAdmin from '@/views/acl/admin/locale/zh-CN';
import localeRole from '@/views/acl/role/locale/zh-CN';
import localePermission from '@/views/acl/permission/locale/zh-CN';
import localeCheckOrder from '@/views/center/check-order/locale/zh-CN';

import localeMissionTable from '@/views/station/mission-table/locale/zh-CN';
import localeCourierTable from '@/views/station/courier-table/locale/zh-CN';
import localeStationInfo from '@/views/station/station-info/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.station':'分站管理',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'menu.center': '区域中心仓库',
  'menu.acl': '权限管理',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,

  ...localeMonitor,
  ...localeSearchTable,
  ...localeCardList,
  ...localeStepForm,
  ...localeGroupForm,
  ...localeBasicProfile,
  ...localeDataAnalysis,
  ...localeMultiDAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,

  ...localeUserSetting,
  ...localeeSearchTable,
  ...localeCenterProjectStock,
  ...localeCenterTransferOrder,

  ...localeAdmin,
  ...localeRole,
  ...localePermission,
<<<<<<< HEAD

  ...localeMissionTable,
  ...localeCourierTable,
  ...localeStationInfo,
=======
  ...localeCheckOrder,
>>>>>>> 86491a70517824459506565ced03891c39d999bc
};
