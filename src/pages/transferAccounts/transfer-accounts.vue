<template>
  <el-container>
    <!-- 白色大背景 -->
    <main>
      <!-- 内容展示区域 -->
      <!-- 查看信息认证 -->
      <el-row>
        <el-col :xs="2" :sm="0" :md="0">&nbsp;</el-col>
        <el-col :xs="20" :sm="24" :md="24">
          <section class="content_list" v-if="transferPages == 1">
            <h2>{{$t('walletInfo.accessWallet')}}</h2>
            <!-- 按钮组 -->
            <section class="radio_arr">
              <section class="radio_box" v-for="(item, index) in radioList" :key="item.id">
                <label class="radio" :class="{'on':item.isChecked}"></label>
                <input class="ipt_radio" 
                  :checked='item.isChecked'
                  @click="checkTab(index)" type="radio"><span>{{ $t(item.value) }}</span>
              </section>
            </section>
        
            <!-- keyStore 登陆 -->
            <section class="key_store" v-if="radioPages == 0">
              <p>{{$t('walletInfo.checkKeyStore1')}}</p>
              <input type="file" :placeholder="$t('walletInfo.checkKeyStore2')" @change="tirggerFile($event)">
              <section>
                <span>{{ $t(KeyStoreVal) }}</span>
              </section>
              <public-ipt-pass 
                  v-if="showPass"
                  v-model.trim="passVal"
                  maxlength="30" 
                  class="mt1"
                  :class="walletPassError?'errorBorder':''"  
                  :placeholder="$t('passTips.passEncryption')" 
                  @input="inputContentPass"></public-ipt-pass>
              <tips-content :tipsTxt="walletPassErrorTxt" v-show="walletPassError"></tips-content>
              <public-btn class="key_store_btn"
                :disabled="!keyStoreActive" :class="keyStoreActive?'btn_active':''"
                @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
            <!-- 私钥登陆 -->
            <section class="private_key" v-if="radioPages == 1">
              <p>{{$t('walletInfo.inputPrivateKey1')}}</p>

              <public-ipt-pass 
                  v-model.trim="privateKeyVal"
                  maxlength="64" 
                  :placeholder="$t('walletInfo.inputPrivateKey2')" 
                  :class="privateKeyError?'errorBorder':''" 
                  @input="inputContentKey"></public-ipt-pass>
              
              <tips-content :tipsTxt="privateKeyErrorTxt" v-show="privateKeyError"></tips-content>
              <public-btn class="private_key_btn"
                :disabled="!privateKeyActive" :class="privateKeyActive?'btn_active':''"
                @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
          </section>
          <!-- 转账信息 -->
          <section class="content_list trading-container" v-if="transferPages == 2">

            <section class="trading-error">
              <span>{{$t('transfer.youAddress')}}</span>
            </section>
            <public-ipt 
              :placeholder="$t('transfer.youAddress')" 
               maxlength="42" 
               class="input-bottom"
               v-model.trim="address" 
               type="text" 
               readonly></public-ipt>
            
            <section class="trading-error">
              <span>{{$t('transfer.transferAdddress')}}</span>
              <span><tips-content :tipsTxt="addressTxt" v-show="addressError"></tips-content></span>
            </section>
            <public-ipt 
              v-model.trim="walletAddress"
              :placeholder="$t('transfer.transferAdddress')" 
              class="input-bottom"
              :class="addressError?'errorBorder':''" 
              maxlength="42" 
              type="text"  
              @input="inputContentAddress"></public-ipt>
            

            <section class="trading-error">
              <span>{{$t('transfer.transferNumber')}}</span>
			        <span><tips-content :tipsTxt="moneyTxt" v-show="moneyShow"></tips-content></span>
            </section>

            <section class="money-arr">
              <public-ipt 
                v-model.trim="walletMoney"
                type="text"
                :placeholder = "$t('transfer.transferNumber')"
                maxlength = "19"
                @input="clearAmount"
                onpaste="return false"/>
              <section>
                <span @click="openTransferList">
                  {{transferCurrency}}
                  <img src="../../assets/images/tradingDown.png"/>
                </span>
                <ul v-show="transferListShow">
                  <li v-for="(item, index) in itemList" 
                      :key="index"
                      :class="transferIdx == index ? 'list-active' : ''"
                      @click="tabTransfer(index, item.cnt)">
                    <span>{{item.cnt}}</span>
                    <img :src="transferIdx == index ? ''+ imgUrl +'' : ''" alt="">
                  </li>
                </ul>
              </section>
            </section>

            <section class="money-list">
              <span>{{$t('transfer.balance')}}：</span>
              <label>{{transferIdx == 0 ? allMoneyC : allMoneyN}}</label>
              <span>{{transferCurrency}}</span>
              <span @click="allTranferMoney">{{$t('transfer.all')}}</span>
            </section>

            

            <section class="trading-error">
              <span>{{$t('transfer.transferPoundage')}}</span>
			        <span><tips-content :tipsTxt="moneyTxtN" v-show="moneyShowN"></tips-content></span>
            </section>
            <section class="transfer-slider">
              <el-slider v-model="feeVal" 
                :show-tooltip="false"
                :step="stepFee"
                :min="minFee"
                :max="maxFee"></el-slider>
              <section>
                <span :class="slowTips ? 'slow-color' : ''">{{$t('transfer.transferSlow')}}</span>
                <span>{{feeVal}} SEN</span>
                <span :class="fastTips ? 'fast-color' : ''">{{$t('transfer.transferFast')}}</span>
              </section>
            </section>
			

            <public-btn class="transfer_btn" 
              :disabled="!transferActive" :class="transferActive?'btn_active':''"
              @click.native="transferFrom">{{$t('transfer.generateTrading')}}</public-btn>

          <!-- 内容展示区域结束 -->
          </section>
        </el-col>
      </el-row>    
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- 遮罩层 -->
    <section v-if="maskShow">
      <section class="mask"></section>
      <!-- 确认转账信息 -->
      <section class="mask_cnt clearfix transfer_mask" v-if="maskPage==1">
        <h3>{{$t('transfer.confirmTransferInfo')}}</h3>
        <ul>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.orderInfo')}}</span>
            <span>{{$t('transfer.transferTxt')}}</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.collectionAddress')}}</span>
            <span>{{ walletAddress }}</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.paymentAddress')}}</span>
            <span>{{ address }}</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.transferPoundage1')}}</span>
            <span>{{ feeVal }} SEN</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.transferAomunt')}}</span>
            <span>{{ walletMoney }} {{transferCurrency}}</span>
          </li>
        </ul>
        <p class="transferError" v-show="transferError">{{$t('transfer.transferError')}}</p>
        <section>
          <button type="button" 
            @click="closeTransfer"
            :disabled="confirmDisabled">
            {{$t('mask.cancel')}}
          </button>
          <button type="button" 
            @click="confirmTransfer"
            :disabled="confirmDisabled"
            :class="confirmDisabled?'confirmDisabled':''">
            {{$t('mask.confirm')}}
          </button>
        </section>
      </section>
      <!-- 操作成功 -->
      <section class="mask_cnt clearfix" v-if="maskPage==2">
        <article>
          <img src="../../assets/images/success.png" alt="">
          {{$t('mask.tips')}}
        </article>
        <a :href="successUrl" target="_blank"> {{ successUrl }} </a>
        <button type="button" @click="closeTransfer">{{$t('mask.confirm')}}</button>
      </section>
    </section>
  </el-container>
