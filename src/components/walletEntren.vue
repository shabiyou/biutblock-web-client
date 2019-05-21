<template>
  <main class="wallet-background">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24">
        <h2>{{ $t("walletInfo.accessWallet") }}</h2>
        <!-- 按钮组 -->
        <section class="radio-arr">
          <section
            class="radio-box"
            v-for="(item, index) in radioList"
            :key="item.id">
            <label class="radio" :class="{ on: item.isChecked }"></label>
            <input
              class="ipt-radio"
              :checked="item.isChecked"
              @click="checkTab(index)"
              type="radio" />
              
            <span>{{ $t(item.value) }}</span>
          </section>
        </section>

        <!-- keyStore 登陆 -->
        <section class="key-store" v-show="radioPages == 0">
          <p>{{ $t("walletInfo.checkKeyStore1") }}</p>
          <input
            type="file"
            :placeholder="$t('walletInfo.checkKeyStore2')"
            @change="tirggerFile($event)" />

          <section>
            <span>{{ $t(KeyStoreVal) }}</span>
          </section>
          <public-pass
            v-if="showPass"
            v-model.trim="passVal"
            maxlength="30"
            :class="walletPassError ? 'error-border' : ''"
            :placeholder="$t('passTips.passEncryption')"
            @input="inputContentPass" />

          <public-tips :tipsTxt="walletPassErrorTxt" v-show="walletPassError" />

          <public-button
            class="key-store-btn"
            :disabled="!keyStoreActive"
            :class="keyStoreActive ? 'btn-active' : ''"
            :text = " $t('walletInfo.unlock')"
            @click.native="walletInfoForm" />
        </section>

        <!-- 私钥登陆 -->
        <section class="private-key" v-show="radioPages == 1">
          <p>{{ $t("walletInfo.inputPrivateKey1") }}</p>

          <public-pass
            v-model.trim="privateKeyVal"
            maxlength="64"
            :placeholder="$t('walletInfo.inputPrivateKey2')"
            :class="privateKeyError ? 'error-border' : ''"
            @input="inputContentKey" />

          <public-tips :tipsTxt="privateKeyErrorTxt" v-show="privateKeyError" />
          
          <public-button
            class="private-key-btn"
            :disabled="!privateKeyActive"
            :class="privateKeyActive ? 'btn-active' : ''"
            :text = "$t('walletInfo.unlock')"
            @click.native="walletInfoForm" />

        </section>
      </el-col>
    </el-row>
    <!-- 公共背景底部 -->
    <content-footer />
  </main>
</template>

