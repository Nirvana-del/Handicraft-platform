import request from '@/utils/request';
import {AxiosPromise} from 'axios';
import {LoginData, LoginResult, RegisterData} from './types';

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  return request({
    url: '/handiraft/auth/login',
    method: 'post',
    params: data
  });
}

/**
 * 注册买家API
 *
 * @param data {RegisterData}
 * @param avatar
 * @returns
 */
export function registerBuyerApi(data: RegisterData, avatar: string): AxiosPromise<any> {
  const {username, nickname, gender, password} = data
  return request({
    url: '/handiraft/users/registBuyer',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: {
      username,
      nickname,
      gender,
      avatar,
      password
    }
  });
}

/**
 * 注册商家API
 *
 * @param data {RegisterData}
 * @param avatar
 * @returns
 */
export function registerSellerApi(data: RegisterData, avatar: string): AxiosPromise<any> {
  const {username, nickname, gender, password} = data
  return request({
    url: '/handiraft/users/registSeller',
    method: 'post',
    data: {
      username,
      nickname,
      gender,
      avatar,
      password
    }
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: '/handiraft/auth/logout',
    method: 'delete'
  });
}
