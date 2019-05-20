const config = {
  url: 'http://54.250.166.137:3001/rpctransfer/callrpc',
  url_sen: 'http://54.250.166.137:3001/rpctransfer/callrpc-sen',
  passReg: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/,
  priverKeyReg: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/,
  addressReg: /^(0x)(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/,
  amountReg: /^(([1-9]\d*)|\d)(\.\d{1,8})?$/,
}

let bindToGlobal = (obj, key) => {
   if (typeof window[key] === 'undefined') {
       window[key] = {};
   }

   for (let i in obj) {
       window[key][i] = obj[i]
   }
}
bindToGlobal(config,'_const')