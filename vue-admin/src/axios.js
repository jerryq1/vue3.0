import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? '//apigw.gialen.com/h5/req' : '//192.168.137.230:8881/api'
// const baseURL = process.env.NODE_ENV === 'production' ? '/nadmin/' : '//172.30.31.43:1083/nadmin'

/**
 * 请求拦截成功
 * @param config
 * @returns {*}
 */
const requestFulfilled = (config) => {
  // config.headers.common['token'] = localStorage.getItem('token')
  return config
}

/**
 * 请求拦截失败
 * @param config
 * @returns {*}
 */
const requestRejected = (error) => {
  // 对请求错误做些什么
  // Message.error('请求出错')
  return Promise.reject(error)
}

/**
 * 响应拦截成功
 * @param response
 * @returns {Promise<never>|*}
 */
const responseFulfilled = (response) => {
  // 对响应数据做点什么
  const res = response.data
  if (res.code && (res.code !== 200)) {
    if (res.code === 3001 || res.code === 3401) {
      // redirectLogin('验证失效，请重新登录！')
    } else if (res.code === 303) {
      return response.data // 导入
    } else if (res.code === 505) {
      return response.data // 导入
    } else if (res.code === 304) {
      return response.data // 售后取消发货并退款特殊编码
    } else {
      return Promise.reject(res.msg)
    }
  }
  return response.data
}

/**
 * 响应拦截失败
 * @param error
 * @returns {Promise<never>}
 */
const responseRejected = (error) => {
  // 对响应错误做点什么
  // Message.error('返回出错')
  return Promise.reject(error)
}

axios.defaults.baseURL = baseURL
axios.defaults.timeout = 30000

// 添加请求拦截器
axios.interceptors.request.use(requestFulfilled, requestRejected)
// 添加响应拦截器
axios.interceptors.response.use(responseFulfilled, responseRejected)


/**
 * 上传图片
 * @param type
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
// const uploadImage = (type, params) => {
//   return axios.post(`/image/upload/${type}`, params)
// }
const getProductInfo = (params) => {
  return axios.post('/product.getProductSaleAttributeListV3', params)
}
const getProductDetail = (params) => {
  return axios.post('/product.getProductByProductIdV3', params)
}
const getProductImages = (params) => {
  return axios.post('/product.getProductDeatailItemsV1', params)
}



export {
  baseURL,
  getProductInfo,
  getProductDetail,
  getProductImages
}
