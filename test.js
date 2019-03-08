
let fetch = require('node-fetch')

let payload = {
    "jsonrpc": "2.0",
    "method": "sec_getTransactions",
    "id": "1",
    "params": ["2cdc4aa6393a58419d2246c153dae59d9cd06884"]
}

let options = {
    method: 'post',
    mode: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
}

fetch('http://13.209.3.183:3002', options).then(res => res.json()).then(json => console.log(json))