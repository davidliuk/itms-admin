import { computed } from 'vue';
import { OrderState } from '@/store/modules/order_info/types';
import { OrderDetail } from '@/api/orderInfo';

export type StepData = {
  step: number;
  strList: string[];
  description: string[];
};

export const OrderStateGetString = (state: string) => {
  return computed(() => {
    // // '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消';
    // // console.log(num);
    // if (num === 0) return '待付款';
    // if (num === 1) return '待发货';
    // if (num === 2) return '已发货';
    // if (num === 3) return '待收货';
    // if (num === 4) return '已完成';
    // if (num === -1) return '已取消';
    //
    // if (num === '0') return '待付款';
    // if (num === '1') return '待发货';
    // if (num === '2') return '已发货';
    // if (num === '3') return '待收货';
    // if (num === '4') return '已完成';
    // if (num === '-1') return '已取消';

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

    // UNPAID,PAID,DISPATCH,OUT,IN,ASSIGN,TAKE,RECEIVE,CANCEL
    return '未知订单状态';
  });
};
export const OrderStateGetStepAndString = (orderDetail: OrderDetail) => {
  return computed(() => {
    const num: string = orderDetail.orderStatus as unknown as string;
    const res: StepData = {
      step: 1,
      strList: [],
      description: [],
    };

    res.step = 0;
    res.strList.push('已取消');
    res.description.push('');
    res.strList.push('未付款');
    res.description.push('');
    res.strList.push('待调度');
    res.description.push('');
    res.strList.push('出库中');
    res.description.push('');
    res.strList.push('入库中');
    res.description.push('');
    res.strList.push('配送');
    res.description.push('');
    res.strList.push('待取件');
    res.description.push('');
    res.strList.push('已完成');
    res.description.push('');
    if (num === 'CANCEL') return res;

    res.step = 1;
    if (num === 'UNPAID') return res;
    res.strList[1] = `已付款`;
    res.description[1] = `${orderDetail.paymentTime as unknown as string} \n ${
      orderDetail.nickName as unknown as string
    }`;

    res.step = 2;
    if (num === 'DISPATCH') return res;
    res.strList[2] = `已调度`;
    res.description[2] = orderDetail.dispatchTime as unknown as string;

    res.step = 3;
    if (num === 'OUT') return res;
    res.strList[3] = `已出库`;
    res.description[3] = `${
      orderDetail.checkOrder?.outTime as unknown as string
    } \n ${orderDetail.wareName as unknown as string}`;

    res.step = 4;
    if (num === 'IN') return res;
    res.strList[4] = `已入库`;
    res.description[4] = `${
      orderDetail.checkOrder?.inTime as unknown as string
    } \n ${orderDetail.stationName as unknown as string}`;

    res.step = 5;
    res.description[5] = `配送员:${orderDetail.courierName}`;
    if (num === 'ASSIGN') return res;
    res.strList[5] = `已送达`;
    res.description[5] = `${
      orderDetail.assignTime as unknown as string
    } \n 配送员:${orderDetail.courierName}`;

    res.step = 6;
    if (num === 'TAKE') return res;
    res.strList[6] = `已取件`;
    res.description[6] = `${orderDetail.takeTime as unknown as string} \n ${
      orderDetail.receiverName as unknown as string
    }`;
    res.step = 7;

    // UNPAID,WAITING_DISPATCH,DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_TAKE,CANCEL
    // 返回的值是一个对象，其中有：步骤数+string列表，总共5个元素
    throw new Error('Invalid OrderInfo');
  });
};
