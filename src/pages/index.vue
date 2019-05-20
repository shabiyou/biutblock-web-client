<template>
  <main class="wallet-index">
    <wallet-header />
    <section class="wallet-header">
      <router-view :key="key"/>
    </section>
    <wallet-footer />
  </main>
</template>

<script>
import walletHeader from "../components/walletHeader.vue"
import walletFooter from "../components/walletFooter"
export default {
  name: 'Index',
  props: {},
  components: {
    walletHeader,
    walletFooter
  },
  data () {
    return {

    }
  },
  methods: {

  },
  computed: {
    key() {
      return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  },
}
</script>

<style scoped>
  /* .wallet-index {height: 100%;box-sizing: border-box;background: #F5F5F5;overflow: auto;}
  .wallet-index .wallet-header {height: 100%;margin-bottom: -3rem;box-sizing: border-box;}
  .wallet-index footer {height:3rem;box-sizing: border-box;} */

  .wallet-index .wallet-header {background:rgba(245,245,245,1)}
</style>