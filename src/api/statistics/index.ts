import request from "@/utils/request";

/**
 * 卖家统计信息
 * 统计最近七天收入:1,统计近七天售出商品数量 2 ,出售的手工艺品总数 3,结算的订单的总数 4
 */
export function sellerGetDataApi() {
  return request({
    url: `/handiraft/sellerStats`,
    method: 'get',
  });
}
/**
 * 买家统计信息
 * 统计最近七天收入:1,统计近七天售出商品数量 2 ,出售的手工艺品总数 3,结算的订单的总数 4
 */
export function buyerGetDataApi() {
  return request({
    url: `/handiraft/buyerStats`,
    method: 'get',
  });
}
