<template>
  <el-container>
    <main>
        <embed style="width: 100%;height: 100%" :src="guideUrl" internalinstanceid="8">
    </main>
  </el-container>
</template>

<script>
export default {
  name: 'walletHelp',
  data () {
    return {
      guideUrl: 'https://test.wallet.intchain.io/images/helpEn.pdf'
    }
  },
  mounted() {
    
  },
  created() {
    
  },
}
</script>

<style scoped>
  main {min-height: 100vh;box-shadow: 0px 6px 10px 0px rgba(204, 204, 204, 0.5);}
</style>