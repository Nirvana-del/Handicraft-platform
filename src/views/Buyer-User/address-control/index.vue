<template>
  <div>
    <el-card>
      <template #header>
        <div class="address-header">
          <span>我的地址</span>
          <!--        <el-button class="button" text>Operation button</el-button>-->
        </div>
      </template>
      <el-card class="box-card" shadow="never">
        <el-table
          ref="dataTableRef"
          :data="currentAddress"
          border
        >
          <el-table-column label="收货人" prop="consigneeName" align="center"/>
          <el-table-column label="联系电话" prop="consigneeMobile" align="center"/>
          <el-table-column label="省份" prop="province" align="center"/>
          <el-table-column label="城市" prop="city" align="center"/>
          <el-table-column label="地区" prop="area" align="center"/>
          <el-table-column label="详细地址" prop="detailAddress" align="center"/>
          <el-table-column label="邮政编码" prop="zipCode" align="center"/>
          <el-table-column label="默认地址" prop="defaulted" align="center">
            <template #default="scope">
              <el-icon v-if="scope.row.defaulted === 1"><Select/></el-icon>
              <el-icon v-else>
                <SemiSelect/>
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button
                type="success"
                link
                @click.stop="handleEditAddress(scope.row)"
              >修改信息
              </el-button
              >
              <el-popconfirm title="您确定要删除该地址吗?" @confirm="handleDeleteAddress(scope.row.id)">
                <template #reference>
                  <el-button
                    type="danger"
                    link
                  >删除地址
                  </el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="address-footer">
        <el-button type="primary" @click="handleAddAddress">新增收货地址</el-button>
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      title="地址信息"
      width="30%"
      @close="state.isEdit = false"
    >
      <el-form :model="state.addressForm" label-width="120px" ref="addressRef" :rules="addressRules">
        <el-form-item label="收货人姓名" prop="consigneeName">
          <el-input v-model="state.addressForm.consigneeName"/>
        </el-form-item>
        <el-form-item label="收货人电话" prop="consigneeMobile">
          <el-input v-model="state.addressForm.consigneeMobile"/>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="state.addressForm.province"/>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="state.addressForm.city"/>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="state.addressForm.area"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="state.addressForm.detailAddress"/>
        </el-form-item>
        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model="state.addressForm.zipCode"/>
        </el-form-item>
        <el-form-item label="设为默认地址" prop="defaulted">
          <el-switch
            :disabled="state.currentProduct.isDefaulted || !state.isEdit"
            :model-value="state.currentProduct.isDefaulted"
            @change="(value) => changeDefaultAddress(value)"/>
        </el-form-item>

      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddressInfo">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/store/modules/user";
import {AddressType} from "@/api/address/type";
import {ref} from "vue";
import {ElForm} from "element-plus";
import {addAddress, getAddressDetail, removeAddress, setDefaultAddress, updateAddressInfo} from "@/api/address";
import {
  SemiSelect,
  Select
} from '@element-plus/icons-vue';
import {pick} from "lodash";

const {getAddressInfo} = useUserStore()
const currentAddress = ref<Array<AddressType>>([]);
const dialogVisible = ref(false)
const addressRef = ref(ElForm);
const addressRules = {
  consigneeName: [{required: true, trigger: 'blur'}],
  consigneeMobile: [{required: true, trigger: 'blur'}],
  province: [{required: true, trigger: 'blur'}],
  city: [{required: true, trigger: 'blur'}],
  area: [{required: true, trigger: 'blur'}],
  detailAddress: [{required: true, trigger: 'blur'}],
  zipCode: [{required: true, trigger: 'blur'}]
}
let state = reactive({
  addressForm: {
    id: '',
    consigneeName: '',
    consigneeMobile: '',
    province: '',
    city: '',
    area: '',
    detailAddress: '',
    zipCode: '',
  } as Partial<AddressType>,
  currentProduct: {
    id: '',
    isDefaulted: false
  },
  isEdit: false
})
const refreshAddressDetail = async (id: string) => {
  const res = await getAddressDetail(id)
  console.log(res.data.address)
  const currentInfo = res.data.address
  state.currentProduct.id = currentInfo.id;
  state.currentProduct.isDefaulted = currentInfo.defaulted === 1;
  state.isEdit = true
  const keyList = [...Object.keys(state.addressForm)]
  // keyList.pop();
  state.addressForm = pick(currentInfo, keyList);
}
const handleEditAddress = async (row: AddressType) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await refreshAddressDetail(row.id!);
  dialogVisible.value = true
}
const handleAddAddress = () => {
  dialogVisible.value = true
}
const changeDefaultAddress = async (e: boolean) => {
  if (e) {
    try {
      await setDefaultAddress(state.currentProduct.id)
      await getCurrentAddress()
      await refreshAddressDetail(state.currentProduct.id)
    } catch (err) {
      console.log(err)
    }
  }

}
const handleDeleteAddress = async (id: number) => {
  await removeAddress(id)
  await getCurrentAddress()
}
const submitAddressInfo = () => {
  addressRef.value.validate(async (valid: boolean) => {
    console.log(valid)
    if (valid) {
      if (!state.isEdit) {
        await addAddress(state.addressForm)
      } else {
        await updateAddressInfo(state.addressForm)
      }
      dialogVisible.value = false;
      await getCurrentAddress()
    }
  })
}
const getCurrentAddress = async () => {
  currentAddress.value = await getAddressInfo()
}
onMounted(() => {
  getCurrentAddress()
})
</script>

<style lang="scss" scoped>
.address-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
