import router, {buyerRoutes, sellerRoutes, visitorRoutes} from '@/router';
import {useUserStoreHook} from '@/store/modules/user';
import {usePermissionStoreHook} from '@/store/modules/permission';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({showSpinner: false}); // 进度条

const permissionStore = usePermissionStoreHook();

// 白名单路由
const whiteList = ['/login', '/visitor/goods', '/visitor/detail'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = localStorage.getItem('accessToken');
  if (hasToken) {
    if (to.path === '/login') {
      // 登录成功，跳转到首页
      next({path: '/'});
    } else {
      const userStore = useUserStoreHook();
      const hasRoles = userStore.roles && userStore.roles.length > 0;
      if (hasRoles) {
        // 未匹配到任何路由，跳转404
        if (to.matched.length === 0) {
          from.name ? next({name: from.name}) : next('/404');
        } else {
          next();
        }
      } else {
        try {
          await userStore.getInfo();
          const {isSeller} = userStore
          if (isSeller) {
            sellerRoutes.forEach(route => {
              router.addRoute(route);
            })
            permissionStore.setRoutes(sellerRoutes)
          } else {
            buyerRoutes.forEach(route => {
              router.addRoute(route);
            })
            permissionStore.setRoutes(buyerRoutes)
          }
          next({...to, replace: true});
        } catch (error) {
          console.log(error)
          // 移除 token 并跳转登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    const {isVisitor} = useUserStoreHook()
    if (isVisitor) {
      visitorRoutes.forEach(route => {
        router.addRoute(route);
      })
      permissionStore.setRoutes(visitorRoutes)
    }
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
