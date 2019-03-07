<template>
  <main>
    <wallet-header></wallet-header>
      <router-view class="m" :key="key"/>
    <wallet-footer></wallet-footer>
  </main>
</template>

<script>
import walletHeader from "./componentsPublic/wallet-header.vue"
import walletFooter from "./componentsPublic/wallet-footer.vue"
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
}
</script>

<style scoped>
  main {background: #F5F5F5;}
  main .m {margin: 2.4rem auto 1.8rem;}
</style>