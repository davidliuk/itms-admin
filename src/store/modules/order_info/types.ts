export interface OrderState {
  id?: string;
  order_no?: number;
  nick_name?: string;
  receiver_name?: string;
  order_status?: '待付款' | '代发货' | '已发货' | '已完成' | '已取消';
  payment_time?: string;
  take_name?: string;
  total_amount?: number;
  courier_name?: string;
  // 高级功能
  user_id?: number;
  fight_fee?: number;
  refundable_time?: string;
  courier_id?: number;
  courier_phone?: string;
  receiver_phone?: string;
  receiver_post_code?: string;
  receiver_province?: number;
  receiver_city?: number;
  receiver_district?: number;
  receiver_address?: string;
  delivery_time?: string;
  take_time?: string;
  receive_time?: string;
  ware_id?: number;
}
