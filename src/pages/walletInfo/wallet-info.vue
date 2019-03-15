<template>
  <el-container>
    <!-- 白色大背景 -->
    <main>
      <!-- 内容展示区域 -->
      <!-- 查看信息认证 -->
      <el-row v-if="infoPages == 1">
        <el-col :xs="2" :sm="0" :md="0">&nbsp;</el-col>
        <el-col :xs="20" :sm="24" :md="24">
          <section class="content_list">
            <h2>{{$t('walletInfo.accessWallet')}}</h2>
            <!-- 按钮组 -->
            <section class="radio_arr">
              <section class="radio_box" v-for="(item, index) in radioList" :key="item.id">
                <label class="radio" :class="{'on':item.isChecked}"></label>
                <input class="ipt_radio" 
                  :checked='item.isChecked'
                  @click="checkTab(index)" type="radio"><span>{{ $t(item.value) }}</span>
              </section>
            </section>
        
            <!-- keyStore 登陆 -->
            <section class="key_store" v-if="radioPages == 0">
              <p>{{$t('walletInfo.checkKeyStore1')}}</p>
              <input type="file" accept="application/json" :placeholder="$t('walletInfo.checkKeyStore2')" @change="tirggerFile($event)">
              <section>
                <span>{{ $t(KeyStoreVal) }}</span>
              </section>
              <public-ipt 
                  v-if="showPass" 
                  v-model="passVal"
                  maxlength="30" 
                  class="mt1" 
                  :placeholder="$t('passTips.passEncryption')" 
                  :class="walletPassError?'errorBorder':''" 
                  @input="inputContentPass"></public-ipt>
              <tips-content :tipsTxt="walletPassErrorTxt" v-show="walletPassError"></tips-content>
              <public-btn class="key_store_btn"
              :disabled="!keyStoreActive" :class="keyStoreActive?'btn_active':''"
              @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
            <!-- 私钥登陆 -->
            <section class="private_key" v-if="radioPages == 1">
              <p>{{$t('walletInfo.inputPrivateKey1')}}</p>

              <public-ipt
                  v-model="privateKeyVal"
                  maxlength="64" 
                  :placeholder="$t('walletInfo.inputPrivateKey2')" 
                  :class="privateKeyError?'errorBorder':''" 
                  @input="inputContentKey"></public-ipt>
              
              <tips-content :tipsTxt="privateKeyErrorTxt" v-show="privateKeyError"></tips-content>
              <public-btn class="private_key_btn"
                :disabled="!privateKeyActive" :class="privateKeyActive?'btn_active':''"
                @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
          </section>
        </el-col>
      </el-row>    
      <!-- 钱包信息 -->
      <section class="info_content" v-if="infoPages == 2">
        <section>
          <ul>
            <li>
              <h4>{{$t('walletInfo.walletAddress')}}</h4>
              <p>{{ walletAddress }}</p>
            </li>
            <li>
              <h4>{{$t('walletInfo.walletPrivateKey')}}</h4>
              <p>{{ walletKey }}</p>
            </li>
            <li>
              <h4>{{$t('walletInfo.walletMoney')}}</h4>
              <p>{{ walletMoney }} SEC</p>
            </li>
          </ul>
        </section>
        <section>
          <figcaption>
            <div>
              <qrcode :value="walletAddress" :options="{ size: 93 }"></qrcode>
            </div>
            <p>{{$t('walletInfo.qrCode')}}</p>
          </figcaption>
          <span @click="maskShow=true">{{$t('walletInfo.newKeyStore')}}</span>
        </section>
      <!-- 内容展示区域结束 -->
      </section>
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- 遮罩层 -->
    <section v-if="maskShow">
      <section class="mask"></section>
      <section class="mask_cnt info_mask clearfix">
        <p>{{$t('passTips.newWalletPass')}}</p>
        <public-ipt 
          v-model="newWalletPass"
          maxlength="30"
          :placeholder="$t('passTips.newWalletPass')" 
          @input="inputContentNewPass"></public-ipt>
        <tips-content :tipsTxt="infoTxt" v-show="passTips"></tips-content>
        <section>
          <button type="button" @click="closeMask">{{$t('mask.cancel')}}</button>
          <button type="button" 
            :disabled="!passActive" 
            :class="passActive?'btn_active':''"
            @click="createWallet">{{$t('mask.confirm')}}</button>
        </section>
      </section>
    </section>
  </el-container>
</template>

