export default {
  updateAmount (amount, address) {
    var keystoreArr = localStorage.getItem("keystore").split(/},{/).map((item,
        index,arr) => {
        if(arr.length<2){
            return item
        }
        if (index == 0) {
          return item + '}'
        } else if (index == arr.length - 1) {
          return '{' + item
        } else {
          return '{' + item + '}'
        }
    })
    keystoreArr = keystoreArr.map(item=>{
      const keystore = JSON.parse(item)
      if(keystore.address == address){
        keystore.amount = amount
        return keystore
      }
      return keystore
    })
    keystoreArr = JSON.stringify(keystoreArr)
    localStorage.setItem("keystore",keystoreArr.substring(1,keystoreArr.length-1))
  },
  createNewWallet (newWalletPass, userInoAddress,privateInoKey,amount) {
    //存储密码、地址、私钥、余额
    let keystoreArr = localStorage.getItem("keystore") ? localStorage.getItem('keystore').split(/},{/).map((item,
      index,arr) => {
      if(arr.length<2){
          return item
      }
      if (index == 0) {
        return item + '}'
      } else if (index == arr.length - 1) {
        return '{' + item
      } else {
        return '{' + item + '}'
      }
    }) : []
    localStorage.setItem("keystore", [...keystoreArr, JSON.stringify({
      pass: newWalletPass,
      address: userInoAddress,
      privateKey: privateInoKey,
      amount: amount
    })])
  }
}