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
          </ul>
        </section>

        <section class="input-content">
          <section class="input-text">
            <section class="tips-list">
              <p>{{ $t('mapping.ethprivateKey') }}</p>
              <public-tips v-show="showKey" :tipsTxt="tipsTxt2"/>
            </section>
            <public-input 
              v-model.trim = "ethprivateKey"
              :class="showKey ? 'error-border' : ''"
              :placeholder = "$t('mapping.ethprivateKey')"
              :maxlength = "64" />
          </section>
          
          <section class="input-text">
            <p>{{ $t('mapping.ethddress') }}</p>
            <span v-show="ethAddressShow" :class="iosTextIndent ? 'iost-padding' : ''"> {{ $t('mapping.ethddress') }} </span>
            <span v-show="!ethAddressShow" class="address-color" :class="iosTextIndent ? 'iost-padding' : ''"> {{ ethAddressText }} </span>
          </section>
        </section>


        <section class="input-content mapping-top">
          <section class="input-text">
            <section class="tips-list">
              <p>{{ $t('mapping.biutprivateKey') }}</p>
              <public-tips v-show="showBiutKey" :tipsTxt="tipsTxt1"/>
            </section>
            <public-input 
              v-model.trim = "biutprivateKey"
              :class="showBiutKey ? 'error-border' : ''"
              :placeholder = "$t('mapping.biutprivateKey')"
              :maxlength = "64" />
          </section>
          
          <section class="input-text">
            <p>{{ $t('mapping.biutAddress') }}</p>
            <span v-show="biutAddressShow" :class="iosTextIndent ? 'iost-padding' : ''"> {{ $t('mapping.biutAddress') }} </span>
            <span v-show="!biutAddressShow" class="address-color" :class="iosTextIndent ? 'iost-padding' : ''"> {{ biutAddressText }} </span>
          </section>
        </section>

        <!-- 映射按钮 --> 
        <public-button
          type="button"
          :text="$t('mapping.mappingButton')"
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
      :biutAddress = 'biutAddressText'
      :ethAddress = 'ethAddressText'
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
      ethprivateKey: '',
      ethddress: 'mapping.ethddress',
      biutprivateKey: '',
      biutAddress: 'mapping.biutAddress',
      gasPriceTxt: 'Gas Price',
      gasLimitTxt: 'Gas Limit',
      tipsTxt1: 'mapping.biutKeyErrorTxt', // biut私钥无效
      tipsTxt2: 'mapping.ethKeyErrorTxt', // eth私钥无效

      ethAddressShow: true,
      biutAddressShow: true,
      ethAddressText: '',
      biutAddressText: '',
      iosTextIndent: false,

      showKey: false,
      showBiutKey: false,

      maskShow: false, //关闭弹窗
    }
  },
  computed: {
    //是否可点击
    confirmFrom () {
      let ethprivateKey = this.ethprivateKey.replace(/\s+/g, "")
      let biutrivateKey = this.biutprivateKey.replace(/\s+/g, "")
      let ethAddress = this.ethAddressText.replace(/\s+/g, "")
      let biutAddress = this.biutAddressText.replace(/\s+/g, "")
      
      if (ethprivateKey.length > 0 && ethprivateKey.length < 64) {
        this.showKey =  true
      } else if (ethprivateKey.length == 64 && !(_const.priverKeyReg.test(ethprivateKey))) {
        this.showKey =  true
      } else {
        this.showKey =  false
      }
      if (biutrivateKey.length > 0 && biutrivateKey.length < 64) {
        this.showBiutKey =  true
      } else if (biutrivateKey.length == 64 && !(_const.priverKeyReg.test(biutrivateKey))) {
        this.showBiutKey =  true
      } else if (biutrivateKey.length == 64 && biutrivateKey == ethprivateKey) {
        this.showBiutKey =  true
      } else {
        this.showBiutKey =  false
      }
      
      return ethprivateKey.length == 64
        &&  biutrivateKey.length == 64
        && _const.priverKeyReg.test(ethprivateKey) 
        && _const.priverKeyReg.test(biutrivateKey) 
        && ethAddress.length == 42
        && biutAddress.length == 42
        && biutrivateKey != ethprivateKey
        && _const.addressReg.test(biutAddress) ? true : false
    }
  },
  created () {
    
  },
  mounted () {
    let browser = {
        versions: function () {
          var u = navigator.userAgent, app = navigator.appVersion;
          return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Adr') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
          };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
      }
    if (browser.versions.mobile && browser.versions.ios) {
      this.iosTextIndent = true
    }
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

    /**
     * 
     * 获取eth的地址
     * 
     */
    getEthAddress (privateKeys) {
      let address = SECUtil.privateToAddress(SECUtil.privateToBuffer(privateKeys)).toString('hex')
      return address
    },

    /**
     * 
     * 获取biut的地址
     * 
     */
    getBiutAddress (privateKeys) {
      let privateKeyBuffer = SECUtil.privateToBuffer(privateKeys)
      let extractAddress = SECUtil.privateToAddress(privateKeyBuffer) //返回值
      let address = `0x${extractAddress.toString('hex')}`
      return address
    },

    /** 关闭弹窗 */
    cloaseMask (e) {
      this.maskShow = false
      if (e == 2) {
        this.ethprivateKey = ""
        this.biutprivateKey = ""
        this.biutAddressShow = true
        this.ethAddressShow = true
        this.ethAddressText = ''
        this.biutAddressText = ''
      }
    },

    /**
     * 
     */
    // 移动端判断
    ismobile () {
		  var mobileArry = ["iPhone", "iPad", "Android", "Windows Phone", "BB10; Touch", "BB10; Touch", "PlayBook", "Nokia"];
		  var ua = navigator.userAgent;
		  var res=mobileArry.filter(function(arr) {
			return ua.indexOf(arr) > 0;
		  });
		  return res.length > 0;
		}
  },
  watch: {
    //监听eth 私钥输入
    ethprivateKey (newVal, oldVal) {
      if (newVal.length == 64 && _const.priverKeyReg.test(newVal)) {
        let address = "0x" + this.getEthAddress(newVal)
        this.ethAddressShow = false
        this.ethAddressText = address
      } else {
        this.ethAddressShow = true
        this.ethAddressText = ''
      }
    },

    //监听 biut私钥输入
    biutprivateKey (newKey, oldKey) {
      if (newKey.length == 64 && _const.priverKeyReg.test(newKey)) {
        let address = this.getBiutAddress(newKey)
        this.biutAddressShow = false
        this.biutAddressText = address
      } else {
        this.biutAddressShow = true
        this.biutAddressText = ''
      }
    }
  },
}
</script>

