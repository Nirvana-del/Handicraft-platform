<script lang="ts">
export default {name: 'Dashboard'};
</script>

<script setup lang="ts">
import {useUserStore, useUserStoreHook} from '@/store/modules/user';
import {useTransition, TransitionPresets} from '@vueuse/core';

// import GithubCorner from '@/components/GithubCorner/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
import RadarChart from './components/RadarChart.vue';
import {buyerGetDataApi, sellerGetDataApi} from "@/api/statistics";
import {getBuyerOrderList, getSellerOrderList} from "@/api/order";

const userStore = useUserStore();

const date: Date = new Date();

const greetings = computed(() => {
  if (date.getHours() >= 6 && date.getHours() < 8) {
    return '晨起披衣出草堂，轩窗已自喜微凉🌅！';
  } else if (date.getHours() >= 8 && date.getHours() < 12) {
    return '上午好🌞！';
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return '下午好☕！';
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    return '晚上好🌃！';
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    return '偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！';
  }
});

const duration = 5000;

const {isSeller, isVisitor} = useUserStoreHook()

const state = reactive({
  recent7income: [],
  recent7count: [],
  productTotal: 0,
  orderTotal: 0,
  recent7pay: [],
  recent7BuyAccount: [],
  orderList: []
})
const {
  recent7income,
  recent7count,
  productTotal,
  orderTotal,
  recent7pay,
  recent7BuyAccount,
  orderList
} = toRefs(state)

const recentTotalIncom = computed(() => {
  if (recent7income.value.length !== 0){
    return recent7income.value.reduce((pre, item: any) => item.amount + pre, 0);
  } else {
    return recent7pay.value.reduce((pre, item: any) => item.amount + pre, 0);
  }
})

const recentTotalAmount = computed(() => {
  if (recent7count.value.length !== 0){
    return recent7count.value.reduce((pre, item: any) => item.quantity + pre, 0);
  }else {
    return recent7BuyAccount.value.reduce((pre, item: any) => item.quantity + pre, 0);
  }
})
const recentTotalIncomOutPut = useTransition(recentTotalIncom, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo
});
const recentTotalAmountOutPut = useTransition(recentTotalAmount, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo
});
const totalAmountOutPut = useTransition(productTotal, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo
});
const orderAmountOutPut = useTransition(orderTotal, {
  duration: duration,
  transition: TransitionPresets.easeOutExpo
});

const sellerGetData = async () => {
  const res = await sellerGetDataApi()
  console.log(res.data)
  const {statsVo1, statsVo2, statsVo3, statsVo4} = res.data
  recent7income.value = statsVo1
  recent7count.value = statsVo2
  productTotal.value = statsVo3.quantity
  orderTotal.value = statsVo4.quantity
}
const sellerGetOrderList = async () => {
  const res = await getSellerOrderList()
  console.log(res.data)
  orderList.value = res.data.orderList
}
const buyerGetData = async () => {
  const res = await buyerGetDataApi()
  console.log(res.data)
  const {statsVo1, statsVo2, statsVo3, statsVo4} = res.data
  recent7pay.value = statsVo1
  recent7BuyAccount.value = statsVo2
  productTotal.value = statsVo3.quantity
  orderTotal.value = statsVo4.quantity
}
const buyerGetOrderList = async () => {
  const res = await getBuyerOrderList()
  console.log(res.data)
  orderList.value = res.data.orderList
}
onMounted(() => {
  if (isSeller) {
    sellerGetData()
    sellerGetOrderList()
  }else {
    buyerGetData()
    buyerGetOrderList()
  }
})
</script>

