import {
  GoodsDetail,
  GoodsPageResult,
  GoodsQuery,
} from './types';
import request from '@/utils/request';
import {AxiosPromise} from 'axios';

/**
 * 获取商品分页列表
 *
 * @param queryParams
 */
export function listSpuPages(
  queryParams: GoodsQuery
): AxiosPromise<GoodsPageResult> {
  return request({
    url: '/mall-pms/api/v1/spu/pages',
    method: 'get',
    params: queryParams,
  });
}

/**
 * 卖家获取商品列表
 *
 * @param status
 */
export function listSpuByStatus(
  status: number
): AxiosPromise<GoodsPageResult> {
  console.log(status)
  return request({
    url: `/handiraft/handirafts/getByStatus/${status}`,
    method: 'get'
  });
}

/**
 * 买家获取商品列表
 *
 */
export function listSpuList(): AxiosPromise<GoodsPageResult> {
  return request({
    url: '/handiraft/handirafts/getHandicraftsList',
    method: 'get',
  });
}

/**
 * 买家根据分类获取手工艺品
 *
 */
export function listSpuListByCategory(id: string): AxiosPromise<GoodsPageResult> {
  return request({
    url: `/handiraft/handirafts/buyerGetByCategory/${id}`,
    method: 'delete',
  });
}

/**
 * 卖家根据分类获取手工艺品
 *
 */
export function listSpuListByCategorySeller(id: string): AxiosPromise<GoodsPageResult> {
  return request({
    url: `/handiraft/handirafts/sellerGetByCategory/${id}`,
    method: 'delete',
  });
}

/**
 * 获取商品详情
 *
 * @param id
 */
export function getSpuDetail(id: string): AxiosPromise<{ handicrafts: GoodsDetail }> {
  return request({
    url: '/handiraft/handirafts/getByprimaryKey/' + id,
    method: 'get',
  });
}

/**
 * 添加商品
 *
 * @param data
 */
export function addSpu(data: any) {
  data.album = data.album.join(',');
  console.log(data.album)
  return request({
    url: '/handiraft/handirafts/addHandicrafts',
    method: 'post',
    data: data,
  });
}

/**
 * 修改商品
 *
 * @param id
 * @param data
 */
export function updateSpu(data: object) {
  return request({
    url: '/handiraft/handirafts/updateHandicrafts',
    method: 'put',
    data: data,
  });
}

/**
 * 删除商品
 *
 * @param ids
 */
export function deleteSpu(ids: string) {
  return request({
    url: '/handiraft/handirafts/undercarriage',
    method: 'put',
    params: {
      id: ids
    }
  });
}
