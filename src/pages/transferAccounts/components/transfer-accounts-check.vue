<template>
  <main>
    <!-- 转账数量 -->
    <section class="trading-list">
      <p>{{ $t("transfer.transferNumber") }} <label>*</label></p>
      <span><public-tips :tipsTxt="moneyTxt" v-show="moneyShow"/></span>
    </section>

    <!-- 转账数量 - 输入框 -->
    <section class="money-arr">
      <public-input
        maxlength="19"
        v-model="walletMoney"
        :placeholder="$t('transfer.transferNumber')"
        @input="clearAmount"
      />

      <!-- BIUT、BIU币种选中 -->
      <section>
        <span @click="openTransferList" id="amountListImg">
          {{ transferCurrency }}
          <img src="../../../assets/images/tradingDown.png" />
        </span>
        <ul v-show="transferListShow">
          <li
            v-for="(item, index) in itemList"
            :key="index"
            :class="transferIdx == index ? 'list-active' : ''"
            @click="tabTransfer(index, item.cnt)"
          >
            <span>{{ item.cnt }}</span>
            <img
              v-show="transferIdx == index"
              :src="transferIdx == index ? '' + imgUrl + '' : ''"
            />
          </li>
        </ul>
      </section>
    </section>

    <!-- 转账数量 - 转出全部金额 -->
    <section class="money-list">
      <span>{{ $t("transfer.balance") }}：</span>
      <label>{{ transferIdx == 0 ? (getPointNum(amountBiut)) : (getPointNum(amountBiu)) }}</label>
      <span>{{ transferCurrency }}</span>
      <span @click="allTranferMoney">{{ $t("transfer.all") }}</span>
    </section>
  </main>
</template>

<script>
const publicInput = () => import("../../../components/public-input")
const publicTips = () => import("../../../components/public-tips")
import tradingCheck from '../../../assets/images/tradingCheck.png'
export default {
  name: 'transferAccountsCheck',
  props: {
    // amountBiut: String,
    // amountBiu: String,
    tradingMoney: String //biu可转账金额
  },
  components: {
    publicInput,
    publicTips
  },
  computed: {
    amountBiut () {
      return this.$store.getters.availibleAmount
    },
    amountBiu () {
      return this.$store.getters.walletMoneyN
    }
  },
  data() {
    return {
      imgUrl: tradingCheck,
      moneyTxt: 'transfer.transferMoney', //金额错误
      moneyShow: false,
      walletMoney: '', //转账金额
      transferListShow: false,//币种列表
      transferCurrency: 'BIUT',
      transferIdx: 0,
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
  methods: {
    //转账只能输入金额
    clearAmount() {
      this.$nextTick(() => {
        this.walletMoney = this.walletMoney.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        this.walletMoney = this.walletMoney.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.walletMoney = this.walletMoney.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        this.walletMoney = this.walletMoney.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3');//只能输入两个小数  
      })
      if (String(this.walletMoney.length) > 10 && this.walletMoney.indexOf(".") < 0) {
        this.$nextTick(() => {
          this.walletMoney = String(this.walletMoney).substring(0, 10)
        })
      }
      if (this.walletMoney.indexOf(".") == 0) {
        this.$nextTick(() => {
          this.walletMoney = String(this.walletMoney).substring(0, 9)
        })
      }
    },

    //转出全部金额
    allTranferMoney() {
      if (this.transferIdx == 0) {
        this.walletMoney = this.getPointNum(this.amountBiut)
      } else {
        if (this.tradingMoney <= 0) {
          this.walletMoney = this.getPointNum(this.amountBiu)
        } else {
          this.walletMoney = this.tradingMoney
        }
      }
      this.walletMoney = this.walletMoney.replace(",", "")
    },

    //打开显示列表
    openTransferList() {
      this.transferListShow = !this.transferListShow
    },

    //切换显示 BIUT BIU
    tabTransfer(index, cnt) {
      this.walletMoney = ''
      this.transferIdx = index
      this.transferCurrency = cnt
      this.transferListShow = false
    },

    //清空input输入框
    clearIpt() {
      this.walletMoney = ''
    }
  },
  watch: {
    walletMoney(newVal, oldVal) {
      let param = {
        amount: newVal,
        idx: this.transferIdx
      }
      this.$emit('getAmount', param)
      let a = newVal.length > 0 && Number(newVal) > Number(this.amountBiut) && this.transferIdx === 0
      let b = newVal.length > 0 && Number(newVal) > Number(this.tradingMoney) && this.transferIdx === 1
      if (a || b) {
        this.moneyShow = true
      } else {
        this.moneyShow = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.trading-list {
  @extend %flexBetween;
  padding-bottom: 0.4rem;
  p {
    //font-family: source-Bold;
    font-weight: bold;
    font-size: 0.8rem;
    color: $colorTips;
    label {
      color: $colorRed;
    }
  }
  span {
    &:last-child {
      .tips_content {
        padding-top: 0 !important;
      }
    }
  }
}

.money-arr {
  max-width: 100%;
  @include border($d: bor);
  box-sizing: border-box;
  height: 2.4rem;
  position: relative;
  @extend %flexBetween;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  input {
    border: 0;
    flex: 1;
    height: 2.2rem;
    border-radius: 0.5rem;
  }
  span {
    padding-right: 1rem;
    display: flex;
    align-items: center;
    img {
      width: 0.4rem;
      height: 0.3rem;
      margin-left: 0.5rem;
    }
  }
  ul {
    position: absolute;
    top: 2.4rem;
    right: 0;
    margin: 0;
    padding: 0;
    width: 4.3rem;
    height: 3.2rem;
    border-radius: 0.2rem;
    box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.16);
    z-index: 9;
    background: #fff;
    li {
      @extend %flexBetween;
      height: 1.6rem;
      padding: 0 0.5rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
    }
    .list-active {
      color: $colorGreen;
    }
  }
}

.money-list {
  color: $colorGray2;
  font-size: 0.7rem;
  padding: 0.5rem 0 1.3rem;
  label {
    color: $colorTips;
  }
  span {
    &:last-child {
      color: $colorGreen;
      margin-left: 0.6rem;
    }
  }
}
</style>