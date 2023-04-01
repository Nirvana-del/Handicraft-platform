<script lang="ts">
export default {
  name: 'order',
};
</script>

<script setup lang="ts">
import {onMounted, reactive, ref, toRefs} from 'vue';
import {ElForm} from 'element-plus';

import {
  getBuyerOrderList,
  getProductInfoByOrderId,
  getLogisticsStatusByOrderId,
  cancelOrderApi, payOrderApi, payOrderByCouponApi,receiveProductApi
} from '@/api/order';
import {Search, Refresh, ArrowDown} from '@element-plus/icons-vue';
import {Logistics, Order, OrderQuery} from '@/api/order/types';
import {getCurrentCouponApi} from "@/api/coupon";

const queryFormRef = ref(ElForm);

const orderSourceMap = {
  1: '微信小程序',
  2: 'APP',
  3: 'PC',
};

const orderStatusMap = {
  '未支付': '未支付',
  '支付成功': '支付成功',
  '退款异常': '退款异常',
  '已退款': '已退款'
};

const state = reactive({
  loading: false,
  ids: [],
  single: true,
  multiple: true,
  couponVisible: false,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dateRange: [] as any,
  } as OrderQuery,
  orderList: [] as Order[],
  total: 0,
  dialog: {
    title: '订单详情',
    visible: false,
    // eslint-disable-next-line no-undef
  } as DialogType,
  allCoupon: [],
  myCoupon: undefined,
  dialogVisible: false,
  orderDetail: {
    order: {
      refundAmount: undefined,
      refundType: undefined,
      refundNote: undefined,
      gmtRefund: undefined,
      confirmTime: undefined,
      gmtDelivery: undefined,
      shipSn: undefined,
      shipChannel: undefined,
      gmtPay: undefined,
      integralPrice: undefined,
      payChannel: undefined,
      skuPrice: undefined,
      couponPrice: undefined,
      freightPrice: undefined,
      orderPrice: undefined,
    },
    member: {},
    orderItems: [],
  },
  orderSourceMap,
  orderStatusMap,
  orderDelivery: {} as Logistics,
  payForm: '',
  payDialogVisible: false,
  currentOrderId: ''
});

const {
  loading,
  queryParams,
  orderList,
  total,
  orderDelivery,
  dialog,
  payDialogVisible,
  couponVisible,
  allCoupon,
  myCoupon,
  currentOrderId
} = toRefs(state);

const handleQuery = async () => {
  state.loading = false;
  console.log(queryParams.value.status)
  await getOrderList(queryParams.value.status)
}

function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

const viewDetail = async (row: any) => {
  console.log(row)
  const res = await getLogisticsStatusByOrderId(row.id)
  console.log(res.data.orderDelivery)
  orderDelivery.value = res.data.orderDelivery
  state.dialog.visible = true;
}

const getOrderList = async (status?: string) => {
  const res = await getBuyerOrderList(status)
  const newList = res.data.orderList
  orderList.value = newList
  for (const item of newList) {
    const res = await getProductInfoByOrderId(item.id)
    item.orderItems = res.data.orderItemList
  }
  orderList.value = newList
}
const cancelOrder = async (order: any) => {
  await cancelOrderApi(order.id)
  await getOrderList(queryParams.value.status)
}

const confirmPay = async (order: any) => {
  console.log(order)
  ElMessageBox.confirm(
    '确定支付吗?',
    '确定支付',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // await getOrderList()
      const res = await getCurrentCouponApi(order.seller)
      console.log(res)
      allCoupon.value = res.data.myCoupon
      // dialog.value.visible = false
      couponVisible.value = true
      currentOrderId.value = order.id
      // const res2 = await payOrderApi(order.id)
      // payDialogVisible.value = true
      // console.log(res2.data.response) // 支付宝内嵌表单
      // state.payForm = res2.data.response;
      // console.log(couponVisible.value)
    })
    .catch(async () => {
      // await cancelOrderApi(order.id)

    })

  // document.querySelector("body")!.innerHTML = res.data.response;
  // document.forms[0].submit();
}

const confirmReceive = async (order: any) => {
  const res = await receiveProductApi(order.id)
  console.log(res)
  await getOrderList()
}

