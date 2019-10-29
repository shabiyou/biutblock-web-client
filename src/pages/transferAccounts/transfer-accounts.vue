<template>
  <main class="el-container" @click="closeAmountList">
    <!-- 钱包登陆 -->
    <wallet-entren v-show="tradingPages === 1" @login="loginWallet" />

    <!-- 填写转账信息 -->
    <main class="wallet-background" v-if="tradingPages === 2">
      <section class="transfer-content">
        <!-- 当前钱包地址 字段 address -->
        <input-list
          class="ipt-m"
          ref=""
          :iptTitle="$t('transfer.youAddress')"
          :iptPlc="$t('transfer.youAddress')"
          :iptRd="true"
          :iptVal="address"
        />

        <!-- 转入钱包地址 -->
        <input-list
          ref="addressModel"
          class="ipt-m"
          :iptTitle="$t('transfer.transferAdddress')"
          :iptPlc="$t('transfer.transferAdddress')"
          :iptLength="42"
          :errorShow="addressError"
          :errorTxt="addressTxt"
          @change="addressChange"
        />

        <transfer-check
          ref="moneyModel"
          :amountBiut="allMoneyC"
          :amountBiu="allMoneyN"
          :tradingMoney="tradingMoney"
          @getAmount="getAmount"
        />

        <!-- 滑块 -->
        <transfer-slider
          ref="feeModel"
          :ststs="allMoneyN"
          :feeVal="feeVal"
          @getFee="getFee"
        />

        <!-- 提交按钮 -->
        <public-button
          class="transfer_btn"
          :disabled="!transferActive"
          :class="transferActive ? 'btn-active' : ''"
          :text="$t('transfer.generateTrading')"
          @click.native="maskShow = true"
        />
      </section>
      
      <!-- 公共背景底部 -->
      <content-footer />
    </main>

    <!-- mask遮罩层 -->
    <transfer-mask
      v-show="maskShow"
      :maskInfo="tradingInfo"
      @close="closeMask"
    />
  </main>
</template>

