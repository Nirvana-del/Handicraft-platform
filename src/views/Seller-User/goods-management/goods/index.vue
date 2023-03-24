<!--商品列表-->
<script lang="ts">

export default {
  name: 'goods',
};

</script>

<script setup lang="ts">
import {listSpuByStatus} from "@/api/handicrafts/goods";
import SellerGoods from '@/components/GoodsList/sellerGoods.vue'
const fetchGoodsList = async () => {
  return listSpuByStatus(1);
}

</script>

<template>
  <div>
    <SellerGoods :refreshGoodsList="fetchGoodsList"/>
  </div>
</template>

<style scoped></style>
