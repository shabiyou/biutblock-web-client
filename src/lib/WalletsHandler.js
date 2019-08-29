const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')

let WalletHandler = {
  getWalletKeys: function () {
    let keys = SECUtil.generateSecKeys()
    let privKey64 = keys.privKey
    let privateKey = privKey64
    let englishWords = SECUtil.entropyToMnemonic(privKey64)
    let pubKey128 = keys.publicKey
    let pubKey128ToString = pubKey128.toString('hex')
    let userAddressToString = keys.secAddress

    return {
      privateKey: privateKey,
      publicKey: pubKey128ToString,
      englishWords: englishWords,
      userAddress: userAddressToString
    }
  },

  fillUpWalletsBalance: function (walletsArr, walletsBalanceJS) {
    if (Object.keys(walletsBalanceJS).length === walletsArr.length) {
      for (let wallet of walletsArr) {
        wallet['walletBalance'] = walletsBalanceJS[wallet.walletName]
      }
    }
  },

  getWalletNamesFromEncrypt: function (encryptedData, pwd) {
    let keyData = CryptoJS.AES.decrypt(encryptedData.toString(), pwd).toString(CryptoJS.enc.Utf8)
    let keyDataJSON = JSON.parse(keyData)
    let walletNamesArr = Object.keys(keyDataJSON)
    return walletNamesArr
  },

  getWalletEncryptedKeys: function (encryptedData, pwd) {
    let keyData = CryptoJS.AES.decrypt(encryptedData.toString(), pwd).toString(CryptoJS.enc.Utf8)
    let keyDataJSON = JSON.parse(keyData)
    return keyDataJSON
  },

  saveKeyStore: function (walletName, walletData, pwd) {
    let ciperData = this.ecryptWalletKeys(JSON.stringify(walletData), pwd)
    let blob = new Blob([ciperData], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${walletName}.json`)
  },

  savePhrase: function (walletName, phrase) {
    let blob = new Blob([phrase], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${walletName}_Phrase.data`)
  },

  savePrivteKey: function (walletName, privateKey) {
    let blob = new Blob([privateKey], {
      type: 'text/plain;charset=utf-8'
    })
    FileSaver.saveAs(blob, `${walletName}_PrivateKey.data`)
  },

  ecryptWalletKeys: function (walletKeys, pwd) {
    return CryptoJS.AES.encrypt(walletKeys, pwd)
  },

  _getKeysFromPrivateKey: function (privateKey, fnAfterImport) {
    try {
      let privateKeyBuffer = SECUtil.privateToBuffer(privateKey)
      let extractAddress = SECUtil.privateToAddress(privateKeyBuffer).toString('hex')
      let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer).toString('hex')
      let extractPhrase = SECUtil.entropyToMnemonic(privateKeyBuffer)
      return {
        walletName: walletName,
        privateKey: privateKey,
        publicKey: extractPublicKey,
        englishWords: extractPhrase,
        walletAddress: extractAddress
      }
    } catch (e) {
      fnAfterImport('error')
    }
  },

  formatDate: function (date, offset) {
    let timezone = 0
    if (offset / -60 >= 0) {
      timezone = `+${offset / -60}`
    } else {
      timezone = `${offset / -60}`
    }
    let time = `${date} GMT${timezone}`
    return time
  }
}

export default WalletHandler
