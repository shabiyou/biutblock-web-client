<template>
  <main class="el-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24">
        <main class="wallet-help">

          <embed v-show="guideUrls" 
            src="http://scan.secblock.io/secwallet-web-help-en.pdf"  
            width="100%" 
            height="100%">
          </embed>

          <embed v-show="!guideUrls" 
            src="http://scan.secblock.io/secwallet-web-help-cn.pdf"  
            width="100%" 
            height="100%">
          </embed>

        </main>
      </el-col>
    </el-row>  
  </main>
</template>

<script>
export default {
  name: '',
  props: {},
  data () {
    return {

    }
  },
  computed: {
    guideUrls () {
      if (this.$i18n.locale == "zh") {
        return  false
      } else {
        return true
      }
    }
  },
  created () {

  },
  mounted () {
    
  },
  destroyed () {},
  methods: {

  },
}
</script>

<style scoped>
  .el-container {padding: 0;}
  .el-container .el-row {width: 100%;}
  .wallet-help {height: 37rem;box-shadow: 0 .3rem 1rem 0 rgba(204, 204, 204, 0.5);
    margin: 2.4rem 0 1.8rem;}
</style>