<script lang="ts">
export default {
  name: 'goods',
};
</script>

<script setup lang="ts">
import {reactive, ref, onMounted, toRefs} from 'vue';
import {ElTable} from 'element-plus';

import {
  buyerGetAllCouponApi
} from "@/api/coupon";

const dataTableRef = ref(ElTable);
const state = reactive({
  // 遮罩层
  loading: false,
  couponList: [] as Array<Product>,
  couponDetail: '',
  isEdit: false,
  dialog: {
    title: '',
    visible: false,
  }
});

const {
  loading,
  couponList
} = toRefs(state);

async function getCouponList() {
  const res = await buyerGetAllCouponApi()
  console.log(res.data)
  couponList.value = res.data.myCoupon
}

const handleQuery = async () => {
  state.loading = true;
  await getCouponList()
  state.loading = false;
}

onMounted(() => {
  handleQuery()
})
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="couponList"
        border
      >
        <el-table-column width="120" label="商家" align="center" prop="seller">
        </el-table-column>
        <el-table-column label="优惠券名称" prop="name" align="center"/>
        <el-table-column label="折扣" min-width="100" align="center">
          <template v-slot="{row}">
            {{ row.discount * 10 }}折
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default>
            <el-tag type="info">已领取</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped></style>
