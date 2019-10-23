import { strictEqual } from "assert"
import WalletsHandler from "../../src/lib/WalletsHandler"
const dataCenterHandler = require("../../src/lib/DataCenterHandler")
const moment = require('moment-timezone')

const state = {
	isLogin: false,
	wallet: {
		walletAddress: "",
		walletKey: "",
		walletPublicKey: "",
		ownInvitationCode: "",
		walletBalance: "-",
		walletBalanceSEN: "-",
		availibleAmount: "-",
		freezeAmount: "-",
    invitationCode: "-",
		englishWords: "",
    mortgagePoolAddress: [],
    ownPoolAddress: [],
    mortgageValue: "0",
		role: "",
		nonce: 0,
		invitatedAmount: "-",
		minerLevel: '',
		lastWeekReward: "-",
		myReward: "-",
		rewardList: [],
		poolTimeLock: "-",
		pools: []
	},
	pools: []
}

const getters = {
	isLogin: state => state.isLogin,
	wallet: state => state.wallet,
	walletAddress: state => state.wallet.walletAddress,
	walletKey: state => state.wallet.walletKey,
	walletPublicKey: state => state.wallet.walletPublicKey,
	englishWords: state => state.wallet.englishWords,
	inviteCode: state => state.wallet.ownInvitationCode,
	walletMoneyC: state => state.wallet.walletBalance,
	walletMoneyN: state => state.wallet.walletBalanceSEN,
	availibleAmount: state => state.wallet.availibleAmount,
	freezeAmount: state => state.wallet.freezeAmount,
	nonce: state => state.wallet.nonce,
	invitatedAmount: state => state.wallet.invitatedAmount,
	minerLevel: state => state.wallet.minerLevel,
	lastWeekReward: state => state.wallet.lastWeekReward,
	myReward: state => state.wallet.myReward,
	rewardList: state => state.wallet.rewardList,
	poolTimeLock: state => state.wallet.poolTimeLock,
	poolList: state => state.wallet.pools,
	mortgagePoolAddress: state => state.wallet.mortgagePoolAddress,
	ownPoolAddress: state => state.wallet.ownPoolAddress
}

const mutations = {
	login: function (state, wallet) {
		state.isLogin = true
		if (state.wallet.walletAddress !== wallet.walletAddress.replace('0x', '')) {
			state.wallet = {
				walletAddress: "",
				walletKey: "",
				walletPublicKey: "",
				onwInvitationCode: "",
				walletBalance: "-",
				walletBalanceSEN: "-",
				availibleAmount: "-",
				freezeAmount: "-",
    		invitationCode: "-",
				englishWords: "",
    		mortgagePoolAddress: [],
    		ownPoolAddress: [],
    		mortgageValue: "0",
				role: "",
				nonce: 0,
				invitatedAmount: "-",
				minerLevel: '4',
				lastWeekReward: "-",
				myReward: "-",
				rewardList: [],
				poolTimeLock: "-",
				pools: []
			}
			state.wallet.walletAddress = wallet.walletAddress.replace('0x', '')
			state.wallet.walletKey = wallet.privateKey
			state.wallet.walletPublicKey = wallet.publicKey
			state.wallet.ownInvitationCode = wallet.ownInvitationCode
			state.wallet.invitationCode = wallet.invitationCode
			state.wallet.mortgagePoolAddress = wallet.mortgagePoolAddress
			state.wallet.ownPoolAddress = wallet.ownPoolAddress
			state.wallet.mortageValue = wallet.mortgageValue
			state.wallet.role = wallet.role
			state.wallet.englishWords = wallet.englishWords
		}
	},

	logoff: function (state) {
		state.isLogin = false
		// state.wallet = {
		// 	walletAddress: "",
		// 	walletKey: "",
		// 	walletPublicKey: "",
		// 	onwInvitationCode: "",
		// 	walletBalance: "-",
		// 	walletBalanceSEN: "-",
		// 	availibleAmount: "-",
		// 	freezeAmount: "-",
    // 	invitationCode: "-",
		// 	englishWords: "",
    // 	mortgagePoolAddress: [],
    // 	ownPoolAddress: [],
    // 	mortgageValue: "0",
		// 	role: "",
		// 	nonce: 0,
		// 	invitatedAmount: 0,
		// 	minerLevel: '',
		// 	lastWeekReward: 0,
		// 	myReward: 0,
		// 	rewardList: [],
		// 	poolTimeLock: 0,
		// 	pools: []
		// }
	},

	updateWalletBalance: function (state, params) {
		state.wallet.walletBalance = params.walletBalance
		state.wallet.availibleAmount = params.availibleAmount
		state.wallet.freezeAmount = params.freezeAmount
		state.wallet.walletBalanceSEN = params.walletBalanceSEN
		state.wallet.nonce = params.nonce
	},

	updateMinerLevel: function (state, {invitatedAmount, minerLevel}) {
		state.wallet.invitatedAmount = invitatedAmount
		state.wallet.minerLevel = minerLevel
	},

	updateLastWeekReward: function (state, lastWeekReward) {
		state.wallet.lastWeekReward = lastWeekReward
	},

	updateMyReward: function (state, myReward) {
		state.wallet.myReward = myReward
	},

	updateRewardList: function (state, list) {
		state.wallet.rewardList = []
		for (let detail of list) {
			let time = WalletsHandler.formatDate(moment(detail.insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
			state.wallet.rewardList.push({
				id: 1,
				poolTime: time,
				poolMoney: `+ ${detail.profit}`
			})
		}
	},

	updatePoolTimeLock: function (state, timelock) {
		state.wallet.poolTimeLock = timelock
	},

	insertMyPool: function (state, pools) {
		state.wallet.pools = pools
	},

	insertPool: function (state) {

	}

}

const actions = {
	updatePoolStuffs ({commit, state}) {
		let address = state.walletAddress
		dataCenterHandler.getMinerLevel({
			address: address
		}, (body) => {
			if (body.status) {
				commit('updateMinerLevel', {invitatedAmount: body.amount, minerLevel: body.minerType})
			}
		})

		dataCenterHandler.getLastProfit({
			address: address
		}, (body) => {
			if (body.status) {
				commit('updateLastWeekReward', body.profit)
			}
		})

		if (state.wallet.role === 'Miner') {
			dataCenterHandler.getTotalProfit({
				address: address
			}, (body) => {
				commit('updateMyReward', body.profit)
			})
		} else {
			dataCenterHandler.getMyPoolProfit({
				address: address
			}, (body) => {
				commit('updateMyReward', body.profit)
			})
		}

		dataCenterHandler.getProfitHistory({
			address: address
		}, (body) => {
			if (body.status) {
				commit('updateRewardList', body.profitHistory)
			}
		})
	},

	getPoolInfo ({commit}, address, balance) {
		dataCenterHandler.getMiningPool({ address: address }, (body) => {
			if (body.status && body.miningPool && body.miningPool.poolName !== '') {
				commit('insertMyPool', {
					id: 0,
					poolName: body.miningPool.poolName,
					poolAddress: infos[i].tokenName.split('-')[1],
					pooolMoney: `${balance}`
				})
			}
		})
	}
}


export default {
    state,
    mutations,
		getters,
		actions
}