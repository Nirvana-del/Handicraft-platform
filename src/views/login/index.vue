<template>
  <div class="box" :class="{'add-class-content': !flag}">
    <div ref="content" class="content">
      <img class="login-img images" :class="{'add-class-login-img': !flag, 'add-class-login-img-show': flag}"
           src="../../assets/login.jpg" alt="登录">
      <img class="register-img images" :class="{'add-class-register-img': !flag}" src="../../assets/register.jpg"
           alt="注册">
      <div ref="loginWrapper" class="login-wrapper">
        <div class="top-tips">
          <div class="title">{{ $t('login.title') }}
            <lang-select class="set-language"/>
          </div>
          <span class="top-tips-span" @click="toggleForm">{{ topLabel }}</span>
        </div>
        <h1>{{ titleLabel }}</h1>

        <div v-if="flag" class="login-form">
          <div>
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              auto-complete="on"
              label-position="left"
            >
              <el-form-item prop="username" class="form-item">
                <el-input
                  ref="username"
                  :prefix-icon="User"
                  v-model="loginForm.username"
                  :placeholder="$t('login.username')"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>
              <el-tooltip
                :disabled="capslockTooltipDisabled"
                content="大写锁定开启"
                placement="right"
              >
                <el-form-item prop="password" class="form-item">
                  <el-input
                    ref="passwordRef"
                    :prefix-icon="Lock"
                    :key="passwordType"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup="checkCapslock"
                    @blur="capslockTooltipDisabled = true"
                    @keyup.enter="handleLogin"
                  >
                    <template #suffix>
                         <span class="show-pwd" @click="showPwd">
                         <el-icon v-if="passwordType==='password'" class="el-input__icon"><Hide/></el-icon>
                         <el-icon v-else class="el-input__icon"><View/></el-icon>
                     </span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-tooltip>

              <div class="login-bottom">
                <el-button
                  size="large"
                  :loading="loading"
                  type="primary"
                  @click.prevent="handleLogin"
                >{{ $t('login.login') }}
                </el-button>
                <el-link type="primary" @click="visitorToLogin">游客登录</el-link>
              </div>
            </el-form>
          </div>
        </div>
        <div v-else class="register-form">
          <div>
            <el-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              auto-complete="on"
              label-position="left"
            >
              <el-form-item prop="username" class="form-item">
                <el-input
                  ref="username"
                  :prefix-icon="User"
                  v-model="registerForm.username"
                  :placeholder="$t('login.username')"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>
              <el-form-item prop="nickname" class="form-item">
                <el-input
                  ref="username"
                  :prefix-icon="UserFilled"
                  v-model="registerForm.nickname"
                  :placeholder="$t('login.nickname')"
                  name="nickname"
                  type="text"
                  tabindex="1"
                  auto-complete="on"
                />
              </el-form-item>
              <el-tooltip
                :disabled="capslockTooltipDisabled"
                content="大写锁定开启"
                placement="right"
              >
                <el-form-item prop="password" class="form-item">
                  <el-input
                    ref="passwordRef"
                    :prefix-icon="Lock"
                    :key="passwordType"
                    v-model="registerForm.password"
                    :type="passwordType"
                    :placeholder="$t('login.password')"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                  >
                    <template #suffix>
                         <span class="show-pwd" @click="showPwd">
                         <el-icon v-if="passwordType==='password'" class="el-input__icon"><Hide/></el-icon>
                         <el-icon v-else class="el-input__icon"><View/></el-icon>
                     </span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-tooltip>
              <el-form-item prop="password_confirm" class="form-item">
                <el-input
                  ref="password_confirmRef"
                  :prefix-icon="Lock"
                  :key="password_confirmType"
                  v-model="registerForm.password_confirm"
                  :type="password_confirmType"
                  :placeholder="$t('login.password_confirm')"
                  name="password_confirm"
                  auto-complete="on"
                  @keyup.enter="handleRegister"
                >
                  <template #suffix>
                         <span class="show-pwd" @click="showPwdConfirm">
                         <el-icon v-if="password_confirmType==='password'" class="el-input__icon"><Hide/></el-icon>
                         <el-icon v-else class="el-input__icon"><View/></el-icon>
                     </span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="gender" class="form-item">
                <el-radio-group v-model="registerForm.gender">
                  <el-radio :label="1">{{ $t('login.male') }}</el-radio>
                  <el-radio :label="2">{{ $t('login.female') }}</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item prop="roleType" class="form-item">
                <el-select v-model="registerForm.roleType" placeholder="选择身份">
                  <el-option
                    v-for="item in ['买家', '商家']"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="roleType" class="form-item">
                <div :style="{
                display: 'flex',
                justifyContent: 'space-between'
              }">
                  <el-upload
                    ref="upload"
                    :limit="1"
                    v-model="avatarUrl"
                    :on-exceed="handleUploadAvatar"
                    :http-request="uploadAvatar"
                    :auto-upload="true"
                  >
                    <template #trigger>
                      <el-button type="primary">选择头像</el-button>
                    </template>
                  </el-upload>
                  <el-button
                    size="large"
                    :style="{
                  marginLeft: '10px'
              }"
                    :loading="loading"
                    type="primary"
                    @click.prevent="handleRegister"
                  >{{ $t('login.register') }}
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, reactive, ref, toRefs, watch} from "vue";
import LangSelect from '@/components/LangSelect/index.vue';
import {LoginData, RegisterData} from "@/api/auth/types";
import router from "@/router";
// import SvgIcon from '@/components/SvgIcon/list.vue';
import {Lock, User, View, Hide, UserFilled} from '@element-plus/icons-vue'
// 状态管理依赖
import {useRoute} from 'vue-router';
import {ElForm, ElInput} from "element-plus";
import {useUserStoreHook} from '@/store/modules/user'
import {getCurrentInstance} from "vue";
import {genFileId} from 'element-plus'
import type {UploadInstance, UploadProps, UploadRawFile, UploadRequestOptions} from 'element-plus'
import {uploadFileApi} from "@/api/file";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const {appContext: {config: {globalProperties: {$t}}}} = getCurrentInstance()!;  // 这里可以根据需要写个hook
const permissionStore = useUserStoreHook();
const upload = ref<UploadInstance>()
const route = useRoute();
const handleUploadAvatar: UploadProps['onExceed'] = (files) => {
  upload.value?.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  console.log(genFileId())
  upload.value?.handleStart(file)
}
const loginFormRef = ref(ElForm);
const registerFormRef = ref(ElForm);
const passwordRef = ref(ElInput);
const password_confirmRef = ref(ElInput);

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error($t('login.validatePassword')));
  } else {
    callback();
  }
}
const {visitorLogin} = useUserStoreHook()
async function visitorToLogin(){
  console.log('游客登陆')
  await visitorLogin()
  router.push({path: '/visitor'});
}
function validateUsername(rule: any, value: any, callback: any) {
  if (value.length === 0) {
    callback(new Error($t('login.validateUsername')));
  } else {
    callback();
  }
}

