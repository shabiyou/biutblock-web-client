<template>
  <main class="el-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24">
        <main class="wallet-help">
          <!-- <iframe :src="guideUrl"  width="100%" height="100%">
              This browser does not support PDFs. Please download the PDF to view it: 
              <a :href="guideUrl">Download PDF</a>
          </iframe> -->

          <object width="100%" height="100%" border="0"><param name="src" :value="guideUrl"> </object>

          <!-- <embed :src="guideUrl"  width="100%" height="100%"></embed> -->
        </main>
      </el-col>
    </el-row>  
  </main>
</template>

<script>
export default {
  name: '',
  components: {
    
  },
  props: {},
  data () {
    return {
      guideUrl: "http://scan.secblock.io/secwallet-web-help-en.pdf"
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    if (this.$i18n.locale == "zh") {
      this.guideUrl = "http://scan.secblock.io/secwallet-web-help-cn.pdf"
    }
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