<script>
import walletEntren from '../../components/wallet-entren'
const contentFooter = () => import("../../components/content-footer")
const publicButton = () => import("../../components/public-button")
const inputList = () => import("../../components/public-input-title")
const transferMask = () => import("./components/transfer-accounts-mask")
const transferSlider = () => import("./components/transfer-accounts-slider")
import transferCheck from './components/transfer-accounts-check'
let fetch = require('node-fetch')
let httpHeaderOption = {
  'content-type': 'application/json'
}
export default {
  name: 'transferAccounts',
  components: {
    contentFooter,
    walletEntren,
    publicButton,
    transferMask,
    inputList,
    transferSlider,
    transferCheck
  },
  props: {},
  data() {
    return {
      tradingPages: 1, //默认显示登陆页面
      maskShow: false,//遮罩层
      address: '', //发款地址
      allMoneyC: "0", //总金额 BIUT
      allMoneyN: "0", //总金额 BIU
      tradingMoney: "0", //biu可转账金额
      walletAddress: '', //收款地址
      walletMoney: '', //转账金额
      feeVal: 0.02,
      transferIdx: 0,
      nonce: '',

      privateKey: '',//当前钱包私钥

      addressTxt: 'transfer.transferAddressError', //地址错误
      addressError: false,
    }
  },
  computed: {
    //转账信息传给子组件（包含所有的转账信息）
    tradingInfo() {
      return [
        {
          fromAddress: this.address, //当前钱包地址
          toAddress: this.walletAddress, //转入钱包地址
          privateKey: this.privateKey, //当前钱包私钥
          transferType: this.transferIdx, //类型 0 BIUT 1 BIU
          transferAmount: this.walletMoney, //转账金额
          transferFee: this.feeVal, //转账手续费
          nonce: this.nonce
        }
      ]
    },

    //转账按钮是否可点击
    transferActive() {
      let address = this.walletAddress.replace(/\s+/g, "") //转账地址

      if (address.length > 0 && address.length < 42) {
        this.addressError = true
        this.addressTxt = 'transfer.transferAddressError'
        return false
      } else if (!(_const.addressReg.test(address)) && address.length == 42) {
        this.addressError = true
        this.addressTxt = 'transfer.transferAddressError'
        return false
      } else if (_const.addressReg.test(address) && address == this.address) {
        this.addressError = true
        this.addressTxt = 'transfer.transferAddressError2'
        return false
      } else {
        this.addressError = false
        //转账SEC
        if (this.transferIdx === 0) {
          return address.length == 42 && this.walletMoney > 0 && address != this.address
            && Number(this.walletMoney) <= Number(this.allMoneyC) && _const.addressReg.test(address)
            && this.feeVal <= this.allMoneyN ? true : false
        } else {
          //转账BIU
          return address.length == 42 && this.walletMoney > 0 && address != this.address
            && Number(this.walletMoney) <= Number(this.tradingMoney)
            && _const.addressReg.test(address) ? true : false
        }
      }
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //登陆钱包
    loginWallet(e) {
      this.tradingPages = 2
      this.address = e.address
      this.privateKey = e.privateKey
      
      let address = e.address.replace("0x", "")
      this.selectMoney(address)

      let nonceData = {
        "jsonrpc": "2.0",
        "id":"1",
        'method': 'sec_getNonce',
        "params": [""+e.address+""]
      }
      fetch(_const.url, {
        method: 'post',
        body: JSON.stringify(nonceData), // request is a string
        headers: httpHeaderOption
      }).then((res) => res.json()).then((text) => {
        this.nonce = JSON.parse(text.body).result.Nonce
      })
    },

    //转账钱包地址
    addressChange(e) {
      this.walletAddress = e
    },

    //转账钱包手续费、可转账biu
    getFee(e) {
      this.feeVal = e
      this.tradingMoney = String(this.getPointNum(this.allMoneyN - e, 8))
    },

    //当前输入的转账金额
    getAmount(e) {
      this.walletMoney = e.amount
      this.transferIdx = e.idx
    },

    //点击其他地方关闭sec、sen选择
    closeAmountList(event) {
      let amountList = document.getElementById('amountListImg')
      if (this.transferListShow && !amountList.contains(event.target)) {
        this.transferListShow = false
      }
    },

    //取消转账
    closeMask(e) {
      /**
       * e maskPages 页面关闭值
       * 
       * 1 取消 2 转账成功
       */
      if (e === 1) {
        this.maskShow = false
      } else {
        this.$refs.addressModel.clearIpt()
        this.$refs.moneyModel.clearIpt()
        this.$refs.feeModel.resetSlider()
        this.maskShow = false
        this.$nextTick(() => {
          this.selectMoney(this.address.replace("0x", ""))
        })
      }
    },

    //查询余额
    selectMoney(address) {
      //查询SEC余额
      this.getWalletBalance(address, 'biut').then(res => {
        this.allMoneyC = this.scientificNotationToString(res.Balance)
      })
      //查询BIU余额
      this.getWalletBalance(address, 'biu').then(res => {
        let amount = this.scientificNotationToString(res.Balance)
        this.allMoneyN = amount
        this.tradingMoney = String(this.getPointNum(amount - this.feeVal, 8))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styless/public";
.transfer-content {
  width: 20.6rem;
  margin: 0 auto;
  height: 25.35rem;
  padding-top: 5rem;
  color: $colorTips;
  font-size: 0.8rem;
  .ipt-m {
    margin-bottom: 1.2rem;
  }
}

@media (max-width: 767px) {
  .transfer-content {
    width: 90%;
    padding-top: 2rem;
    height: auto;
    .money-arr {
      width: 100%;
    }
    .transfer_btn {
      margin-bottom: 1rem;
    }
  }
}
</style>