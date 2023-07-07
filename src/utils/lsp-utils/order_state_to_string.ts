import { computed } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export const OrderStateGetString = (num: number | string) => {
  return computed(() => {
    // '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消';
    // console.log(num);
    if (num === 0) return '待付款';
    if (num === 1) return '待发货';
    if (num === 2) return '已发货';
    if (num === 3) return '待收货';
    if (num === 4) return '已完成';
    if (num === -1) return '已取消';

    if (num === '0') return '待付款';
    if (num === '1') return '待发货';
    if (num === '2') return '已发货';
    if (num === '3') return '待收货';
    if (num === '4') return '已完成';
    if (num === '-1') return '已取消';
    return '未知订单状态';
  });
};
