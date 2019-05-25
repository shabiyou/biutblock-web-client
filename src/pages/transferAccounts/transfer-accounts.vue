<template>
  <main class="el-container" @click="closeAmountList">
    <!-- 钱包登陆 -->
    <wallet-entren v-show="tradingPages == 1" @login = "loginWallet" />

    <!-- 填写转账信息 --> 
    <main class="wallet-background" v-if="tradingPages == 2">
      <section class="transfer-content">

        <!-- 当前钱包地址 --> 
        <section class="trading-error">
          <span>{{$t('transfer.youAddress')}}</span>
        </section>
        <public-input 
          v-model.trim="address"
          :placeholder = "$t('transfer.youAddress')"
          maxlength = "42"
          class="input-bottom"
          readonly/>

        <!-- 转入钱包地址 --> 
        <section class="trading-error">
          <span>{{$t('transfer.transferAdddress')}}</span>
          <span><public-tips :tipsTxt="addressTxt" v-show="addressError"/></span>
        </section>
        <public-input 
          v-model.trim="walletAddress"
          :placeholder = "$t('transfer.transferAdddress')"
          class="input-bottom"
          maxlength = "42"/>

        <!-- 转账数量 --> 
        <section class="trading-error">
          <span>{{$t('transfer.transferNumber')}}</span>
          <span><public-tips :tipsTxt="moneyTxt" v-show="moneyShow"/></span>
        </section>

        <!-- 转账数量 - 输入框 --> 
        <section class="money-arr">
          <public-input 
            v-model.trim="walletMoney"
            :placeholder = "$t('transfer.transferNumber')"
            maxlength = "19"
            @input="clearAmount" />
          <section>
            <span @click="openTransferList" id="amountListImg">
              {{transferCurrency}}
              <img src="../../assets/images/tradingDown.png"/>
            </span>
            <ul v-show="transferListShow">
              <li v-for="(item, index) in itemList" 
                  :key="index"
                  :class="transferIdx == index ? 'list-active' : ''"
                  @click="tabTransfer(index, item.cnt)">
                <span>{{item.cnt}}</span>
                <img :src="transferIdx == index ? ''+ imgUrl +'' : ''" v-show="transferIdx == index" alt="">
              </li>
            </ul>
          </section>
        </section>

        <!-- 转账数量 - 转出全部金额 -->  
        <section class="money-list">
          <span>{{$t('transfer.balance')}}：</span>
          <label>{{transferIdx == 0 ? allMoneyC : allMoneyN}}</label>
          <span>{{transferCurrency}}</span>
          <span @click="allTranferMoney">{{$t('transfer.all')}}</span>
        </section>

        <section class="trading-error">
          <span>{{$t('transfer.transferPoundage')}}</span>
          <span><public-tips :tipsTxt="moneyTxtN" v-show="moneyShowN"/></span>
        </section>

        <!-- 转账数量 - BIUT、BIU币种选中 --> 
        <section class="transfer-slider">
          <el-slider v-model="feeVal"
            :max="maxFee"
            :step="stepFee"
            :min="minFee"></el-slider>
          <section>
            <span :class="slowTips ? 'slow-color' : ''">{{$t('transfer.transferSlow')}}</span>
            <span>{{feeVal}} BIU</span>
            <span :class="fastTips ? 'fast-color' : ''">{{$t('transfer.transferFast')}}</span>
          </section>
        </section>

        <!-- 提交按钮 --> 
        <public-button
               class="transfer_btn" 
              :disabled="!transferActive" 
              :class="transferActive ? 'btn-active' : ''"
              :text="$t('transfer.generateTrading')"
              @click.native="maskShow = true" />
      </section>
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- mask遮罩层 -->
    <transfer-mask 
      v-show="maskShow"
      :maskInfo = "tradingInfo"
      @close = "closeMask" />
  </main>
</template>

<script>
import walletEntren from '../../components/walletEntren'
import contentFooter from '../../components/contentFooter'
import publicButton from '../../components/publicButton'
import publicInput from '../../components/publicInput'
import publicTips from '../../components/publicTips'

