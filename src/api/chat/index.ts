import axios from "axios";

export type MsgType = {
  recipientUsername: string,
  recipienHeadUrl: string,
  recipienName: string,
  senderUsername: string,
  senderName: string,
  senderHeadUrl: string,
  message: string,
}

export function sendMessageApi(msg: MsgType) {
  return axios({
    baseURL: '/msg',
    url: `/handiraft/chat/sendMessage`,
    method: 'post',
    params:{
      ...msg
    }
  });
}

export function getChatList(username: string) {
  return axios({
    baseURL: '/msg',
    url: `/handiraft/chat/getChatList/${username}`,
    method: 'get'
  });
}
