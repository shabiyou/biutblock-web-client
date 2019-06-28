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
import walletHeader from "../components/wallet-header"
import walletFooter from "../components/wallet-footer"
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
  .wallet-index {height: 100%;}
  .wallet-index .wallet-header {background:rgba(245,245,245,1)}
</style>