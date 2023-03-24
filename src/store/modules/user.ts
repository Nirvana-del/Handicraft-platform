import {defineStore} from 'pinia';

import {loginApi, logoutApi, registerBuyerApi, registerSellerApi} from '@/api/auth';
import {getUserInfo} from '@/api/user';
import {resetRouter} from '@/router';
import {store} from '@/store';

import {LoginData, RegisterData} from '@/api/auth/types';
import {UserInfo} from '@/api/user/types';

import {useStorage} from '@vueuse/core';
import {RoleMap} from "@/enums/RoleTypeEnum";
import {searchAddress} from "@/api/address";
import {AddressType} from "@/api/address/type";

export const useUserStore = defineStore('user', () => {
  // state
  const token = useStorage('accessToken', '');
  const nickname = ref<string>('');
  const avatar = ref<string>('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'); // 默认头像
  const userId = ref<string>('');
  const isVisitor = ref<boolean>(true);
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const perms = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  const address = ref<Array<AddressType>>([]);
  const isSeller = computed(() => {
    return roles.value.includes(RoleMap.SELLER)
  })
  function getAddressInfo() {
    return new Promise<Array<AddressType>>((resolve, reject) => {
      searchAddress()
        .then(response => {
          const {addressList} = response.data
          address.value = addressList
          resolve(addressList)
        })
        .catch(error => {
          reject(error);
        });
    })
  }

  /**
   * 游客登陆
   */
  function visitorLogin() {
    return new Promise<void>((resolve) => {
      isVisitor.value = true
      resolve()
    });
  }
  /**
   * 登录调用
   *
   * @returns
   * @param loginData
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then(response => {
          const {tokenType, accessToken} = response.data;
          token.value = tokenType + ' ' + accessToken; // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function registerSeller(registerData: RegisterData, avatar: string) {
    return new Promise<void>((resolve, reject) => {
      registerSellerApi(registerData, avatar)
        .then(response => {
          console.log(response)
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function registerBuyer(registerData: RegisterData, avatar: string) {
    return new Promise<void>((resolve, reject) => {
      registerBuyerApi(registerData, avatar)
        .then(response => {
          console.log(response)
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    isVisitor.value = false
    return new Promise<UserInfo>((resolve, reject) => {
      getUserInfo()
        .then(({data}) => {
          if (!data) {
            return reject('Verification failed, please Login again.');
          }
          if (!data.roles || data.roles.length <= 0) {
            reject('getUserInfo: roles must be a non-null array!');
          }
          nickname.value = data.nickname;
          avatar.value = data.avatar;
          roles.value = data.roles;
          perms.value = data.perms;
          userId.value = data.userId;
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter();
          resetToken();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    token.value = '';
    nickname.value = '';
    avatar.value = '';
    roles.value = [];
    perms.value = [];
  }

  return {
    token,
    nickname,
    avatar,
    roles,
    perms,
    address,
    getAddressInfo,
    login,
    getInfo,
    logout,
    isSeller,
    resetToken,
    userId,
    registerBuyer,
    registerSeller,
    isVisitor,
    visitorLogin
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
