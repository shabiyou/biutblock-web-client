const state = {
	isLogin: false,
	wallet: {}
}

const mutation = {
	login: function (wallet) {
		state.isLogin = true
		state.wallet = wallet
	},

	logoff: function () {
		state.isLogin = false
		state.wallet = {}
	},

	updateWalletBalance: function (params) {
		wallet.walletBalance = params.walletBalance
		wallet.availibleAmount = params.availibleAmount
		wallet.freezeAmount = params.freezeAmount
	}
}

const getters = {
	wallet: () => state.wallet
}

export default {
    state,
    mutation,
    getters
}