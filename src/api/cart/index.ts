import request from "@/utils/request";
import {CartType} from "@/api/cart/type";

/**
 * 获取当前用户购物车
 *
 */
export function searchCart() {
  return request({
    url: '/handiraft/cart/getCart',
    method: 'get'
  });
}

/**
 * 添加至购物车
 *
 * @param data
 */
export function addToCartApi(data: CartType) {
  return request({
    url: '/handiraft/cart/addCart',
    method: 'post',
    data
  });
}

/**
 * 更改购买数量
 *
 * @param id
 * @param count
 */
export function updateGoodsAccount(id: string, count: string) {
  return request({
    url: `/handiraft/cart/changeQuantity/${id}/${count}`,
    method: 'get',
  });
}

/**
 * 清空购物车
 *
 */
export function clearUserCart() {
  return request({
    url: `/handiraft/cart/clearCart`,
    method: 'delete',
  });
}

/**
 * 从购物车删除
 *
 * @param ids
 */
export function deleteFromCart(ids: string) {
  return request({
    url: `/handiraft/cart/deleteCart/${ids}`,
    method: 'delete',
  });
}

/**
 * 根据主键获取购物车详情
 *
 * @param id
 */
export function getCartDetail(id: number) {
  return request({
    url: `/handiraft/cart/getByprimaryKey/${id}`,
    method: 'get',
  });
}


