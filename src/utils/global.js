const config = {
  //url: 'http://test.biut.io/rpctransfer/callrpc',  //测试网络
  url: 'https://scan.biut.io/rpctransfer/callrpc',
  //url_sen: 'http://test.biut.io/rpctransfer/callrpc-sen',  //测试网络
  url_sen: 'https://scan.biut.io/rpctransfer/callrpc-sen',
  
  //url_mapping: 'https://test.biut.io/mapping',
  url_mapping: 'https://scan.biut.io/mapping',
  passReg: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/,
  priverKeyReg: /[0-9a-f]{64}$/,
  addressReg: /^(0x)(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/,
  hashReg: /^(0x)/,
  amountReg: /^(([1-9]\d*)|\d)(\.\d{1,8})?$/,

  websiteUrl: "http://mining.biut.io",
}

let bindToGlobal = (obj, key) => {
  if (typeof window[key] === 'undefined') {
    window[key] = {};
  }

  for (let i in obj) {
    window[key][i] = obj[i]
  }
}
bindToGlobal(config, '_const')