<style scoped>
  .wallet-mapping {height: 25.95rem;padding: 4.4rem 6.2rem 0;width: 42.7rem;margin: 0 auto;}
  .input-content {display: flex;justify-content: space-between;}
  .input-text {flex: 1;}
  .input-text:first-child {margin-right: 1.5rem;}
  .input-text span {border: 0.05rem solid rgba(145,162,170,1);height: 2.4rem;box-sizing: border-box;
    border-radius: .5rem;display: flex;align-items: center;padding-left: 1rem;color: #839299;
    font-size: .7rem;font-family: source-Light;}
  .input-text .iost-padding {padding-left: 1.3rem!important;}
  .input-text .address-color {color: #42535B;}

  .wallet-mapping p {font-size: .8rem;color: #42535B;padding-bottom: .5rem;font-family: source-Bold;}
  .wallet-mapping .mapping-top {margin-top: 1.2rem;}

  
  .mapping-tips {display: flex;background:rgba(238,28,57,0.1);padding: .85rem .9rem;margin-bottom: 2.4rem;}
  .mapping-tips img {width: .8rem;height: .8rem;margin: .15rem .5rem 0 0;}
  .mapping-tips ul {margin: 0;padding: 0;}
  .mapping-tips ul li {display: flex;}
  .mapping-tips ul li span {color: #42535B;font-size: .6rem;line-height: 1.8;}

  .tips-list {display: flex;align-items: center;justify-content: space-between;}
  .tips-list >>> .tips_content {padding-top: 0;font-size: .7rem;}

  .wallet-mapping button {margin-top: 2.7rem;width: 11.8rem;}
  @media (max-width: 767px) {
    .wallet-mapping {padding: 1.2rem .2rem;height: auto;width: 90%;}
    .input-content {display: block;margin: 0!important;}
    .input-content .input-text {width: 100%;margin-top: 1.2rem;}
    .wallet-mapping button {margin-bottom: 1rem;width: 100%;}
  }
</style>