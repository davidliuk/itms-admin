export interface OrderState {
  id?: string;
  user_id?: number;
  nick_name?: string;
  order_no?: string;
  coupon_id?: number;
  total_amount?: number;
  activity_amount?: number;
  coupon_amount?: number;
  original_total_amount?: number;
  freight_fee?: number;
  freight_fee_reduce?: number;
  refundable_time?: string;
  pay_type?: number;
  // pay_type?: '微信' | '支付宝';
  source_type?: number;
  order_status?: number;
  // order_status?: '待付款' | '代发货' | '已发货' | '待收货' | '已完成' | '已取消';
  process_status?: number;
  logistics_id?: number;
  logistics_name?: string;
  logistics_phone?: string;
  courier_id?: number;
  courier_name?: string;
  courier_phone?: string;
  take_name?: string;
  receiver_name?: string;
  receiver_phone?: string;
  receiver_post_code?: string;
  receiver_province?: number;
  receiver_city?: number;
  receiver_district?: number;
  receiver_address?: string;
  payment_time?: string;
  delivery_time?: string;
  take_time?: string;
  receive_time?: string;
  remark?: string;
  cancel_time?: string;
  cancel_reason?: string;
  ware_id?: number;
  station_id?: number;
  commission_amount?: number;
  create_time?: string;
  update_time?: string;
  is_deleted?: number;
}