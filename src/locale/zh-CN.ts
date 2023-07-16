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

import localeInvoice from '@/views/finance/invoice/locale/zh-CN';
import localeSettlement from '@/views/finance/settlement/locale/zh-CN';
import localeSupplier from '@/views/finance/supplier/locale/zh-CN';

import localeFinanceView from '@/views/finance/financeview/locale/zh-CN';

import localeAdmin from '@/views/acl/admin/locale/zh-CN';
import localeRole from '@/views/acl/role/locale/zh-CN';
import localePermission from '@/views/acl/permission/locale/zh-CN';

import localeCategory from '@/views/product/category/locale/zh-CN';
import localeAttrGroup from '@/views/product/attr-group/locale/zh-CN';
import localeAttr from '@/views/product/attr/locale/zh-CN';
import localeSku from '@/views/product/sku/locale/zh-CN';
import localeSkuCreate from '@/views/product/sku-create/locale/zh-CN';
import localeSkuEdit from '@/views/product/sku-edit/locale/zh-CN';
import localeSupplierProduct from '@/views/product/supplier/locale/zh-CN';

import localeeSearchTable from '@/views/center/search-table/locale/zh-CN';
import localeCenterProjectStock from '@/views/center/skuware/locale/zh-CN'; // 库存
import localeCenterTransferOrder from '@/views/center/transfer_order/locale/zh-CN';
import localeCheckOrder from '@/views/center/check-order/locale/zh-CN'; // 分发单->分站，验货单->运输公司
import localeTransferOrder from '@/views/center/transfer-order/locale/zh-CN'; // 调拨单->中心库房
import localeWorkOrder from '@/views/center/work-order/locale/zh-CN';
import localeStorageOrder from '@/views/center/storage-order/locale/zh-CN';
import localPurchaseOrder from '@/views/center/purchase-order/locale/zh-CN';
import localeLogistics from '@/views/center/logistics-table/locale/zh-CN';
import localeStationTable from '@/views/center/station-table/locale/zh-CN';
// @ts-ignore
import localeLogisticsCheckOrder from '@/views/logistics/logistics-check-order/locale/zh-CN';
// 运输公司接收的验货单

import localeMissionTable from '@/views/station/mission-table/locale/zh-CN';
import localeCourierTable from '@/views/station/courier-table/locale/zh-CN';
import localeStationInfo from '@/views/station/station-info/locale/zh-CN';
// import localeStationTable from '@/views/station/station-table/locale/zh-CN';
import localeStationCheckOrder from '@/views/station/checkorder-table/locale/zh-CN';
import localeReceiptTable from '@/views/station/receipt-table/locale/zh-CN';
import localeTransferTable from '@/views/station/transfer-table/locale/zh-CN';
import localeStorageTable from '@/views/station/storage-table/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.dispatch': '调度中心',
  'menu.dispatch.orderList': '订单列表',
  'menu.DistributionCenter': '库房管理',
  'menu.finance': '财务管理',
  'menu.stock': '进货管理',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.station': '分站管理',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'menu.center': '区域中心仓库',
  'menu.logistics': '运输公司',
  'menu.acl': '权限管理',
  'menu.product': '商品管理',
  'menu.supplier': '供应商管理',
  'menu.financeView': '财务分析',

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

  ...localeFinanceView,

  ...localeSettlement,
  ...localeSupplier,
  ...localeInvoice,

  ...localeUserSetting,
  ...localeeSearchTable,
  ...localeCenterProjectStock,
  ...localeCenterTransferOrder,

  ...localeAdmin,
  ...localeRole,
  ...localePermission,

  ...localeCategory,
  ...localeAttrGroup,
  ...localeAttr,
  ...localeSku,
  ...localeSkuCreate,
  ...localeSkuEdit,
  ...localeSupplierProduct,

  ...localeMissionTable,
  ...localeCourierTable,
  ...localeStationInfo,
  ...localeStationCheckOrder,
  ...localeReceiptTable,
  ...localeTransferTable,
  ...localeStorageTable,

  ...localeCheckOrder,
  ...localeTransferOrder,
  ...localeLogisticsCheckOrder,
  ...localeWorkOrder,
  ...localeStorageOrder,
  ...localPurchaseOrder,
  ...localeLogistics,
  ...localeStationTable,
};