async function payByCoupon() {
  console.log(myCoupon.value)
  console.log(currentOrderId.value)
  if (myCoupon.value === undefined){
    const res = await payOrderApi(currentOrderId.value)
    payDialogVisible.value = true
    console.log(res.data.response) // 支付宝内嵌表单
    state.payForm = res.data.response;
    couponVisible.value = false
    console.log(couponVisible.value)
  }else {
    const res = await payOrderByCouponApi(currentOrderId.value, myCoupon.value)
    payDialogVisible.value = true
    console.log(res.data.response) // 支付宝内嵌表单
    state.payForm = res.data.response;
    console.log(couponVisible.value)
    couponVisible.value = false
  }
  myCoupon.value = undefined
}

onMounted(() => {
  handleQuery();
  getOrderList()
});
</script>

<template>
  <div class="app-container">
    <el-dialog v-model="payDialogVisible" width="1100" :open-delay="10">
      <iframe
        :srcdoc="state.payForm"
        style="display: flex;margin: auto"
        frameborder="no"
        scrolling="no"
        width="1000"
        height="700"
      >
      </iframe>
    </el-dialog>

    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="订单状态"
        >
          <el-option
            v-for="(key, value) in orderStatusMap"
            :key="key"
            :label="key"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
        >查询
        </el-button
        >
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="dataTable"
      v-loading="loading"
      :data="orderList"
      border>
      <el-table-column type="expand" width="100" label="订单手工艺品">
        <template #default="scope">
          <el-table :data="scope.row.orderItems" border>
            <el-table-column label="序号" type="index" width="100"/>
            <el-table-column label="手工艺品编号" align="center" prop="id"/>
            <el-table-column label="图片" prop="picUrl">
              <template #default="scope">
                <img :src="scope.row.picUrl" width="40" alt=""/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="单价" prop="price">
              <template #default="scope">{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column align="center" label="数量" prop="count">
              <template #default="scope">{{ scope.row.count }}</template>
            </el-table-column>
            <el-table-column align="center" label="总价" prop="count">
              <template #default="scope">{{ scope.row.totalAmount }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderSn" label="订单编号"/>
      <el-table-column label="商家" align="center" prop="seller"/>
      <el-table-column align="center" label="订单状态">
        <template #default="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderPrice" label="订单总额">
        <template #default="scope">
          {{ scope.row.totalAmount }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="totalQuantity" label="手工艺品数量">
        <template #default="scope">
          {{ scope.row.totalQuantity }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="remark" label="订单备注">
        <template #default="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="createTime" label="创建时间"/>

      <el-table-column align="center" label="操作" width="300">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">查看物流</el-button>
          <el-popconfirm v-if="scope.row.status === '未支付'" title="您确定要取消订单吗？"
                         @confirm="cancelOrder(scope.row)">
            <template #reference>
              <el-button size="small" type="primary">取消订单</el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="scope.row.status === '未支付'" size="small" type="danger" @click="confirmPay(scope.row)">
            确认支付
          </el-button>
          <!--          <el-button v-if="scope.row.status === '未支付'" size="small" type="danger" @click="confirmPay(scope.row)">-->
          <!--            优惠券支付-->
          <!--          </el-button>-->
          <el-button v-if="scope.row.status === '已支付'" size="small" type="danger" @click="confirmReceive(scope.row)">
            确认收货
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具条 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
    />
    <el-dialog v-model="dialog.visible" title="物流信息">
      <el-descriptions>
        <el-descriptions-item label="收货人姓名">{{ orderDelivery.receiverName }}</el-descriptions-item>
        <el-descriptions-item label="收货人电话">{{ orderDelivery.receiverPhone }}</el-descriptions-item>
        <el-descriptions-item label="省份">{{ orderDelivery.receiverProvince }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ orderDelivery.receiverCity }}</el-descriptions-item>
        <el-descriptions-item label="地区">{{ orderDelivery.receiverRegion }}</el-descriptions-item>
        <el-descriptions-item label="详细地址">{{ orderDelivery.receiverDetailAddress }}</el-descriptions-item>
        <el-descriptions-item label="发布状态">
          <el-tag>{{ orderDelivery.deliveryStatus }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">{{ orderDelivery.remark }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog v-model="couponVisible" title="选择优惠券">
      <el-select v-model="myCoupon">
        <el-option v-for="item in allCoupon" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="couponVisible = false">取消</el-button>
        <el-button type="primary" @click="payByCoupon">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
