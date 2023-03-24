<!--商品列表-->
<script lang="ts">
export default {
  name: 'goods',
};
</script>

<script setup lang="ts">
import {reactive, ref, onMounted, toRefs} from 'vue';
import {ElTable, ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
import {AxiosPromise} from 'axios';

import {
  Search,
  Refresh
} from '@element-plus/icons-vue';
import {getSpuDetail, listSpuListByCategory} from '@/api/handicrafts/goods';
import {moneyFormatter} from '@/utils/filter';
import {GoodsPageResult, GoodsQuery} from '@/api/handicrafts/goods/types';
import {useCart} from "@/hooks/useCart";
import {listCategories} from "@/api/handicrafts/category";
import {useUserStoreHook} from "@/store/modules/user";
const {isVisitor} = useUserStoreHook()

const dataTableRef = ref(ElTable);
const router = useRouter();
const {addToCart} = useCart();
const props = defineProps<{
  refreshGoodsList: () => AxiosPromise<GoodsPageResult>
}>()
const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  total: 0,
  goodsList: [] as Array<Product>,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    price: ''
  } as GoodsQuery,
  // goodsList: [] as Product[],
  categoryOptions: [] as OptionType[],
  goodDetail: '',
  dialogVisible: false,
});

const {
  loading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ids,
  queryParams,
  goodsList,
  categoryOptions,
  goodDetail,
  total,
  dialogVisible,
} = toRefs(state);
function handleAddtoCart(product: Product){
  if (isVisitor){
    ElMessage.warning('请先登录账号')
    router.push({
      path: '/login'
    })
  }else {
    addToCart(product)
  }
}
// 刷新表格数据（全量）
async function handleQuery() {
  state.loading = true;
  const res = await props.refreshGoodsList()
  goodsList.value = res.data.handicrafts
  state.loading = false;
}
async function getGoodsListByQuery(){
  console.log(queryParams.value.categoryId)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const res = await listSpuListByCategory(queryParams.value.categoryId!)
  console.log(res.data.handicrafts)
  goodsList.value = res.data.handicrafts
}
function resetQuery() {
  state.queryParams = {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    categoryId: undefined,
  };
  handleQuery();
}

// 获取商品详情
async function handleGoodsView(row: any) {
  console.log(row)
  const res = await getSpuDetail(row.id)
  // console.log(res.data.handicrafts)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  state.goodDetail = res.data.handicrafts.detail!;
  state.dialogVisible = true;
}

// 过滤分类数据
function filterCategory(categories: any[]): OptionType[] {
  return categories.map(item => {
    if (item.categoryList && item.categoryList.length !== 0) {
      return {
        value: item.id,
        label: item.name,
        children: filterCategory(item.categoryList)
      }
    } else {
      return {
        value: item.id,
        label: item.name
      }
    }
  })
}

// 获取分类数据
async function getCategoryList() {
  const res = await listCategories()
  console.log(res)
  categoryOptions.value = filterCategory(res.data.categories);
}

function handleRowClick(row: any) {
  dataTableRef.value.toggleRowSelection(row);
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: { id: any }) => item.id);
}

const contactSeller = (row: any) => {
  if (isVisitor){
    ElMessage.warning('请先登录账号')
    router.push({
      path: '/login'
    })
  }else{
    router.push({
      name: 'UserChat',
      query: {sellerId: row.sellerId, sellerAvatar: row.sellerAvatar, sellerNickName: row.nickName}
    })
  }

}

onMounted(() => {
  handleQuery();
  getCategoryList()
});
</script>

<template>
  <div class="app-container">
    <div class="search">
      <!--      商家展示： 正在出售的/已经售出的/已经下架的-->
      <!--      买家展示： 按类别/价格/名称等-->
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
<!--        <el-form-item label="关键字">-->
<!--          <el-input-->
<!--            v-model="queryParams.name"-->
<!--            placeholder="商品名称"-->
<!--            clearable-->
<!--          ></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="商品分类">
          <el-cascader
            v-model="queryParams.categoryId"
            placeholder="全部"
            :props="{ emitPath: false }"
            :options="categoryOptions"
            clearable
            style="width: 300px"
          />
        </el-form-item>
<!--        <el-form-item label="商品价格">-->
<!--&lt;!&ndash;          <el-cascader&ndash;&gt;-->
<!--&lt;!&ndash;            v-model="queryParams.price"&ndash;&gt;-->
<!--&lt;!&ndash;            placeholder="全部"&ndash;&gt;-->
<!--&lt;!&ndash;            :props="{ emitPath: false }"&ndash;&gt;-->
<!--&lt;!&ndash;            :options="categoryOptions"&ndash;&gt;-->
<!--&lt;!&ndash;            clearable&ndash;&gt;-->
<!--&lt;!&ndash;            style="width: 300px"&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->
<!--          <el-input-->
<!--            v-model="queryParams.price"-->
<!--            placeholder="商品价格"-->
<!--            clearable-->
<!--          ></el-input>-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getGoodsListByQuery"
          >搜索
          </el-button
          >
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="goodsList"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        border
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="商品名称" prop="handicrafts.name" align="center"/>
        <el-table-column label="图片" align="center">
          <template #default="scope">
            <el-popover placement="right" :width="400" trigger="hover">
              <img :src="scope.row.handicrafts.picUrl" width="400" height="400" alt=""/>
              <template #reference>
                <img
                  :src="scope.row.handicrafts.picUrl"
                  style="max-height: 60px; max-width: 60px"
                  alt=""/>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品类目" prop="handicrafts.categoryName" min-width="100" align="center"/>
        <el-table-column align="center" label="零售价" prop="handicrafts.originPrice">
          <template #default="scope">{{
              moneyFormatter(scope.row.handicrafts.originPrice)
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              type="success"
              link
              @click.stop="handleGoodsView(scope.row.handicrafts)"
            >查看详情
            </el-button
            >

            <el-button
              type="primary"
              link
              @click.stop="contactSeller(scope.row)"
            >联系客服
            </el-button>
            <el-button
              type="danger"
              link
              @click.stop="handleAddtoCart(scope.row.handicrafts)"
            >添加至购物车
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页工具条 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
    />
    <el-dialog v-model="dialogVisible" title="商品详情">
      <div class="goods-detail-box" v-html="goodDetail"/>
    </el-dialog>
  </div>
</template>

<style scoped></style>
