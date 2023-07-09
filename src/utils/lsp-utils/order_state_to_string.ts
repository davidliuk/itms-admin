import { computed } from 'vue';
import { OrderState } from '@/store/modules/order_info/types';

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

    if (state === 'UNPAID') return '未付款';
    if (state === 'CANCEL') return '已取消';
    if (state === 'WAITING_DISPATCH') return '待调度';
    if (state === 'DISPATCH') return '已调度';
    if (state === 'OUT') return '出库中';
    if (state === 'IN') return '入库中';
    if (state === 'WAITING_ASSIGN') return '待配送';
    if (state === 'ASSIGN') return '配送中';
    if (state === 'WAITING_TAKE') return '待取件';
    if (state === 'FINISHED') return '已完成';
    if (state === 'CANCEL') return '已取消';

    // UNPAID,WAITING_DISPATCH,DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_TAKE,FINISHED,CANCEL
    return '未知订单状态';
  });
};
export const OrderStateGetStepAndString = (orderInfo: OrderState) => {
  return computed(() => {
    const num: string = orderInfo.orderStatus as unknown as string;
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
    res.description[1] = orderInfo.paymentTime as unknown as string;

    res.step = 2;
    if (num === 'WAITING_DISPATCH') return res;
    res.strList[2] = `已调度`;
    res.step = 3;
    if (num === 'OUT' || num === 'DISPATCH') return res;
    res.strList[3] = `已出库`;
    res.description[3] = orderInfo.deliveryTime as unknown as string;
    res.step = 4;
    if (num === 'IN') return res;
    res.strList[4] = `已入库`;
    // res.description[4] = orderInfo.takeTime as unknown as string;

    res.step = 5;
    if (num === 'WAITING_ASSIGN') {
      res.strList[5] = `待配送`;
      return res;
    }
    if (num === 'ASSIGN') {
      res.strList[5] = `配送中`;
      res.description[5] = `配送员:${orderInfo.courierName}`;
      return res;
    }

    res.step = 6;
    if (num === 'WAITING_TAKE') return res;
    res.strList[6] = `已取件`;
    res.description[6] = orderInfo.takeTime as unknown as string;

    res.step = 7;
    if (num === 'FINISHED') return res;

    // UNPAID,WAITING_DISPATCH,DISPATCH,OUT,IN,WAITING_ASSIGN,ASSIGN,WAITING_TAKE,FINISHED,CANCEL
    // 返回的值是一个对象，其中有：步骤数+string列表，总共5个元素
    throw new Error('Invalid OrderInfo');
  });
};
