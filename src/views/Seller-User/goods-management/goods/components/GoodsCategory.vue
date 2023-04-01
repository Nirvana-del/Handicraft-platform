<template>
  <div class="component-container">
    <div class="component-container__main">
      <el-cascader-panel
        ref="categoryRef"
        :options="categoryOptions"
        v-model="goodsInfo.categoryId"
        :props="{ emitPath: false }"
        @change="handleCategoryChange"
      />
      <div style="margin-top: 20px">
        <el-link type="info" :underline="false" v-show="pathLabels.length > 0"
        >您选择的手工艺品分类:
        </el-link
        >
        <el-link
          type="danger"
          :underline="false"
          v-for="(item, index) in pathLabels"
          :key="index"
          style="margin-left: 5px"
        >
          {{ item }}
          <CaretRight
            v-show="index < pathLabels.length - 1"
            style="width: 1em; height: 1em; margin-left: 5px"
          />
        </el-link>
      </div>
    </div>
    <div class="component-container__footer">
      <el-button type="primary" @click="handleNext"
      >下一步，填写手工艺品信息
      </el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, nextTick, reactive, ref, toRefs} from 'vue';
import {ElCascaderPanel, ElMessage} from 'element-plus';
import {CaretRight} from '@element-plus/icons-vue';

// API 引用
import {listCategories} from '@/api/handicrafts/category';
import {computed} from 'vue';

const emit = defineEmits(['next', 'update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {
      return {
        categoryId: 1
      }
    },
  },
});

const goodsInfo: any = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const state = reactive({
  categoryOptions: [] as OptionType[],
  pathLabels: [],
});

const {categoryOptions, pathLabels} = toRefs(state);
const filterCategoryList = (arr:any[] )=>{
  return arr.map((item: any) => {
    if(item.categoryList !== null){
        item.children = filterCategoryList(item.categoryList);
    }
    return {
      value: item.id,
      label: item.name,
      children: item.children
    }
  })
}
function loadData() {
  listCategories().then(({data}) => {
    console.log(data)
    const newList = filterCategoryList(data.categories)
    console.log(newList)
    state.categoryOptions = newList;
    if (goodsInfo.value.id) {
      nextTick(() => {
        handleCategoryChange();
      });
    }
  });
}

const categoryRef = ref(ElCascaderPanel);

function handleCategoryChange() {
  const checkNode = categoryRef.value.getCheckedNodes()[0];
  state.pathLabels = checkNode.pathLabels; // 手工艺品分类选择层级提示
  goodsInfo.value.categoryId = checkNode.value;
}

function handleNext() {
  if (!goodsInfo.value.categoryId) {
    ElMessage.warning('请选择手工艺品分类');
    return false;
  }
  emit('next');
}

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.component-container {
  &__main {
    margin: 20px auto;
  }

  &__footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
}
</style>
