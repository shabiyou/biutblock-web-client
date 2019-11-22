<template>
  <section class="mask">
    <!-- 确认转账信息 -->
    <section class="mask_cnt clearfix transfer-mask" v-if="maskPage == 1">
      <h3>{{ $t("transfer.confirmTransferInfo") }}</h3>

      <!-- 确认详细信息列表 -->
      <ul>
        <li>
          <span :class="maskWidth ? 'firstChilds' : 'firstChild'">{{
            $t("transfer.orderInfo")
          }}</span>
          <span>{{ $t("transfer.transferTxt") }}</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <span :class="maskWidth ? 'firstChilds' : 'firstChild'">{{
            $t(item.title)
          }}</span>
          <span>{{ item.cnt }}</span>
        </li>
      </ul>
      <p class="transfer-error" v-show="transferError">
        {{ $t("transfer.transferError") }}
      </p>

      <!-- 确认按钮 -->
      <section>
        <button
          type="button"
          @click="closeTransfer"
          :disabled="confirmDisabled"
        >
          {{ $t("mask.cancel") }}
        </button>
        <button
          type="button"
          @click="confirmTransfer"
          :class="confirmDisabled ? 'cantClick' : ''"
          :disabled="confirmDisabled"
        >
          {{ $t(confrimButton) }}
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
const SECUtil = require('@biut-block/biutjs-util')
let fetch = require('node-fetch')
let httpHeaderOption = {
  'content-type': 'application/json'
}
export default {
  name: 'transferAccountsMask',
  props: {
    maskInfo: Array
  },
  data() {
    return {
      maskPage: 1,
      transferError: false, //转账错误
      confirmDisabled: false, //确认转账按钮
      successUrl: '',
      confrimButton: 'mask.confirm'
    }
  },
  computed: {
    maskWidth() {
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
      return [
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
        },
        {
          id: "06",
          title: "transfer.transferInputData",
          cnt: this.maskInfo[0].inputData
        }
      ]
    }
  },
  methods: {
    //取消转账
    closeTransfer() {
      this.$emit('close', this.maskPage)
      this.maskPage = 1
    },

    //确认转账
    confirmTransfer() {
      this.confrimButton = 'mask.confirms'
      this.confirmDisabled = true
      this.transferError = false
      let privateVal = this.maskInfo[0].privateKey //钱包私钥
      let fromAddress = this.maskInfo[0].fromAddress.replace("0x", "") //发送地址
      let toAddress = this.maskInfo[0].toAddress.replace("0x", "") //接收地址
      let amount = this.maskInfo[0].transferAmount.replace(/,/gm, "") //转账金额
      let fee = this.maskInfo[0].transferFee.toString() //手续费
      let tradingType = this.maskInfo[0].transferType //转账类型 0 BIUT 1 BIU
      let nonce = this.maskInfo[0].nonce
      let inputData = this.maskInfo[0].inputData

      let url = _const.url
      if (tradingType == 1) {
        url = _const.url_sen
      }
      

      //签名
      const transfer = {
        "timeStamp": new Date().getTime(),
        'walletAddress': fromAddress,
        'sendToAddress': toAddress,
        'amount': amount,
        'txFee': '0',
        'gasLimit': '0',
        'gas': '0',
        'gasPrice': '0',
        'data': '',
        "nonce": nonce,
        'inputData': inputData,
        'chainName': tradingType === 0 ? 'SEC' : 'SEN'
      }
      const tx = JSON.stringify(transfer)
      let signedTx = this._signedTx(privateVal, transfer)
      let postData = {
          "method": "sec_sendRawTransaction",
          "id": "1",
          "jsonrpc": "2.0",
          "params": signedTx
        }
      fetch(url, {
          method: 'post',
          body: JSON.stringify(postData), // request is a string
          headers: httpHeaderOption
        }).then((res) => res.json()).then((result) => {
          this.confirmDisabled = false
          this.confrimButton = 'mask.confirm'
          if (JSON.parse(result.body).result) {
            let txHash = JSON.parse(result.body).result.txHash
            this.maskPage = 2
            if (tradingType == 0) {
              this.successUrl = "https://scan.biut.io/tokentxdetails?hash=" + txHash + ""
            } else {
              this.successUrl = "https://scan.biut.io/sen/tokentxdetails?hash=" + txHash + ""
            }
          } else {
            this.transferError = true
          }
        })
    },

    _signedTx: function (privateKey, transfer) {
      let timeStamp = new Date().getTime()
      let transferData = [{
        timestamp: timeStamp,
        from: transfer.walletAddress,
        to: transfer.sendToAddress,
        value: transfer.amount,
        txFee: transfer.txFee,
        nonce: transfer.nonce,
        gasLimit: '0',
        gas: '0',
        gasPrice: '0',
        data: '',
        inputData: transfer.inputData,
        chainName: transfer.chainName
      }]
      const tokenTxBuffer = [
        SECUtil.bufferToInt(transferData[0].timestamp),
        Buffer.from(transferData[0].from, 'hex'),
        Buffer.from(transferData[0].to, 'hex'),
        Buffer.from(transferData[0].value),
        Buffer.from(transferData[0].gasLimit),
        Buffer.from(transferData[0].gas),
        Buffer.from(transferData[0].gasPrice),
        Buffer.from(transferData[0].nonce),
        Buffer.from(transferData[0].inputData),
        Buffer.from(transferData[0].chainName)
      ]
      let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
      let signature = SECUtil.ecsign(txSigHash, Buffer.from(privateKey, 'hex'))
      transferData[0].data = {
        v: signature.v,
        r: signature.r.toString('hex'),
        s: signature.s.toString('hex')
      }
      return transferData
    }
  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.transfer-error {
  font-size: 0.8rem;
  color: $colorRed;
  padding-top: 10px;
}
.confirm-disabled {
  background: linear-gradient(90deg, #c2c2c2 0%, #a5a5a5 100%) !important;
}

.transfer-mask {
  width: 29.8rem;
  h3 {
    font-size: 0.8rem;
    color: $colorTips;
    font-weight: 500;
    padding-bottom: 0.5rem;
    margin: 0;
    @include border($c: #e6e6e6, $d: bottom);
  }
  ul {
    padding: 0;
    li {
      color: $colorTips;
      font-size: 0.7rem;
      padding-top: 0.65rem;
      @extend %flexWrap;
      &:first-child {
        padding-top: 0.8rem;
      }
      span {
        &:first-child {
          display: inline-block;
          color: $colorGray2;
        }
      }
      .firstChild {
        width: 4rem;
      }
      .firstChilds {
        width: 6.75rem;
        font-size: 0.7rem;
      }
    }
  }
  section {
    float: right;
    padding-top: 1.5rem;
    button {
      float: left;
      &:first-child {
        background: linear-gradient(90deg, #c2c2c2 0%, #a5a5a5 100%);
        margin-right: 0.6rem;
      }
    }
  }
}

@media (max-width: 767px) {
  .transfer-mask {
    width: 80%;
  }
}
</style>