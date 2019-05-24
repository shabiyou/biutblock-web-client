<template>
  <main class="el-container">
    <main class="wallet-background">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24">
          <!-- 创建钱包 -->
          <section class="create-pages wallet-content" v-if="pages == 1">
            <h2>{{$t('newWallet.createWallet')}}</h2>

            <public-pass
              v-model.trime="walletPass1"
              maxlength="30"
              :class="formatError ? 'error-border' : ''"
              :placeholder="$t('newWallet.enterPass1')" 
              @loseFocus="loseFocus"
              @getFocus="getFocus"
              @input="inputContent1" />
            <public-tips v-show="showFormat" :tipsTxt="tipsTxt1"/>

            <public-pass
              v-model.trime="walletPass2"
              maxlength="30"
              :placeholder="$t('newWallet.enterPass2')" 
              :class="dontAgree ? 'error-border' : ''" 
              @input="inputContent1"/>
            <public-tips v-show="errorTxt2" :tipsTxt="tipsTxt2"/>
            
            <tips-list :tipsListKey="tipsListPass" class="tips-list1"/>

            <public-button
              :text="$t('newWallet.createWallet')"
              :disabled="!createActive"
              :class="createActive ? 'btn-active' : '' "
              @click.native="createFrom"
              type="button"/>
            
          </section>

          <!-- 下载keystroe文件 -->
          <section class="down-keystroe wallet-content" v-if="pages == 2">
            <h2>{{$t('newWallet.saveKeyStore')}}</h2>
            <span @click="downUrlTxt">{{$t('newWallet.keyStoreDown')}}</span>

            <tips-list :tipsListKey="tipsListKey" class="tips-list2" />

            <public-button 
              type="button" 
              class="btn-active"
              :text="$t('newWallet.next')"
              @click.native="continueKey" />
          </section>
        </el-col>
      </el-row>  

      <!-- 保存私钥 -->
      <section class="save-privateKey wallet-content" v-if="pages == 3">
        <h2>{{$t('newWallet.savePrivateKey')}}</h2>
        <article> {{ privateKey }} </article>

        <tips-list :tipsListKey="tipsListKey" class="tips-list3" />
      </section>

      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    
  </main>
</template>

<script>
import contentFooter from '../../components/contentFooter'
import publicPass from '../../components/publicPass'
import publicButton from '../../components/publicButton'
import publicTips from '../../components/publicTips'
import tipsList from './components/tipsList'
import tipsImg from '../../assets/images/tipsImg.png'

