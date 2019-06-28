<template>
  <main class="mask">
    <section class="mask_cnt info_mask clearfix">
      <p>{{ $t("passTips.newWalletPass") }}</p>

      <public-pass
        v-model = 'newWalletPass'
        maxlength = '30'
        :placeholder = "$t('passTips.newWalletPass')"
        @input = 'passChange' />
      <public-tips :tipsTxt="infoTxt" v-show="passTips" />

      <section>
        <button type="button" @click="closeMask">
          {{ $t("mask.cancel") }}
        </button>
        <button
          type = 'button'
          :disabled = '!passActive'
          :class = "passActive ? 'btn-active' : ''"
          @click = 'createFrom'>
          {{ $t("mask.confirm") }}
        </button>
      </section>

    </section>
  </main>
</template>

<script>
const publicPass = () => import("../../../components/public-pass")
const publicTips = () => import("../../../components/public-tips")
import walletsHandler from '../../../lib/WalletsHandler.js'
const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
export default {
  name: 'walletInfoMask',
  props: {
    infoAddress: String,
    infoKey: String,
    infoWord: String,
    infoPublicKey: String
  },
  components: {
    publicPass,
    publicTips,
  },
  data() {
    return {
      newWalletPass: '', //新钱包密码
      infoTxt: 'passTips.passFormat',//密码提示语
      passTips: false //密码提示语是否显示
    }
  },
  computed: {
    //新钱包密码按钮是否激活
    passActive () {
      let pass = (this.newWalletPass).replace(/\s+/g, "")
      if (pass.length > 0) {
        this.passTips = true
      } else {
        this.passTips = false
      }
      return _const.passReg.test(pass) ? true : false
    }
  },
  methods: {
    //密码不能输入中文、空格
    passChange () {
      this.$nextTick(()=> {
        this.newWalletPass = this.inputNull(this.newWalletPass)
      })
    },

    //取消创建钱包
    closeMask () {
      this.passTips = false
      this.newWalletPass = ''
      this.$emit("close")
    },

    //下载keystroe文件
    createFrom () {
      let walletAddress = this.infoAddress.replace("0x","")
      let walletKey = this.infoKey
      let walletWord = this.infoWord
      let walletPublickKey = this.infoPublicKey
      let newPass = this.newWalletPass.replace(/\s+/g,'')

      let keyFileDataJS = {
        [walletKey]: {
            walletName: "New Import",
            privateKey: walletKey,
            publicKey: walletPublickKey,
            walletAddress: walletAddress,
            englishWords: walletWord,
        }
      }
      //通过密码加密钱包  
      let cipherKeyData = CryptoJS.AES.encrypt(JSON.stringify(keyFileDataJS), newPass)
      var walletName = "BIUT" + walletAddress + ".json"
      this.funDownload(walletName , "" + cipherKeyData.toString() + "")
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
  },
}
</script>

<style scoped>
  .info_mask {padding: .8rem 1.2rem .6rem;}
  .info_mask p {color: #42535B;font-size: .8rem;padding-bottom: .6rem;}
  .info_mask section {float: right;padding-top: 1rem;}
  .info_mask section button {float: left;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}
  .info_mask section button:first-child {margin-right: .6rem;}
</style>