const state = reactive({
  avatarUrl: '',
  redirect: '',
  loginForm: {
    username: 'test', // test
    password: '123456',
  } as LoginData,
  registerForm: {
    username: '',
    nickname: '',
    gender: 0,
    avatar: '',
    password: '',
    password_confirm: '',
    roleType: ''
  } as RegisterData,
  password_confirm: '',
  loginRules: {
    username: [{required: true, trigger: 'blur'}],
    nickname: [{required: true, trigger: 'blur'}],
    mobile: [{required: true, trigger: 'blur'}],
    password: [
      {required: true, trigger: 'blur', validator: validatePassword},
    ],
  },
  registerRules: {
    username: [{required: true, trigger: 'blur', validator: validateUsername}],
    nickname: [{required: true, trigger: 'blur'}],
    mobile: [{required: true, trigger: 'blur'}],
    email: [{required: true, trigger: 'blur'}],
    gender: [{required: true, trigger: 'blur'}],
    roleType: [{required: true, trigger: 'blur'}],
    password: [
      {required: true, trigger: 'blur', validator: validatePassword},
    ],
    password_confirm: [
      {required: true, trigger: 'blur', validator: validatePassword},
    ],

  },
  loading: false,
  passwordType: 'password',
  password_confirmType: 'password',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
});

const {
  loginForm,
  loginRules,
  registerForm,
  registerRules,
  loading,
  passwordType,
  password_confirmType,
  capslockTooltipDisabled,
  avatarUrl
} = toRefs(state);

function checkCapslock(e: any) {
  const {key} = e;
  // state.capslockTooltipDisabled =
  //   key && key.length === 1 && key >= 'A' && key <= 'Z';
  if (key === 'CapsLock') {
    console.log('CapsLock')
    state.capslockTooltipDisabled = false
  } else {
    state.capslockTooltipDisabled = true
  }
  console.log(capslockTooltipDisabled.value)
}

