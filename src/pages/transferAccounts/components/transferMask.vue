<template>
  <section class="mask">
    <!-- 确认转账信息 -->
    <section class="mask_cnt clearfix transfer-mask" v-if="maskPage == 1">
      <h3>{{ $t("transfer.confirmTransferInfo") }}</h3>
      <ul>
        <li>
          <span :class="maskWidth ? 'firstChilds' : 'firstChild'">{{$t("transfer.orderInfo")}}</span>
          <span>{{ $t("transfer.transferTxt") }}</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <span :class="maskWidth ? 'firstChilds' : 'firstChild'">{{ $t(item.title) }}</span>
          <span>{{item.cnt}}</span>
        </li>
      </ul>
      <p class="transfer-error" v-show="transferError">
        {{ $t("transfer.transferError") }}
      </p>
      <section>
        <button
          type="button"
          @click="closeTransfer"
          :disabled="confirmDisabled">
          {{ $t("mask.cancel") }}
        </button>
        <button
          type="button"
          @click="confirmTransfer"
          :disabled="confirmDisabled"
          :class="confirmDisabled ? 'confirm-disabled' : ''">
          {{ $t("mask.confirm") }}
        </button>
      </section>
    </section>

    <!-- 操作成功 -->
    <section class="mask_cnt clearfix" v-if="maskPage == 2">
      <article>
        <img src="../../../assets/images/success.png" alt="" />
        {{ $t("mask.tips") }}
      </article>
      <a :href="successUrl" target="_blank"> {{ successUrl }} </a>
      <button type="button" @click="closeTransfer">
        {{ $t("mask.confirm") }}
      </button>
    </section>
  </section>
</template>

<script>
import SECSDK from '../../../lib/SECSDK.bundle.js'
let fetch = require('node-fetch')
let httpHeaderOption = {
  'content-type': 'application/json'
}
export default {
  name: '',
  props: {
    maskInfo: Array
  },
  data() {
    return {
      maskPage: 1,
      transferError: false, //转账错误
      confirmDisabled: false, //确认转账按钮
      successUrl: ''
    }
  },
  computed: {
    maskWidth () {
      if (this.$i18n.locale == 'zh') {
        return false
      } else {
        return true
      }
    },

    amountType() {
      return this.maskInfo[0].transferType === 0 ? 'BIUT' : 'BIU'
    },

    itemList() {
      return  [
        {
          id: '02',
          title: 'transfer.collectionAddress',
          cnt: this.maskInfo[0].toAddress
        },
        {
          id: '03',
          title: 'transfer.paymentAddress',
          cnt: this.maskInfo[0].fromAddress
        },
        {
          id: '04',
          title: 'transfer.transferPoundage1',
          cnt: this.maskInfo[0].transferFee + ' BIU'
        },
        {
          id: '05',
          title: 'transfer.transferAomunt',
          cnt: this.maskInfo[0].transferAmount + ' ' + this.amountType
        }
      ]
    }
  },
  methods: {
    //取消转账
    closeTransfer () {
      this.$emit('close', this.maskPage)
      this.maskPage = 1
    },
    
    //确认转账
    confirmTransfer () {
      this.confirmDisabled = true
      let privateVal = this.maskInfo[0].privateKey //钱包私钥
      let fromAddress = this.maskInfo[0].fromAddress.replace("0x","") //发送地址
      let toAddress = this.maskInfo[0].toAddress.replace("0x","") //接收地址
      let amount = this.maskInfo[0].transferAmount //转账金额
      let fee = this.maskInfo[0].transferFee.toString() //手续费
      let tradingType = this.maskInfo[0].transferType //转账类型 0 BIUT 1 BIU
      let inputData = 'Test'
      
      let url = _const.url 
      if (tradingType == 1) {
        url = _const.url_sen
      }

      //签名
      const transfer = {
        'privateKey': privateVal,
        'from': fromAddress,
        'to': toAddress,
        'value': amount,
        'inputData': inputData,
        'gas': fee
      }
      const tx = JSON.stringify(transfer)
      // transfer转换成json string 然后通过此方法对交易进行签名， 
      let txSigned = JSON.parse(SECSDK.default.txSign(tx))
      let postData = {
          "method": "sec_sendRawTransaction",
          "params": [txSigned]
        }
      delete postData.params[0].contractAddress //删除 contractAddress 字段
      fetch(url, {
          method: 'post',
          body: JSON.stringify(postData), // request is a string
          headers: httpHeaderOption
        }).then( (res) => res.json()).then((text) => {
          if (JSON.parse(text.body).result.status == 1) {
            this.maskPage = 2
            if (this.transferIdx == 0) {
              this.successUrl = "http://scan.secblock.io/accountdetails?address="+fromAddress+""
            } else {
              this.successUrl = "http://scan.secblock.io/sen/accountdetails?address="+fromAddress+""
            }
            this.confirmDisabled = false
          } else {
            this.transferError = true
            this.confirmDisabled = false
          }
        })
    }
  },
  created() {
    
  }
}
</script>

<style scoped>
  .transfer-error {font-size: .8rem;color: #EE1C39;padding-top: 10px;}
  .confirm-disabled {background: linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%)!important;}


  .transfer-mask {width: 29.8rem;}
  .transfer-mask h3 {font-size: .8rem;color: #42535B;font-weight: 500;padding-bottom: .5rem;margin: 0;
    border-bottom: .05rem solid #CFDEDB;}
  .transfer-mask ul {padding: 0;}
  .transfer-mask ul li {color: #42535B;font-size: .7rem;padding-top: .65rem;display: flex;flex-wrap: wrap;}
  .transfer-mask ul li:first-child {padding-top: .8rem;}
  
  .transfer-mask ul li span:first-child {display: inline-block;color: #91A2AA;}
  .transfer-mask ul li .firstChild {width: 4rem;}
  .transfer-mask ul li .firstChilds {width: 6.75rem;font-size: .7rem;}

  .transfer-mask section {float: right;padding-top: 1.5rem;}
  .transfer-mask section button {float: left;}
  .transfer-mask section button:first-child {background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);
    margin-right: .6rem;}

  @media (max-width: 767px) {
    .transfer-mask {width: 80%;}
  }
</style>