<template>
  <main class="el-container">
    <!-- 钱包登陆 -->
    <wallet-entren v-if="!isLogin" @login="loginWallet" />

    <!-- 登陆成功 -->
    <main class="wallet-background" v-if="isLogin">
      <section class="wallet-info-content">
        <!-- 钱包基本信息 -->
        <wallet-info/>

        <!-- 钱包二维码 -->
        <wallet-qrcode @createMask="createdMask" />
      </section>
      <!-- 公共背景底部 -->
      <content-footer />
    </main>

    <!-- 遮罩层 -->
    <info-mask
      v-show="maskShow"
      @close="closeMask" />
  </main>
</template>

<script>
import walletEntren from '../../components/wallet-entren'
import { transcode } from 'buffer';
const contentFooter = () => import("../../components/content-footer")
const infoMask = () => import("./components/wallet-info-mask")
const walletInfo = () => import("./components/wallet-info-text")
const walletQrcode = () => import("./components/wallet-info-qrcode")
export default {
  name: 'walletInformation',
  components: {
    contentFooter,
    walletEntren,
    infoMask,
    walletInfo,
    walletQrcode
  },
  props: {},
  data() {
    return {
      infoPages: 1, //默认显示登陆页面
      maskShow: false, //遮罩层 
    }
  },
  computed: {
    isLogin () {
      if (this.$store.getters.isLogin) {
        this.infoPages = 2
      } else {
        this.infopages = 1
      }
      return this.$store.getters.isLogin
    },
    walletKey () {
      return this.$store.getters.walletKey
    },
    walletAddress () {
      return this.$store.getters.walletAddress
    },
    walletWords () {
      return this.$store.getters.englishWords
    },
    walletPublicKey () {
      return this.$store.getters.publicKey
    },
    inviteCode () {
      return this.$store.getters.inviteCode
    },
    walletMoneyC () {
      return this.$store.getters.walletMoneyC
    },
    walletMoneyN () {
      return this.$store.getters.walletMoneyN
    },
    availableAmount () {
      return this.$store.getters.availibleAmount
    },
    freezeAmount () {
      return this.$store.getters.freezeAmount
    },
    wallet () {
      return this.$store.getters.wallet
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //取消创建新钱包
    closeMask() {
      this.maskShow = false
    },

    //打开创建钱包
    createdMask() {
      this.maskShow = true
    },

    //登陆钱包
    async loginWallet(e) {
      this.$store.commit('login', e)
      this.$store.commit('updateWalletBalance', {
        walletBalance: balance.walletBalance,
        freezeAmount: balance.freezeAmount,
        availibleAmount: balance.availibleAmount,
        walletBalanceSEN: balance.walletBalanceSEN,
        nonce: balance.nonce
      })
      let balance = await this.updateWalletBalance(this.wallet)
    },

    // updateWalletBalance: async function (wallet) {
    //   let address = wallet.address.replace('0x', '')
    //   let walletSEC = await this.getWalletBalance(address, 'biut')
    //   let walletSEN = await this.getWalletBalance(address, 'biu')
    //   let freezeAmount = '0'
    //   let timeLocks = []
    //   let availibleAmount = walletSEC
    //   let poolAddress = []
    //   for (let pool of wallet.mortgagePoolAddress) {
    //     poolAddress.push(pool.replace('0x', ''))
    //   }
    //   for (let pool of wallet.ownPoolAddress) {
    //     poolAddress.push(pool.replace('0x', ''))
    //   }
    //   let contracts = await this.getContractInfoSync(poolAddress)

    //   for (let i = 0; i < contracts.length; i++) {
    //     if (contracts[i].timeLock) {
    //       timeLocks.push(contracts[i].timeLock)
    //     }
    //   }
    //   for (let timelock of timeLocks) {
    //     if (address in timelock && address in timelock[address]) {
    //       let benifits = timelock[address][address]
    //       for (let benifit of benifits) {
    //         freezeAmount = this.cal.accAdd(freezeAmount, benifit.lockAmount)
    //       }
    //     }
    //   }

    //   this.$store.commit('updateWalletBalance', {
    //     walletBalance: walletSEC,
    //     freezeAmount: freezeAmount,
    //     availibleAmount: availibleAmount,
    //     walletBalanceSEN: walletSEN
    //   })

    // }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styless/public";
.wallet-info-content {
  justify-content: space-between;
  @extend %flexWrap;
  height: 25.5rem;
  padding: 4.85rem 3.3rem 0;
  color: $colorTips;
}

@media (max-width: 767px) {
  .wallet-info-content {
    padding: 1.85rem 1rem 0;
    height: auto;
  }
}
</style>