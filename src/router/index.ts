import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';

export const Layout = () => import('@/layout/index.vue');

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {hidden: true},
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {hidden: true}
  },
  {
    path: '/visitor',
    redirect: '/visitor/goods',
    name: 'GoodsSearch',
    meta: {hidden: true},
    component: Layout,
    children: [
      {
        path: 'goods',
        component: () => import('@/views/Buyer-User/goods-search/index.vue'),
        name: 'GoodsList',
        meta: {title: 'goodsList', icon: 'goods-list', affix: true}
      }
    ]
  }
  // 多级嵌套路由
  /* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多级菜单', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜单一级'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜单二级'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜单三级-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜单三级-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }*/
];
export const sellerRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'homepage', affix: true}
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {hidden: true}
      },
      {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        meta: {hidden: true}
      }
    ]
  },
  {
    path: '/chat',
    redirect: '/chat/message',
    name: 'ChatMessage',
    meta: {title: 'chatMessage', icon: 'goods', hidden: true},
    component: Layout,
    children:[
      {
        path: 'message',
        component: () => import('@/components/UserChat/index.vue'),
        name: 'UserChat',
        meta: {hidden: true}
      }
    ]
  },
  {
    path: '/goods-management',
    redirect: '/goods-management/goods',
    name: 'Handicrafts',
    meta: {title: 'handicrafts', icon: 'goods'},
    component: Layout,
    children: [
      {
        path: 'goods',
        component: () => import('@/views/Seller-User/goods-management/goods/index.vue'),
        name: 'goodsList',
        meta: {title: 'goodsList', icon: 'goods-list', affix: true}
      },
      {
        path: 'grounding',
        component: () => import('@/views/Seller-User/goods-management/goods/detail.vue'),
        name: 'Grounding',
        meta: {title: 'grounding', icon: 'publish', affix: true}
      },
      {
        path: 'category',
        component: () => import('@/views/Seller-User/goods-management/category/index.vue'),
        name: 'Category',
        meta: {title: 'category', icon: 'menu', affix: true}
      },
      {
        path: 'goods-detail',
        component: () => import('@/views/Seller-User/goods-management/goods/detail.vue'),
        name: 'GoodsDetail',
        meta: {hidden: true}
      },
    ]
  },
  {
    path: '/order',
    redirect: '/order/info',
    name: 'OrderManagement',
    meta: {title: 'orderManagement', icon: 'shopping'},
    component: Layout,
    children: [
      {
        path: 'info',
        component: () => import('@/views/Seller-User/order-management/index.vue'),
        name: 'OrderList',
        meta: {title: 'orderList', icon: 'order', affix: false}
      }
    ]
  },
  {
    path: '/coupon',
    redirect: '/coupon/list',
    name: 'CouponManagement',
    meta: {title: 'couponManagement', icon: 'shopping'},
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/Seller-User/coupon-management/index.vue'),
        name: 'CouponList',
        meta: {title: 'couponList', icon: 'order', affix: false}
      }
    ]
  },
]

export const buyerRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'homepage', affix: true}
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {hidden: true}
      },
      {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        meta: {hidden: true}
      }
    ]
  },

  {
    path: '/chat',
    redirect: '/chat/message',
    name: 'ChatMessage',
    meta: {title: 'chatMessage', icon: 'goods', hidden: true},
    component: Layout,
    children:[
      {
        path: 'message',
        component: () => import('@/components/UserChat/index.vue'),
        name: 'UserChat',
        meta: {hidden: true}
      }
    ]
  },
  {
    path: '/goods-search',
    redirect: '/goods-search/goods',
    name: 'GoodsSearch',
    meta: {title: 'goodsSearch', icon: 'goods'},
    component: Layout,
    children: [
      {
        path: 'goods',
        component: () => import('@/views/Buyer-User/goods-search/index.vue'),
        name: 'GoodsList',
        meta: {title: 'goodsList', icon: 'goods-list', affix: true}
      }
    ]
  },
  {
    path: '/address',
    redirect: '/address/info',
    name: 'AddressManagement',
    meta: {title: 'addressManagement', icon: 'address'},
    component: Layout,
    children: [
      {
        path: 'info',
        component: () => import('@/views/Buyer-User/address-control/index.vue'),
        name: 'AddressInfo',
        meta: {title: 'addressInfo', icon: 'address', affix: true}
      }
    ]
  },
  {
    path: '/cart',
    redirect: '/cart/info',
    name: 'CartManagement',
    meta: {title: 'cartManagement', icon: 'shopping'},
    component: Layout,
    children: [
      {
        path: 'info',
        component: () => import('@/views/Buyer-User/shopping-cart/index.vue'),
        name: 'CartInfo',
        meta: {title: 'cartInfo', icon: 'shopping', affix: true}
      }
    ]
  },
  {
    path: '/order',
    redirect: '/order/info',
    name: 'OrderManagement',
    meta: {title: 'orderManagement', icon: 'order'},
    component: Layout,
    children: [
      {
        path: 'info',
        component: () => import('@/views/Buyer-User/user-order/index.vue'),
        name: 'OrderInfo',
        meta: {title: 'orderInfo', icon: 'order', affix: true}
      }
    ]
  },
  {
    path: '/coupon',
    redirect: '/coupon/list',
    name: 'CouponManagement',
    meta: {title: 'couponManagement', icon: 'shopping'},
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/Buyer-User/coupon-management/index.vue'),
        name: 'CouponList',
        meta: {title: 'couponList', icon: 'dict', affix: false}
      },
      {
        path: 'my-collect',
        component: () => import('@/views/Buyer-User/coupon-management/my-collect.vue'),
        name: 'MyCoupon',
        meta: {title: 'myCoupon', icon: 'brand', affix: false}
      }
    ]
  },
]

export const visitorRoutes: RouteRecordRaw[] = [
  {
    path: '/visitor',
    redirect: '/visitor/goods',
    name: 'GoodsSearch',
    meta: {title: 'goodsSearch', icon: 'goods'},
    component: Layout,
    children: [
      {
        path: 'goods',
        component: () => import('@/views/Buyer-User/goods-search/index.vue'),
        name: 'GoodsList',
        meta: {title: 'goodsList', icon: 'goods-list', affix: true}
      }
    ]
  }
]
/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({left: 0, top: 0})
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({path: '/login'});
  location.reload();
}

export default router;
