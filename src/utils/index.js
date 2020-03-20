function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date, sec) {
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

    return `${t1} ${t2}`
  }

  return t1
}

export function log(...data) {
  console.log('📋: ' + new Date().toString(), ...data)
}

export function err(...data) {
  console.error('❌: ' + new Date().toString(), ...data)
}

export function getMilliseconds(day) {
  return (day ? new Date(day) : new Date()).getTime()
}

export default {
  getMilliseconds,
  formatNumber,
  formatTime,
  log,
  err
}
