import Mock from 'mockjs';

import './user';
import './message-box';

import '@/views/dashboard/workplace/mock';

import '@/views/dashboard/monitor/mock';

import '@/views/list/card/mock';
import '@/views/list/search-table/mock';

import '@/views/form/step/mock';

import '@/views/profile/basic/mock';

import '@/views/visualization/data-analysis/mock';
import '@/views/visualization/multi-dimension-data-analysis/mock';

import '@/views/user/info/mock';
import '@/views/user/setting/mock';

import '@/views/center/search-table/mock';
import '@/views/center/skuware/mock';
import '@/views/center/transfer_order/mock';

import '@/views/station/mission-table/mock';
import '@/views/station/courier-table/mock';
import '@/views/station/station-info/mock';
import '@/views/station/station-table/mock';

// import '@/views/acl/role/mock';
// import '@/views/acl/admin/mock';
// import '@/views/acl/permission/mock';

Mock.setup({
  timeout: '600-1000',
});
