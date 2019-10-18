<template>
  <main class="mask">
    <section class="mask_cnt info_mask clearfix">
      <p>{{ $t("passTips.newWalletPass") }}</p>

      <!-- 密码组件及提示语 -->
      <public-pass
        v-model="newWalletPass"
        maxlength="30"
        :placeholder="$t('passTips.newWalletPass')"
        @input="passChange"
      />
      <public-tips :tipsTxt="infoTxt" v-show="passTips" />

      <!-- 取消、确认按钮列表 -->
      <section>
        <button type="button" @click="closeMask">
          {{ $t("mask.cancel") }}
        </button>
        <button
          type="button"
          :disabled="!passActive"
          :class="passActive ? 'btn-active' : ''"
          @click="createFrom"
        >
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
import {mapGetters} from 'vuex'

const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
export default {
  name: 'walletInfoMask',
  props: {
    // infoAddress: String,
    // infoKey: String,
    // infoWord: String,
    // infoPublicKey: String
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
    ...mapGetters({
      infoAddress: 'walletAddress',
      infoKey: 'walletKey',
      infoWord: 'englishWords',
      infoPublicKey: 'walletPublicKey'
    }),
    //新钱包密码按钮是否激活
    passActive() {
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
    passChange() {
      this.$nextTick(() => {
        this.newWalletPass = this.inputNull(this.newWalletPass)
      })
    },

    //取消创建钱包
    closeMask() {
      this.passTips = false
      this.newWalletPass = ''
      this.$emit("close")
    },

    //下载keystroe文件
    createFrom() {
      let walletAddress = this.infoAddress.replace("0x", "")
      let walletKey = this.infoKey
      let walletWord = this.infoWord
      let walletPublickKey = this.infoPublicKey
      let newPass = this.newWalletPass.replace(/\s+/g, '')

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
      this.funDownload(walletName, "" + cipherKeyData.toString() + "")
      this.closeMask()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.info_mask {
  padding: 0.8rem 1.2rem 0.6rem;
  p {
    color: $colorTips;
    font-size: 0.8rem;
    padding-bottom: 0.6rem;
  }
  section {
    float: right;
    padding-top: 1rem;
    button {
      float: left;
      background: linear-gradient(90deg, #c2c2c2 0%, #a5a5a5 100%);
      &:first-child {
        margin-right: 0.6rem;
      }
    }
  }
}
</style>