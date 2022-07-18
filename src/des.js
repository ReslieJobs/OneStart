import CryptoJS from 'crypto-js'
var key = '(#i@x*l%'
var aStrKey = key
var EncryptByDES = function (string, ikey) {
  const KeyHex = ikey ? CryptoJS.enc.Utf8.parse(ikey) : CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(string,
    KeyHex, {
      mode: CryptoJS.mode.ECB, // ecb模式不需要偏移量
      padding: CryptoJS.pad.ZeroPadding
    })
  // console.log(encrypted.ciphertext)
  // let hexstr = encrypted.toString(); // 此方式返回base64
  return encrypted.ciphertext.toString() // 返回hex格式的密文
  // return encrypted.toString()
}
var EncryptByDESNP = function (string, ikey) {
  const KeyHex = ikey ? CryptoJS.enc.Utf8.parse(ikey) : CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(string,
    KeyHex, {
      mode: CryptoJS.mode.ECB, // ecb模式不需要偏移量
      padding: CryptoJS.pad.NoPadding
    })
  // let hexstr = encrypted.toString(); // 此方式返回base64
  return encrypted.ciphertext.toString() // 返回hex格式的密文
  // return encrypted.toString()
}
var DecryptFromDes = function (hexStr, ikey) {
  var KeyHex
  if (ikey !== '') {
    KeyHex = CryptoJS.enc.Utf8.parse(ikey)
    // console.log('key')
  } else {
    KeyHex = CryptoJS.enc.Utf8.parse(aStrKey)
  }
  // 第一步把16进制字符串转为WordArray格式
  const WordArray = CryptoJS.enc.Hex.parse(hexStr)
  // 第二步把WordArray再转为base64的字符串
  const base64str = CryptoJS.enc.Base64.stringify(WordArray)
  // 第三步再进行解密
  const decrypted = CryptoJS.DES.decrypt(base64str, KeyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
    // iv: CryptoJS.enc.Utf8.parse(ivstr)
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
var shortM = function (mdf) {
  var code = mdf.slice(8)
  return code.substring(0, code.length - 8)
}
export {
  EncryptByDES,
  EncryptByDESNP,
  DecryptFromDes,
  shortM
}