import walletsHandler from '../../lib/WalletsHandler.js'
const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
export default {
  name: '',
  components: {
    contentFooter,
    publicPass,
    publicButton,
    publicTips,
    tipsList
  },
  props: {},
  data () {
    return {
      walletPass1: '',
      walletPass2: '',
      errorTxt1: false, //密码输入框开始输入的时候显示
      errorTxt2: false, //两次密码不一致设置true
      formatError: false, //密码格式错误
      dontAgree: false, //两次密码不一致border
      showFormat: false,//密码提示不显示
      pages: 1, //控制显示页面 1 创建钱包  2 保存Keystore文件 3 保存私钥
      tipsTxt1: 'passTips.passFormat',
      tipsTxt2: 'passTips.passNoMatch',
      privateKey: '', //私钥
      userAddress: '', //地址
      privateKeyArr: [],
      tipsListPass: [{
            'id': '01',
            'tips_img': tipsImg,
            'tips_cnt': 'tipsListPass.tipsCnt1',
          },
          {
            'id': '02',
            'tips_img': tipsImg,
            'tips_cnt': 'tipsListPass.tipsCnt2',
          },
          {
            'id': '03',
            'tips_img': tipsImg,
            'tips_cnt': 'tipsListPass.tipsCnt3',
          }
        ],
      tipsListKey: [{
            'id': '01',
            'tips_img': tipsImg,
            'tips_cnt': 'tipsListKey.tipsCnt1',
          },
          {
            'id': '02',
            'tips_img': tipsImg,
            'tips_cnt': 'tipsListKey.tipsCnt2',
          },
          {
            'id': '03',
            'tips_img': tipsImg,
            'tips_cnt': 'tipsListKey.tipsCnt3',
          }
        ],
        testInput: '',
        keyData: '' //当前创建钱包的加密信息
    }
  },
  computed: {
    //创建钱包按钮是否可点击
    createActive() {
      let pass1 = (this.walletPass1).replace(/\s+/g, "")
      let pass2 = (this.walletPass2).replace(/\s+/g, "")
      if (pass1.length > 0 && !(_const.passReg.test(pass1))) {
        this.formatError = true
        this.errorTxt2 = true
        this.tipsTxt2 = 'passTips.passFormatError'
      } else if (pass2.length > 0 && pass1 != pass2 && _const.passReg.test(pass1)) {
        this.formatError = false
        this.dontAgree = true
        this.errorTxt2 = true
        this.tipsTxt2 = 'passTips.passNoMatch'
      } else {
        this.formatError = false
        this.errorTxt2 = false
        this.dontAgree = false
        return _const.passReg.test(pass1) && pass1 == pass2 ? true : false
      }
    },
  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    //失去焦点
    loseFocus () {
      this.showFormat = false
    },

    //得到焦点
    getFocus () {
      this.showFormat = true
    },

    //不能输入中文
    inputContent1 () {
      this.$nextTick(()=> {
        this.walletPass1 = (this.walletPass1).replace(/[\u4E00-\u9FA5]/g,'')
      })
    },

    //不能输入中文
    inputContent2 () {
      this.$nextTick(()=> {
        this.walletPass2 = (this.walletPass2).replace(/[\u4E00-\u9FA5]/g,'')
      })
    },

    //创建钱包
    createFrom() {
      this.pages = 2 //保存Keystore文件
      let pass = (this.walletPass1).replace(/\s+/g, "")
      let keys = SECUtil.generateSecKeys() //创建钱包
      let privKey64 = keys.privKey //获取创建钱包的私钥
      this.privateKey = keys.privKey //赋值当前显示私钥
      let privateKey = privKey64
      let englishWords = SECUtil.entropyToMnemonic(privKey64)
      let pubKey128 = keys.publicKey //公钥
      let pubKey128ToString = pubKey128.toString('hex')
      let userAddressToString = keys.secAddress //地址
      this.userAddress = keys.secAddress //赋值当前地址用作创建json文件
      
      let walletName = 'BIUT' + ""+ keys.userAddress +"" //下载json文件名称
      
      let keyFileDataJS = {
        [privateKey]: {
            walletName: "New Import",
            privateKey: privateKey,
            publicKey: pubKey128ToString,
            walletAddress: userAddressToString,
            englishWords: englishWords,
        }
      }
      //通过密码加密钱包  
      let cipherKeyData = CryptoJS.AES.encrypt(JSON.stringify(keyFileDataJS), pass)
      this.keyData = cipherKeyData.toString()
    },

    //保存keyStore之后继续查看私钥
    continueKey() {
      this.pages = 3
    },

    //下载json文件
    downUrlTxt () {
      var filename = "BIUT" + this.userAddress + ".json";
      this.funDownload(filename, ""+this.keyData+"");
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
    }
  },
  watch: {
    
  },
}
</script>

<style scoped>
  .create-pages {width: 20.6rem;}
  .create-pages h2 {padding: 7.4rem 0 2.1rem;}
  .create-pages .ipt-arr {margin-top: 1rem;}
  .create-pages .tips-list1 {padding: .6rem 0 1.8rem;}

  .down-keystroe {width: 24.5rem;}
  .down-keystroe h2 {padding: 8.4rem 0 2.9rem;}
  .down-keystroe span {display: block;height: 2.4rem;background: rgba(255, 255, 255, 1);border-radius: .5rem;
    border: 1px solid rgba(145, 162, 170, 1);text-align: center;line-height: 2.4rem;color: #42535B;font-size: .8rem;
    font-weight: 500;}
  .down-keystroe .tips-list2 {padding: .8rem 0 2.2rem;}

  .save-privateKey {width: 26.6rem;}
  .save-privateKey h2 {padding: 8.4rem 0 3.1rem;}
  .save-privateKey article {background: rgba(245, 245, 245, 1);color: #42535B;border: .05rem solid rgba(145, 162, 170, 1);
    border-radius: .5rem;font-size: .8rem;font-weight: 500;padding: 1rem;word-wrap: break-word;line-height: 1.5;}
  .save-privateKey .tips-list3 {padding-top: 1.2rem;}

  @media (max-width: 767px) {
    .create-pages,.down-keystroe,.save-privateKey {width: 90%;}
    .create-pages h2,.down-keystroe h2,.save-privateKey h2 {padding-top: 5.4rem;}  
  }
</style>