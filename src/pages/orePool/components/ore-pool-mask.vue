<template>
  <section class="mask">
    <!-- 已经加入过的弹窗 -->
    <section class="mask_cnt"  v-show="maskPage === 1">
      <section class="join-content clearfix">
        <p>{{ $t('mask.poolTips') }}</p>
        <figure>
          <img src="../../../assets/images/errorImg.png" alt="" />
          <figcaption>{{ $t('mask.poolTxt') }}</figcaption>
        </figure>
        <button type="button" @click="close">{{ $t('mask.poolBtn') }}</button>
      </section>
    </section>

    <!-- 申请加入的弹窗 -->
    <section class="mask_cnt apply-mask" v-show="maskPage === 2">
      <section class="join-container">
        <header>
          <span>{{ $t('pool.poolIndexTit2') }}</span>
          <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
        </header>
        <section class="error-list">
          <p class="join-txt1">{{ $t('mask.poolNumber') }} <label>*</label></p>
        </section>
        <section class="ipt-list">
          <input type="text" placeholder="10,000.00" v-model="joinIpt" @input="clearAmount"/>
          <span>BIUT</span>
        </section>
        <p class="join-txt-all">
          {{ $t('transfer.balance') }}：{{ totalMoney | currency("") }}  BIUT
          <span @click="allMoney">{{ $t('transfer.all') }}</span>
        </p>
        <p class="join-txt2">{{ $t('mask.poolTxt1') }}</p>
        <p class="join-txt3">{{ $t('mask.poolNumberError') }}</p>
        <public-button 
          :text="$t('mask.poolBtn1')"
          :class="joinBtn ? 'btn-active' : ''"
          :disabled="!joinBtn"
          @click.native="joinFrom"/>
      </section>
    </section>
  </section>
</template>

<script>
import publicButton from '../../../components/public-button'
let fetch = require('node-fetch')
let dataCenterHandler = require('../../../lib/DataCenterHandler')
let httpHeaderOption = {
  'content-type': 'application/json'
}
export default {
  name: '',
  components: {
    publicButton
  },
  props: {
    maskPage: Number,
    nounce: Number,
    selectedItem: Object,
    address: String,
    privateKey: String
  },
  data() {
    return {
      joinIpt: '',
      totalMoney: "10000"
    }
  },
  mounted() {
    //查询可用余额
    // this.getWalletBalance(this.address, 'biut').then(res => {
    //   this.totalMoney = this.scientificNotationToString(res)
    // })
  },
  computed: {
    joinBtn () {
      let ipt = this.joinIpt.replace(/\s+/g, "")
      return 10000 <= ipt &&  ipt <= Number(this.totalMoney) ? true : false
    }
  },
  methods: {
    close () {
      this.$emit('close')
      this.joinIpt = ''
    },

    joinFrom () {
      /**
       * 确认加入矿池
       * 
       * 加入成功 调用 close() 关闭弹窗
       */
      
      let ipt = this.joinIpt.replace(/\s+/g, "")
      let sourceCode = `lock( "${this.address}", ${ipt}, ${365 * 24 * 3600 * 1000})`.toString('base64')
      sourceCode = JSON.stringify({callCode: Buffer.from(sourceCode).toString('base64')})
      const transfer = {
        "timeStamp": new Date().getTime(),
        'walletAddress': this.address,
        'sendToAddress': this.selectedItem.poolAddress,
        'amount': ipt,
        'txFee': '0',
        'gasLimit': '0',
        'gas': '0',
        'gasPrice': '0',
        'data': '',
        "nonce": this.nonce,
        'inputData': sourceCode
      }
      const tx = JSON.stringify(transfer)
      // transfer转换成json string 然后通过此方法对交易进行签名，
      //let txSigned = JSON.parse(SECSDK.default.txSign(tx))
      let txBody = {
        "method": "sec_sendContractTransaction",
        "params": [{
          "companyName": "coinegg",
          "privateKey": this.privateKey,
          "transfer": transfer
        }]
      }
      fetch(url, {
        method: 'post',
        body: JSON.stringify(txBody),
        headers: httpHeaderOption
      }).then((res) => res.json()).then((text) => {
        let signedTx = JSON.parse(text.body).result.signedTrans
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
        }).then((res) => res.json()).then((text) => {
          if (JSON.parse(text.body).result.status == 1) {
            this.close() 
            dataCenterHandler.joinPool({
              address: this.address,
              mortgagePoolAddress: this.selectedItem.poolAddress,
              mortgageValue: ipt
            }, (body) => {

            })    
          }
        })
      })
    },

    //转出全部金额
    allMoney() {
      this.joinIpt = this.totalMoney
    },

    //转账只能输入金额
    clearAmount() {
      this.$nextTick(() => {
        this.joinIpt = this.joinIpt.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        this.joinIpt = this.joinIpt.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.joinIpt = this.joinIpt.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        this.joinIpt = this.joinIpt.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只能输入两个小数  
      })
      if (String(this.joinIpt.length) > 10 && this.joinIpt.indexOf(".") < 0) {
        this.$nextTick(() => {
          this.joinIpt = String(this.joinIpt).substring(0, 10)
        })
      }
      if (this.joinIpt.indexOf(".") == 0) {
        this.$nextTick(() => {
          this.joinIpt = String(this.joinIpt).substring(0, 9)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.mask_cnt {
  padding-bottom: .8rem;
  .join-content {
    p {color: #252F33;font-size: .8rem;font-family: source-Medium;}
    figure {
      display: flex;
      align-items: center;
      color: #5e6466;
      font-size: 0.7rem;
      margin: 0;
      padding: 1.05rem 0 2.3rem;
      img {
        margin-right: 0.6rem;
      }
    }
    button {
      border-radius: 0.2rem;
    }
  }
}
.apply-mask {
  padding-bottom: 1.3rem;
  width: 15.6rem;
  .join-container {
    color: #9CA6AA;
    header {
      @extend %flexBetween;
      align-items: flex-start;
      color: #252F33;
      font-size: .8rem;
      img {
        cursor: pointer;
      }
    }
    .error-list {
       padding: 1.6rem 0 .8rem;
    }
    .ipt-list {
      @extend %flexBetween;
      height: 2.4rem;
      line-height: 2.4rem;
      background: #F5FAF9;
      font-size: .7rem;
      padding: 0 1.2rem 0 .8rem;
      input {
        flex: 1;
        background: #F5FAF9;
        border: 0;
        color: #2E3A40;
        margin-right: .8rem;
      }
    }
    .join-txt1 {
      font-size: .8rem;
      label {
        color: $colorRed;
      }
    }
    .join-txt2 {
      font-family: source-Light;
      font-size: .6rem;
      padding-top: .9rem;
    }
    .join-txt3 {
      font-size: .6rem;
      padding: .2rem 0 1.4rem;
      color: $colorRed;
      text-align: center;
    }
    .join-txt-all {
      @extend %flexEnd;
      padding-top: .5rem;
      font-size: .6rem;
      span {
        cursor: pointer;
        color: $colorGreen;
        margin-left: .5rem;
      }
    }
    button {
      height: 2.4rem;
      width: 100%!important;
    }
  }
}

@media (max-width: 767px) {
  .mask_cnt .join-content figure {
    align-items: flex-start;
  }
}
</style>