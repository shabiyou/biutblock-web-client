<template>
  <main class="el-container">
    <main class="wallet-background">
      <section class="wallet-mapping">
        <section class="mapping-tips">
          <img src="../../assets/images/tipsImg.png" alt="">
          <span>
            {{ $t('mapping.mappingTipsTxt') }}
          </span>
        </section>

        <section class="tips-list">
          <p>{{ $t('mapping.ethprivateKey') }}</p>
          <public-tips v-show="showKey" :tipsTxt="tipsTxt1"/>
        </section>
        <public-input 
          v-model.trim = "ethprivateKey"
          :class="showKey ? 'error-border' : ''"
          :placeholder = "$t('mapping.ethprivateKey')"
          :maxlength = "64" />
        

        <section class="tips-list mapping-top">
          <p>{{ $t('mapping.biutAddress') }}</p>
          <public-tips v-show="showAddress" :tipsTxt="tipsTxt2"/>
        </section>
        
        <public-input 
          v-model.trim = "biutAddress"
          :class="showAddress ? 'error-border' : ''"
          :placeholder = "$t('mapping.biutAddress')"
          :maxlength = "42" />
        
        <!-- 映射按钮 --> 
        <public-button
          type="button"
          :text="$t('mapping.mappingButton')"
          :class="confirmFrom ? 'btn-active' : ''"
          @click.native="confirmMapping" />

      </section>
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>

    <!-- mask 弹窗 -->
    <mapping-mask 
      v-show="maskShow"
      :biutAddress = 'biutAddress'
      :ethprivateKey = 'ethprivateKey'
      @close="cloaseMask"/>
  </main>
</template>

<script>
import contentFooter from '../../components/contentFooter'
import publicButton from '../../components/publicButton'
import mappingMask from './components/mappingMask'

import publicInput from '../../components/publicInput'
import publicTips from '../../components/publicTips'
export default {
  name: '',
  components: {
    contentFooter,
    publicButton,
    mappingMask,

    publicInput,
    publicTips
  },
  props: {},
  data () {
    return {
      ethprivateKey: '',
      biutAddress: '',
      gasPriceTxt: 'Gas Price',
      gasLimitTxt: 'Gas Limit',
      tipsTxt1: 'mapping.ethKeyErrorTxt',
      tipsTxt2: 'mapping.biutAddressErrorTxt',
      showKey: false,
      showAddress: false,

      maskShow: false, //关闭弹窗
    }
  },
  computed: {
    //是否可点击
    confirmFrom () {
      let ethprivateKey = this.ethprivateKey.replace(/\s+/g, "")
      let biutAddress = this.biutAddress.replace(/\s+/g, "")
      if (ethprivateKey.length > 0 && ethprivateKey.length < 64) {
        this.showKey =  true
      } else if (ethprivateKey.length == 64 && !(_const.priverKeyReg.test(ethprivateKey))) {
        this.showKey =  true
      } else {
        this.showKey =  false
      }
      if (biutAddress.length > 0 && biutAddress.length < 42) {
        this.showAddress = true
      } else if (!(_const.addressReg.test(biutAddress)) && biutAddress.length == 42) {
        this.showAddress = true
      } else {
        this.showAddress = false
      }
      return ethprivateKey.length == 64
        && _const.priverKeyReg.test(ethprivateKey) 
        && biutAddress.length == 42
        && _const.addressReg.test(biutAddress) ? true : false
    }
  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    /** 
     * 
     * 提交数据之前做简单的判断，传递需要的参数
     * 
     */
    confirmMapping () {
      this.maskShow = true
    },

    /** 关闭弹窗 */
    cloaseMask (e) {
      this.maskShow = false
      if (e == 2) {
        this.ethprivateKey = ""
        this.biutAddress = ""
      }
    }
  },
}
</script>

<style scoped>
  .wallet-mapping {height: 26.25rem;padding: 4.1rem 6.2rem 0;width: 20.6rem;margin: 0 auto;}

  .wallet-mapping p {font-size: .8rem;color: #42535B;padding-bottom: .5rem;}
  .wallet-mapping .mapping-top {margin-top: 1.2rem;}
  
  .mapping-tips {display: flex;background:rgba(238,28,57,0.1);padding: 1rem .4rem .5rem .55rem;margin: 1.4rem 0 2.3rem;}
  .mapping-tips img {width: .8rem;height: .8rem;margin-right: .5rem;}
  .mapping-tips span {color: #42535B;font-size: .6rem;line-height: 1.5;}

  .tips-list {display: flex;align-items: center;justify-content: space-between;}
  .tips-list >>> .tips_content {padding-top: 0;font-size: .7rem;}
  .wallet-mapping button {margin-top: 2.1rem;}
  @media (max-width: 767px) {
    .wallet-mapping {padding: 1.2rem .2rem 0;height: auto;width: 90%;}
    .input-list {justify-content: center!important;padding-top: 0!important;}
    .input-list >>> section {width: 90%!important;}
    .input-list >>> section p {padding-top: 1rem!important;}
    .wallet-mapping button {margin-left: 5%;margin-bottom: 1rem;}
  }
</style>