import transferMask from './components/transferMask'
import tradingCheck from '../../assets/images/tradingCheck.png'
export default {
  name: '',
  components: {
    walletEntren,
    contentFooter,
    publicButton,
    publicInput,
    publicTips,
    transferMask
  },
  props: {},
  data () {
    return {
      address: '', //发款地址
      allMoneyC: 0, //总金额 BIUT
      allMoneyN: 0, //总金额 BIU
      walletAddress: '', //收款地址
      walletMoney: '', //转账金额
      privateKey: '',//当前钱包私钥


      tradingPages: 2, //默认显示登陆页面
      maskShow: false,//遮罩层

      addressTxt: 'transfer.transferAddressError', //地址错误
      addressError: false,
      moneyTxt: 'transfer.transferMoney', //金额错误
      moneyShow: false,
      moneyTxtN: 'transfer.transferMoneyN',//BIU silder金额大于余额
      moneyShowN: false,

      feeVal: 0.02, //初始值
      minFee: 0.01, //最小值
      maxFee: 0.1, //最大值
      stepFee: 0.00818182, //步长
      fastTips: false,
      slowTips: false,

      transferListShow: false,
      transferCurrency: 'BIUT',
      transferIdx: 0,
      imgUrl: tradingCheck,
      itemList: [
        {
          id: '01',
          cnt: 'BIUT'
        },
        {
          id: '02',
          cnt: 'BIU'
        }
      ]
    }
  },
  computed: {
    //转账信息传给子组件（包含所有的转账信息）
    tradingInfo () {
      return [
        {
          fromAddress: this.address, //当前钱包地址
          toAddress: this.walletAddress, //转入钱包地址
          privateKey: this.privateKey, //当前钱包私钥
          transferType: this.transferIdx, //类型 0 BIUT 1 BIU
          transferAmount: this.walletMoney, //转账金额
          transferFee: this.feeVal //转账手续费
        }
      ]
    },

    //转账按钮是否可点击
    transferActive () {
      let amount = String(this.walletMoney).replace(/\s+/g, "") //当前输入金额
      let address = (this.walletAddress).replace(/\s+/g, "") //转账地址
      let allNumber = this.getPointNum(this.allMoneyN - this.feeVal, 8) // BIU可转账金额

      if (this.feeVal > this.allMoneyN) {
        this.moneyTxtN = 'transfer.transferMoneyN'
        this.moneyShowN = true
      } else if (this.feeVal === 0) {
        this.moneyTxtN = 'transfer.transferMoneyN1'
        this.moneyShowN = true
      } else {
        this.moneyShowN = false
      }
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
        //转账SEC
        if (this.transferIdx === 0) {
          if (amount.length > 0 && Number(amount) > Number(this.allMoneyC)) {
            this.moneyShow = true
			      return false
          } else {
            this.moneyShow = false
            this.addressError = false
            return address.length == 42
              && amount > 0
			        && address != this.address
              && amount <= this.allMoneyC
              && _const.addressReg.test(address)
              && 0 < this.feeVal
              && this.feeVal < this.allMoneyN ? true : false
          }
        } else {
          //转账BIU
          if (amount.length > 0 && Number(amount) > Number(allNumber)) {
            this.moneyShow = true
			      return false
          } else {
            this.moneyShow = false
            this.addressError = false
            return address.length == 42
              && amount > 0
			        && address != this.address
              && amount <= allNumber
              && _const.addressReg.test(address)
              && 0 < this.feeVal ? true : false
          }
        }
      }
    }
  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    //登陆钱包
    loginWallet (e) {
      this.tradingPages = 2
      this.address = e.address
      this.privateKey = e.privateKey
      let address = e.address.replace("0x","")
      this.selectMoney (address)
    },

     //转账只能输入金额
    clearAmount () {
      this.$nextTick(()=> {
        this.walletMoney =  this.walletMoney.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        this.walletMoney =  this.walletMoney.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.walletMoney =  this.walletMoney.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
        this.walletMoney =  this.walletMoney.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      })
      if (String(this.walletMoney.length) > 10 && this.walletMoney.indexOf(".") < 0) {
        this.$nextTick(()=> {
          this.walletMoney = String(this.walletMoney).substring(0,10)
        })
      }
      if (this.walletMoney.indexOf(".") == 0) {
        this.$nextTick(()=> {
          this.walletMoney = String(this.walletMoney).substring(0,9)
        })
      } 
    },

    //转出全部金额
    allTranferMoney () {
      if (this.transferIdx == 0) {
        this.walletMoney = this.allMoneyC
      } else {
        this.walletMoney =  this.getPointNum(this.allMoneyN - this.feeVal, 8)
      }
    },

    //截取小数点后 八位
    getPointNum (num,n){  
      let str = String(num);
      let index = str.indexOf(".");
      let str1 = str.substring(0,index+n+1);
      str1 = Number(str1);
      return str1;
    },

    //打开显示列表
    openTransferList() {
      this.transferListShow = !this.transferListShow
    },

    //点击其他地方关闭sec、sen选择
    closeAmountList (event) {
      let amountList = document.getElementById('amountListImg')
      if (this.transferListShow && !amountList.contains(event.target) ) {
        this.transferListShow = false
      }
    },

    //切换显示 BIUT BIU
    tabTransfer (index, cnt) {
      this.transferIdx = index
      this.transferCurrency = cnt
      this.transferListShow = false
    },

    //取消转账
    closeMask (e) {
      /**
       * e maskPages 页面关闭值
       * 
       * 1 取消 2 转账成功
       */
      if (e === 1 ) {
        this.maskShow = false
      } else {
        this.walletAddress = ''
        this.walletMoney = ''
        this.feeVal = 0.02
        this.maskShow = false
        this.$nextTick(() => {
          this.selectMoney (this.address.replace("0x",""))
        })
      }
    },

    //查询余额
    selectMoney (address) {
      //查询SEC余额
      this.getWalletBalance (address).then(res=>{
        this.allMoneyC = res
      })
      //查询BIU余额
      this.getWalletBalanceSEN (address).then(res=>{
        this.allMoneyN = Number(res)
      })
    }
  },
  watch: {
    //监听滚动条变化
    feeVal (newFee, oldFee) {
      if (Number(newFee) > 0.02636364) {
        this.fastTips = true
        this.slowTips = false
      } else if (Number(newFee) < 0.02636364) {
        this.slowTips = true
        this.fastTips = false
      } else {
        this.fastTips = false
        this.slowTips = false
      }
    }

  },
}
</script>