<script>
import contentFooter from './contentFooter'
import publicButton from './publicButton'
import publicPass from './publicPass'
import publicTips from './publicTips'
const SECUtil = require('@sec-block/secjs-util')
const CryptoJS = require('crypto-js')
export default {
  name: '',
  components: {
    contentFooter,
    publicButton,
    publicPass,
    publicTips
  },
  props: {},
  data() {
    return {
      passVal: '',  //密码
      privateKeyVal: '', //私钥
      KeyStoreUrl: '', //keystroe文件地址

      showPass: false,//默认不显示密码输入框
      privateKeyError: false,//私钥错误true显示
      walletPassError: false,//密码
      privateKeyErrorTxt: 'walletInfo.invalidPrivateKey',
      walletPassErrorTxt: 'passTips.passError',
      KeyStoreVal: 'walletInfo.checkKeyStore2', //绑定keyStore的值
      radioPages: 0, //keyStore与私钥切换显示  0 显示keyStore  1 显示私钥
      radioList:[
          {
            id: '0',
            value: 'Keystore',
            isChecked: true,
          },
          {
            id: '1',
            value: 'walletInfo.privateKey',
            isChecked: false,
          },
      ],
    }
  },
  computed: {
    //keyStore按钮是否可点击
    keyStoreActive () {
      let passVal = this.passVal.replace(/\s+/g, "")
      if (passVal.length > 0 && !(_const.passReg.test(passVal))) {
        this.walletPassError = true
      } else {
        this.walletPassError = false
      }
      return _const.passReg.test(passVal)  ? true : false
    },

    //私钥按钮是否可点击
    privateKeyActive () {
      let privateKeyVal = this.privateKeyVal.replace(/\s+/g, "")
      if (privateKeyVal.length > 0 && privateKeyVal.length < 64) {
        this.privateKeyError = true
      } else if (!(_const.priverKeyReg.test(privateKeyVal)) && privateKeyVal.length == 64) {
        this.privateKeyError = true
      } else {
        this.privateKeyError = false
      }
      return privateKeyVal.length == 64 && _const.priverKeyReg.test(privateKeyVal) ? true : false
    },
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //keyStore文件登陆不能输入中文
    inputContentPass () {
        this.$nextTick(()=> {
          this.passVal = this.passVal.replace(/[\u4E00-\u9FA5]/g,'')
        })
    },

    //私钥登陆不能输入中文
    inputContentKey () {
       this.$nextTick(()=> {
          this.privateKeyVal = this.privateKeyVal.replace(/[\u4E00-\u9FA5]/g,'')
        })
     },

    //登陆钱包
    walletInfoForm () {
      //1 私钥登陆  0 keyStore登陆
      if (this.radioPages === 1) {
        let privateVal = this.privateKeyVal.replace(/\s+/g, "")
        let privateKeyBuffer = SECUtil.privateToBuffer(privateVal)
        let extractAddress = SECUtil.privateToAddress(privateKeyBuffer) //返回值
        let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer)
        //传递给父级需要的参数
        let parm = {
          address: `0x${extractAddress.toString('hex')}`,
          privateKey: privateVal
        }
        this.$emit('login', parm)
      } else {
          let passVal = this.passVal.replace(/\s+/g, "")
          let that = this
          //解锁钱包
          this.$axios.get(''+this.KeyStoreUrl+'').then(function (response) {
                let jsonstr = response.data
                let keyData = CryptoJS.AES.decrypt(jsonstr.toString(), passVal).toString(CryptoJS.enc.Utf8)
                if (response.status == 200) {
                  let walletData = keyData.split(':{')
                  let arrData1 = '{' + walletData[1].replace("}}","") + '}'
                  let arrData = eval('(' + arrData1 + ')')
                  let parm = {
                    address: '0x'+ arrData.walletAddress,
                    privateKey: arrData.privateKey
                  }
                  that.$emit('login', parm)
                }
            }).catch(function (error) {
                that.walletPassError = true
            });
      }
    },

    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files; // (利用console.log输出看结构就知道如何处理档案资料)
      if (file.length === 1) {
        this.KeyStoreUrl = this.getObjectURL(file[0]) // 上传钱包获取本地地址
        this.KeyStoreVal = file[0].name
        this.showPass = true
      } else {
        this.KeyStoreVal = 'walletInfo.checkKeyStore2'
        this.passVal = ''
        this.walletPassError = false
        this.showPass = false
      }
    },

    //切换登陆方式
    checkTab (index) {
      this.radioPages = index
      this.radioList.forEach((item) => {
        item.isChecked = false;
      });
      this.radioList[index].isChecked = true;
    },
  },
}
</script>

<style scoped>
.el-row {height: 30.35rem;}
/* 单选按钮组 */
.radio-arr {display: flex;height: 1.5rem;}
.radio-arr .radio-box:first-child {margin-right: 5rem;}
.radio-arr .radio-box { display: flex;position: relative;height: 1.5rem;font-size: .8rem;color: #91A2AA;
  align-items: center;justify-content: center;}
.radio-arr .radio-box .ipt-radio {display: inline-block;position: absolute;opacity: 0;width: 1.2rem;
  height: 1.2rem;cursor: pointer;left: 0;outline: none;-webkit-appearance: none;margin-right: .8rem;}
.radio-arr .radio-box .radio {display: inline-block;width: 1.2rem;height: 1rem;cursor: pointer;
  background-size: cover;background-image: url('../assets/images/radio.png');}
.radio-arr .radio-box .on {width: 1.2rem;height: 1rem;background-size: cover;
  background-image: url('../assets/images/radios.png');}
.radio-arr .radio-box span {margin-left: .8rem;}

/* keyStore 与 私钥 */
.private-key,.key-store,.radio-arr,h2 {width: 20.6rem;margin: 0 auto;}

h2 {margin: 8.4rem auto 2.7rem;}

.key-store p,.private-key p {font-size: .9rem;color: #42535B;font-weight: 500;
  padding: 1.45rem 0 .55rem;font-family: source-Medium;}
.key-store .key-store-btn,.private-key .private-key-btn {margin-top: 1.6rem;}

.key-store {position: relative;}
.key-store input[type='file'] {width: 20.6rem;height: 2.4rem;position: absolute;top: 3rem;opacity: 0;
  max-width: 100%!important;font-family: source-Regular;}
.key-store section {width: 20.6rem;height: 2.3rem;border: .05rem solid rgba(145,162,170,1);text-align: center;
  border-radius: .5rem;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;line-height: 2.4rem;
  color: #42535B;font-size: .7rem;font-weight: 400;max-width: 100%!important;box-sizing: border-box;}
.key-store .ipt-arr {margin-top: 20px;}
.key-store section:hover,.key-store input[type='file']:hover {cursor: pointer;}

@media (max-width: 767px) {
 .private-key,.key-store,.radio-arr,h2 {width: 90%;}
 h2 {margin-top: 6.4rem;}
}
</style>