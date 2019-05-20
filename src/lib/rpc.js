let jaysonBrowserClient = require('jayson/lib/client/browser')
let fetch = require('node-fetch')

let callServer = function (request, callback) {
  var options = {
    method: 'POST',
    mode: 'no-cors',
    body: request, // request is a string
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:1024',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  }
  fetch('http://13.209.3.183:3002', options)
    .then(function (res) { return res.text() })
    .then(function (text) { callback(null, text) })
    .catch(function (err) { callback(err) })
}

class RPC {
  constructor () {
    this.externalServerAddress = '13.209.3.183'
    this.externalServerPort = '3002'
    this.localhostAddress = '127.0.0.1'
    this.localhostPort = '3002'

    this.client = jaysonBrowserClient(callServer, {
    })
  }

  sendTransactions (walletAddress, transferData, fnAfterTransaction) {
    this.client.request('sec_sendRawTransaction', transferData, (err, response) => {
      if (err) return
      if (response.result.status === '1') {
        this.getWalletBalance(walletAddress, fnAfterTransaction)
      }
    })
  }
}

export default RPC
