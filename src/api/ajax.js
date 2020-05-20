/**
 * http请求拦截器
 *
 * https://segmentfault.com/a/1190000012403236
 */

import cfg from './config'
import utils from '@/utils/index'

Promise.prototype.finally = function (callback) {
  var Promise = this.constructor
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value
        }
      )
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason
        }
      )
    }
  )
}

const Fly = require('flyio/dist/npm/wx')

// Wepy2, 使用@wepy/plugin-define解决这个问题
const ajaxUrl = cfg.host()

let fly = new Fly()
let loginFly = new Fly()
// 定义公共headers
const headers = {
  'content-type': 'application/json',
  'Neo-AJAX': 1,
  'X-Tag': 'TinyCRM'
}

// 管理Token
const headerAuth = {
  setToken: (token) => {
    if (token) {
      headers.authorization = cfg.bearerToken(token)
    }
  },

  getToken: () => {
    return headers.authorization
  },

  deleteToken: () => {
    delete headers.authorization
  }
}

headerAuth.setToken(cfg.token())

Object.assign(fly.config, {
  headers: headers,
  baseURL: ajaxUrl,
  timeout: 10000,
  withCredentials: true
})

loginFly.config = fly.config

// session失效后本地重新登录
const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        // console.log(`[${utils.getFullDate()}]wx-login`, res)

        wx.removeStorageSync('token')
        wx.removeStorageSync('username')
        headerAuth.deleteToken()

        loginFly
          .post('api/signin', { code: res.code })
          .then(logined => {
            if (logined.data.code === 0 && cfg.isTokenStr(logined.data.data.token)) {
              wx.setStorageSync('token', logined.data.data.token)
              wx.setStorageSync('username', logined.data.data.username)

              headerAuth.setToken(logined.data.data.token)
              cfg.setToken(logined.data.data.token)

              resolve(logined.data)
            } else {
              reject(logined.data)
            }
          })
          .catch(error => {
            // console.error(`[${utils.getFullDate()}]wx-login`, error)
            reject(error)
          })
      },
      fail: error => {
        wx.showToast({ title: error.errMsg, icon: 'none' })
        reject(error)
      }
    })
  })
}

// 请求拦截器
// https://wendux.github.io/dist/#/doc/flyio/interceptor
fly.interceptors.request.use(
  request => {
    // console.log(`[${utils.getFullDate()}]req: ${request.url}`, request)

    // 有Token
    if (headerAuth.getToken()) {
      return request
    }

    // console.log(`[${utils.getFullDate()}]req: ${request.url}, 没有token，先请求token...`)

    // 锁定当前实例，后续请求会在拦截器外排队
    fly.lock()

    return login()
      .then(d => {
        // console.log(`[${utils.getFullDate()}]req: ${request.url}`, d)

        // 只有最终返回request对象时，原来的请求才会继续
        request.headers.authorization = cfg.bearerToken(d.data.token)

        // console.log(`[${utils.getFullDate()}]req: ${request.url}`, request)
        return request
      })
      .catch(error => {
        console.error(`[${utils.getFullDate()}]req: ${request.url}`, error)

        return request
      })
      .finally(() => {
        // 解锁后，会继续发起请求队列中的任务
        fly.unlock()
      })
  },
  error => {
    console.error(`[${utils.getFullDate()}]req`, error)

    Promise.reject(error)
  }
)

// 响应拦截器
let respRenewToken = null
fly.interceptors.response.use(
  function (resp) {
    // console.log(`[${utils.getFullDate()}]resp: ${resp.request.url}`, resp)
    return resp.data
  },
  function (err) {
    console.error(`[${utils.getFullDate()}]resp: ${err.request.url}`, err)

    // 用户验证失败
    if (err.status === 401) {
      if (respRenewToken) {
        err.request.headers.authorization = 'Bearer ' + respRenewToken

        return fly.request(err.request)
      } else {
        console.error(`[${utils.getFullDate()}]resp: ${err.request.url}, token失效，重新请求token...`)

        this.lock()
        return login()
          .then(d => {
            respRenewToken = d.data.token
            console.error(`[${utils.getFullDate()}]resp: ${err.request.url}, token已更新，值为: ${d.data.token}`)
            err.request.headers.authorization = 'Bearer ' + d.data.token
          })
          .finally(() => this.unlock())
          .then(() => {
            console.error(`[${utils.getFullDate()}]resp: 重新请求，path:${err.request.url}，baseURL:${err.request.baseURL}`)

            return fly.request(err.request)
          })
      }
    } else {
      wx.showToast({
        title: '出现未知错误' + (err.status ? err.status : ''),
        icon: 'none',
        duration: 3000
      })
    }
  }
)

export default fly
