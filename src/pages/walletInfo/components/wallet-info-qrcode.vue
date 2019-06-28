<template>
  <main class="info-qrcode">
    <figcaption>
      <qrcode :value="qrAddress" :options="{ size: 93 }" />
      <p>{{ $t("walletInfo.qrCode") }}</p>
    </figcaption>
    <span @click="createWallet">{{ $t("walletInfo.newKeyStore") }}</span>
  </main>
</template>

<script>
import qrcode from '@xkeshi/vue-qrcode'
export default {
  name: 'walletInfoQrcode',
  props: {
     qrAddress: String
  },
  components: {
    qrcode
  },
  data() {
    return {

    }
  },
  methods: {
    //打开创建钱包
    createWallet () {
      this.$emit('createMask')
    }
  },
}
</script>

<style scoped>
  .info-qrcode {display: flex;flex-direction: column;justify-content: space-between;}
  .info-qrcode p {font-size: .7rem;}
  .info-qrcode figcaption {text-align: center;}
  .info-qrcode span {width: 10.85rem;height: 2.2rem;border-radius: .5rem;color: #fff;font-size: .8rem;display: block;
    background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);text-align: center;
    line-height: 2.2rem;margin-bottom: -1.1rem;}
  
  @media (max-width: 767px) {
    .info-qrcode figcaption {text-align: left;}
    .info-qrcode span {margin-bottom: 1rem;}
  }
</style>