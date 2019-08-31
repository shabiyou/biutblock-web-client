<template>
  <main class="el-container">
    <main class="wallet-background">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24">
          <!-- 创建钱包 -->
          <create-wallet v-if="pages === 1" ref="create" :tipsListPass="tipsListPass" :invailidCode="inviteCodeError" @created="createFrom" />

          <!-- 下载keystroe文件 -->
          <down-keystore v-if="pages === 2" :tipsListKey="tipsListKey" @down="downUrlTxt" @next="continueKey" />

          <!-- 保存私钥 -->
          <save-priveate v-if="pages === 3" :tipsListKey="tipsListKey" :privateKey="privateKey" />
        </el-col>
      </el-row>

      <!-- 公共背景底部 -->
      <content-footer />

      <wallet-transparent :txt="systemErrorTxt" v-show="transparentShow" />
    </main>
  </main>
</template>

<script>
const contentFooter = () => import("../../components/content-footer")
const walletTransparent = () => import("../../components/wallet-transparent")
import createWallet from './components/create-new-wallet'
const downKeystore = () => import("./components/create-wallet-down")
const savePriveate = () => import("./components/create-wallet-key")
import tipsImg from '../../assets/images/tipsImg.png'
import walletsHandler from '../../lib/WalletsHandler.js'
const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
const random = require('string-random')
const dataCenterHandler = require('../../lib/DataCenterHandler')
const sourceCode = 'ZnVuY3Rpb24gdHJhbnNmZXIoYWRkcmVzcywgYW1vdW50KSB7CiAgICB2YXIgdHJhbnNmZXJGbGFnID0gZmFsc2UKICAgIGlmKGFtb3VudD4wKXsKICAgICAgICB0cmFuc2ZlckZsYWcgPSB0cnVlCiAgICB9CiAgICByZXR1cm4geydBZGRyZXNzJzogYWRkcmVzcywgJ0Ftb3VudCc6IGFtb3VudCwgJ1RyYW5zZmVyRmxhZyc6IHRyYW5zZmVyRmxhZ30KfQoKZnVuY3Rpb24gbG9jayhiZW5lZml0QWRkcmVzcywgYW1vdW50LCB0aW1lKXsKICAgIHZhciBsb2NrRmxhZyA9IGZhbHNlCiAgICBpZihhbW91bnQ+MCl7CiAgICAgICAgbG9ja0ZsYWcgPSB0cnVlCiAgICB9CiAgICByZXR1cm4geydBZGRyZXNzJzogYmVuZWZpdEFkZHJlc3MsICdBbW91bnQnOiBhbW91bnQsICdUaW1lJzogdGltZSwgJ0xvY2tGbGFnJzogbG9ja0ZsYWd9Cn0KCmZ1bmN0aW9uIHJlbGVhc2VMb2NrKGJlbmVmaXRBZGRyZXNzLCBhbW91bnQpewogICAgdmFyIHJlbGVhc2VMb2NrRmxhZyA9IGZhbHNlCiAgICBpZihhbW91bnQ+MCl7CiAgICAgICAgcmVsZWFzZUxvY2tGbGFnID0gdHJ1ZQogICAgfQogICAgcmV0dXJuIHsnQWRkcmVzcyc6IGJlbmVmaXRBZGRyZXNzLCAnQW1vdW50JzogYW1vdW50LCAnUmVsZWFzZUxvY2tGbGFnJzogcmVsZWFzZUxvY2tGbGFnfQp9'

export default {
  name: 'newWallet',
  components: {
    contentFooter,
    createWallet,
    downKeystore,
    savePriveate,
    walletTransparent
  },
  props: {},
  data() {
    return {
      pages: 1, //控制显示页面 1 创建钱包  2 保存Keystore文件 3 保存私钥
      privateKey: '', //钱包私钥 -- 页面展示
      userAddress: '', //钱包地址 -- 下载名称
      keyData: '', //当前创建钱包的加密信息
      inviteCodeError: false,
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
      transparentShow: false,
      systemErrorTxt: ''
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //创建钱包
    createFrom(e, inviteCode) {
      this.$refs.create.createBtn = 'newWallet.createBtns'
      this.$refs.create.createReadonly = true
      let keys = SECUtil.generateSecKeys() //创建钱包
      let privKey64 = keys.privKey //获取创建钱包的私钥
      let englishWords = SECUtil.entropyToMnemonic(privKey64) //助记词
      let pubKey128 = keys.publicKey
      let pubKey128ToString = pubKey128.toString('hex') //公钥
      let userAddressToString = keys.secAddress //地址
      let contractAddress = SECUtil.generateContractAddressString(userAddressToString)
      this.userAddress = userAddressToString //赋值当前地址用作创建json文件
      this.privateKey = privKey64 //赋值当前显示私钥

      let transfer = {
        nonce: "1",
        timestamp: new Date().getTime(),
        walletAddress: userAddressToString,
        sendToAddress: contractAddress,
        amount: '0',
        gasLimit: '0',
        gasPrice: '0',
        txFee: '0',
        chainName: 'SEC',
        inputData: JSON.stringify({
          sourceCode: sourceCode,
          totalSupply: 100000000,
          tokenName: `SEC-${contractAddress}-${random(6)}`
        })
      }

      let encryptTransfer = this._encryptTransaction(privKey64, transfer)
      this.createOwnContract(encryptTransfer)

      dataCenterHandler.createWallet({
        address: this.userAddress,
        contractAddress: contractAddress,
        invitationCode: inviteCode,
        privateKey: privKey64
      }, (body) => {
        if (body === undefined || body === "") {
          this.transparentShow = true
          this.systemErrorTxt = 'public.systemError'
          setTimeout(() => {
            this.transparentShow = false
          }, 3000)
          this.$refs.create.createBtn = 'newWallet.createBtn'
          this.$refs.create.createReadonly = false
        } else if (body.status && body.doc[0].role !== 'Owner') {
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
          this.pages = 2 //保存Keystore文件
          this.$refs.create.createBtn = 'newWallet.createBtn'
          this.$refs.create.createReadonly = false
        } else {
          this.inviteCodeError = true
        }
      })
    },

    _encryptTransaction: function (privateKey, transfer) {
      let timeStamp = new Date().getTime()
      let transferData = [{
        timestamp: timeStamp,
        from: transfer.walletAddress,
        to: transfer.sendToAddress,
        value: transfer.amount,
        txFee: transfer.txFee,
        nonce: transfer.nonce,
        gasLimit: '0',
        gas: '0',
        gasPrice: '0',
        data: '',
        inputData: transfer.inputData,
        chainName: transfer.chainName
      }]
      const tokenTxBuffer = [
        SECUtil.bufferToInt(transferData[0].timestamp),
        Buffer.from(transferData[0].from, 'hex'),
        Buffer.from(transferData[0].to, 'hex'),
        Buffer.from(transferData[0].value),
        Buffer.from(transferData[0].gasLimit),
        Buffer.from(transferData[0].gas),
        Buffer.from(transferData[0].gasPrice),
        Buffer.from(transferData[0].nonce),
        Buffer.from(transferData[0].inputData),
        Buffer.from(transferData[0].chainName)
      ]
      let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
      let signature = SECUtil.ecsign(txSigHash, Buffer.from(privateKey, 'hex'))
      transferData[0].data = {
        v: signature.v,
        r: signature.r.toString('hex'),
        s: signature.s.toString('hex')
      }
      return transferData
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