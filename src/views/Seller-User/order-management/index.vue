<script lang="ts">
export default {
  name: 'order',
};
</script>

<script setup lang="ts">
import {onMounted, reactive, ref, toRefs} from 'vue';
import {ElForm} from 'element-plus';

import {

  getProductInfoByOrderId,
  getLogisticsStatusByOrderId,
  getSellerOrderList, sendProductApi
} from '@/api/order';
import {Search, Refresh} from '@element-plus/icons-vue';
import {Logistics, Order, OrderQuery} from '@/api/order/types';

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

const payTypeMap = {
  1: '支付宝',
  2: '微信',
  3: '会员余额',
};

const state = reactive({
  loading: false,
  ids: [],
  single: true,
  multiple: true,
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
  payTypeMap,
  orderDelivery: {} as Logistics
});

const {loading, queryParams, orderList, total, orderDelivery, dialog} = toRefs(state);

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
  const res = await getSellerOrderList(status)
  const newList = res.data.orderList
  for (const item of newList) {
    const res = await getProductInfoByOrderId(item.id)
    item.orderItems = res.data.orderItemList
  }
  orderList.value = newList
}
const sendProduct = async (order: any) => {
  await sendProductApi(order.id)
  await getOrderList()
}
onMounted(() => {
  handleQuery();
  getOrderList()
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item prop="orderSn">
        <el-input v-model="queryParams.orderSn" placeholder="订单号"/>
      </el-form-item>
      <el-form-item prop="dateRange">
        <el-date-picker
          v-model="queryParams.dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
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
      <el-table-column type="expand" width="100" label="订单商品">
        <template #default="scope">
          <el-table :data="scope.row.orderItems" border>
            <el-table-column label="序号" type="index" width="100"/>
            <el-table-column label="商品编号" align="center" prop="id"/>
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

      <el-table-column align="center" label="订单状态">
        <template #default="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderPrice" label="订单金额">
        <template #default="scope">
          {{ scope.row.totalAmount }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="payPrice" label="商品数量">
        <template #default="scope">
          {{ scope.row.totalQuantity }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="createTime" label="创建时间"/>

      <el-table-column align="center" label="操作" width="300">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">查看物流</el-button>
          <el-popconfirm v-if="scope.row.status === '已支付'" title="您确定要发货吗？" @confirm="sendProduct(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">
                订单发货
              </el-button>
            </template>
          </el-popconfirm>

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
  </div>
</template>

<style scoped></style>
