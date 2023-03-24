<script lang="ts" setup>
import {getCurrentInstance, onMounted} from 'vue'
import {useUserStoreHook} from "@/store/modules/user";
import {useRoute} from "vue-router";
import {getChatList, MsgType, sendMessageApi} from "@/api/chat";

const wsBaseUrl = 'ws://127.0.0.1:8899/handiraft/chat/'
const state = reactive({
  textarea: "",
  list: [] as any[],
  curUserId: "",
  curUserName: "",
  curSessionId: '',
  sessionList_already: [],
  sessionList_not: [],
  websock: null as unknown as WebSocket
})
const {
  textarea,
  list,
  curSessionId,
  sessionList_already,
} = toRefs(state)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {proxy}: any = getCurrentInstance()
const route = useRoute()
const {userId, nickname, avatar} = useUserStoreHook()
const {sellerId, sellerAvatar, sellerNickName} = route.query

onMounted(() => {
  if (sellerId) {
    curSessionId.value = sellerId as string
    initWebSocket(userId, sellerId as string);
  }

  // proxy.$socket.on('connect', () => {
  //   console.log('socketio-connect')
  // })
  // proxy.$socket.on('message', (data: any) => {
  //   console.log(data)
  // });
  // initWebSocket(nickname, route.query.name as string);
  // msgList(userId);
  sessionListAlready()
});
// onUnmounted(() => {
//   proxy.$socket.removeAllListeners('connect');
//   proxy.$socket.removeAllListeners('message');
// });
// let sendMessage = () => {
//   console.log('发送消息')
//   proxy.$socket.emit('message', {
//     msgContent: "你好！" + new Date()
//   });
// }
const initWebSocket = (userId: string, sessionId: string) => {
  console.log(userId, sessionId)
  // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
  state.websock = new WebSocket(wsBaseUrl + userId + "/" + sessionId);
  state.websock.onopen = websocketOnopen;
  state.websock.onerror = websocketOnerror;
  state.websock.onmessage = websocketOnmessage;
  state.websock.onclose = websocketClose;
}
const websocketOnopen = () => {
  console.log("WebSocket连接成功");
}
const websocketOnerror = (e: any) => {
  console.log("WebSocket连接发生错误", e);
}
const websocketOnmessage = (e: any) => {
  const wsMsg = (e.data as string).slice(17, e.data.length - 1).split(',')
  let newObj = {} as any
  wsMsg.forEach((item: string) => {
    const key = item.split('=')[0].trim()
    const value = item.split('=')[1]
    newObj[key] = value
  })
  console.log(newObj)
  if(!state.sessionList_already.find((item: any) => item.username === newObj.username)){
    sessionListAlready()
  }
  state.list.push(newObj)
  // if (data instanceof Array) {
  //   // 列表数据
  //   state.sessionList_already = data
  // } else {
  //   // 消息数据
  //   state.list.push(data)
  // }
}
const websocketClose = (e: any) => {
  // if (state.curUserId != null) {
  //   if (state.curSessionId != null) {
  //     initWebSocket(state.curUserId, state.curSessionId)
  //   } else {
  //     initWebSocket(state.curUserId, 99999999)
  //   }
  console.log("connection closed", e);
}
// 消息发送
const sendMsg = async () => {
  if (state.curSessionId == '') {
    return ElMessage.error("请选择左边的对话框开始聊天!")
  }
  const msgObj = {
    recipientUsername: curSessionId.value,
    recipienHeadUrl: sellerAvatar,
    recipienName: sellerNickName,
    senderUsername: userId,
    senderName: nickname,
    senderHeadUrl: avatar,
    message: state.textarea,
  } as MsgType
  // state.list = []
  state.textarea = ''
  await sendMessageApi(msgObj)
  // let data = {
  //   "fromUserId": state.curUserId,
  //   "fromUserName": state.curUserName,
  //   "content": state.textarea
  // }
  // state.list.push(data)
  // state.websock.send(state.textarea)
}
// 获取已存在的会话列表
const sessionListAlready = async () => {
  const res = await getChatList(userId)
  console.log(res.data.data.chatList)
  sessionList_already.value = res.data.data.chatList
}
// 登录or注册
// 获取可建立会话列表
// const getSessionListNot = () => {
//   axios.get('http://127.0.0.1:1997/sessionList/not?id=' + state.curUserId)
//     .then(function (response) {
//       if (response.data.code == -1) {
//         return ElMessage.error(response.data.errDesc);
//       }
//       state.sessionList_not = response.data.data
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

