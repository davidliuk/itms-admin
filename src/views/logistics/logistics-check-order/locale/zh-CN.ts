export default {
  'menu.logistics.LogCheckOrder': '验货(分发)单表格',
  'LogCheckOrder.form.id': '分发单编号',
  'LogCheckOrder.form.id.placeholder': '请输入分发单编号',
  'LogCheckOrder.form.wareId': '中心库房标识',
  'LogCheckOrder.form.wareId.placeholder': '请输入中心库房标识',
  'LogCheckOrder.form.stationId': '分站标识',
  'LogCheckOrder.form.stationId.placeholder': '请输入分站库房标识',
  'LogCheckOrder.form.skuId': '商品标识',
  'LogCheckOrder.form.skuId.placeholder': '请输入商品标识',

  'LogCheckOrder.form.status': '状态',
  'LogCheckOrder.form.status.OUT': '已出库', // 中心库房出库
  'LogCheckOrder.form.status.IN': '已入库',
  'LogCheckOrder.form.status.CANCEL': '取消',
  'LogCheckOrder.form.status.3': '已出库',
  'LogCheckOrder.form.status.4': '已入库',
  'LogCheckOrder.form.status.-1': '取消',

  'LogCheckOrder.form.inTime': '入库时间',
  'LogCheckOrder.form.outTime': '出库时间',
  'LogCheckOrder.form.search': '查询',
  'LogCheckOrder.form.reset': '重置',
  'LogCheckOrder.form.selectDefault': '全部',
  'LogCheckOrder.operation.create': '新建',
  'LogCheckOrder.operation.import': '批量导入',
  'LogCheckOrder.operation.download': '下载',
  'LogCheckOrder.form.createTime': '创建时间',
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

  // 分发单号、分站库房名称、出库时间、状态、
  // 商品代码、商品名称、计量单位，商品信息

  'LogCheckOrder.columns.index': '#',
  'LogCheckOrder.columns.id': '分发单标识',
  'LogCheckOrder.columns.orderId': '分发单所属订单',
  'LogCheckOrder.columns.wareId': '仓库标识',
  'LogCheckOrder.columns.stationId': '分站标识(id换成分站库房名称)',

  'LogCheckOrder.columns.inTime': '入库时间',
  'LogCheckOrder.columns.outTime': '出库时间',
  'LogCheckOrder.columns.createTime': '创建时间',
  'LogCheckOrder.columns.updateTime': '更新时间',

  'LogCheckOrder.columns.status': '状态',
  'LogCheckOrder.columns.operations': '操作',
  'LogCheckOrder.columns.operations.view': '查看商品详情',
  'LogCheckOrder.columns.operations.delete': '删除',

  'LogCheckOrder.columns.skuId': '商品编号',
  'LogCheckOrder.columns.skuImg': '商品图片',
  'LogCheckOrder.columns.skuNum': '商品数量',
  'LogCheckOrder.columns.skuName': '商品名称',
  'LogCheckOrder.columns.skuPrice': '商品价格',

  // size
  'LogCheckOrder.size.mini': '迷你',
  'LogCheckOrder.size.small': '偏小',
  'LogCheckOrder.size.medium': '中等',
  'LogCheckOrder.size.large': '偏大',
  // actions
  'LogCheckOrder.actions.refresh': '刷新',
  'LogCheckOrder.actions.density': '密度',
  'LogCheckOrder.actions.columnSetting': '列设置',
};
