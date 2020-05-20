const formatNumber = (n) => {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

const formatTime = (date, sec, ms) => {
  date = date || new Date()

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')

  if (sec) {
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    const t3 = ms ? '.' + date.getMilliseconds() : ''

    return `${t1} ${t2}${t3}`
  }

  return t1
}

// 按照格式：2020-04-15 14:33:26.611 返回
const getFullDate = () => {
  return this.formatTime(new Date(), true, true)
}

// 返回带毫秒的时间值
const getTimeWithMs = (day) => {
  return (day ? new Date(day) : new Date()).getTime()
}

// https://blog.csdn.net/seesun2012/article/details/78899522
// 格式化文件大小
const renderSize = (value) => {
  let srcsize = parseFloat(value)
  if (isNaN(srcsize)) {
    return '0B'
  }

  let unitArr = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

  let index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size = srcsize / Math.pow(1024, index)
  size = size.toFixed(1)
  return size + unitArr[index]
}

// https://segmentfault.com/a/1190000022221464
// 检查数据类型
const dataType = (tgt, type) => {
  const dataType = Object.prototype.toString.call(tgt).replace(/\[object (\w+)\]/, '$1').toLowerCase()

  return type ? dataType === type : dataType
}

// 使用wx提供的功能下载并打开文档
const openDoc = (url) => {
  wx.downloadFile({
    url: url,
    success: (res) => {
      console.log('下载文档成功', res)
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        showMenu: true,
        success: (opened) => {
          console.log('打开文档成功', opened)
        },
        fail: (error) => {
          console.log('打开文档失败', error)
        }
      })
    },
    fail: (error) => {
      console.log('下载文档失败', error)
    }
  })
}

export default {
  getFullDate,
  getTimeWithMs,
  formatNumber,
  formatTime,
  renderSize,
  openDoc,
  dataType
}