<script>
import contentFooter from '../componentsPublic/content-footer'
import publicIpt from '../componentsPublic/pubic-ipt-pass'
import tipsContent from '../componentsPublic/tips-content'
import publicBtn from '../componentsPublic/public-btn'
import Qrcode from '@xkeshi/vue-qrcode'
import walletsHandler from '../../lib/WalletsHandler.js'
import walletMethods from '../../utils/publicMethode.js'
const SECUtil = require('@sec-block/secjs-util')
const CryptoJS = require('crypto-js')
export default {
  name: '',
  data () {
    return {
      walletAddress: '',//钱包地址
      walletKey: '',//钱包私钥
      walletMoney: '0',//钱包SEC币
      infoTxt: 'passTips.passFormat',
      privateKeyErrorTxt: 'walletInfo.invalidPrivateKey',
      walletPassErrorTxt: 'passTips.passError',
      infoPages: 1,//页面相关展示  1 登陆 2 信息
      maskShow: false,//弹窗显示与隐藏
      privateKeyError: false,//私钥错误true显示
      walletPassError: false,//密码
      showPass: false,//默认不显示密码输入框
      radioPages: 0, //keyStore与私钥切换显示  0 显示keyStore  1 显示私钥
      KeyStoreVal: 'walletInfo.checkKeyStore2', //绑定keyStore的值
      keyStoreAddress:'',//keyStore上传文件地址
      passVal: '', //绑定pass的值
      privateKeyVal: '', //绑定私钥的值
      newWalletPass: '',//新钱包密码
      passTips: false,
      // privateInoKey: "",
      // userInoAddress: "",
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
      KeyStoreUrl: ''
    }
  },
  methods: {
     //keyStore文件登陆 去空
     inputContentPass () {
        this.passVal = this.passVal.replace(/^\s+|\s+$/g, '')
        this.$nextTick(()=> {
          this.passVal = this.passVal.replace(/[\u4E00-\u9FA5]/g,'')
        })
     },
     //私钥登陆 去空
     inputContentKey () {
       this.privateKeyVal = this.privateKeyVal.replace(/^\s+|\s+$/g, '')
       this.$nextTick(()=> {
          this.privateKeyVal = this.privateKeyVal.replace(/[\u4E00-\u9FA5]/g,'')
        })
     },
     //创建新钱包 去空
     inputContentNewPass () {
       this.newWalletPass = this.newWalletPass.replace(/^\s+|\s+$/g, '')
       this.$nextTick(()=> {
          this.newWalletPass = this.newWalletPass.replace(/[\u4E00-\u9FA5]/g,'')
        })
     },
    //登陆
    walletInfoForm () {
      
      //1 私钥登陆  0 keyStore登陆
      if (this.radioPages === 1) {
        let privateVal = this.privateKeyVal.replace(/^\s+|\s+$/g, '')
        var key = /^[A-Za-z0-9]+$/
        if (!key.test(privateVal)) {
          this.privateKeyError = true
          return
        } else {
            //let privateKey = "3f1c81dc0cbd62f1561b4e10f34d88c7944239cff5faccecd3339f6514bbe390"
            let privateKeyBuffer = SECUtil.privateToBuffer(privateVal)
            let extractAddress = SECUtil.privateToAddress(privateKeyBuffer) //返回值
            let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer)
            this.infoPages = 2
            this.walletAddress = `0x${extractAddress.toString('hex')}`
            this.walletKey = privateVal
            this.getWalletBalance (`${extractAddress.toString('hex')}`).then(res=>{
                this.walletMoney = res
            })
        }
      } else {
          var passVal = this.passVal.replace(/^\s+|\s+$/g, '')
          let that = this
          var pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
          if (!pass.test(passVal)) {
            this.walletPassError = true
            return
          } else {
            //解锁钱包
            this.$axios.get(''+this.KeyStoreUrl+'').then(function (response) {
                let jsonstr = eval('(' + response.data + ')')
                let keyData = CryptoJS.AES.decrypt(jsonstr.data.toString(), passVal).toString(CryptoJS.enc.Utf8)
                if (response.status == 200) {
                  let walletData = JSON.parse(keyData)
                  that.walletAddress = '0x'+ walletData.SECundefined.walletAddress
                  that.walletKey = walletData.SECundefined.privateKey
                  that.getWalletBalance (walletData.SECundefined.walletAddress).then(res=>{
                    that.walletMoney = res
                  })
                  that.infoPages = 2
                }
            }).catch(function (error) {
                that.walletPassError = true
            });
          }
      }
    },
    
    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files;
     
      if (file.length === 1) {
        this.KeyStoreUrl = this.getObjectURL(file[0]) // 上传钱包获取本地地址 
        this.KeyStoreVal = file[0].name
         console.log(file[0].name)
        this.showPass = true
      } else {
        this.KeyStoreVal = 'walletInfo.checkKeyStore2'
        this.passVal = ''
        this.walletPassError = false
        this.showPass = false
      }
    },
    //取消创建新钱包
    closeMask () {
      this.maskShow = false
      this.passTips = false
      this.newWalletPass = ''
    },
    //确认创建钱包
    createWallet () {
      let newPass = this.newWalletPass.replace(/^\s+|\s+$/g, '')
      let keys = SECUtil.generateSecKeys() //创建钱包
      let privKey64 = keys.privKey //获取创建钱包的私钥
      let privateKey = privKey64
      let englishWords = SECUtil.entropyToMnemonic(privKey64)
      let pubKey128 = keys.publicKey //公钥
      let pubKey128ToString = pubKey128.toString('hex')
      let userAddressToString = keys.secAddress //地址
      let walletName  = 'SEC' + ""+ keys.userAddress +"" 
      let keyFileDataJS = {
            [walletName]: {
              'privateKey': privateKey,
              'publicKey': pubKey128ToString,
              'walletAddress': userAddressToString
            }
      }
      //通过密码加密钱包  
      let cipherKeyData = CryptoJS.AES.encrypt(JSON.stringify(keyFileDataJS), newPass)
      var json = "" + userAddressToString + ".json"
      this.funDownload("SEC" + json + "", "{'version':3,'data':'" + cipherKeyData.toString() + "'}")
      this.closeMask()
    },
    // 下载文件方法
    funDownload (filename, content) {
          var eleLink = document.createElement('a');
          eleLink.download = filename;
          eleLink.style.display = 'none';
          // 字符内容转变成blob地址
          var blob = new Blob([content], {type: "application/octet-stream"});
          eleLink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(eleLink);
          eleLink.click();
          // 然后移除
          document.body.removeChild(eleLink);
    },
    //切换登陆方式
    checkTab (index) {
      this.radioPages = index
      this.radioList.forEach((item) => {
        item.isChecked = false;
      });
      this.radioList[index].isChecked = true;
    },

    //获取钱包的交易信息
    getTransferHistory () {
      let url = 'http://13.209.3.183:3001/rpctransfer/callrpc'
      let walletAddress = ''
      let postData = 
      {
        "method":"sec_getTransactions",
        "params":[walletAddress]
      }

      fetch(url, {
          method: 'post',
          body: JSON.stringify(postData), // request is a string
          headers: httpHeaderOption
        }).then( (res) => res.json()).then((text) => {
          //交易池中的交易
          JSON.parse(text.body).result.resultInPool
          //该钱包上链的交易
          JSON.parse(text.body).result.resultInChain
        })
    }


  },
  components: {
    contentFooter,
    publicIpt,
    tipsContent,
    publicBtn,
    qrcode: Qrcode
  },
  computed: {
    //keyStore按钮是否可点击
    keyStoreActive () {
      if (this.passVal.length == 0) {
        this.walletPassError = false
      }
      return this.passVal.length > 7 ? true : false
    },

    //私钥按钮是否可点击
    privateKeyActive () {
      return this.privateKeyVal.length > 63 ? true : false
    },

    //新钱包密码
    passActive () {
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      if (this.newWalletPass.length > 0) {
        this.passTips = true
      } else {
        this.passTips = false
      } 
      return this.newWalletPass.length > 7 && pass.test(this.newWalletPass) ? true : false
    },
  },
  created() {
    
  },
}
</script>

