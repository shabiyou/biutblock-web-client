<template>
  <section class="mask">
    <!-- 已经加入过的弹窗 -->
    <section class="mask_cnt" v-show="maskPage === 1">
      <section class="join-content clearfix">
        <p>{{ $t("mask.poolTips") }}</p>
        <figure>
          <img src="../../../assets/images/errorImg.png" alt="" />
          <figcaption>{{ $t("mask.poolTxt") }}</figcaption>
        </figure>
        <button type="button" @click="close">{{ $t("mask.poolBtn") }}</button>
      </section>
    </section>

    <!-- 申请加入的弹窗 -->
    <!-- <section class="mask_cnt apply-mask" v-show="maskPage === 2"> -->
    <section class="mask_cnt apply-mask" v-show="maskPage === 2">
      <section class="join-container">
        <header>
          <span  v-show="!mortgageShow">{{ $t("pool.poolIndexTit2") }}</span>
          <span  v-show="mortgageShow">{{ $t("mask.poolMaskTit1") }}</span>
          <img
            src="../../../assets/images/closeMask.png"
            alt=""
            @click="close"
          />
        </header>

        <ul>
          <li
            v-for="(item, index) in itemList"
            :key="index"
            class="mask-list-text">
            <span>{{ $t(item.tit) }}</span>
            <span>{{ item.txt }}</span>
          </li>
        </ul>

        <section class="error-list">
          <p class="join-txt1">{{ $t("mask.poolNumber") }} <label>*</label></p>
        </section>
        <section class="ipt-list">
          <input
            type="text"
            placeholder="10,000.00"
            v-model="joinIpt"
            @input="clearAmount"
          />
          <span>BIUT</span>
        </section>
        <p class="join-txt-all">
          {{ $t("transfer.balance") }}：{{ getPointNum(scientificNotationToString(totalMoney)) }} BIUT
          <span @click="allMoney">{{ $t("transfer.all") }}</span>
        </p>
        <p class="join-txt2">{{ $t("mask.poolTxt1") }}</p>
        <p class="join-txt3" v-show="!mortgageShow">{{ $t("mask.poolNumberError") }}</p>
        <p class="join-txt3" v-show="mortgageShow">{{ $t("mask.poolNumberError1") }}</p>

        <p class="join-txt4" v-show="networkError">{{ $t("mask.poolNumberError2") }}</p>

        <public-button
          :text="joinButton"
          :class="[joinBtn ? 'btn-active' : '',joninReadonly ? 'cantClick' : '']"
          :disabled="!joinBtn"
          @click.native="joinFrom"
          v-show="!mortgageShow"/>

        <!-- 抵押更多按钮 -->
        <public-button 
          :text="$t(mortgageBtn)"
          :class="[mortgageActive ? 'btn-active' : '',mortgageReadonly ? 'cantClick' : '']"
          :disabled="!mortgageActive"
          @click.native="mortgageFrom"
          v-show="mortgageShow"/>
      </section>
    </section>

    <!-- 追加成功 -->
    <section class="mask_cnt append-success" v-show="maskPage === 3">
      <header>
        <figure>
          <img src="../../../assets/images/tipsSuccess.png" alt="" />
          <figcaption>{{ $t(poolMaskTit2) }}</figcaption>
        </figure>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </header>

      <ul>
        <li v-for="(item, index) in itemList" :key="index">
          <span>{{ $t(item.tit) }}</span>
          <span>{{ item.txt }}</span>
        </li>
        <li>
          <span>{{ $t('mask.poolMaskTxt4') }}</span>
          <span>{{ joinIpt }}</span>
        </li>
      </ul>
      <footer>
        <button type="button" @click="close">{{ $t('mask.poolMaskClose') }}</button>
      </footer>
    </section>
  </section>
</template>