// 创建会话
// const createSession = (toUserId: string, toUserName: string) => {
//   axios.get('http://127.0.0.1:1997/createSession?id=' + state.curUserId + "&toUserId=" + toUserId + "&toUserName=" + toUserName)
//     .then(function (response) {
//       if (response.data.code == -1) {
//         return ElMessage.error(response.data.errDesc);
//       }
//       getSessionListNot()
//       sessionListAlready()
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
// 开始会话
const startSession = (sessionId: string) => {
  if (state.websock != undefined) {
    state.websock.close()
  }
  state.list = []
  curSessionId.value = sessionId
  initWebSocket(userId, sessionId)
}

const textareaIsEmpty = computed(() => {
  return textarea.value.length === 0;
})

const chatBox = ref()
watch(state, () => {
  console.log('监听到', state.list)
  nextTick(() => {
    chatBox.value.scrollTop = chatBox.value?.scrollHeight;
  })
}, {deep: true, immediate: true})
// 删除会话
// const delSession = (sessionId: string) => {
//   axios.get('http://127.0.0.1:1997/delSession?sessionId=' + sessionId)
//     .then(function (response) {
//       if (response.data.code == -1) {
//         return ElMessage.error(response.data.errDesc);
//       }
//       getSessionListNot()
//       sessionListAlready()
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
// 获取消息数据
// const msgList = (sessionId: string) => {
//   getChatList(sessionId).then(function (response) {
//     console.log(response.data.data.chatList)
//     if (response.data.code == -1) {
//       return ElMessage.error(response.data.errDesc);
//     }
//     state.list = response.data.data
//     // 从新获取列表
//     sessionListAlready()
//   })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
</script>
<template>
  <div class="wrap">
    <div class="main">
      <div class="main_down">
        <el-card class="left" shadow="never">
          <div class="left_up">
            <div class="label_title">
              消息列表
            </div>
            <!--            recipienHeadUrl: "recipienHeadUrl"-->
            <!--            screenName: "admin"-->
            <!--            username: "admin"-->
            <div class="box-item" :class="curSessionId === item.username ? 'box_select' : 'box'"
                 v-for="item in sessionList_already"
                 :key="item.id">
              <el-avatar shape="square" :src="item.recipienHeadUrl"/>
              <div class="box-item-name" @click="startSession(item.username)">
                {{ item.screenName }}
                <!--                <el-icon @click="delSession(item.id)"><CloseBold /></el-icon>-->
              </div>
              <!--              <div class="right_left">-->
              <!--                <div class="right_left_count">-->
              <!--                  {{ item.username }}-->
              <!--                </div>-->
              <!--                <div class="right_left_del">-->
              <!--                  <i class="el-icon-close" @click="delSession(item.id)"></i>-->
              <!--                  <el-icon><CloseBold /></el-icon>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
          </div>
          <!--          <div class="left_down">-->
          <!--            <div class="label_title">-->
          <!--              可建立会话-->
          <!--            </div>-->
          <!--            <div v-for="item in sessionList_not" :key="item.id" class="box" @click="createSession(item.id, item.name)">-->
          <!--              <div class="box-item-name">-->
          <!--                {{ item.name }}-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->

        </el-card>
        <el-card class="right" shadow="never">
          <!--          聊天框-->
          <div class="right-up" ref="chatBox" id="msg_end">
            <el-empty v-if="state.list.length === 0" description="暂无聊天内容"/>

            <div v-for="(item,i) in list" :key="i"
                 class="msg-wrap"
                 :class="item.senderUsername === String(userId) ? 'msg_right' : 'msg_left'">
              <!--              发送者名称-->
              <div class="msg-sender">
                <el-tag size="small">{{ item.date }}</el-tag>
                {{ item.senderName }}
              </div>
              <!--              头像以及消息内容-->
              <div class="msg-down"
                   :class="item.senderUsername === String(userId) ? 'msg-right-down' : 'msg-left-down'">
                <!--                我发送的消息-->
                <div v-if="item.senderUsername === String(userId)" class="msg-right-down">
                  <div class="msg-bubble">
                    {{ item.message }}
                  </div>
                  <el-avatar shape="square" :src="item.senderHeadUrl"/>
                </div>
                <div v-else class="msg-left-down">
                  <!--                  :src="item.recipienHeadUrl === 'recipienHeadUrl' ? 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'-->
                  <!--                  :item.recipienHeadUrl"-->
                  <el-avatar shape="square" :src="item.senderHeadUrl"/>
                  <div class="msg-bubble">
                    {{ item.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--          输入框-->
          <div class="right-down">
            <el-input
              type="textarea"
              :rows="9"
              placeholder="请输入内容，回车发送！"
              @keyup.enter="sendMsg"
              v-model="textarea">
            </el-input>
            <el-button
              :class="{'sendButton-active': !textareaIsEmpty}"
              :color="!textareaIsEmpty && '#00BEBD' " class="sendButton" @click="sendMsg" :disabled="textareaIsEmpty">发送
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrap {
  box-sizing: border-box;
  height: calc(100vh - 50px - 34px);
  //overflow: hidden;
  width: 100%;
  /* background: linear-gradient(to left,$base,$assist-clor); */
  background: linear-gradient(to bottom, #DEF3F4, #F2F6F8);

  .main {
    display: flex;
    justify-content: center;
    align-items: start;
    height: 100%;

    .main_down {
      //width: 60%;
      //height: 750px;
      //border: 1px #1890ff solid;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .left {
      min-width: 200px;
      height: 83vh;
      //border-right: 1px #1890ff solid;
      margin-right: 5px;

      .box-item {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .box {
        //width: 250px;
        //height: 22px;
        padding: 10px 25px 10px 25px;
        display: flex;
        justify-self: flex-end;
        margin-top: 10px;
        /* border: 1px red solid; */
      }

      .box:hover {
        background-color: #F8F8F8;
        cursor: pointer;
      }

      .box_select {
        padding: 10px 25px 10px 25px;
        display: flex;
        justify-self: flex-end;
        margin-top: 10px;
        background-color: #F2F2F2;
      }

      .box-item-name {
        width: 230px;
        height: 22px;
        margin-left: 10px;
      }

      .left_up {
        width: 100%;
        height: 450px;
        overflow-y: auto;
        /* border: 1px red solid; */

        .label_title {
          //width: 282px;
          //height: 25px;
          background-color: #f8f8f8;
          font-weight: 600;
          padding: 8px;
        }
      }

      .left_down {
        width: 300px;
        height: 300px;
        overflow-y: auto;
        /* border: 1px green solid; */
      }
    }

    .right {
      //width: 680px;
      height: 83vh;
      /* border-right: 1px #1890ff solid; */
      .right_left {
        width: 50px;
        height: 22px;
        display: flex;
        justify-content: space-between;
        /* border: 1px red solid; */
      }

      .right_left_count {
        /* border: 1px blue solid; */
        padding-left: 10px;
        width: 20px;
      }

      .right_left_del {
        width: 20px;
        padding-left: 10px;
      }

      .right-up {
        width: 50vw;
        height: 45vh;
        overflow-y: scroll;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        /* padding-bottom: 40px; */
        //border-bottom: 1px #1890ff solid;
        .msg-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 50px;

          .msg-down {
            margin-top: 10px;

            .msg-bubble {
              padding: 5px 10px;
              background-color: #eee;
              border-radius: 10%;
              margin: 0 10px;
            }
          }

          .msg-left-down {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 5px;
          }

          .msg-right-down {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-right: 5px;
          }
        }
      }

      .msg_left {
        width: 675px;
        /* padding-left: 5px; */
        margin-top: 5px;
        /* border: 1px #1890ff solid; */
      }

      .msg_left_up {
        height: 25px;
        margin-top: 5px;
      }

      .msg_left_down {
        height: 25px;
        /* border: 1px #1890ff solid; */
        padding-left: 10px;
      }

      .msg_right {
        //width: 660px;
        padding-right: 20px;
        margin-top: 5px;
        /* border: 1px #1890ff solid; */
        text-align: right;
      }

      .msg-sender {
        height: 25px;

      }

      .msg_right_down {
        height: 25px;
        /* border: 1px #1890ff solid; */
        padding-right: 10px;
      }

      .right-down {
        //width: 680px;
        //height: 200px;
        /* border: 1px red solid; */
        .sendButton {
          margin-top: 10px;
        }

        .sendButton-active {
          color: #fff;

        }
      }
    }

  }

}


</style>
