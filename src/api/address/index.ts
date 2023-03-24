import request from "@/utils/request";
import {AddressType} from "@/api/address/type";

/**
 * 查询当前用户地址
 *
 */
export function searchAddress() {
  return request({
    url: '/handiraft/address/getAddress',
    method: 'get'
  });
}

/**
 * 添加收货地址
 *
 * @param data
 */
export function addAddress(data: Partial<AddressType>) {
  return request({
    url: '/handiraft/address/addAddress',
    method: 'post',
    data
  });
}

/**
 * 移除当前收货地址
 *
 * @param id
 */
export function removeAddress(id: number) {
  return request({
    url: `/handiraft/address/deleteAddress/${id}`,
    method: 'delete',
  });
}

/**
 * 获取当前收货地址详情信息
 *
 * @param id
 */
export function getAddressDetail(id: string) {
  return request({
    url: `/handiraft/address/getAddressById/${id}`,
    method: 'get',
  });
}
/**
 * 设置默认地址
 *
 * @param id
 */
export function setDefaultAddress(id: string) {
  return request({
    url: `/handiraft/address/setDefaultAddr/${id}`,
    method: 'put',
  });
}

/**
 * 修改收货地址
 *
 * @param data
 */
export function updateAddressInfo(data: Partial<AddressType>) {
  return request({
    url: `/handiraft/address/updateAddress`,
    method: 'put',
    data
  });
}