<template>
  <div class="dashboard-container">
    <!-- github角标 -->
    <!--    <github-corner class="github-corner" />-->
    <div v-if="!isVisitor">
      <!-- 用户信息 -->
      <el-row class="mb-8">
        <el-card class="w-full">
          <div class="flex justify-between flex-wrap">
            <div class="flex items-center">
              <img
                class="user-avatar"
                :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
               alt=""/>
              <span class="ml-[10px] text-[16px]">
              {{ userStore.nickname }}
            </span>
            </div>

            <div class="leading-[40px]">
              {{ greetings }}
            </div>

            <!--          <div class="space-x-2 flex items-center">-->
            <!--            <el-link-->
            <!--              target="_blank"-->
            <!--              type="danger"-->
            <!--              href="https://www.cnblogs.com/haoxianrui/p/16090029.html"-->
            <!--              >官方0到1教程</el-link-->
            <!--            >-->
            <!--            <el-divider direction="vertical" />-->
            <!--            <el-link-->
            <!--              target="_blank"-->
            <!--              type="success"-->
            <!--              href="https://gitee.com/youlaiorg/vue3-element-admin"-->
            <!--              >Gitee源码</el-link-->
            <!--            >-->
            <!--            <el-divider direction="vertical" />-->
            <!--            <el-link-->
            <!--              target="_blank"-->
            <!--              type="primary"-->
            <!--              href="https://github.com/youlaitech/vue3-element-admin"-->
            <!--              >GitHub源码-->
            <!--            </el-link>-->
            <!--          </div>-->
          </div>
        </el-card>
      </el-row>
      <!-- 数据卡片 -->
      <el-row :gutter="40" class="mb-4">
        <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
          <div class="data-box">
            <div
              class="text-[#40c9c6] hover:!text-white hover:bg-[#40c9c6] p-3 rounded"
            >
              <svg-icon icon-class="uv" size="3em"/>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="text-[var(--el-text-color-secondary)]">{{isSeller ? '最近七天收入' : '最近七天支出'}}</div>
              <div class="text-lg">
                {{ Math.round(recentTotalIncomOutPut) }}
              </div>
            </div>
          </div>
        </el-col>

        <!--消息数-->
        <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
          <div class="data-box">
            <div
              class="text-[#36a3f7] hover:!text-white hover:bg-[#36a3f7] p-3 rounded"
            >
              <svg-icon icon-class="message" size="3em"/>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="text-[var(--el-text-color-secondary)]">{{isSeller ? '最近7天销量' : '最近7天购物数量'}}</div>
              <div class="text-lg">
                {{ Math.round(recentTotalAmountOutPut) }}
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :lg="6" class="mb-4">
          <div class="data-box">
            <div
              class="text-[#f4516c] hover:!text-white hover:bg-[#f4516c] p-3 rounded"
            >
              <svg-icon icon-class="money" size="3em"/>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="text-[var(--el-text-color-secondary)]">{{isSeller ? '手工艺品总销量' : '购买手工艺品总量'}}</div>
              <div class="text-lg">
                {{ Math.round(totalAmountOutPut) }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6" class="mb-2">
          <div class="data-box">
            <div
              class="text-[#34bfa3] hover:!text-white hover:bg-[#34bfa3] p-3 rounded"
            >
              <svg-icon icon-class="shopping" size="3em"/>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="text-[var(--el-text-color-secondary)]">订单结算总数</div>
              <div class="text-lg">
                {{ Math.round(orderAmountOutPut) }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- Echarts 图表 -->
      <el-row :gutter="40">
        <el-col :sm="24" :lg="8" class="mb-4">
          <BarChart
            id="barChart"
            height="400px"
            width="100%"
            :dataSource="isSeller ? recent7income : recent7pay"
            class="bg-[var(--el-bg-color-overlay)]"
          />
        </el-col>

        <el-col :xs="24" :sm="12" :lg="8" class="mb-4">
          <PieChart
            id="pieChart"
            height="400px"
            width="100%"
            :dataSource="isSeller ? recent7count : recent7BuyAccount"
            class="bg-[var(--el-bg-color-overlay)]"
          />
        </el-col>

        <el-col :xs="24" :sm="12" :lg="8" class="mb-4">
          <RadarChart
            id="radarChart"
            height="400px"
            width="100%"
            :dataSource="orderList"
            class="bg-[var(--el-bg-color-overlay)]"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  position: relative;

  .user-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
    z-index: 99;
  }

  .data-box {
    font-weight: bold;
    padding: 20px;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    box-shadow: var(--el-box-shadow-dark);
    border-color: var(--el-border-color);
    display: flex;
    justify-content: space-between;
  }

  .svg-icon {
    fill: currentColor !important;
  }
}
</style>
