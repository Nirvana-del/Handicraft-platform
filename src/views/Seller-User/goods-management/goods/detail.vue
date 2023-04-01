<template>
  <div class="app-container">
    <el-steps
      :active="active"
      process-status="finish"
      finish-status="success"
      simple
    >
      <el-step title="选择手工艺品分类" />
      <el-step title="填写手工艺品信息" />
<!--      <el-step title="设置手工艺品属性" />-->
      <el-step title="设置手工艺品库存" />
    </el-steps>

    <GoodsCategory
      v-show="active === 0"
      v-model="goodsInfo"
      v-if="loaded === true"
      @prev="prev"
      @next="next"
    />
    <GoodsInfo
      v-show="active === 1"
      v-model="goodsInfo"
      v-if="loaded === true"
      @prev="prev"
      @next="next"
    />
<!--    <GoodsAttribute-->
<!--      v-show="active === 2"-->
<!--      v-model="goodsInfo"-->
<!--      v-if="loaded === true"-->
<!--      @prev="prev"-->
<!--      @next="next"-->
<!--    />-->
    <GoodsStock
      v-show="active === 2"
      v-model="goodsInfo"
      v-if="loaded === true"
      @prev="prev"
      @next="next"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs } from 'vue';

import GoodsCategory from './components/GoodsCategory.vue';
import GoodsInfo from './components/GoodsInfo.vue';
import GoodsStock from './components/GoodsStock.vue';

import { getSpuDetail } from '@/api/handicrafts/goods';
import { useRoute } from 'vue-router';
import { GoodsDetail } from '@/api/handicrafts/goods/types';
import {pick} from 'lodash'
const route = useRoute();

const state = reactive({
  loaded: false,
  active: 0,
  goodsInfo: {
    id: '',
    name: '',
    categoryId: '',
    originPrice: null,
    picUrl: '',
    album: [],
    description: '',
    detail: '',
    stock: null
  } as Partial<GoodsDetail>,
});

const { loaded, active, goodsInfo } = toRefs(state);

function loadData() {
  const goodsId = route.query.goodsId as string;

  if (goodsId) {
    getSpuDetail(goodsId).then((response) => {
      console.log(response.data.handicrafts.album)
      const newAlbum = (response.data.handicrafts.album as any).replace(/(\\)|"/g, '').split(',');
      console.log(...Object.keys(goodsInfo.value))
      // 获取部分属性值
      const newInfo = pick(response.data.handicrafts,[...Object.keys(goodsInfo.value)]);
      console.log(newInfo)
      state.goodsInfo = newInfo;
      state.goodsInfo.album = newAlbum;
      state.goodsInfo.originPrice = (state.goodsInfo.originPrice as any) / 100;
      state.goodsInfo.price = (state.goodsInfo.price as any) / 100;
      state.loaded = true;
    });
  } else {
    state.loaded = true;
  }
}

function prev() {
  if (state.active-- <= 0) {
    state.active = 0;
  }
}
function next() {
  if (state.active++ >= 3) {
    state.active = 0;
  }
}

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.app-container {
  width: 1200px;
  margin: 50px auto;
  border: 1px solid #eee;
}
</style>
