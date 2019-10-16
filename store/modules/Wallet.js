import { strictEqual } from "assert"

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
    role: ""
	}
}

const getters = {
	isLogin: state => state.isLogin,
	wallet: state => state.wallet,
	walletAddress: state => state.wallet.walletAddress,
	walletKey: state => state.wallet.walletKey,
	walletPublicKey: state => state.wallet.walletPublicKey,
	inviteCode: state => state.wallet.ownInvitationCode,
	walletMoneyC: state => state.wallet.walletBalance,
	walletMoneyN: state => state.wallet.walletBalanceSEN,
	availibleAmount: state => state.wallet.availibleAmount,
	freezeAmount: state => state.wallet.freezeAmount
}

const mutations = {
	login: function (state, wallet) {
		state.isLogin = true
		state.wallet.walletAddress = wallet.address
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
	}
}

const actions = {

}


export default {
    state,
    mutations,
		getters,
		actions
}