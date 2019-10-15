<template>
  <main class="el-container">
    <!-- 钱包登陆 -->
    <wallet-entren v-if="infoPages === 1" @login="loginWallet" />

    <!-- 登陆成功 -->
    <main class="wallet-background" v-if="infoPages === 2">
      <section class="wallet-info-content">
        <!-- 钱包基本信息 -->
        <wallet-info
          :infoAddress="walletAddress"
          :infoKey="walletKey"
          :infoMoneyC="walletMoneyC"
          :infoMoneyN="walletMoneyN"
          :availableAmount="availableAmount"
          :freezeAmount="freezeAmount"
          :inviteCode="inviteCode"
        />

        <!-- 钱包二维码 -->
        <wallet-qrcode :qrAddress="walletAddress" @createMask="createdMask" />
      </section>
      <!-- 公共背景底部 -->
      <content-footer />
    </main>

    <!-- 遮罩层 -->
    <info-mask
      v-show="maskShow"
      :infoAddress="walletAddress"
      :infoKey="walletKey"
      :infoWord="walletWords"
      :infoPublicKey="walletPublicKey"
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
      walletAddress: '',//钱包地址
      walletKey: '',//钱包私钥
      walletPublicKey: '',//钱包公钥
      walletWords: '',//钱包助记词
      walletMoneyC: "0",//钱包SEC币
      walletMoneyN: "0",//钱包SEN币

      availableAmount: "0", //可用余额
      freezeAmount: "0", //冻结金额
      inviteCode: '',//邀请码

      infoPages: 1, //默认显示登陆页面
      maskShow: false, //遮罩层 
    }
  },
  computed: {
    isLogin () {
      if (this.$store.isLogin) {
        this.infoPages = 2
      } else {
        this.infopages = 1
      }
      return this.$store.isLogin
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
    loginWallet(e) {
      this.infoPages = 2
      this.walletAddress = e.address
      this.walletKey = e.privateKey
      this.walletWords = e.englishWords
      this.walletPublicKey = e.publicKey
      this.inviteCode = e.ownInvitationCode
      let address = e.address.replace("0x", "")

      this.$store.commit('login', e)
      //查询SEC余额
      this.getWalletBalance(address, 'biut').then(res => {
        this.walletMoneyC = String(this.scientificNotationToString(res))
        let poolAddress = []
        for (let pool of e.mortgagePoolAddress) {
          poolAddress.push(pool.replace('0x', ''))
        }
        for (let pool of e.ownPoolAddress) {
          poolAddress.push(pool.replace('0x', ''))
        }
        
        this.getContractInfoSync(poolAddress).then((infos) => {
          let freezeAmount = "0"
          let timeLocks = []
          let availableAmount = res
          for (let i = 1; i < infos.length; i++) {
            if (infos[i].timeLock) {
              timeLocks.push(infos[i].timeLock)
            }
          }
          for (let timelock of timeLocks) {
            if (address in timelock && address in timelock[address]) {
              let benifits = timelock[address][address]
              for (let benifit of benifits) {
                freezeAmount = this.cal.accAdd(freezeAmount, benifit.lockAmount)
              }
            }
          }
          this.availableAmount = String(this.scientificNotationToString(res))
          this.walletMoneyC = String(this.scientificNotationToString(this.cal.accAdd(res, freezeAmount)))
          this.freezeAmount = String(this.scientificNotationToString(freezeAmount))
        })
      })

      //查询SEN余额
      this.getWalletBalance(address, 'biu').then(res => {
        this.walletMoneyN = String(this.scientificNotationToString(res))
      })
    },
  },

  updateWalletBalance: function (wallet) {
    let address = wallet.address.replace('0x', '')
    let walletSEC = this.getWalletBalance(address, 'biut')
    let walletSEN = this.getWalletBalance(address, 'biu')
    let freezeAmount = '0'
    let timeLocks = []
    let availibleAmount = walletSEC
    let poolAddress = []
    for (let pool of e.mortgagePoolAddress) {
      poolAddress.push(pool.replace('0x', ''))
    }
    for (let pool of e.ownPoolAddress) {
      poolAddress.push(pool.replace('0x', ''))
    }
    let contracts = this.getContractInfoSync(poolAddress)

    for (let i = 1; i < contracts.length; i++) {
      if (contracts[i].timeLock) {
        timeLocks.push(infos[i].timeLock)
      }
    }
    for (let timelock of timeLocks) {
      if (address in timelock && address in timelock[address]) {
        let benifits = timelock[address][address]
        for (let benifit of benifits) {
          freezeAmount = this.cal.accAdd(freezeAmount, benifit.lockAmount)
        }
      }
    }

    this.$store.commit('updateWalletBalance', )

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