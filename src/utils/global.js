const config = {
  url: 'http://scan.secblock.io/rpctransfer/callrpc',
  url_sen: 'http://scan.secblock.io/rpctransfer/callrpc-sen',
  passReg: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/,
  priverKeyReg: /[0-9a-f]{64}$/, 
  addressReg: /^(0x)(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/,
  hashReg: /^(0x)/,
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