<template>
  <el-container>
    <main>
        <embed style="width: 100%;height: 100%" :src="guideUrl" internalinstanceid="8">
    </main>
  </el-container>
</template>

<script>
// import SECHelpEN from '../../assets/help/SECHelp_EN.pdf'
// import SECHelpZH from '../../assets/help/SECHelp_ZH.pdf'
export default {
  name: 'walletHelp',
  data () {
    return {
      guideUrl: "https://test.wallet.intchain.io/images/helpEn.pdf"
    }
  },
  mounted() {
    console.log(this.$i18n.locale)
  },
  created() {
    console.log(this.$i18n.locale)
    if (this.$i18n.locale == "zh") {
      this.guideUrl = "https://test.wallet.intchain.io/images/helpZh.pdf"
    }
  },
}
</script>

<style scoped>
  main {min-height: 100vh;box-shadow: 0px 6px 10px 0px rgba(204, 204, 204, 0.5);}
</style>