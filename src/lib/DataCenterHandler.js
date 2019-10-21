const request = require('request')
const dataCenterUrl = "http://test.biut.io:3000/mining-pool/"
const Promise = require('es6-promise').Promise
const DataCenterHandler = {
  createWallet: function (params, callback) {
    request({
      url: `${dataCenterUrl}createwallet`,
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  findOutWallet: function (params, callback) {
    request({
      url: `${dataCenterUrl}finditem`,
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  updateWallet: function (params, callback) {
    request({
      url: `${dataCenterUrl}updatefreezevalue`,
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  updatePoolAddress: function (params, callback) {
    request({
      url: `${dataCenterUrl}updatepooladdress`,
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getAllPool: function (callback) {
    request({
      url: `${dataCenterUrl}getallpools`,
      method: 'POST',
      body: {},
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getRelatedMiners: function (params, callback) {
		request({
			url: `${dataCenterUrl}getrelatedminers`,
			method: 'POST',
			body: params,
			json: true
		}, (err, res, body) => {
			callback(body)
		})
  },

  getRelatedMinersPromise: function (params) {
    return new Promise((resovle, reject) => {
      request({
        url: `${dataCenterUrl}getrelatedminers`,
        method: 'POST',
        body: params,
        json: true
      }, (err, res, body) => {
        if (err) throw reject(err)
        resovle(body)
      })
    })
  },
  
  getMinerLevel: function (params, callback) {
		request({
			url: `${dataCenterUrl}getminertype`,
			method: 'POST',
			body: params,
			json: true
		}, (err, res, body)  => {
			callback(body)
		})
  },
  
  getInvitationDetails: function (params, callback) {
		request({
			url: `${dataCenterUrl}getRewardsHistoryByAddress`,
			method: 'POST',
			body: params,
			json: true
		}, (err, res, body) => {
			callback(body)
		})
  },

  getInvitationDetailsPromise: function (params) {
    return new Promise((resovle, reject) => {
      request({
        url: `${dataCenterUrl}getRewardsHistoryByAddress`,
        method: 'POST',
        body: params,
        json: true
      }, (err, res, body) => {
        if (err) throw reject(err)
        resovle(body)
      })
    })
  },

  joinPool: function (params, callback) {
    request({
      url: `${dataCenterUrl}joinmortgagepool`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getMiningPool: function (params, callback) {
    request({
      url: `${dataCenterUrl}getMiningPool`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getMyTotalReward: function (params, callback) {
    request({
      url: `${dataCenterUrl}getTotalRewardsByAddress`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getMyLastTotalReward: function (params, callback) {
    request({
      url: `${dataCenterUrl}getRewardsByAddress`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getLastProfit: function (params, callback) {
    request({
      url: `${dataCenterUrl}lastProfit`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getTotalProfit: function (params, callback) {
    request({
      url: `${dataCenterUrl}totalProfit`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getProfitHistory: function (params, callback) {
    request({
      url: `${dataCenterUrl}profitHistory`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  },

  getMyPoolProfit: function (params, callback) {
    request({
      url: `${dataCenterUrl}myPoolProfit`,
      method: 'POST',
      body: params,
      json: true
    }, (err, res, body) => {
      callback(body)
    })
  }
}

module.exports = DataCenterHandler
