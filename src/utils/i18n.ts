// translate router.meta.title, be used in breadcrumb sidebar tagsview
import i18n from '@/lang/index';
import {useUserStoreHook} from "@/store/modules/user";

export function translateRouteTitleI18n(title: any) {
  // 判断是否存在国际化配置，如果没有原生返回
  // 后续通过逻辑判断身份
  // const isSeller = computed(() => {
  //   const userStore = useUserStoreHook();
  //   return userStore.isSeller;
  //   // return !!roles.includes(RoleMap.SELLER);
  //   // return false;
  // })
  const {isSeller} = useUserStoreHook();

  // console.log(isSeller.value)
  const routePrefix = isSeller ? 'sellerRoute' : 'buyerRoute';
  const hasKey = i18n.global.te(`${routePrefix}.` + title);
  if (hasKey) {
    return i18n.global.t(`${routePrefix}.` + title);
  }
  return title;
}
