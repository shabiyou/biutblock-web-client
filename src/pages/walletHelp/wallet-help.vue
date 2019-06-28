<template>
  <main class="el-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24">
        <main class="wallet-help" v-show="mobilePages">
          <embed v-show="guideUrls" 
            src="https://scan.biut.io/biutwallet.web-help-en.pdf"  
            width="100%" 
            height="100%">
          </embed>
          <embed v-show="!guideUrls" 
            src="https://scan.biut.io/biutwallet.web-help-cn.pdf"  
            width="100%" 
            height="100%">
          </embed>
        </main>
        <main v-show="!mobilePages" class="pc-look">
          <span>
            {{ $t("helpTips.helpTipsTxt") }}
          </span>
        </main>
      </el-col>
    </el-row>  
  </main>
</template>

<script>
export default {
  name: 'walletHelp',
  props: {},
  data() {
    return {
      mobilePages: true
    }
  },
  computed: {
    guideUrls() {
      if (this.$i18n.locale == "zh") {
        return false
      } else {
        return true
      }
    }
  },
  created() {

  },
  mounted() {
    if (this.ismobile()) {
      this.mobilePages = false
    }
  },
  destroyed() { },
  methods: {
  },
}
</script>

<style scoped>
.el-container {
  padding: 0;
}
.el-container .el-row {
  width: 100%;
}
.wallet-help {
  height: 37rem;
  box-shadow: 0 0.3rem 1rem 0 rgba(204, 204, 204, 0.5);
  margin: 2.4rem 0 1.8rem;
}
.pc-look {
  height: calc(100vh - 4rem);
  text-align: center;
  padding-top: 2rem;
}
</style>