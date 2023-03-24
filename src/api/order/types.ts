/**
 * 订单查询参数
 */
export interface OrderQuery extends PageQuery {
  orderSn: string | undefined;
  status: string | undefined;
  dateRange: [] | undefined
}

/**
 * 订单分页列表项
 */
export interface Order {
  id: string;
  orderSn: string;
  totalAmount: string;
  payAmount: string;
  payType: number;
  status: number;
  totalQuantity: number;
  createTime: string;
  memberId: string;
  sourceType: number;
  orderItems: OrderItem[];
}
export interface OrderItem {
  cartId: string,
  addrId: string,
  remark: string,
}

/**
 * 订单分页
 */
export type OrderPageResult = PageResult<Order[]>;

/**
 * 订单表单
 */
export interface OrderDetail {
  id: number | undefined;
  title: string;
  picUrl: string;
  beginTime: string;
  endTime: string;
  status: number;
  sort: number;
  url: string;
  remark: string;
}

/**
 * 订单状态枚举
 */
export enum OrderStatusEnum {
  /**
   * 待付款
   */
  WAIT_PAY = 1,
  /**
   * 待发货
   */
  WAIT_SHIPPING = 2,
  /**
   * 已发货
   */
  SHIPPED = 3,

  /**
   * 已完成
   */
  FINISHED = 4,
  /**
   * 已关闭
   */
  CLOSED = 5,
  /**
   * 已取消
   */
  CANCELED = 6,
}

// 物流信息
export type Logistics = {
  id: string,
  orderId: string,
  deliveryCompany: string,
  deliverySn: string,
  receiverName: string,
  receiverPhone: string,
  receiverPostCode: string,
  receiverProvince: string,
  receiverCity: string,
  receiverRegion: string,
  receiverDetailAddress: string,
  remark: string,
  deliveryStatus: string,
}
