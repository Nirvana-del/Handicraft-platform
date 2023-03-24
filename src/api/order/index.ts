import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {OrderItem, OrderPageResult, OrderQuery} from './types';

/**
 * 获取订单分页列表
 *
 * @param queryParams
 */
export function listOrderPages(
  queryParams: OrderQuery
): AxiosPromise<OrderPageResult> {
  return request({
    url: '/mall-oms/api/v1/orders',
    method: 'get',
    params: queryParams,
  });
}

// /**
//  * 获取订单详情
//  *
//  * @param orderId
//  */
// export function getOrderDetail(orderId: number) {
//   return request({
//     url: '/mall-oms/api/v1/orders/' + orderId,
//     method: 'get',
//   });
// }

/**
 * 生成订单
 *
 * @param orderInfo
 */
export function generateOrder(orderInfo: OrderItem) {
  return request({
    url: '/handiraft/order/createOrder',
    method: 'post',
    data: orderInfo
  });
}

/**
 * 买家获取订单列表
 *
 */
export function getBuyerOrderList(status?: string) {
  return request({
    url: '/handiraft/order/buyerGetOrder',
    method: 'get',
    params:{
      status
    }
  });
}

/**
 * 商家获取订单列表
 *
 */
export function getSellerOrderList(status?: string) {
  return request({
    url: '/handiraft/order/sellerGetOrder',
    method: 'get',
    params:{
      status
    }
  });
}
/**
 * 订单发货
 *
 */
export function sendProductApi(orderId: string) {
  return request({
    url: `/handiraft/order/sendOrder/${orderId}`,
    method: 'put'
  });
}

/**
 * 订单收货
 *
 */
export function receiveProductApi(orderId: string) {
  return request({
    url: `/handiraft/order/takeDelivery/${orderId}`,
    method: 'put'
  });
}

/**
 * 根据订单主键获取订单信息
 *
 */
export function getOrderDetail(orderId: string) {
  return request({
    url: `/handiraft/order/getById/${orderId}`,
    method: 'get'
  });
}

/**
 * 根据订单主键获取订单信息
 *
 */
export function getProductInfoByOrderId(orderId: string) {
  return request({
    url: `/handiraft/orderItem/getByOrderId/${orderId}`,
    method: 'get'
  });
}
/**
 * 根据订单主键获取订单信息
 *
 */
export function getLogisticsStatusByOrderId(orderId: string) {
  return request({
    url: `/handiraft/delivery/getByOrderId/${orderId}`,
    method: 'get'
  });
}

/**
 * 买家取消订单
 *
 */
export function cancelOrderApi(orderId: string) {
  return request({
    url: `/handiraft/pay/cancelOrder/${orderId}`,
    method: 'delete'
  });
}
/**
 * 买家支付订单
 *
 */
export function payOrderApi(orderId: string) {
  return request({
    url: `/handiraft/pay/pay/${orderId}`,
    method: 'get'
  });
}


