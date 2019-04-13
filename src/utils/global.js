const config = {
  url: 'http://54.250.166.137:3001/rpctransfer/callrpc',
  passReg: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/,
  priverKeyReg: /^[A-Za-z0-9]+$/,
  addressReg: /^(0x)(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/
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