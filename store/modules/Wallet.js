import { strictEqual } from "assert"
const dataCenterHandler = require("../../src/lib/DataCenterHandler")
const WalletsHandler = require("../../src/lib/WalletsHandler")

const state = {
	isLogin: false,
	wallet: {
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
		nonce: "",
		invitatedAmount: 0,
		minerLevel: '',
		lastWeekReward: 0,
		myReward: 0,
		rewardList: [],
		poolTimeLock: 0,
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
	minerLevel: state => state.wallet.invitatedAmount,
	lastWeekReward: state => state.wallet.lastWeekReward,
	myReward: state => state.wallet.myReward,
	rewardList: state => state.wallet.rewardList,
	poolTimeLock: state => state.wallet.poolTimeLock,
	poolList: state => state.wallet.pools,
	mortgagePoolAddress: state => state.wallet.mortgagePoolAddress
}

const mutations = {
	login: function (state, wallet) {
		state.isLogin = true
		state.wallet.walletAddress = wallet.address.replace('0x', '')
		state.wallet.walletKey = wallet.privateKey
		state.wallet.walletPublicKey = wallet.publicKey
		state.wallet.ownInvitationCode = wallet.ownInvitationCode
		state.wallet.invitationCode = wallet.invitationCode
		state.wallet.mortgagePoolAddress = wallet.mortgagePoolAddress
		state.wallet.ownPoolAddress = wallet.ownPoolAddress
		state.wallet.mortageValue = wallet.mortgageValue
		state.wallet.role = wallet.role
		state.wallet.englishWords = wallet.englishWords
	},

	logoff: function (state) {
		state.isLogin = false
		state.wallet = {}
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

	insertMyPool: function (state, pool) {
		state.wallet.pools.push(pool)
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
				commit('insertPool', {
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