<template>
  <main class="down-keystroe wallet-content">
    <h2>{{ $t("newWallet.saveKeyStore") }}</h2>
    <span @click="downUrlTxt">{{ $t("newWallet.keyStoreDown") }}</span>
    <!-- 提示语组件 -->
    <tips-list :tipsListKey="tipsListKey" class="tips-list" />

    <public-button
      type = 'button'
      class = 'btn-active'
      :text = "$t('newWallet.next')"
      @click.native = 'continueKey' />
  </main>
</template>

<script>
const publicButton = ()=>import("../../../components/public-button")
const tipsList = ()=>import("./wallet-tips-list")
export default {
  name: 'downKeystore',
  components: {
    tipsList,
    publicButton
  },
  props: {
    tipsListKey: Array
  },
  data() {
    return {

    }
  },
  methods: {
    //继续下一步，查看私钥
    continueKey () {
      this.$emit("next")
    },

    //下载文件
    downUrlTxt () {
      this.$emit("down")
    }
  },
}
</script>

<style scoped>
  .down-keystroe {width: 24.5rem;}
  .down-keystroe h2 {padding: 8.4rem 0 2.9rem;}
  .down-keystroe span {display: block;height: 2.4rem;background: rgba(255, 255, 255, 1);border-radius: .5rem;
    border: 1px solid rgba(145, 162, 170, 1);text-align: center;line-height: 2.4rem;color: #42535B;font-size: .8rem;
    font-weight: 500;}
  .down-keystroe .tips-list {padding: .8rem 0 2.2rem;}
</style>