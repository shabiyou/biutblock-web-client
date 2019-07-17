<template>
  <main class="info-qrcode">
    <!-- 二维码 -->
    <figcaption>
      <qrcode :value="qrAddress" :options="{ size: 93 }" />
      <p>{{ $t("walletInfo.qrCode") }}</p>
    </figcaption>

    <!-- 下载按钮 -->
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
    createWallet() {
      this.$emit('createMask')
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.info-qrcode {
  @extend %flexColumn;
  p {
    font-size: 0.7rem;
  }
  figcaption {
    text-align: center;
  }
  span {
    width: 10.85rem;
    height: 2.2rem;
    border-radius: 0.5rem;
    color: #fff;
    font-size: 0.8rem;
    display: block;
    background: linear-gradient(90deg, #29d893 0%, #0cc5b7 100%);
    text-align: center;
    line-height: 2.2rem;
    margin-bottom: -1.1rem;
  }
}

@media (max-width: 767px) {
  .info-qrcode {
    margin: 1rem 0;
    figcaption {
      text-align: left;
    }
    span {
      margin: 1rem 0 0;
    }
  }
}
</style>