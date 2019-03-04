<template>
  <main>
    <wallet-header></wallet-header>
      <router-view class="m" :key="key"/>
    <wallet-footer></wallet-footer>
  </main>
</template>

<script>
import walletHeader from "./componentsPublic/wallet_header.vue"
import walletFooter from "./componentsPublic/wallet_footer.vue"
export default {
  name: 'index',
  data () {
    return {

    }
  },
  components: {
    walletHeader,
    walletFooter,
  },
  computed: {
    key() {
      return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  },
  created() {
    // var ua = navigator.userAgent.toLowerCase();
    // if (ua.match(/MicroMessenger/i) == "micromessenger") {//微信中打开网页
    //     alert("微信打开")
    // } else if (ua.match(/QQ/i) == "qq") {//qq里打开网页
    //     alert("qq打开")
    // } else {
    //     return false;
    // }
    // var u = navigator.userAgent;
    // if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    //     alert("安卓手机")
    // } else if (u.indexOf('iPhone') > -1) {
    //     alert("ios手机")
    //     //苹果手机
    // } else if (u.indexOf('Windows Phone') > -1) {
    //     //winphone手机
        
    // }
  },
}
</script>

<style scoped>
  main {background: #F5F5F5;}
  main .m {margin: 2.4rem auto 1.8rem;}
</style>