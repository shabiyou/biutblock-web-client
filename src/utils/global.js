const config = {
  url: 'http://54.250.166.137:3002/rpctransfer/callrpc'
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