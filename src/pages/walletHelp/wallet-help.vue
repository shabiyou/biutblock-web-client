<template>
  <el-container>
    <main>
        <iframe :src="guideUrl"  width="100%" height="100%">
          This browser does not support PDFs. Please download the PDF to view it: 
          <a :href="guideUrl">Download PDF</a>
        </iframe>
    </main>
  </el-container>
</template>

<script>
export default {
  name: 'walletHelp',
  data () {
    return {
      guideUrl: "https://test.wallet.intchain.io/images/helpEn.pdf"
    }
  },
  mounted() {
    
  },
  created() {
    if (this.$i18n.locale == "zh") {
      this.guideUrl = "https://test.wallet.intchain.io/images/helpZh.pdf"
    }
  },
}
</script>

<style scoped>
  main {min-height: 100vh;box-shadow: 0px 6px 10px 0px rgba(204, 204, 204, 0.5);}
</style>