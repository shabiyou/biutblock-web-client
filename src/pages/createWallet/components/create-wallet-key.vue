<template>
  <main class="save-privateKey wallet-content">
    <h2>{{ $t("newWallet.savePrivateKey") }}</h2>

    <!-- 私钥显示 -->
    <section class="privateKey">
      {{ privateKey }}
    </section>

    <!-- 提示语组件 -->
    <tips-list :tipsListKey="tipsListKey" class="tips-list" />
  </main>
</template>

<script>
const tipsList = () => import("./wallet-tips-list")
export default {
  name: 'savePriveate',
  components: {
    tipsList
  },
  props: {
    privateKey: String,
    tipsListKey: Array
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.save-privateKey {
  width: 26.6rem;
  h2 {
    padding: 8.4rem 0 3.1rem;
  }
  .privateKey {
    background: $baColor;
    color: $colorTips;
    @include border ($d: bor);
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 1rem;
    word-break: break-all;
    line-height: 1.5;
  }
  .tips-list {
    padding-top: 1.2rem;
  }
}
</style>