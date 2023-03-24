/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
}
/**
 * 注册数据类型
 */
export interface RegisterData {
  username: string,
  nickname: string,
  mobile: string,
  gender: number,
  avatar: string,
  email: string,
  status: string,
  password: string,
  password_confirm: string,
  roleType: string
  [key: string]: any
  /**
   * 验证码Code
   */
  //verifyCode: string;
  /**
   * 验证码Code服务端缓存key(UUID)
   */
  // verifyCodeKey: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  /**
   * 访问token
   */
  accessToken?: string;
  /**
   * 过期时间(单位：毫秒)
   */
  expires?: number;
  /**
   * 刷新token
   */
  refreshToken?: string;
  /**
   * token 类型
   */
  tokenType?: string;
}