<style scoped>
  main .el-row {height: 30.35rem;}
  /* 信息内容 */
  .info_content {padding: 4.6rem 3.3rem 0;display: flex;justify-content: space-between;height: 25.75rem;}
  .info_content section:first-child {width: 35.8rem;max-width: 100%;}
  .info_content section:first-child ul li {border-bottom: .05rem solid #CFDEDB;color: #42535B;padding-top: 2.2rem;}
  .info_content section:first-child ul li:first-child {padding-top: 0rem;}
  .info_content section:first-child ul li h4 {margin: 0;font-size: 1rem;font-weight: 300;}
  .info_content section:first-child ul li p {padding: .8rem 0 2.3rem;font-size: .8rem;font-weight: 500;
    word-wrap:break-word;white-space:pre-wrap;width: calc(100% - 2.3rem);}
  .info_content section:last-child {display: flex;flex-direction: column;justify-content: space-between;
    color: #42535B;font-size: .7rem;font-weight: 300;align-items: flex-end;}
  .info_content section:last-child figcaption {display: flex;align-items: center;flex-direction: column;}
  .info_content section:last-child figcaption div {width: 4.65rem;height: 4.65rem;margin-bottom: .8rem;}
  .info_content section:last-child span {width: 10.85rem;border: 0;color: #fff;height: 2.2rem;border-radius: .5rem;
    background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);display: inline-block;
    text-align: center;line-height: 2.2rem;}
  .info_content section:last-child span:hover {cursor: pointer;}

  /* 弹窗 */
  .info_mask {padding: .8rem 1.2rem .6rem;}
  .info_mask p {color: #42535B;font-size: .8rem;padding-bottom: .6rem;}
  .info_mask section {float: right;padding-top: 1rem;}
  .info_mask section button {float: left;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}
  .info_mask section button:first-child {margin-right: .6rem;}
</style>