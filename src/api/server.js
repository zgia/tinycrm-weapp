/**
 * 本模块主要用于与服务端进行交互
 */
import ajax from './ajax.js'
import qs from 'qs'

// 通用的get请求
export const get = (url, params) => {
  // console.log('server get', url, params)
  let res = ajax.get(url, qs.stringify(params))
  // console.log('server get', url, res)
  return res
}

// 通用的post请求
export const post = (url, params) => {
  return ajax.post(url, qs.stringify(params))
}

// 通用的delete请求
export const del = (url, params) => {
  return ajax.delete(url, qs.stringify(params))
}

async function requestFunc(url, params) {
  let res = await get(url, params)
  // ...
  return res.data
}

export default {
  requestFunc,
  get,
  post,
  del
}
