<script lang="ts">
export default {
  name: 'goods',
};
</script>

<script setup lang="ts">
import {reactive, ref, onMounted, toRefs} from 'vue';
import {ElTable, ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from 'vue-router';
import {AxiosPromise} from 'axios';

import {
  Plus,
} from '@element-plus/icons-vue';
import {getCouponListApi, sellerAddCouponApi, sellerDeleteCouponApi, sellerUpdateCouponApi} from "@/api/coupon";
import {addCategory, deleteCategories, listCategories, updateCategories} from "@/api/handicrafts/category";

const dataFormRef = ref(ElForm);

const dataTableRef = ref(ElTable);
const router = useRouter();
const state = reactive({
  // 遮罩层
  loading: false,
  couponList: [] as Array<Product>,
  couponDetail: '',
  isEdit: false,
  dialog: {
    title: '',
    visible: false,
  },
  formData: {
    id: undefined,
    name: undefined
  },
  rules: {
    name: [
      {
        required: true,
        message: '请输入分类名字',
        trigger: 'blur',
      },
    ]
  },
});

const {
  loading,
  dialog,
  couponList,
  formData,
  rules,
  isEdit
} = toRefs(state);

async function getCouponList() {
  const res = await listCategories()
  console.log(res.data)
  couponList.value = res.data.categories
}

const handleQuery = async () => {
  state.loading = true;
  await getCouponList()
  state.loading = false;
}

onMounted(() => {
  handleQuery()
})

function handleAdd() {
  isEdit.value = false
  dialog.value.visible = true
}

async function handleUpdate(row: any) {
  isEdit.value = true
  const {name} = row
  formData.value.name = name
  formData.value.id = row.id
  dialog.value.visible = true
}

function handleDelete(row: any) {
  const id = row.id;
  ElMessageBox.confirm('是否确认删除选中的分类?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(function () {
      return deleteCategories(id);
    })
    .then(() => {
      ElMessage.success('删除成功');
      handleQuery();
    });
}

function closeDialog() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
  state.dialog.visible = false;
}

async function handleAddCate() {
  console.log(formData.value)
  await addCategory(formData.value)
  await handleQuery()
  ElMessage.success('新增成功')
  dialog.value.visible = false
}

async function handleUpdateCate() {
  console.log(formData.value)
  await updateCategories(formData.value)
  await handleQuery()
  ElMessage.success('修改成功')
  dialog.value.visible = false
}

function submitForm() {
  dataFormRef.value.validate(async (valid: any) => {
    if (!isEdit.value) {
      // console.log(formData.value)
      handleAddCate()
    } else {
      // console.log(formData.value)
      handleUpdateCate()
    }
  })
}
</script>

<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <el-button type="success" :icon="Plus" @click="handleAdd"
        >新增
        </el-button
        >
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="couponList"
        border
      >
        <el-table-column label="分类ID" prop="id" align="center"/>
        <el-table-column label="分类名称" prop="name" align="center"/>

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click.stop="handleUpdate(scope.row)"
            >
              修改信息
            </el-button>
            <el-button
              type="danger"
              link
              @click.stop="handleDelete(scope.row)"
            >删除分类
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="750px">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