<script>
import publicButton from '../../../components/public-button'
let fetch = require('node-fetch')
const SECUtil = require('@biut-block/biutjs-util')
let dataCenterHandler = require('../../../lib/DataCenterHandler')
let httpHeaderOption = {
  'content-type': 'application/json',
  "access-control-allow-origin": '*'
}
let url = _const.url
export default {
  name: '',
  components: {
    publicButton
  },
  props: {
    nounce: Number,
    selectedItem: Object,
    address: String,
    addressShort: String,
    privateKey: String,
    totalMoney: String,
    mortgageShow: Boolean,
    maskPage: Number
  },
  data() {
    return {
      mortgageBtn:'mask.poolMaskBtn', //抵押更多按钮
      joinButton: 'mask.poolBtn1', //加入按钮
      poolMaskTit2: 'mask.poolMaskTit2',//
      mortgageReadonly: false,
      joninReadonly: false,
      joinIpt: '0',
      networkError: false,//网络错误
    }
  },
  mounted() {
    //查询可用余额
    // this.getWalletBalance(this.address, 'biut').then(res => {
    //   this.totalMoney = this.scientificNotationToString(res)
    // })
  },
  created(){

  },
  computed: {
    joinBtn() {
      let ipt = this.joinIpt ? this.joinIpt.replace(/\s+/g, "") : '0'
      return 10000 <= ipt && ipt <= Number(this.totalMoney) ? true : false
    },

    mortgageActive () {
      let ipt = this.joinIpt ? this.joinIpt.replace(/\s+/g, "") : '0'
      return 10 <= ipt && ipt <= Number(this.totalMoney) ? true : false
    },

    itemList () {
      return [
        {
          id: '1',
          tit: 'mask.poolMaskTxt1',
          txt: this.selectedItem.poolName
        },
        {
          id: '2',
          tit: 'mask.poolMaskTxt2',
          txt: this.addressShort
        },
        {
          id: '3',
          tit: 'mask.poolMaskTxt3',
          txt: this.selectedItem.poolAddress
        }
      ]
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.joinIpt = ''
    },

    joinFrom() {
      /**
       * 确认加入矿池
       * 
       * 加入成功 调用 close() 关闭弹窗
       */
      this.joninReadonly = true
      this.joinButton = 'mask.poolBtn1s'
      this._addMortgage((ipt) => {
        dataCenterHandler.joinPool({
          address: this.address,
          mortgagePoolAddress: this.selectedItem.poolAddress,
          mortgageValue: ipt
        }, (body) => {
          this.$emit('updatePage', ipt, this.selectedItem.poolAddress)
          //this.close()
          this.poolMaskTit2 = 'mask.poolMaskTit2Add'
          this.joninReadonly = false
          this.joinButton = 'mask.poolBtn1'
        })
      })
    },

    _addMortgage (callback) {
      let ipt = this.joinIpt.replace(/\s+/g, "")
      let sourceCode = `lock( "${this.address}", ${ipt}, ${new Date().getTime() + 365 * 24 * 3600 * 1000})`.toString('base64')
      sourceCode = JSON.stringify({ callCode: Buffer.from(sourceCode).toString('base64') })
      const transfer = {
        "nonce": '1',
        "timeStamp": new Date().getTime(),
        'walletAddress': this.address,
        'sendToAddress': this.selectedItem.poolAddress,
        'amount': ipt,
        'txFee': '0',
        'gasLimit': '0',
        'gas': '0',
        'gasPrice': '0',
        'data': '',
        'inputData': sourceCode,
        'chainName': 'SEC'
      }
      let signedTx = this._signTx(this.privateKey, transfer)
      let postData = {
        "method": "sec_sendContractTransaction",
        "params": signedTx
      }
      fetch(url, {
        method: 'post',
        body: JSON.stringify(postData), // request is a string
        headers: httpHeaderOption
      }).then((res) => res.json()).then((text) => {
        if (JSON.parse(text.body).result.status == 1) {
          callback(ipt)
        }
      })
    },
    
    //抵押更多提交方法
    mortgageFrom () {
      this.mortgageReadonly = true
      this.mortgageBtn = 'mask.poolMaskBtns'
      this._addMortgage((ipt) => {
          dataCenterHandler.updateWallet({
            address: this.address,
            mortgageValue: ipt
          }, (doc) => {
            if (doc.status) {
            this.$emit('updatePage', ipt, '')
            this.poolMaskTit2 = 'mask.poolMaskTit2'
            this.mortgageBtn = 'mask.poolMaskBtn'
            this.mortgageReadonly = false
            //this.close()
            }
          })
        })
      //this.mortgageReadonly = true
      //this.mortgageBtn = 'mask.poolMaskBtns'
      

      /**
       * 抵押更多成功
       * 
       * this.$emit('updatePage')
       * 
       * 
       * this.mortgageReadonly = false
       * 
       * this.mortgageBtn = 'mask.poolMaskBtn'
       * 
       * this.close () 关闭
       * 
       * 
       * 抵押失败
       * this.mortgageReadonly = false
       * this.mortgageBtn = 'mask.poolMaskBtn'
       * this.networkError = false
       */
    },

    _signTx: function (privateKey, transfer) {
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
  padding-bottom: 0.8rem;
  .join-content {
    p {
      color: #252f33;
      font-size: 0.8rem;
      //font-family: source-Medium;
    }
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
    color: #9ca6aa;
    header {
      @extend %flexBetween;
      align-items: flex-start;
      color: #252f33;
      font-size: 0.8rem;
      padding-bottom: 1.4rem;
      img {
        cursor: pointer;
      }
    }
    ul {
      margin: 0;
      padding: 0;
    }
    .mask-list-text {
      @extend %flex;
      font-size: 0.7rem;
      color: #9ca6aa;
      padding-top: 0.8rem;
      span {
        &:first-child {
          width: 5rem;
        }
        &:last-child {
          color: #42535b;
          flex: 1;
          word-break: break-all;
        }
      }
    }
    .error-list {
      padding: 1.6rem 0 0.8rem;
    }
    .ipt-list {
      @extend %flexBetween;
      height: 2.4rem;
      line-height: 2.4rem;
      background: #f5faf9;
      font-size: 0.7rem;
      padding: 0 1.2rem 0 0.8rem;
      input {
        flex: 1;
        background: #f5faf9;
        border: 0;
        color: #2e3a40;
        margin-right: 0.8rem;
      }
    }
    .join-txt1 {
      font-size: 0.8rem;
      label {
        color: $colorRed;
      }
    }
    .join-txt2 {
      //font-family: source-Light;
      font-size: 0.6rem;
      padding-top: 0.9rem;
    }
    .join-txt3 {
      font-size: 0.6rem;
      padding: 0.2rem 0 1.4rem;
      color: $colorRed;
      text-align: center;
    }
    .join-txt4 {
      font-size: 0.6rem;
      padding: 0;
      margin: -1rem 0 1rem;
      color: $colorRed;
      text-align: center;
    }
    .join-txt-all {
      @extend %flexEnd;
      padding-top: 0.5rem;
      font-size: 0.6rem;
      span {
        cursor: pointer;
        color: $colorGreen;
        margin-left: 0.5rem;
      }
    }
    button {
      height: 2.4rem;
      width: 100% !important;
    }
  }
}

.append-success {
  width: 22.4rem;
  padding: 0.8rem 1.2rem;
  header {
    @extend %flexBetween;
    padding-bottom: 2.1rem;
    figure {
      margin: 0;
      @extend %flexCenter;
      color: #252f33;
      font-size: 0.8rem;
      img {
        margin-right: 0.5rem;
      }
    }
    img {
      cursor: pointer;
    }
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      font-size: 0.7rem;
      color: #9ca6aa;
      @extend %flexCenter;
      padding-bottom: 0.8rem;
      span {
        &:first-child {
          width: 5rem;
        }
        &:last-child {
          flex: 1;
          color: #42535b;
          word-break: break-all;
        }
      }
    }
  }
  footer {
    @extend %flexEnd;
  }
}

@media (max-width: 767px) {
  .append-success {
    width: 15.6rem;
  }
  .mask_cnt .join-content figure {
    align-items: flex-start;
  }
}
</style>