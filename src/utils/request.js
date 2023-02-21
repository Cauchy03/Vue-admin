import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 如果携带token 在响应头设置(与后端商量)  
    config.headers['token'] = getToken()
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果你想获取http信息，如请求头或状态
   * 可以return  response => response
  */
  /**
   * 通过自定义代码确定请求状态
   * 也可以通过HTTP状态码来判断状态
   */
  response => {
    const res = response.data
    // 服务器响应失败的回调 code的值可能是200也可能20000
    if (res.code !== 20000 && res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法的token; 50012: 已登录的其他客户端; 50014: token过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        // You have been logged out, you can cancel to stay on this page, or log in again
        MessageBox.confirm('您已登出，您可以取消以留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 相应成功的回调
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