</template>

<script>
import contentFooter from '../componentsPublic/content-footer'
import publicIptPass from '../componentsPublic/pubic-ipt-pass'
import publicIpt from '../componentsPublic/pubic-ipt'
import publicBtn from '../componentsPublic/public-btn'
import tipsContent from '../componentsPublic/tips-content'
import tradingCheck from '../../assets/images/tradingCheck.png'
import SECSDK from '../../lib/SECSDK.bundle.js'
import walletMethods from '../../utils/publicMethode.js'
const SECUtil = require('@sec-block/secjs-util')
const CryptoJS = require('crypto-js')
let fetch = require('node-fetch')
let httpHeaderOption = {
  'content-type': 'application/json'
}
export default {
  name: 'transferAccounts',
  data () {
    return {
      walletAddress: '', //转账地址
      walletMoney: '',//转账金额
      address: '', //当前钱包地址
      allMoneyC: 0, //当前钱包总金额	SEC
	    allMoneyN: 0.015,//当前钱包总金额 SEN
      privateKeyErrorTxt: 'walletInfo.invalidPrivateKey',
      walletPassErrorTxt: 'passTips.passError',
      transferPages: 1,//页面相关展示  1 登陆 2 转账
      listChild: true, //默认英文版的长度
      privateKeyError: false,//私钥错误true显示
      walletPassError: false,//密码
      addressError: false,//转账地址无效
      maskShow: false,//遮罩层默认的状态下关闭
      maskPage: 1,//默认先显示确认转账信息
      showPass: false,//默认不显示密码输入框
      radioPages: 0, //keyStore与私钥切换显示  0 显示keyStore  1 显示私钥
      confirmDisabled: false,//确认转账按钮
      transferError: false,//转账失败提示
      KeyStoreVal: 'walletInfo.checkKeyStore2', //绑定keyStore的值
      passVal: '', //绑定pass的值
      privateKeyVal: '', //绑定私钥的值
      addressTxt: 'transfer.transferAddressError',
      moneyTxt: 'transfer.transferMoney',
      moneyShow: false,
      moneyShowN: false,
	    moneyTxtN: 'transfer.transferMoneyN',//SEN silder金额大于余额
      radioList:[
          {
            id: '0',
            value: 'Keystore',
            isChecked: true,
          },
          {
            id: '1',
            value: 'walletInfo.privateKey',
            isChecked: false,
          },
      ],
      successUrl: '',
      KeyStoreUrl: '',

      feeVal: 0.02, //初始值
      minFee: 0.01,//最小值
      maxFee: 0.1, //最大值
      stepFee: 0.00818182, //步长
      allFeeVal: 0,//所有的SEN币种
      fastTips: false,
      slowTips: false,
      transferListShow: false,
      transferCurrency: 'SEC',
      transferIdx: 0,
      imgUrl: tradingCheck,
      itemList: [
        {
          id: '01',
          cnt: 'SEC'
        },
        {
          id: '02',
          cnt: 'SEN'
        }
      ]
    }
  },
  created() {
    
  },
  methods: {
    //keyStore文件登陆 去空
     inputContentPass () {
        this.$nextTick(()=> {
          this.passVal = this.passVal.replace(/[\u4E00-\u9FA5]/g,'')
        })
     },
     //私钥登陆 去空
     inputContentKey () {
       this.$nextTick(()=> {
          this.privateKeyVal = this.privateKeyVal.replace(/[\u4E00-\u9FA5]/g,'')
        })
     },
     //转账地址 去空
     inputContentAddress () {
        this.$nextTick(()=> {
          this.walletAddress = this.walletAddress.replace(/[\u4E00-\u9FA5]/g,'')
        })
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
      } else if (this.walletMoney.indexOf(".") == 0) {
        this.$nextTick(()=> {
          this.walletMoney = String(this.walletMoney).substring(0,9)
        })
      }
    },

    //登陆
    walletInfoForm () {
      //1 私钥登陆  0 keyStore登陆
      if (this.radioPages === 1) {
        let privateVal = this.privateKeyVal.replace(/\s+/g, "")
        let privateKeyBuffer = SECUtil.privateToBuffer(privateVal)
        let extractAddress = SECUtil.privateToAddress(privateKeyBuffer) //返回值
        let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer)
        this.transferPages = 2
        this.address = `0x${extractAddress.toString('hex')}`
        this.privateKeyVal = privateVal
        this.getWalletBalance (`${extractAddress.toString('hex')}`).then(res=>{
          this.allMoneyC = res
        })
        this.getWalletBalanceSEN (`${extractAddress.toString('hex')}`).then(res=>{
          this.allMoneyN = res
          this.allFeeVal = res
        })
      } else {
          let passVal = this.passVal.replace(/\s+/g, "")
          let that = this
          //解锁钱包
          this.$axios.get(''+this.KeyStoreUrl+'').then(function (response) {
                let jsonstr = response.data
                let keyData = CryptoJS.AES.decrypt(jsonstr.toString(), passVal).toString(CryptoJS.enc.Utf8)
                if (response.status == 200) {
                  let walletData = keyData.split(':{')
                  let arrData1 = '{' + walletData[1].replace("}}","") + '}'
                  let arrData = eval('(' + arrData1 + ')')
                  that.address = '0x'+ arrData.walletAddress
                  that.privateKeyVal = arrData.privateKey
                  that.getWalletBalance (arrData.walletAddress).then(res=>{
                    that.allMoneyC = res
                  })
                  that.getWalletBalanceSEN (arrData.walletAddress).then(res=>{
                    that.allMoneyN = res
                    that.allFeeVal = res
                  })
                  that.transferPages = 2
                }
            }).catch(function (error) {
                that.walletPassError = true
            });
      }
    },
    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files; // (利用console.log输出看结构就知道如何处理档案资料)
      if (file.length === 1) {
        this.KeyStoreUrl = this.getObjectURL(file[0]) // 上传钱包获取本地地址
        this.KeyStoreVal = file[0].name
        this.showPass = true
      } else {
        this.KeyStoreVal = 'walletInfo.checkKeyStore2'
        this.passVal = ''
        this.walletPassError = false
        this.showPass = false
      }
    },
    //切换登陆方式
    checkTab (index) {
      this.radioPages = index
      this.radioList.forEach((item) => {
        item.isChecked = false;
      });
      this.radioList[index].isChecked = true;
    },
    //转账
    transferFrom () {
      var walletAddress = this.walletAddress.replace(/\s+/g, "")
      var key = /^[A-Za-z0-9]+$/
      if (!key.test(walletAddress)) {
        this.addressError = true
        return
      }
      this.maskShow = true
      this.addressError = false
      if (this.$i18n.locale == 'zh') {
        this.listChild = false
      } else {
        this.listChild = true
      }
    },
    //全部转出
    allTranferMoney () {
      if (this.transferIdx == 0) {
        this.walletMoney = this.allMoneyC
      } else {
        this.walletMoney = (this.allMoneyN - this.feeVal).toFixed(3)
      }
    },
    //取消转账
    closeTransfer () {
      this.maskPage = 1
      this.maskShow = false
    },
    //确认转账
    confirmTransfer () {
      this.confirmDisabled = true
      let privateVal = this.privateKeyVal //私钥
      let fromAddress = this.address.replace("0x","")  //发送地址
      let toAddress = this.walletAddress.replace(/\s+/g, "").replace("0x","")  //接收地址
      let amount = this.walletMoney.replace(/\s+/g, "")  //转账金额
      let gasFeel = this.feeVal.toString()
      let inputData = 'Test'
      let url = _const.url_sen
      if (this.transferIdx == 0) {
        url = _const.url
      }
      
      //签名
      const transfer = {
        'privateKey': privateVal,
        'from': fromAddress,
        'to': toAddress,
        'value': amount,
        'inputData': inputData
      }
      const tx = JSON.stringify(transfer)
      // transfer转换成json string 然后通过此方法对交易进行签名， 
      let txSigned = JSON.parse(SECSDK.default.txSign(tx))
      txSigned.txFee = gasFeel
      let postData = 
        {
          "method": "sec_sendRawTransaction", //callrpc_sen
          "params": [txSigned]
        }
      let x = delete postData.params[0].contractAddress
      console.log(x)
      fetch(url, {
          method: 'post',
          body: JSON.stringify(postData), // request is a string
          headers: httpHeaderOption
        }).then( (res) => res.json()).then((text) => {
          if (JSON.parse(text.body).result.status == 1) {
            this.maskPage = 2
            this.getWalletBalance (fromAddress).then(res=>{
              this.allMoneyC = res || "0"
            })
            this.getWalletBalanceSEN (fromAddress).then(res=>{
              this.allMoneyN = res
              this.allFeeVal = res
            })
            this.successUrl = "http://scan.secblock.io/accountdetails?address="+fromAddress+""
            this.confirmDisabled = false
            this.walletMoney = ''
            this.walletAddress = ''
            this.feeVal = 0.02
          } else {
            this.transferError = true
            this.confirmDisabled = false
          }
        })
    },
    openTransferList() {
      this.transferListShow = !this.transferListShow
    },

    tabTransfer (index, cnt) {
      this.transferIdx = index
      this.transferCurrency = cnt
      this.transferListShow = false
    }
  },
  components: {
    contentFooter,

    publicIpt,

    publicBtn,

    tipsContent,

    publicIptPass
  },
  computed: {
  
    //转账是否可点击
	  transferActive () {
      let amount = String(this.walletMoney).replace(/\s+/g, "") //当前输入金额
      let address = (this.walletAddress).replace(/\s+/g, "") //转账地址
      let allNumber = (this.allMoneyN - this.feeVal).toFixed(3) // SEN可转账金额

      if (this.feeVal > this.allMoneyN) {
        this.moneyTxtN = 'transfer.transferMoneyN'
        this.moneyShowN = true
      } else if (this.feeVal === 0) {
        this.moneyTxtN = 'transfer.transferMoneyN1'
        this.moneyShowN = true
      } else {
        this.moneyShowN = false
      }
		
      if (address.length > 0 && !(_const.addressReg.test(address)) && address.length < 42) {
        this.addressError = true
        this.addressTxt = 'transfer.transferAddressError'
		    return false
      } else if (_const.addressReg.test(address) && address.length == 42 && address == this.address) {
        this.addressError = true
        this.addressTxt = 'transfer.transferAddressError2'
		    return false
      } else {
        //转账SEC
        if (this.transferIdx === 0) {
          if (amount.length > 0 && amount > this.allMoneyC) {
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
          //转账SEN
          if (amount.length > 0 && amount > allNumber) {
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
    },

    //keyStore按钮是否可点击
    keyStoreActive () {
      let passVal = this.passVal.replace(/\s+/g, "")
      if (passVal.length > 0 && !(_const.passReg.test(passVal))) {
        this.walletPassError = true
      } else {
        this.walletPassError = false
      }
      return _const.passReg.test(passVal)  ? true : false
    },
    
    //私钥按钮是否可点击
    privateKeyActive () {
      let privateKeyVal = this.privateKeyVal.replace(/\s+/g, "")
      if (privateKeyVal.length > 0 && !(_const.priverKeyReg.test(privateKeyVal)) && privateKeyVal.length < 64) {
        this.privateKeyError = true
      } else {
        this.privateKeyError = false
      }
      return privateKeyVal.length == 64 && _const.priverKeyReg.test(privateKeyVal) ? true : false
    },
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
    },
  },
}
</script>

<style scoped>
   main .el-row {height: 30.35rem;}
   .trading-container {padding-top: 100px;}

  .trading-error {display: flex;align-items: center;justify-content: space-between;padding-bottom: 8px;color: #42535B;
    font-size: 16px;}
  .trading-error span:last-child .tips_content {padding-top: 0;}
  .input-bottom {margin-bottom: 24px;}

  .money-arr {width: 412px;border: 1px solid rgba(145,162,170,1);box-sizing: border-box;height: 2.4rem;position: relative;
    display: flex;align-items: center;justify-content: space-between;border-radius: .5rem;
    font-size: 14px;}
  .money-arr input {border: 0;flex: 1;height: 2.2rem;border-radius: .5rem;}
  .money-arr span {padding-right: 20px;display: flex;align-items: center;}
  .money-arr span img {width: 8px;height: 6px;margin-left: 10px;}

  .money-arr ul {position: absolute;top: 2.4rem;right: 0;margin: 0;padding: 0;width:86px;height:64px;border-radius:4px;
    box-shadow:0px 3px 6px rgba(0,0,0,0.16);z-index: 9;}
  .money-arr ul li {display: flex;align-items: center;height: 32px;justify-content: space-between;padding: 0 10px;}
  .money-arr ul li:hover,.money-arr span:hover {cursor: pointer;}
  .money-arr ul li img {width: 16px;height: 16px;}


  .content_list .transfer_btn {margin-top: 48px;}

  .money-list {color: #91A2AA;font-size: 14px;padding: 10px 0 26px;}
  .money-list label {color: #42535B;}
  .money-list span:last-child {color: #00D86D;margin-left: 12px;}
  .money-list span:last-child:hover {cursor: pointer;}
  



  .transfer_mask {margin-top: -6.25rem!important;width: 596px;margin-left: -298px}
  .transfer_mask h3 {font-size: .8rem;color: #42535B;font-weight: 500;padding-bottom: .5rem;margin: 0;
    border-bottom: .05rem solid #CFDEDB;}
  .transfer_mask ul li {color: #42535B;font-size: .7rem;padding-top: .65rem;display: flex;}
  .transfer_mask ul li:first-child {padding-top: .8rem;}
  
  .transfer_mask ul li span:first-child {display: inline-block;color: #91A2AA;}
  .transfer_mask ul li .firstChild {width: 4rem;}
  .transfer_mask ul li .firstChilds {width: 135px;font-size: 14px;}

  .transfer_mask section {float: right;padding-top: 1.5rem;}
  .transfer_mask section button {float: left;}
  .transfer_mask section button:first-child {background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);
    margin-right: .6rem;}

  .transferError {font-size: 16px;color: #EE1C39;padding-top: 10px;}
  .confirmDisabled {background: linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%)!important;}

  .list-active {color: #00D86D;}
  .slow-color {color: #0B7FE6!important;}
  .fast-color {color: #F5A623!important;}


  .transfer-slider section {display: flex;justify-content: space-between;align-items: center;font-size: 14px;box-sizing: border-box;}
  .transfer-slider >>> .el-slider__runway {height: 2px;}
  .transfer-slider >>> .el-slider__bar {background-color: #00D86D;height: 2px;}
  .transfer-slider >>> .el-slider__button {border-color: #00D86D;}
  .transfer-slider >>> .el-slider__button-wrapper {width: 24px;height: 24px;}
</style>