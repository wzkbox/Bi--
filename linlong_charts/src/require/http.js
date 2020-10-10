import axios from 'axios' // 引入axios
import { Message } from 'element-ui'
// export const devHttp = '/agent'
export const devHttp = 'http://172.28.51.162:5002'
export const prodHttp = 'http://172.28.51.162:5002'
// 环境的切换
if (process.env.NODE_ENV === 'development') {
	
//配置的默认值/defaults
  axios.defaults.baseURL = devHttp
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = prodHttp
}
//`timeout` 指定请求超时的毫秒数
axios.defaults.timeout = 1000000

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      //Message.error('网络错误')
	  //return Promise.reject(error);
      return Promise.reject(response)
    }
  })
// 服务器状态码不是2开头的的情况
// 这里可以跟你们的后台开发人员协商好统一的错误状态码
// 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
// 下面列举几个常见的操作，其他需求可自行扩展)

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      if (res.status !== 200) Message.error('服务器错误')
      resolve(res.data)
    }).catch(err => {
      Message.error('网络或服务器错误')
      reject(err.data)
    })
  })
}
