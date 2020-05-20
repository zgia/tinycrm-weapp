const config = {
  'Host': {
    'development': 'http://crm.cn',
    'production': 'http://crm.cn',
    'test': ''
  },
  'token': wx.getStorageSync('token')
}

const host = () => {
  return process.env.NODE_ENV === 'production'
    ? config.Host.production
    : config.Host.development
}

const isTokenStr = (token) => {
  return token && token.length > 100
}

const token = () => {
  if (!config.token) {
    console.error('!config.token')
    setToken(wx.getStorageSync('token'))
  }

  return isTokenStr(config.token) ? config.token : ''
}

const bearerToken = (_token) => {
  let tk = _token || token()

  return tk ? 'Bearer ' + tk : ''
}

const setToken = (token) => {
  console.info('setToken', token)
  config.token = token
}

export default {
  host,
  isTokenStr,
  token,
  bearerToken,
  setToken
}
