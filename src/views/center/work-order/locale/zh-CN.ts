export default {
  // String name = workOrderQueryVo.getName();
  // Long courierId = workOrderQueryVo.getCourierId();
  // Long userId = workOrderQueryVo.getUserId();
  // Long wareId = workOrderQueryVo.getWareId();
  // Long stationId = workOrderQueryVo.getStationId();
  // Long orderId = workOrderQueryVo.getOrderId();
  // WorkStatus status = workOrderQueryVo.getWorkStatus();
  // WorkType type = workOrderQueryVo.getWorkType();
  // Date startTime = workOrderQueryVo.getStartTime();
  // Date endTime = workOrderQueryVo.getEndTime();
  'menu.center.WorkOrder': '任务单表格',
  'WorkOrder.form.id': '任务单编号',
  'WorkOrder.form.id.placeholder': '请输入任务单编号',
  'WorkOrder.form.userId': '用户标识',
  'WorkOrder.form.userId.placeholder': '请输入用户标识',
  'WorkOrder.form.wareId': '中心库房标识',
  'WorkOrder.form.wareId.placeholder': '请输入中心库房标识',
  'WorkOrder.form.stationId': '分站标识',
  'WorkOrder.form.stationId.placeholder': '请输入分站库房标识',
  'WorkOrder.form.courierId': '配送员标识',
  'WorkOrder.form.courierId.placeholder': '请输入配送员标识',
  'WorkOrder.form.orderId': '订单标识',
  'WorkOrder.form.orderId.placeholder': '请输入订单标识',
  'WorkOrder.form.startTime': '创建时间',
  'WorkOrder.form.endTime': '结束时间',

  'WorkOrder.form.workType': '任务单类型',
  'WorkOrder.form.workType.placeholder': '请输入任务单类型',
  'WorkOrder.form.workType.0': '送货',
  'WorkOrder.form.workType.1': '换货',
  'WorkOrder.form.workType.2': '退货',
  'WorkOrder.form.workType.DELIVERY': '送货',
  'WorkOrder.form.workType.EXCHANGE': '换货',
  'WorkOrder.form.workType.RETURN': '退货',
  //   DELIVERY(0, "送货"),
  // EXCHANGE(1, "换货"),
  //     RETURN(2, "退货");

  'WorkOrder.form.workStatus.0': '已调度',
  'WorkOrder.form.workStatus.1': '已出库',
  'WorkOrder.form.workStatus.2': '已入库',
  'WorkOrder.form.workStatus.3': '已分配',
  'WorkOrder.form.workStatus.4': '待收货',
  'WorkOrder.form.workStatus.5': '完成',
  'WorkOrder.form.workStatus.-1': '取消',

  //   DISPATCH(2, "已调度"), // 区域中心库房出库
  //   OUT(3, "已出库"), // 分站库房出库
  //   IN(4, "已入库"),
  //   ASSIGN(5, "已分配"),
  //   TAKE(6, "已领货"), // 待收货
  //   RECEIVE(7, "完成"), //
  //   RETURN_UNASSIGNED(8, "退货未分配"), //
  //   RETURN_ASSIGN(9, "退货分配"), //
  //   RETURN_STATION(10, "退货入站"), //
  //   RETURN_OUT(11, "货物出库"), //
  //   RETURN_IN(12, "货物入库"), //
  //   CANCEL(-1, "取消");

  'WorkOrder.form.workStatus': '状态',
  'WorkOrder.form.workStatus.DISPATCH': '已调度',
  'WorkOrder.form.workStatus.OUT': '已出库',
  'WorkOrder.form.workStatus.IN': '已入库',
  'WorkOrder.form.workStatus.ASSIGN': '已分配',
  'WorkOrder.form.workStatus.TAKE': '已领货', // 待收货
  'WorkOrder.form.workStatus.RECEIVE': '完成',
  'WorkOrder.form.workStatus.RETURN_UNASSIGNED': '退货未分配',
  'WorkOrder.form.workStatus.RETURN_ASSIGN': '退货分配',
  'WorkOrder.form.workStatus.RETURN_STATION': '退货入站',
  'WorkOrder.form.workStatus.RETURN_OUT': '退货出库',
  'WorkOrder.form.workStatus.RETURN_IN': '退货出库',
  'WorkOrder.form.workStatus.CANCEL': '取消',

  'WorkOrder.form.search': '查询',
  'WorkOrder.form.reset': '重置',
  'WorkOrder.form.selectDefault': '全部',
  'WorkOrder.operation.create': '新建',
  'WorkOrder.operation.import': '批量导入',
  'WorkOrder.operation.download': '下载',

  // city	string	市
  // courierId	integer(int64)	配送员ID
  // createTime	string(date-time)	创建时间
  // detailAddress	string	详细地址
  // district	string	区
  // id	integer(int64)	id
  // logisticsId	integer(int64)	物流公司id
  // logisticsName	string	物流公司名称
  // logisticsPhone	string	物流公司电话
  // name	string	姓名
  // orderId	integer(int64)	订单ID
  // orderInfo	OrderInfo	订单	OrderInfo
  // param	object	其他参数
  // phone	string	电话号码
  // postCode	string	邮编
  // province	string	省
  // stationId	integer(int64)	分站ID
  // stationName	string	姓名
  // updateTime	string(date-time)	更新时间
  // userId	integer(int64)	用户ID
  // wareId	integer(int64)	仓库ID
  // workStatus	string	状态,可用值:DISPATCH,OUT,IN,ASSIGN,TAKE,RECEIVE,CANCEL
  // workType	string	配送类型,可用值:DELIVERY,EXCHANGE,RETURN
  'WorkOrder.columns.index': '#',
  'WorkOrder.columns.id': '任务单标识',
  'WorkOrder.columns.orderId': '任务单所属订单',
  'WorkOrder.columns.wareId': '仓库标识',
  'WorkOrder.columns.stationId': '分站标识',
  'WorkOrder.columns.stationName': '分站名称',
  'WorkOrder.columns.userId': '用户标识',

  'WorkOrder.columns.logisticsID': '物流公司ID',
  'WorkOrder.columns.logisticsName': '物流公司名称',
  'WorkOrder.columns.workType': '任务单类型',
  'WorkOrder.columns.workStatus': '任务单状态',
  'WorkOrder.columns.startTime': '开始时间',
  'WorkOrder.columns.endTime': '结束时间',

  'WorkOrder.columns.operations': '操作',
  'WorkOrder.columns.operations.view': '查看商品详情',
  // 'WorkOrder.columns.operations.delete': '删除',

  'WorkOrder.columns.skuId': '商品编号',
  'WorkOrder.columns.skuImg': '商品图片',
  'WorkOrder.columns.skuNum': '商品数量',
  'WorkOrder.columns.skuName': '商品名称',
  'WorkOrder.columns.skuPrice': '商品价格',

  // size
  'WorkOrder.size.mini': '迷你',
  'WorkOrder.size.small': '偏小',
  'WorkOrder.size.medium': '中等',
  'WorkOrder.size.large': '偏大',
  // actions
  'WorkOrder.actions.refresh': '刷新',
  'WorkOrder.actions.density': '密度',
  'WorkOrder.actions.columnSetting': '列设置',
};
