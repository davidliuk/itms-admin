export default {
  // 定义调拨单类型

  // id: '',
  // wareId: '',
  // stationId: '',
  // stationName:'',
  // orderId:'',
  // workOrderId:'',
  // logisticsId:'',
  // logisticsName:''

  'menu.center.TransferOrder': '调拨单表格',
  'TransferOrder.form.id': '调拨单编号',
  'TransferOrder.form.id.placeholder': '请输入调拨单编号',
  'TransferOrder.form.wareId': '中心库房标识',
  'TransferOrder.form.wareId.placeholder': '请输入中心库房标识',

  'TransferOrder.form.orderId': '订单标识',
  'TransferOrder.form.orderId.placeholder': '请输入订单标识',
  'TransferOrder.form.workOrderId': '任务单标识',
  'TransferOrder.form.workOrderId.placeholder': '请输入任务标识',

  'TransferOrder.form.stationId': '分站标识',
  'TransferOrder.form.stationId.placeholder': '请输入分站库房标识',
  'TransferOrder.form.stationName': '分站名称',
  'TransferOrder.form.stationName.placeholder': '请输入分站库房名称',

  'TransferOrder.form.logisticsId': '运输公司标识',
  'TransferOrder.form.logisticsId.placeholder': '请输入运输公司标识',
  'TransferOrder.form.logisticsName': '运输公司名称',
  'TransferOrder.form.logisticsName.placeholder': '请输入运输公司名称',
  'TransferOrder.form.status': '状态',
  'TransferOrder.form.status.DISPATCH': '已调度待出库',
  'TransferOrder.form.status.OUT': '已出库',
  'TransferOrder.form.status.IN': '已入分站库',
  'TransferOrder.form.status.CANCEL': '取消',
  'TransferOrder.form.status.2': '已调度待出库',
  'TransferOrder.form.status.3': '已出库',
  'TransferOrder.form.status.4': '已入分站库',
  'TransferOrder.form.status.-1': '取消',
  //   DISPATCH(2, "已调度"), // 区域中心库房出库
  // OUT(3, "已出库"), // 分站库房出库
  //   IN(4, "已入库"),
  //   CANCEL(-1, "取消");
  'TransferOrder.columns.type': '类型',
  'TransferOrder.form.type.DELIVERY': '送货',
  'TransferOrder.form.type.EXCHANGE': '换货',
  'TransferOrder.form.type.RETURN': '退货',
  //   DELIVERY(0, "送货"),
  // EXCHANGE(1, "换货"),
  //   RETURN(2, "退货");

  'TransferOrder.form.search': '查询',
  'TransferOrder.form.reset': '重置',
  'TransferOrder.form.selectDefault': '全部',
  'TransferOrder.operation.create': '新建',
  'TransferOrder.operation.import': '批量导入',
  'TransferOrder.operation.download': '下载',

  // id: number; // 调拨单id
  // orderId: number; // 订单ID
  // wareId: number; // 仓库ID
  // workOrderId: number; // 任务单ID
  // stationId: number; // 分站ID，生成分发单之后
  // stationName: string; // 分站名称
  // logisticsId: number; // 物流公司id
  // logisticsName: string; // 物流公司名称
  // logisticsPhone: string; // 物流公司电话
  // status: number; // 状态
  // inTime: Date; // 入库时间
  // outTime: Date; // 出库时间

  'TransferOrder.columns.index': '#',
  'TransferOrder.columns.id': '调拨单标识',
  'TransferOrder.columns.orderId': '订单号',
  'TransferOrder.columns.wareId': '仓库标识',
  'TransferOrder.columns.stationId': '分站号',
  'TransferOrder.columns.stationName': '分站名称',
  'TransferOrder.columns.workOrderId': '任务单标识',
  'TransferOrder.columns.inTime': '入库时间',
  'TransferOrder.columns.outTime': '出库时间',
  'TransferOrder.columns.logisticsId': '物流公司id',
  'TransferOrder.columns.logisticsName': '物流公司名称',
  'TransferOrder.columns.logisticsPhone': '物流公司电话',
  'TransferOrder.columns.status': '状态',
  'TransferOrder.columns.operations': '操作',
  'TransferOrder.columns.operations.view': '查看商品详情',

  'TransferOrder.columns.skuId': '商品编号',
  'TransferOrder.columns.skuImg': '商品图片',
  'TransferOrder.columns.skuNum': '商品数量',
  'TransferOrder.columns.skuName': '商品名称',
  'TransferOrder.columns.skuPrice': '商品价格',

  // size
  'TransferOrder.size.mini': '迷你',
  'TransferOrder.size.small': '偏小',
  'TransferOrder.size.medium': '中等',
  'TransferOrder.size.large': '偏大',
  // actions
  'TransferOrder.actions.refresh': '刷新',
  'TransferOrder.actions.density': '密度',
  'TransferOrder.actions.columnSetting': '列设置',
};
