import request from "@/utils/request";

/**
 * 商家获取优惠券列表
 */
export function getCouponListApi() {
  return request({
    url: `/handiraft/coupon/getBySeller`,
    method: 'get'
  });
}

/**
 * 根据 ID 获取优惠券详情
 */
export function getCouponDetailApi(id: string) {
  return request({
    url: `/handiraft/coupon/getById/${id}`,
    method: 'get'
  });
}


/**
 * 商家修改优惠券
 */
export function sellerUpdateCouponApi(couponObj: any) {
  return request({
    url: `/handiraft/coupon/updateCoupon`,
    method: 'put',
    params: couponObj
  });
}

/**
 * 商家添加优惠券
 */
export function sellerAddCouponApi(couponObj: any) {
  return request({
    url: `/handiraft/coupon/addCoupon`,
    method: 'post',
    params: couponObj
  });
}

/**
 * 商家删除优惠券
 */
export function sellerDeleteCouponApi(id: string) {
  return request({
    url: `/handiraft/coupon/deleteCoupon/${id}`,
    method: 'delete'
  });
}

/**
 * 买家领取优惠券
 */
export function buyerGetCouponApi(couponId: string) {
  return request({
    url: `/handiraft/coupon/receive/${couponId}`,
    method: 'get'
  });
}

/**
 * 买家获取领取的所有优惠券
 */
export function buyerGetAllCouponApi() {
  return request({
    url: `/handiraft/coupon/getAllReceived`,
    method: 'get'
  });
}

/**
 * 获取当前订单可以使用的优惠券
 */
export function getCurrentCouponApi(seller: string) {
  return request({
    url: `/handiraft/coupon/getAvailable/${seller}`,
    method: 'get'
  });
}

/**
 * 买家获取优惠券列表
 */
export function buyerGetCouponListApi() {
  return request({
    url: `/handiraft/coupon/getAll`,
    method: 'get'
  });
}
