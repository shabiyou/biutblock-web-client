<template>
  <main class="el-container">
    <!-- 钱包登陆 -->
    <wallet-entren v-if="infoPages == 1" @login = "loginWallet" />
    
    <!-- 登陆成功 -->
    <main class="wallet-background" v-if="infoPages == 2">
      <section class="wallet-info-content">
        <!-- 钱包基本信息 -->
        <wallet-info 
          :infoAddress = "walletAddress"
          :infoKey = "walletKey"
          :infoMoneyC = "walletMoneyC"
          :infoMoneyN = "walletMoneyN" />

        <!-- 钱包二维码 -->
        <wallet-qrcode 
          @createMask = "createdMask" 
          :qrAddress = "walletAddress" />

      </section>
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- 遮罩层 -->
    <info-mask v-show="maskShow" @close = "closeMask"/>
  </main>
</template>

<script>
import contentFooter from '../../components/contentFooter'
import walletEntren from '../../components/walletEntren'
import infoMask from './components/infoMask'
import walletInfo from './components/walletInfo'
import walletQrcode from './components/walletQrcode'
export default {
  name: '',
  components: {
    contentFooter,
    walletEntren,
    infoMask,
    walletInfo,
    walletQrcode
  },
  props: {},
  data () {
    return {
      walletAddress: '',//钱包地址
      walletKey: '',//钱包私钥
      walletMoneyC: "0",//钱包SEC币
      walletMoneyN: "0",//钱包SEN币
      infoPages: 1, //钱包默认显示登陆页面
      maskShow: false, //遮罩层 
    }
  },
  computed: {
    
  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    //取消创建新钱包
    closeMask () {
      this.maskShow = false
    },

    //打开创建钱包
    createdMask () {
      this.maskShow = true
    },

    //登陆钱包
    loginWallet (e) {
      this.infoPages = 2
      this.walletAddress = e.address
      this.walletKey = e.privateKey
      let address = e.address.replace("0x","")
      //查询SEC余额
      this.getWalletBalance (address).then(res=>{
        this.walletMoneyC = this.scientificNotationToString(res)
      })

      //查询SEN余额
      this.getWalletBalanceSEN (address).then(res=>{
        this.walletMoneyN = this.scientificNotationToString(res)
      })
    },

    //讲科学计算法转化成数字
    scientificNotationToString(param) {
      let strParam = String(param)
      let flag = /e/.test(strParam)
      if (!flag) return param

      // 指数符号 true: 正，false: 负
      let sysbol = true
      if (/e-/.test(strParam)) {
        sysbol = false
      }
      // 指数
      let index = Number(strParam.match(/\d+$/)[0])
      // 基数
      let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

      if (sysbol) {
        return basis.padEnd(index + 1, 0)
      } else {
        return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
      }
    },
  },
}
</script>

<style scoped>
  .wallet-info-content {display: flex;justify-content: space-between;flex-wrap: wrap;
    height: 25.5rem;padding: 4.85rem 3.3rem 0;color: #42535B;}

  @media (max-width: 767px) {
    .wallet-info-content  {padding: 1.85rem 1rem 0;height: 28.5rem;}
  }
</style>