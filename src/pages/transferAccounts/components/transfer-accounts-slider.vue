<template>
  <main>
    <section class="trading-list">
      <span>{{ $t("transfer.transferPoundage") }}</span>
      <span><public-tips :tipsTxt="moneyTxtN" v-show="moneyShowN"/></span>
    </section>

    <!-- 转账数量 - silder 滑块 -->
    <section class="transfer-slider">
      <el-slider
        v-model="feeIpt"
        :max="maxFee"
        :step="stepFee"
        :min="minFee" />
      <section>
        <span :class="slowTips ? 'slow-color' : ''">
          {{$t("transfer.transferSlow") }}
        </span>
        <span>{{ feeIpt }} BIU</span>
        <span :class="fastTips ? 'fast-color' : ''">
          {{ $t("transfer.transferFast") }}
        </span>
      </section>
    </section>
  </main>
</template>

<script>
const publicTips = () => import("../../../components/public-tips")
export default {
  name: 'transferAccountsSlider',
  props: {
    feeVal: Number,
    ststs: String
  },
  components: {
    publicTips
  },
  data() {
    return {
      feeIpt: this.feeVal, //初始值
      minFee: 0.01, //最小值
      maxFee: 0.1, //最大值
      stepFee: 0.00818182, //步长
      fastTips: false,//最大值颜色变化
      slowTips: false,//最小值颜色变化
      moneyTxtN: 'transfer.transferMoneyN',//BIU silder金额大于余额
      moneyShowN: false,
    }
  },
  methods: {
    resetSlider () {
      this.feeIpt = 0.02
    }
  },
  watch: {
    //监听滚动条变化
    feeIpt (newFee, oldFee) {
      this.$emit('getFee', newFee)
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
      if (Number(newFee) > Number(this.ststs)) {
        this.moneyShowN = true
      } else {
        this.moneyShowN = false
      }
    }
  }
}
</script>

<style scoped>
  .trading-list {display: flex;align-items: center;justify-content: space-between;padding-bottom: .4rem;}
  .trading-list span:last-child .tips_content {padding-top: 0!important;}

  .transfer-slider section {display: flex;justify-content: space-between;align-items: center;font-size: 14px;
    padding-bottom: 43px;}
  .transfer-slider >>> .el-slider__runway {height: 2px;}
  .transfer-slider >>> .el-slider__bar {background-color: #00D69B;height: 2px;}
  .transfer-slider >>> .el-slider__button {border-color: #00D69B;}
  .transfer-slider >>> .el-slider__button-wrapper {width: 24px;height: 24px;top: -13px;}

  .slow-color {color: #0B7FE6!important;}
  .fast-color {color: #F5A623!important;}
</style>