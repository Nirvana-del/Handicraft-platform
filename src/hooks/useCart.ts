import {moneyFormatter} from "@/utils/filter";
import {ElMessage} from "element-plus";
import {addToCartApi, deleteFromCart, searchCart, updateGoodsAccount} from "@/api/cart";

const cart = ref({
  // 购物车下所有商品
  items: [] as CartItem[]
})
export const useCart = () => {
  // 选中状态下的商品列表
  const selectedItems = computed(() => {
    return cart.value.items.filter(item => item.selected)
  })
  const getUserCart = async () => {
    const res = await searchCart();
    const cartList = res.data.cartList.map((item: CartItem) => ({...item, selected: false}));
    console.log(cartList)
    cart.value.items = cartList
  }
  const addToCart = async (product: Product) => {
    try {
      await addToCartApi({handiraftId: product.id, count: 1})
      ElMessage.success('添加至购物车成功！')
    }catch (err: any){
      ElMessage.error(err.message)
    }
  }
  const updateQuantity = async (item: CartItem, quantity: string) => {
    console.log(item.id, quantity)
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await updateGoodsAccount(item.id!, quantity)
      await getUserCart()
    }catch (err){
      console.log(err)
    }
    // item.quantity = quantity
  }
  const updateSelected = async (productIdList: Array<string>) => {
    cart.value.items.forEach(cartItem => {
      // 传入已勾选的 ID 集合，如果包含则修改状态为 true
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cartItem.selected = productIdList.includes(cartItem.id!)
    })
  }
  const totalProducts = computed(() => {
    return selectedItems.value.reduce((pre, item) => pre + item.count, 0)
  })

  const totalMoney = computed(() => {
    const totalMount = selectedItems.value.reduce((pre, item) => pre + item.count * item.handicrafts.originPrice, 0)
    return moneyFormatter(totalMount);
  })

  const removeFromCart = async (ids: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await deleteFromCart(ids)
      await getUserCart()
    }catch (err){
      console.log(err)
    }
  }

  const isCartEmpty = computed(() => cart.value.items.length === 0);
  return {
    cart,
    addToCart,
    updateQuantity,
    totalProducts,
    removeFromCart,
    isCartEmpty,
    totalMoney,
    selectedItems,
    updateSelected,
    getUserCart
  }
}
