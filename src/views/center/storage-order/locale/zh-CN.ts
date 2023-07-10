export default {
  // Long stationId = storageOrderQueryVo.getStationId();
  // Long wareId = storageOrderQueryVo.getWareId();
  // Long skuId = storageOrderQueryVo.getSkuId();
  // Long supplierId = storageOrderQueryVo.getSupplierId();
  // String skuName = storageOrderQueryVo.getSkuName();
  // StorageType storageType = storageOrderQueryVo.getStorageType();
  'menu.center.StorageOrder': '出库单表格',
  'StorageOrder.form.id': '出库单编号',
  'StorageOrder.form.id.placeholder': '请输入出库单编号',
  'StorageOrder.form.wareId': '中心库房标识',
  'StorageOrder.form.wareId.placeholder': '请输入中心库房标识',
  'StorageOrder.form.stationId': '分站标识',
  'StorageOrder.form.stationId.placeholder': '请输入分站库房标识',
  // 'StorageOrder.form.stationName': '分站名称',
  // 'StorageOrder.form.stationName.placeholder': '请输入分站名称标识',
  'StorageOrder.form.skuId': '商品标识',
  'StorageOrder.form.skuId.placeholder': '请输入商品标识',
  'StorageOrder.form.skuName': '商品名称',
  'StorageOrder.form.skuName.placeholder': '请输入商品名称',
  'StorageOrder.form.supplierId': '供应商标识',
  'StorageOrder.form.supplierId.placeholder': '请输入供应商标识',
  // 'StorageOrder.form.supplierName': '供应商名称',
  // 'StorageOrder.formsupplierName.placeholder': '请输入供应商名称',
  // 'StorageOrder.form.startTime': '创建时间',
  // 'StorageOrder.form.endTime': '结束时间',
  'StorageOrder.form.storageType': '出库类型',
  'StorageOrder.form.storageType.IN': '入库',
  'StorageOrder.form.storageType.OUT': '出库',
  'StorageOrder.form.storageType.RETURN_IN': '退货入库',
  'StorageOrder.form.storageType.RETURN_OUT': '退货出库',
  'StorageOrder.form.storageType.0': '入库',
  'StorageOrder.form.storageType.1': '出库',
  'StorageOrder.form.storageType.2': '退货入库',
  'StorageOrder.form.storageType.3': '退货出库',
  //   IN(0, "入库"),
  //  OUT(1, "出库"),
  //     RETURN_IN(2, "退货入库"),
  //     RETURN_OUT(3, "退货出库");
  'StorageOrder.form.search': '查询',
  'StorageOrder.form.reset': '重置',
  'StorageOrder.form.selectDefault': '全部',
  'StorageOrder.operation.create': '新建',
  'StorageOrder.operation.import': '批量导入',
  'StorageOrder.operation.download': '下载',

  // id	integer(int64)	id
  // orderId	integer(int64)	订单ID
  // wareId	integer(int64)	仓库ID

  // stationId	integer(int64)	分站ID
  // stationName	string	分站名称

  // supplierId	integer(int64)	供应商ID
  // supplierName	string	供应商名称

  // skuId	integer(int64)	商品sku编号
  // skuName	string	商品sku名字
  // skuNum	integer(int32)	商品购买的数量
  // skuPrice	number	商品sku价格
  // imgUrl	string	商品sku图片

  // storageType	string	类型,可用值:IN,OUT,RETURN_IN,RETURN_OUT

  // updateTime	string(date-time)	更新时间
  // createTime	string(date-time)	创建时间

  'StorageOrder.columns.index': '#',
  'StorageOrder.columns.id': '出库单标识',
  'StorageOrder.columns.orderId': '出库单所属订单',
  'StorageOrder.columns.wareId': '仓库标识',
  'StorageOrder.columns.stationId': '分站标识',
  'StorageOrder.columns.stationName': '分站名称',
  'StorageOrder.columns.supplierId': '供应商标识',
  'StorageOrder.columns.supplierName': '供应商名称',
  'StorageOrder.columns.storageType': '出库类型',
  'StorageOrder.columns.updateTime': '更新时间',
  'StorageOrder.columns.createTime': '创建时间',

  'StorageOrder.columns.status': '状态',
  'StorageOrder.columns.operations': '操作',
  'StorageOrder.columns.operations.view': '查看商品详情',
  'StorageOrder.columns.operations.delete': '删除',

  'StorageOrder.columns.skuId': '商品编号',
  'StorageOrder.columns.skuImg': '商品图片',
  'StorageOrder.columns.skuNum': '商品数量',
  'StorageOrder.columns.skuName': '商品名称',
  'StorageOrder.columns.skuPrice': '商品价格',

  // size
  'StorageOrder.size.mini': '迷你',
  'StorageOrder.size.small': '偏小',
  'StorageOrder.size.medium': '中等',
  'StorageOrder.size.large': '偏大',
  // actions
  'StorageOrder.actions.refresh': '刷新',
  'StorageOrder.actions.density': '密度',
  'StorageOrder.actions.columnSetting': '列设置',
};
