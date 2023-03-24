<script setup lang="ts">
import {listSpuList} from "@/api/handicrafts/goods";
import BuyerGoods from "@/components/GoodsList/buyerGoods.vue";

const fetchGoodsList = async () => {
 return listSpuList()
}
onMounted(() => {
  fetchGoodsList()
})
</script>
<template>
  <div>
    <BuyerGoods :refreshGoodsList="fetchGoodsList"/>
  </div>
</template>

<style scoped>

</style>