<style scoped>
  .transfer-content {width: 20.6rem;margin: 0 auto;height: 25.35rem;padding-top: 5rem;color: #42535B;
    font-size: .8rem;}
  .trading-error {display: flex;align-items: center;justify-content: space-between;padding-bottom: .4rem;}
  .trading-error span:last-child .tips_content {padding-top: 0!important;}
  .input-bottom {margin-bottom: 1.2rem;}

  .money-arr {width: 20.6rem;border: 0.05rem solid rgba(145,162,170,1);box-sizing: border-box;height: 2.4rem;position: relative;
    display: flex;align-items: center;justify-content: space-between;border-radius: .5rem;
    font-size: .7rem;}
  .money-arr input {border: 0;flex: 1;height: 2.2rem;border-radius: .5rem;}
  .money-arr span {padding-right: 1rem;display: flex;align-items: center;}
  .money-arr span img {width: .4rem;height: .3rem;margin-left: .5rem;}
  ul {position: absolute;top: 2.4rem;right: 0;margin: 0;padding: 0;width: 4.3rem;height: 3.2rem;border-radius: .2rem;
    box-shadow:0 .15rem .3rem rgba(0,0,0,0.16);z-index: 9;background: #fff;}
  ul li {display: flex;align-items: center;height: 1.6rem;justify-content: space-between;padding: 0 .5rem;}
  ul li img {width: .8rem;height: .8rem;}

  .money-list {color: #91A2AA;font-size: .7rem;padding: .5rem 0 1.3rem;}
  .money-list label {color: #42535B;}
  .money-list span:last-child {color: #00D69B;margin-left: .6rem;}


  .list-active {color: #00D69B;}
  .slow-color {color: #0B7FE6!important;}
  .fast-color {color: #F5A623!important;}

  .transfer-slider section {display: flex;justify-content: space-between;align-items: center;font-size: 14px;
    padding-bottom: 43px;}
  .transfer-slider >>> .el-slider__runway {height: 2px;}
  .transfer-slider >>> .el-slider__bar {background-color: #00D69B;height: 2px;}
  .transfer-slider >>> .el-slider__button {border-color: #00D69B;}
  .transfer-slider >>> .el-slider__button-wrapper {width: 24px;height: 24px;top: -13px;}

  @media (max-width: 767px) {
    .transfer-content {width: 90%;padding-top: 2rem;height: auto;}
    .money-arr {width: 100%;}
    .transfer_btn {margin-bottom: 1rem;}
  }
</style>