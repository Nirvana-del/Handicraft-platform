import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 获取商品分类列表
 *
 * @param queryParams
 */
export function listCategories() {
  return request({
    url: '/handiraft/category/getCategory',
    method: 'get',
    // params: queryParams,
  });
}

/**
 * 添加商品分类
 *
 * @param data
 */
export function addCategory(data: object) {
  return request({
    url: '/handiraft/category/addCategory',
    method: 'post',
    params: data,
  });
}


/**
 * 删除商品分类
 *
 * @param ids
 */
export function deleteCategories(ids: string) {
  return request({
    url: `/handiraft/category/deleteCategory/${ids}`,
    method: 'put',
  });
}

/**
 * 修改商品分类
 *
 * @param obj
 */
export function updateCategories(obj: object) {
  return request({
    url: `/handiraft/category/updateCategory`,
    method: 'put',
    params: obj
  });
}
