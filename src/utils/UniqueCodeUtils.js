import CryptoJS from 'crypto-js'

export const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 6)
}

const generateHash = (input) => {
  return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex)
}

export const generateUniqueCode = (eventTitle) => {
  if (!eventTitle) {
    return ''
  }

  const hash = generateHash(eventTitle)
  const uniqueCode = hash.substring(0, 4)
  const year = new Date().getFullYear()
  const uniqueId = generateUniqueId()

  return `${uniqueCode}-${year}-${uniqueId}`
}
