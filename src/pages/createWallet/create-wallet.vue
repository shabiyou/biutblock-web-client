<template>
  <main class="el-container">
    <main class="wallet-background">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24">
          <!-- 创建钱包 -->
          <create-wallet
            v-if="pages === 1"
            :tipsListPass="tipsListPass"
            @created="createFrom"
          />

          <!-- 下载keystroe文件 -->
          <down-keystore
            v-if="pages === 2"
            :tipsListKey="tipsListKey"
            @down="downUrlTxt"
            @next="continueKey"
          />

          <!-- 保存私钥 -->
          <save-priveate
            v-if="pages === 3"
            :tipsListKey="tipsListKey"
            :privateKey="privateKey"
          />
        </el-col>
      </el-row>

      <!-- 公共背景底部 -->
      <content-footer />
    </main>
  </main>
</template>

<script>
const contentFooter = () => import("../../components/content-footer")
import createWallet from './components/create-new-wallet'
const downKeystore = () => import("./components/create-wallet-down")
const savePriveate = () => import("./components/create-wallet-key")
import tipsImg from '../../assets/images/tipsImg.png'
import walletsHandler from '../../lib/WalletsHandler.js'
const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
export default {
  name: 'newWallet',
  components: {
    contentFooter,
    createWallet,
    downKeystore,
    savePriveate
  },
  props: {},
  data() {
    return {
      pages: 1, //控制显示页面 1 创建钱包  2 保存Keystore文件 3 保存私钥
      privateKey: '', //钱包私钥 -- 页面展示
      userAddress: '', //钱包地址 -- 下载名称
      keyData: '', //当前创建钱包的加密信息
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
      ]
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //创建钱包
    createFrom(e) {
      this.pages = 2 //保存Keystore文件
      let keys = SECUtil.generateSecKeys() //创建钱包
      let privKey64 = keys.privKey //获取创建钱包的私钥
      let englishWords = SECUtil.entropyToMnemonic(privKey64) //助记词
      let pubKey128 = keys.publicKey
      let pubKey128ToString = pubKey128.toString('hex') //公钥
      let userAddressToString = keys.secAddress //地址
      this.userAddress = userAddressToString //赋值当前地址用作创建json文件
      this.privateKey = privKey64 //赋值当前显示私钥

      let keyFileDataJS = {
        [privKey64]: {
          walletName: "New Import",
          privateKey: privKey64,
          publicKey: pubKey128ToString,
          walletAddress: userAddressToString,
          englishWords: englishWords,
        }
      }
      //通过密码加密钱包  
      let cipherKeyData = CryptoJS.AES.encrypt(JSON.stringify(keyFileDataJS), e)
      this.keyData = cipherKeyData.toString()
    },

    //保存keyStore之后继续查看私钥
    continueKey() {
      this.pages = 3
    },

    //下载json文件
    downUrlTxt() {
      var filename = "BIUT" + this.userAddress + ".json";
      this.funDownload(filename, "" + this.keyData + "");
    }
  }
}
</script>
<style scoped>
</style>