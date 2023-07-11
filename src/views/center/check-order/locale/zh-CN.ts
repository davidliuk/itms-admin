export default {
  'menu.center.CheckOrder': '验货(分发)单表格',
  'CheckOrder.form.id': '分发单编号',
  'CheckOrder.form.id.placeholder': '请输入分发单编号',
  'CheckOrder.form.wareId': '中心库房标识',
  'CheckOrder.form.wareId.placeholder': '请输入中心库房标识',
  'CheckOrder.form.stationId': '分站标识',
  'CheckOrder.form.stationId.placeholder': '请输入分站库房标识',
  'CheckOrder.form.skuId': '商品标识',
  'CheckOrder.form.skuId.placeholder': '请输入商品标识',

  'CheckOrder.form.status': '分发单状态',
  'CheckOrder.form.status.OUT': '已出库', // 中心库房出库
  'CheckOrder.form.status.IN': '已入库',
  'CheckOrder.form.status.CANCEL': '取消',
  'CheckOrder.form.status.3': '已出库',
  'CheckOrder.form.status.4': '已入库',
  'CheckOrder.form.status.-1': '取消',

  'CheckOrder.columns.type': '分发单类型',
  'CheckOrder.form.type.DELIVERY': '送货', // 中心库房出库
  'CheckOrder.form.type.EXCHANGE': '换货',
  'CheckOrder.form.type.RETURN': '退货',

  'CheckOrder.form.inTime': '入库时间',
  'CheckOrder.form.inTime.placeholder': '筛选该入库时间之后',
  'CheckOrder.form.outTime': '出库时间',
  'CheckOrder.form.outTime.placeholder': '筛选该出库时间之前',
  'CheckOrder.form.search': '查询',
  'CheckOrder.form.reset': '重置',
  'CheckOrder.form.selectDefault': '全部',
  'CheckOrder.operation.create': '新建',
  'CheckOrder.operation.import': '批量导入',
  'CheckOrder.operation.download': '下载列表',
  'CheckOrder.form.createTime': '创建时间',
  // columns
  // id:number
  // imgUrl:string
  // inTime:string
  // orderId:number
  // outTime:string
  // skuId:number
  // skuName:string
  // skuNum:number
  // skuPrice:number
  // stationId:number
  // status:number0:未分发,1:已分发,2:已入库
  // updateTime:string
  // createTime:string
  // wareId:number

  // id	integer(int64)	id
  // orderId	integer(int64)	订单ID
  // wareId	integer(int64)	仓库ID
  // stationId	integer(int64)	分站ID
  // workOrderId	integer(int64)	任务单ID
  // status	string	状态,可用值:OUT,IN,CANCEL
  // inTime	string(date-time)	入库时间
  // outTime	string(date-time)	出库时间
  // createTime	string(date-time)	创建时间
  // updateTime	string(date-time)	更新时间

  // 分发单号、分站库房名称、出库时间、状态、
  // 商品代码、商品名称、计量单位，商品信息

  'CheckOrder.columns.index': '#',
  'CheckOrder.columns.id': '分发单标识',
  'CheckOrder.columns.orderId': '分发单所属订单',
  'CheckOrder.columns.wareId': '仓库标识',
  'CheckOrder.columns.stationId': '分站标识',
  'CheckOrder.columns.workOrderId': '任务单标识',
  'CheckOrder.columns.inTime': '入库时间',
  'CheckOrder.columns.outTime': '出库时间',
  'CheckOrder.columns.createTime': '创建时间',
  'CheckOrder.columns.updateTime': '更新时间',

  'CheckOrder.columns.status': '状态',
  'CheckOrder.columns.operations': '操作',
  'CheckOrder.columns.operations.view': '查看商品详情',
  'CheckOrder.columns.operations.delete': '删除',

  'CheckOrder.columns.skuId': '商品编号',
  'CheckOrder.columns.skuImg': '商品图片',
  'CheckOrder.columns.skuNum': '商品数量',
  'CheckOrder.columns.skuName': '商品名称',
  'CheckOrder.columns.skuPrice': '商品价格',

  // size
  'CheckOrder.size.mini': '迷你',
  'CheckOrder.size.small': '偏小',
  'CheckOrder.size.medium': '中等',
  'CheckOrder.size.large': '偏大',
  // actions
  'CheckOrder.actions.refresh': '刷新',
  'CheckOrder.actions.density': '密度',
  'CheckOrder.actions.columnSetting': '列设置',
};
