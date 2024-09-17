import axios, { AxiosRequestConfig } from 'axios'
import Router from 'next/router'
import message from '@/components/Message'

//基础URL，axios将会自动拼接在url前
const baseURL = process.env.NEXT_PUBLIC_API_URL

//默认请求超时时间
const timeout = 60000

//创建axios实例
const service = axios.create({
  timeout,
  baseURL,
  //如需要携带cookie 该值需设为true
  // withCredentials: true
})

//统一请求拦截 可配置自定义headers 例如 language、token等
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    //配置自定义请求头
    const storageJwtToken = localStorage.getItem('jwt')
    if (storageJwtToken) {
      const currentHeaders = config?.headers || {}
      config.headers = {
        ...currentHeaders,
        Authorization: `${storageJwtToken}`,
      }
    }
    // console.log('config', config);
    return config
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
)

//axios返回格式
interface axiosTypes<T> {
  data: T
  status: number
  statusText: string
}

//后台响应数据格式
export interface responseTypes<T> {
  code: number
  msg: string
  data: T
}

//核心处理代码 将返回一个promise 调用then将可获取响应的业务数据
const requestHandler = <T>(method: 'get' | 'post' | 'put' | 'delete', url: string, params: object = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  let response: Promise<axiosTypes<responseTypes<T>>>
  switch (method) {
    case 'get':
      response = service.get(url, { params: { ...params }, ...config })
      break
    case 'post':
      response = service.post(url, { ...params }, { ...config })
      break
    case 'put':
      response = service.put(url, { ...params }, { ...config })
      break
    case 'delete':
      response = service.delete(url, { params: { ...params }, ...config })
      break
  }

  return new Promise<T>((resolve, reject) => {
    response
      .then((res) => {
        const data: any = res.data
        if (data.code !== 200) {
          // 特定状态码 处理特定的需求
          if (data.code == 401) {
            //TODO
            message.error('Your access token is expired. Please login again.')
            localStorage.removeItem('jwt')
            Router.replace('/campaign')
          }
          if (data.code == 402) {
            //TODO
            message.error('Please log in to get access token')
            Router.replace('/campaign')
          }
          resolve(data)
        } else {
          //数据请求正确 使用resolve将结果返回
          resolve(data.data)
        }
      })
      .catch((error) => {
        console.log(`something went wrong`, error)
        message.error(error.message)
        reject(error)
      })
  })
}

const request = {
  get: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('get', url, params, config),
  post: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('post', url, params, config),
  put: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('put', url, params, config),
  delete: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('delete', url, params, config),
}

export { request }
