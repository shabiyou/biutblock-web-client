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

      availableAmount: 1000, //可用余额
      freezeAmount: 1000, //冻结金额
      inviteCode: '',//邀请码

      infoPages: 1, //默认显示登陆页面
      maskShow: false, //遮罩层 
    }
  },
  computed: {

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
      //查询SEC余额
      this.getWalletBalance(address, 'biut').then(res => {
        this.walletMoneyC = this.scientificNotationToString(res)
        if (e.mortgagePoolAddress !== '' && e.ownPoolAddress !== '') {
          this.getContractInfo(e.mortgagePoolAddress, (res) => {
            let freezeAmount = 0
            let walletMoneyC = Number(walletMoneyC)
            let availableAmount = Number(walletMoneyC)
            if (res.timeLock && res.timeLock.hasOwnProperty(this.walletAddress) && res.timeLock[this.walletAddress].hasOwnProperty(this.walletAddress)) {
              let benifitAddress = res.timeLock[this.selectedWallet.walletAddress][this.selectedWallet.walletAddress]
              for (let i = 0; i < benifitAddress.length; i++) {
                freezeAmount = freezeMoney + Number(benifitAddress[i].lockAmount)
              }
            }
            this.getContractInfo(e.ownPoolAddress, (res) => {
              if (res.timeLock && res.timeLock.hasOwnProperty(this.walletAddress) && res.timeLock[this.walletAddress].hasOwnProperty(this.walletAddress)) {
                let benifitAddress = res.timeLock[this.walletAddress][this.walletAddress]
                for (let i = 0; i < benifitAddress.length; i++) {
                  freezeMoney = freezeMoney + Number(benifitAddress[i].lockAmount)
                }
              }
              this.freezeAmount = this.scientificNotationToString(freezeAmount)
              this.walletMoneyC = this.scientificNotationToString(walletMoneyC + freezeAmount)
              this.availableAmount = this.scientificNotationToString(availableAmount)
            })
          })
        } else {
          let contractAddress = ''
          if (e.mortgagePoolAddress !== '' && e.ownPoolAddress === '') {
            contractAddress = e.mortgagePoolAddress
          } else if (e.mortgagePoolAddress === '' && e.ownPoolAddress !== '') {
            contractAddress = e.ownPoolAddress
          }
          this.getContractInfo(contractAddress, (res) => {
            let freezeAmount = 0
            if (res.timeLock && res.timeLock.hasOwnProperty(this.walletAddress) && res.timeLock[this.walletAddress].hasOwnProperty(this.walletAddress)) {
              let benifitAddress = res.timeLock[this.walletAddress][this.walletAddress]
              for (let i = 0; i < benifitAddress.length; i++) {
                freezeAmount = freezeAmount + Number(benifitAddress[i].lockAmount)
              }
            }
            this.freezeAmount = this.scientificNotationToString(freezeAmount)
            this.availableAmount = this.walletMoneyC
            this.walletMoneyC = this.scientificNotationToString(freezeAmount + Number(this.availableAmount))
          })
        }
      })

      //查询SEN余额
      this.getWalletBalance(address, 'biu').then(res => {
        this.walletMoneyN = this.scientificNotationToString(res)
      })
    },
  },
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