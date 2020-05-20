/**
 * 本模块主要用于与服务端进行交互
 */
import ajax from './ajax.js'
import qs from 'qs'

// 通用的get请求
const get = (url, params) => {
  params = params || {}
  // console.log('server get', url, params, qs.stringify(params))
  return ajax.get(url, qs.stringify(params))
}

// 通用的post请求
const post = (url, params) => {
  params = params || {}
  return ajax.post(url, params)
}

// 通用的delete请求
const del = (url, params) => {
  params = params || {}
  return ajax.delete(url, qs.stringify(params))
}

export default {
  get,
  post,
  del
}
