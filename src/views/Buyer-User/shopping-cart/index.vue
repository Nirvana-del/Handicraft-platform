<script setup lang="ts">
import {useCart} from "@/hooks/useCart";
import {useUserStore, useUserStoreHook} from "@/store/modules/user";
import {reactive, toRefs} from "vue";
import {clearUserCart} from "@/api/cart";
import {ElMessageBox, ElMessage} from "element-plus";
import {AddressType} from "@/api/address/type";
import {generateOrder} from "@/api/order";
import {OrderItem} from "@/api/order/types";
const {
  cart,
  updateQuantity,
  removeFromCart,
  totalMoney,
  updateSelected,
  getUserCart,
  totalProducts,
  selectedItems
} = useCart()
const state = reactive({
  goodDetail: '',
  dialogVisible: false,
  orderVisible: false,
  addressList: [] as Array<AddressType>,
  orderForm:{
    addrId: '',
    remark: '',
    cartId: ''
  } as OrderItem
})
const cartRef = ref()
const {nickname} = useUserStoreHook()
const handleSelectionChange = (val: CartItem[]) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const productIdList = val.map(item => item.id!);
  updateSelected(productIdList);
}

async function handleGoodsView(detail: string) {
  state.goodDetail = detail;
  state.dialogVisible = true;
}

const batchDelete = () => {
  const ids = selectedItems.value.map((item: CartItem) => item.id).join(',');
  removeFromCart(ids);
}
const clearCart = async () => {
  ElMessageBox.confirm(
    '您确定要清空购物车吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      clearUserCart()
      getUserCart()
    })

}
watch((cart.value), () => {
  nextTick(() => {
    cart.value.items.forEach(item => {
      console.log(item)
      cartRef.value.toggleRowSelection(item, item.selected);
    })
  })
}, {immediate: true})
const {
  goodDetail,
  dialogVisible,
  orderVisible,
  orderForm,
  addressList,
} = toRefs(state);
onMounted(() => {
  getUserCart()
  getCurrentAddress()
})

const settleAccounts = () => {
  orderVisible.value = true
}
const {getAddressInfo} = useUserStore()
const getCurrentAddress = async () => {
  addressList.value = await getAddressInfo()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  state.orderForm.addrId = addressList.value.find((item: AddressType) => item.defaulted === 1)!.id!
}
const submitOrderInfo = async () => {
  state.orderForm.cartId = selectedItems.value.map((item: CartItem) => item.id).join(',');
  console.log(state.orderForm)
  try {
    await generateOrder(state.orderForm)
    ElMessage.success('创建订单成功！')
    orderVisible.value = false
    await getUserCart()

  }catch (err: any){
    ElMessage.error(err.message)
  }
}
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div>
          {{ nickname }}的购物车
        </div>
      </template>
      <el-table
        ref="cartRef"
        v-loading="false"
        :data="cart.items"
        @selection-change="handleSelectionChange"
        row-key="productId"
        border
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="商品名称" prop="handicrafts.name"/>
        <el-table-column label="图片">
          <template #default="{row}">
            <el-popover placement="right" :width="400" trigger="hover">
              <img :src="row.handicrafts.picUrl" width="400" height="400" alt=""/>
              <template #reference>
                <img
                  :src="row.handicrafts.picUrl"
                  style="max-height: 60px; max-width: 60px"
                  alt=""/>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品类目" prop="handicrafts.categoryName" min-width="100"/>
        <el-table-column align="center" label="零售价" prop="handicrafts.originPrice">
          <template #default="{row}">{{
             row.handicrafts.originPrice
            }}
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="count" width="200" align="center">
          <!--          type="expand"-->
          <template #default="{row}">
            <el-input-number
              :model-value="row.count"
              :min="1"
              @update:modelValue="(quantity: string) => updateQuantity(row, quantity)"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column align="center" label="单品总价">
          <template #default="{row}">{{
              row.handicrafts.originPrice * row.count
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button
              type="success"
              link
              @click.stop="handleGoodsView(row.handicrafts.detail)"
            >查看详情
            </el-button
            >
            <el-button type="danger" link @click.stop="removeFromCart(row.id)">移出购物车</el-button>
          </template>
        </el-table-column>
      </el-table>
      <footer class="cart-footer">
        <div>
          <el-button type="danger" @click="batchDelete">删除选中商品</el-button>
          <el-button type="danger" @click="clearCart">清空购物车</el-button>
        </div>
        <span>已选{{ totalProducts }}件商品总计(不含运费): {{ totalMoney }}</span>
        <el-button type="danger" @click="settleAccounts" :disabled="selectedItems.length === 0">结算</el-button>
      </footer>

    </el-card>
    <el-dialog v-model="dialogVisible" title="商品详情">
      <div v-html="goodDetail"/>
    </el-dialog>
    <el-dialog v-model="orderVisible" title="提交订单">
      <el-form :model="orderForm" label-width="120px">
        <el-form-item label="选择收货地址">
          <el-select v-model="orderForm.addrId" placeholder="选择收货地址" size="large">
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.detailAddress"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单备注">
          <el-input type="textarea" v-model="orderForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span>
        <el-button @click="orderVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrderInfo">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
