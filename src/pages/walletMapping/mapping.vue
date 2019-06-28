<template>
  <main class="el-container">
    <main class="wallet-background">
      <section class="wallet-mapping">
        <!-- 提示语组件 -->
        <tips-list :itemList = "itemList"/>

        <!-- eth地址组件 -->
        <input-list 
          ref = 'addressModel'
          :iptTitle = "$t('mapping.ethaddress')"
          :iptPlc = "$t('mapping.ethaddress')"
          :iptLength = 42
          :errorShow = addressErrorShow
          :errorTxt = "addressError"
          @change = 'addressChange' />
        
        <!-- eth的hash组件 -->
        <input-list 
          ref = 'hashModel'
          :iptTitle = "$t('mapping.mappingHash')"
          :iptPlc = "$t('mapping.mappingHashTxt')"
          :iptLength = 66
          :errorShow = hashErrorShow
          :errorTxt = "hashError"
          @change = 'hashChange' />

        <!-- 映射按钮 --> 
        <public-button
          type="button"
          :text="$t('mapping.mappingButton')"
          :disabled="!confirmFrom"
          :class="confirmFrom ? 'btn-active' : ''"
          @click.native="maskShow = true" />

      </section>
      <!-- 公共背景底部 -->
      <content-footer />
    </main>

    <!-- mask 弹窗 -->
    <mapping-mask 
      v-show = "maskShow"
      :ethAddress = 'ethAddress'
      :txhash = 'txhash'
      @close="cloaseMask"/>
  </main>
</template>

<script>
const contentFooter = () => import("../../components/content-footer")
const publicButton = () => import("../../components/public-button")
const mappingMask = () => import("./components/mapping-mask")
const tipsList = () => import("./components/mapping-tips-list")
const inputList = () => import("../../components/public-input-title")
const SECUtil = require('@biut-block/biutjs-util')
export default {
  name: '',
  components: {
    contentFooter,
    publicButton,
    mappingMask,
    tipsList,
    inputList
  },
  props: {},
  data () {
    return {
      addressError: 'mapping.ethAddressErrorTxt', // eth地址无效
      hashError: 'mapping.mappingHashError', // eth私钥无效
      txhash: '', //交易has值
      ethAddress: '',//eth地址
      addressErrorShow: false,
      hashErrorShow: false,
      maskShow: false, //关闭弹窗
      itemList: [
        {
          id: '1',
          cnt: 'mapping.mappingTipsTxt1'
        },
        {
          id: '2',
          cnt: 'mapping.mappingTipsTxt2'
        },
        {
          id: '3',
          cnt: 'mapping.mappingTipsTxt3'
        }
      ]
    }
  },
  computed: {
    //映射按钮是否可点击
    confirmFrom () {
      let ethAddress = this.ethAddress
      let txhash = this.txhash
      if (ethAddress.length > 0 && ethAddress.length < 42) {
        this.addressErrorShow =  true
      } else if (ethAddress.length == 42 && !(_const.addressReg.test(ethAddress))) {
        this.addressErrorShow =  true
      } else {
        this.addressErrorShow =  false
      }
      if (txhash.length > 0 && txhash.length < 66) {
        this.hashErrorShow = true
      } else if (txhash.length  == 66 && !(_const.hashReg.test(txhash))) {
        this.hashErrorShow = true
      } else {
        this.hashErrorShow = false
      }
      return txhash.length == 66
        && _const.hashReg.test(txhash) 
        && ethAddress.length == 42
        && _const.addressReg.test(ethAddress) ? true : false
    }
  },
  created () {

  },
  mounted () {
   
  },
  destroyed () {},
  methods: {
    // 获取子组件 地址
    addressChange (e) {
      this.ethAddress = e
    },

    // 获取子组件 hash
    hashChange (e) {
      this.txhash = e
    },

    //关闭弹窗
    cloaseMask (e) {
      this.maskShow = false
      if (e == 2) {
        this.$refs.addressModel.clearIpt()
        this.$refs.hashModel.clearIpt()
      }
    },
  },
  watch: {

  },
}
</script>

<style scoped>
  .wallet-mapping {height: 25.75rem;padding: 2.8rem 6.2rem 1.8rem;width: 24.6rem;margin: 0 auto;}
  .wallet-mapping >>> main {margin-top: 1rem;}
  .wallet-mapping button {margin-top: 1.8rem;}
  @media (max-width: 767px) {
    .wallet-mapping {padding: 1.2rem .2rem;height: auto;width: 90%;}
    .wallet-mapping button {margin-bottom: 1rem;width: 100%;}
  }
</style>