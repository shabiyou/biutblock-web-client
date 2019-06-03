<template>
  <main class="el-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24">
        <main class="wallet-help" v-show="mobilePages">
          <embed v-show="guideUrls" 
            src="http://scan.biut.io/biutwallet.web-help-en.pdf"  
            width="100%" 
            height="100%">
          </embed>
          <embed v-show="!guideUrls" 
            src="http://scan.biut.io/biutwallet.web-help-cn.pdf"  
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
  name: '',
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
    let browser = {
      versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Adr') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if (browser.versions.mobile) {
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
  .pc-look {height: calc(100vh - 4rem);text-align: center;padding-top: 2rem;}
</style>