<template>
  <main class="el-container">
    <main class="wallet-background">
      <section class="wallet-mapping">
        <section class="mapping-tips">
          <!-- <img src="../../assets/images/tipsImg.png" alt=""> -->
          <ul>
            <li>
              <span>1、</span>
              <span>{{ $t('mapping.mappingTipsTxt1') }}</span>
            </li>
            <li>
              <span>2、</span>
              <span>{{ $t('mapping.mappingTipsTxt2') }}</span>
            </li>
            <li>
              <span>3、</span>
              <span>{{ $t('mapping.mappingTipsTxt3') }}</span>
            </li>
          </ul>
        </section>

        <section class="input-content">
          <section class="input-text">
            <section class="tips-list">
              <p>{{ $t('mapping.ethaddress') }}<label style="color: red;">*</label></p>
              <public-tips v-show="showKey" :tipsTxt="tipsTxt2"/>
            </section>
            <public-input 
              v-model.trim = "ethAddress"
              :class="showKey ? 'error-border' : ''"
              :placeholder = "$t('mapping.ethaddress')"
              :maxlength = "42" />
          </section>
        </section>

        <section class="input-content mapping-top">
          <section class="input-text">
            <section class="tips-list">
              <p>{{ $t('mapping.mappingHash') }}<label style="color: red;">*</label></p>
              <public-tips v-show="showHashKey" :tipsTxt="tipsTxt3"/>
            </section>
            <public-input 
              v-model.trim = "txhash"
              :class="showHashKey ? 'error-border' : ''"
              :placeholder = "$t('mapping.mappingHashTxt')"
              :maxlength = "66" />
          </section>

        </section>

        <!-- 映射按钮 --> 
        <public-button
          type="button"
          :text="mappingButton"
          :disabled="!confirmFrom"
          :class="confirmFrom ? 'btn-active' : ''"
          @click.native="confirmMapping" />

      </section>
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>

    <!-- mask 弹窗 -->
    <mapping-mask 
      v-show="maskShow"
      :ethAddress = 'ethAddress'
      :txhash = 'txhash'
      @close="cloaseMask"/>
  </main>
</template>

<script>
import contentFooter from '../../components/contentFooter'
import publicButton from '../../components/publicButton'
import mappingMask from './components/mappingMask'

import publicInput from '../../components/publicInput'
import publicTips from '../../components/publicTips'
const SECUtil = require('@biut-block/biutjs-util')
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
      ethAddress: '',
      tipsTxt2: 'mapping.ethAddressErrorTxt', // eth私钥无效
      tipsTxt3: 'mapping.mappingHashError', // eth私钥无效
      mappingButton: 'mapping.mappingButton',
      txhash: '', //交易has值
      showKey: false,
      showHashKey: false,
      maskShow: false, //关闭弹窗
    }
  },
  computed: {
    //是否可点击
    confirmFrom () {
      let ethAddress = this.ethAddress.replace(/\s+/g, "")
      //let biutAddress = this.biutAddressText.replace(/\s+/g, "")
      let txhash = this.txhash.replace(/\s+/g, "")
      
      if (ethAddress.length > 0 && ethAddress.length < 42) {
        this.showKey =  true
      } else if (ethAddress.length == 42 && !(_const.addressReg.test(ethAddress))) {
        this.showKey =  true
      } else {
        this.showKey =  false
      }

      if (txhash.length > 0 && txhash.length < 66) {
        this.showHashKey = true
      } else if (txhash.length  == 66 && !(_const.hashReg.test(txhash))) {
        this.showHashKey = true
      } else {
        this.showHashKey = false
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
        this.ethAddress = ''
        this.txhash = ''
      }
    },
  },
  watch: {

  },
}
</script>

<style scoped>
  .wallet-mapping {height: 25.75rem;padding: 2.8rem 6.2rem 1.8rem;width: 24.6rem;margin: 0 auto;}
  .input-content {display: flex;justify-content: space-between;}
  .input-text {flex: 1;}
  .input-text span {border: 0.05rem solid rgba(145,162,170,1);height: 2.4rem;box-sizing: border-box;
    border-radius: .5rem;display: flex;align-items: center;padding-left: 1rem;color: #839299;
    font-size: .7rem;font-family: source-Light;}
  .input-text .iost-padding {padding-left: 1.3rem!important;}
  .input-text .address-color {color: #42535B;}

  .wallet-mapping p {font-size: .8rem;color: #42535B;padding-bottom: .4rem;font-family: source-Bold;}
  .wallet-mapping .mapping-top {margin-top: 1rem;}

  .mapping-tips {display: flex;background:rgba(238,28,57,0.1);padding: .85rem .9rem .7rem;margin-bottom: 2rem;}
  .mapping-tips img {width: .8rem;height: .8rem;margin: .15rem .5rem 0 0;}
  .mapping-tips ul {margin: 0;padding: 0;}
  .mapping-tips ul li {display: flex;}
  .mapping-tips ul li span {color: #42535B;font-size: .6rem;line-height: 1.8;}

  .tips-list {display: flex;align-items: center;justify-content: space-between;}
  .tips-list >>> .tips_content {padding-top: 0;font-size: .7rem;}

  .wallet-mapping button {margin-top: 1.8rem;}
  @media (max-width: 767px) {
    .wallet-mapping {padding: 1.2rem .2rem;height: auto;width: 90%;}
    .input-content {display: block;margin: 0!important;}
    .input-content .input-text {width: 100%;margin-top: 1.2rem;}
    .wallet-mapping button {margin-bottom: 1rem;width: 100%;}
  }
</style>