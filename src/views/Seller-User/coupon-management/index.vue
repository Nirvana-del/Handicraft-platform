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
    name: undefined,
    circulation: undefined,
    discount: undefined,
  },
  rules: {
    name: [
      {
        required: true,
        message: '请输入优惠券名字',
        trigger: 'blur',
      },
    ],
    circulation: [
      {
        required: true,
        message: '请选择优惠券数量',
        trigger: 'blur',
      },
    ],
    discount: [
      {
        required: true,
        message: '请选择优惠券折扣',
        trigger: 'blur',
      },
    ],
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
  const res = await getCouponListApi()
  console.log(res.data.coupons)
  couponList.value = res.data.coupons
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
  const {name, discount, circulation} = row
  formData.value.name = name
  formData.value.discount = discount
  formData.value.circulation = circulation
  formData.value.id = row.id
  dialog.value.visible = true
}

function handleDelete(row: any) {
  const id = row.id;
  console.log(id)
  ElMessageBox.confirm('是否确认删除选中的优惠券?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(function () {
      return sellerDeleteCouponApi(id);
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

async function sellerAddCoupon() {
  await sellerAddCouponApi(formData.value)
  await handleQuery()
  ElMessage.success('新增成功')
  dialog.value.visible = false
}

async function sellerUpdateCoupon() {
  await sellerUpdateCouponApi(formData.value)
  await handleQuery()
  ElMessage.success('修改成功')
  dialog.value.visible = false
}

function submitForm() {
  dataFormRef.value.validate(async (valid: any) => {
    if (!isEdit.value) {
      sellerAddCoupon()
    } else {
      sellerUpdateCoupon()
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
        <el-table-column width="120" label="商家" align="center" prop="seller">
        </el-table-column>
        <el-table-column label="优惠券名称" prop="name" align="center"/>
        <el-table-column label="折扣" min-width="100" align="center">
          <template v-slot="{row}">
            {{ row.discount * 10 }}折
          </template>
        </el-table-column>
        <el-table-column label="数量（张）" prop="circulation" min-width="100" align="center"/>
        <el-table-column label="已领取（张）" prop="receivedCount" min-width="100" align="center"/>
        <el-table-column label="已使用（张）" prop="usedCount" min-width="100" align="center"/>
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
            >删除优惠券
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
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item label="优惠券数量" prop="circulation">
          <el-input-number v-model="formData.circulation" :min="1" :max="10" placeholder="最小为 1"/>
        </el-form-item>
        <el-form-item label="优惠券折扣" prop="discount">
          <el-input-number :min="0.1" :max="1" step="0.1" v-model="formData.discount" placeholder="填写小数"/>
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
