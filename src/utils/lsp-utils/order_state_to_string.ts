import { computed } from 'vue';
import { OrderState } from '@/store/modules/order_info/types';
import { OrderDetail } from '@/api/orderInfo';

export type LabelVal = {
  label: string;
  val: string;
};

export type StepData = {
  step: number;
  strList: string[];
  description: string[];
  descriptionB: string[];
  popupStr: LabelVal[][];
};

export const OrderStateGetString = (state: string) => {
  return computed(() => {
    let res = '未付款';
    if (state === 'UNPAID') return res;
    res = '已付款';
    if (state === 'PAID') return res;
    res = '已调度';
    if (state === 'DISPATCH') return res;
    res = '出库中';
    if (state === 'OUT') return res;
    res = '入库中';
    if (state === 'IN') return res;
    res = '配送中';
    if (state === 'ASSIGN') return res;
    res = '已送达';
    if (state === 'TAKE') return res;
    res = '已取件';
    if (state === 'RECEIVE') return res;
    res = '已取消';
    if (state === 'CANCEL') return res;
    res = '已退货';
    if (state === 'REFUND') return res;

    // UNPAID,PAID,DISPATCH,OUT,IN,ASSIGN,TAKE,RECEIVE,CANCEL,REFUND
    return '未知订单状态';
  });
};
export const OrderStateGetStepAndString = (
  orderDetail: OrderDetail
): StepData => {
  const num: string = orderDetail.orderStatus as unknown as string;
  const res: StepData = {
    step: 1,
    strList: [],
    description: [],
    descriptionB: [],
    popupStr: [],
  };

  res.popupStr.push([{ label: '头实体', val: '头数据' }]);
  res.step = 0;
  res.strList.push('已取消');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('未付款');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('待调度');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('出库中');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('入库中');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('配送');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('待取件');
  res.description.push('');
  res.descriptionB.push('');
  res.strList.push('已完成');
  res.description.push('');
  res.descriptionB.push('');
  if (num === 'CANCEL') return res;
  res.description[0] = '已退款';
  res.step = -1;
  if (num === 'REFUND') return res;

  res.step = 1;
  if (num === 'UNPAID') return res;
  res.strList[1] = `已付款`;
  res.description[1] = `${orderDetail.paymentTime}`;
  res.descriptionB[1] = `${orderDetail.nickName}`;
  // 获得寄件人信息
  const senderData: LabelVal[] = [];
  senderData.push({
    label: 'ID',
    val: `${orderDetail.wareId}`,
  });
  senderData.push({
    label: '支付方式',
    val: (orderDetail.payType as unknown as number) === 1 ? '微信' : '支付宝',
  });
  senderData.push({
    label: '订单来源',
    val:
      (orderDetail.sourceType as unknown as number) === 0 ? '小程序' : '网页端',
  });
  res.popupStr.push(senderData);

  res.step = 2;
  if (num === 'DISPATCH' || num === 'PAID') return res;
  res.strList[2] = `已调度`;
  res.description[2] = `${orderDetail.dispatchTime}`;
  res.descriptionB[2] = '调度中心';
  const dispatchData: LabelVal[] = [];
  dispatchData.push({
    label: '调度信息',
    val: `${orderDetail.wareName}->${orderDetail.stationName}->${orderDetail.receiverName}`,
  });
  dispatchData.push({
    label: '运输公司ID',
    val: `${orderDetail.logisticsId}`,
  });
  dispatchData.push({
    label: '运输公司名称',
    val: `${orderDetail.logisticsName}`,
  });
  dispatchData.push({
    label: '运输公司电话',
    val: `${orderDetail.logisticsPhone}`,
  });
  res.popupStr.push(dispatchData);

  res.step = 3;
  if (num === 'OUT') return res;
  res.strList[3] = `已出库`;
  res.description[3] = `${orderDetail.outTime}`;
  res.descriptionB[3] = `${orderDetail.wareName}`;
  const outData: LabelVal[] = [];
  outData.push({
    label: 'ID',
    val: `${orderDetail.wareId}`,
  });
  // outData.push({
  //   label: '中心仓库位置',
  //   val: `${orderDetail.wareId}`,
  // });
  res.popupStr.push(outData);

  res.step = 4;
  if (num === 'IN') return res;
  res.strList[4] = `已入库`;
  res.description[4] = `${orderDetail.inTime}`;
  res.descriptionB[4] = `${orderDetail.stationName}`;
  const inData: LabelVal[] = [];
  inData.push({
    label: 'ID',
    val: `${orderDetail.stationId}`,
  });
  res.popupStr.push(inData);

  res.step = 5;
  res.description[5] = `-`;
  res.descriptionB[5] = `${orderDetail.courierName}`;
  const courierData: LabelVal[] = [];
  courierData.push({
    label: 'ID',
    val: `${orderDetail.courierId}`,
  });
  res.popupStr.push(courierData);
  if (num === 'ASSIGN') return res;
  res.strList[5] = `已送达`;
  res.description[5] = `${orderDetail.assignTime}`;
  res.descriptionB[5] = `${orderDetail.courierName}`;

  res.step = 6;
  if (num === 'TAKE') return res;
  res.strList[6] = `已取件`;
  res.description[6] = `${orderDetail.takeTime}`;
  res.descriptionB[6] = `${orderDetail.receiverName}`;
  const receiverData: LabelVal[] = [];
  receiverData.push({
    label: '电话',
    val: `${orderDetail.receiverPhone}`,
  });
  receiverData.push({
    label: '省市地址',
    val: `${orderDetail.receiverProvince} ${orderDetail.receiverCity} ${orderDetail.receiverDistrict}`,
  });
  receiverData.push({
    label: '详细地址',
    val: `${orderDetail.receiverAddress}`,
  });
  receiverData.push({
    label: '邮编',
    val: `${orderDetail.receiverPostCode}`,
  });
  res.popupStr.push(receiverData);
  res.step = 7;
  if (num === 'RECEIVE') return res;

  // UNPAID,PAID,DISPATCH,OUT,IN,ASSIGN,TAKE,RECEIVE,CANCEL,REFUND
  // 返回的值是一个对象，其中有：步骤数+string列表，总共5个元素
  console.log(num);
  throw new Error(`Invalid OrderInfo`);
};