function showPwd() {
  if (state.passwordType === 'password') {
    state.passwordType = '';
  } else {
    state.passwordType = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

function showPwdConfirm() {
  if (state.password_confirmType === 'password') {
    state.password_confirmType = '';
  } else {
    state.password_confirmType = 'password';
  }
  nextTick(() => {
    password_confirmRef.value.focus();
  });
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      permissionStore
        .login(state.loginForm)
        .then(() => {
          router.push({path: state.redirect || '/', query: state.otherQuery});
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

const uploadAvatar = async (options: UploadRequestOptions): Promise<any> => {
  console.log(options.file)
  const {data: fileInfo} = await uploadFileApi(options.file);
  console.log(fileInfo)
  avatarUrl.value = fileInfo.url;
}
const handleRegister = async () => {
  registerFormRef.value.validate((valid: boolean) => {
    console.log(valid)
    if (valid) {
      console.log(state.registerForm)
      console.log(avatarUrl.value)
      if (registerForm.value.password !== registerForm.value.password_confirm) {
        return ElMessage.warning('两次输入的密码不一致！')
      } else {
        if (avatarUrl.value.length === 0) {
          return ElMessage.warning('请先选择头像！')
        }
        if (registerForm.value.roleType === '买家') {
          permissionStore
            .registerBuyer(state.registerForm, avatarUrl.value)
            .then(() => {
              toggleForm()
              state.loading = false;
            }).catch(() => {
            state.loading = false;
          });
        } else {
          permissionStore
            .registerSeller(state.registerForm, avatarUrl.value)
            .then(() => {
              toggleForm()
              state.loading = false;
            }).catch(() => {
            state.loading = false;
          });
        }
      }
    }
  })
}
const flag = ref(true)
const content = ref()
const loginWrapper = ref()

const topLabel = computed(() => {
  return flag.value ? $t('login.register') : $t('login.login')
})
const titleLabel = computed(() => {
  return flag.value ? $t('login.login') : $t('login.register')
})
const toggleForm = async () => {
  state.passwordType = 'password';
  await nextTick()
  if (flag.value) {
    loginWrapper.value.style.height = '85vh'
    content.value.style.height = '90vh'
  } else {
    loginWrapper.value.style.height = '70vh'
    content.value.style.height = '85vh'
  }
  flag.value = !flag.value
}
watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true,
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

.box {
  background-color: rgb(51, 32, 108);
  width: 100vw;
  height: 100vh;

  .content {
    width: 90vw;
    height: 85vh;
    background-color: rgb(228, 218, 232);
    border-radius: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: 1s;

    .images {
      margin-left: -150px;
      margin-right: 100px;
      position: absolute;
      left: 15%;
    }

    .login-img {
      width: 45%;
      height: 90%;
      border-radius: 15%;
    }

    .register-img {
      width: 45%;
      opacity: 0;
      border-radius: 15%;
    }

    .login-wrapper {
      width: 30vw;
      height: 70vh;
      border-radius: 40px;
      backdrop-filter: blur(1px);
      background: rgba(244, 240, 245, 0.6);
      padding: 60px;
      box-sizing: border-box;
      position: absolute;
      right: 10%;
      transition: 1s;

      .top-tips {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          font-size: 26px;
          margin-right: 20px;
          text-align: center;
          font-weight: bold;
          display: flex;

          .set-language {
            font-size: 20px;
            margin: auto 10px;
            cursor: pointer;
          }
        }


        .top-tips-span {
          font-size: 15px;
          color: rgb(79, 133, 226);
          border-bottom: 1px solid rgb(79, 133, 226);
          float: right;
          line-height: 25px;
          cursor: pointer;
        }
      }

      h1 {
        font-size: 45px;
        margin: 20px 0;
      }

      .register-form {
        width: 100%;

        .form-item {
          margin-bottom: 20px;

          .text-tips {
            color: rgb(123, 122, 123);
            margin: 5px;

            .forgot-password {
              font-size: 15px;
              color: rgb(79, 133, 226);
              border-bottom: 1px solid rgb(79, 133, 226);
              float: right;
              line-height: 25px;
              cursor: pointer;
            }
          }

          input {
            width: 100%;
            height: 50px;
            margin: 5px 0;
            border-radius: 5px;
            border: 0;
            font-size: 17px;
            padding: 0 20px;
            box-sizing: border-box;
          }

          input:focus {
            outline: none;
            border: 1px solid rgb(79, 133, 226);
          }
        }

        //.btn {
        //  width: 150px;
        //  height: 30px;
        //  margin: 20px 0;
        //  background-color: rgb(59, 58, 59);
        //  border: 0;
        //  border-radius: 5px;
        //  color: #fff;
        //  font-size: 20px;
        //  cursor: pointer;
        //}
      }

      .login-form {
        .form-item {
          margin-bottom: 20px;
        }
        .login-bottom{
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}

.add-class-content {
  background-color: rgb(156, 148, 208) !important;
  transition: .1s;
}

.add-class-login-img {
  animation: disappear 0.3s forwards;
  animation-timing-function: ease;
}

.add-class-login-img-show {
  animation-delay: 0.5s;
  animation: appear 0.5s forwards;
  animation-timing-function: ease;
}

.add-class-register-img {
  animation: appear 0.5s forwards;
  animation-timing-function: ease;
  animation-delay: .2s;

}

@keyframes appear {
  from {
    border-radius: 15%;
    opacity: 0;
  }
  to {
    border-radius: 0;
    opacity: 1;
  }
}

@keyframes disappear {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

</style>
<style lang="scss" scoped>
.el-input {
  height: 40px;
}

:deep(.el-form-item__error) {
  color: #F56C6C;
}

.el-input__icon {
  cursor: pointer;
  font-size: 20px;
}

.el-button {
  width: 150px;
  height: 40px;
  background-color: rgb(59, 58, 59);
  border: 0;
  border-radius: 5px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
</style>
