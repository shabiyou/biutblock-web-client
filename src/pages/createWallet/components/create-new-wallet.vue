<template>
  <main class="create-pages wallet-content">
    <h2>{{ $t("newWallet.createWallet") }}</h2>

    <!-- 用户密码组件 -->
    <public-pass
      v-model="walletPass1"
      maxlength="30"
      :class="formatError ? 'error-border' : ''"
      :placeholder="$t('newWallet.enterPass1')"
      @loseFocus="loseFocus"
      @getFocus="getFocus"
      @input="passChange"
    />
    <!-- 用户密码提示语组件 -->
    <public-tips v-show="showFormat" :tipsTxt="tipsTxt1" />

    <!-- 用户确认密码组件 -->
    <public-pass
      v-model="walletPass2"
      maxlength="30"
      :placeholder="$t('newWallet.enterPass2')"
      :class="dontAgree ? 'error-border' : ''"
      @input="confrimPassChange"
    />
    <!-- 用户确认密码、密码错误组件 -->
    <public-tips v-show="errorTxt2" :tipsTxt="tipsTxt2" />

    <section class="code-input" :class="codeError ? 'error-border' : ''">
      <input 
        type="text" 
        :placeholder="$t('newWallet.codeIpt')" 
        v-model="inviteCode"
        maxlength="8"
        :readonly="codeDis"
        @input="codeChange" />
    </section>
    <!-- 邀请码错误组件 -->
    <public-tips v-show="codeError||invailidCode" :tipsTxt="tipsCode" />

    <!-- 提示语列表组件 -->
    <tips-list :tipsListKey="tipsListPass" class="tips-list" />

    <public-button
      type="button"
      :text="$t('newWallet.createWallet')"
      :disabled="!createActive"
      :class="createActive ? 'btn-active' : ''"
      @click.native="createFrom"
    />
  </main>
</template>

<script>
const publicTips = () => import("../../../components/public-tips")
import tipsList from './wallet-tips-list'
import publicPass from '../../../components/public-pass'
import publicButton from '../../../components/public-button'

const dataCenterHandler = require('../../../lib/DataCenterHandler')

export default {
  name: 'createWallet',
  props: {
    tipsListPass: Array,
    invailidCode: {
      type: Boolean,
      default: false
    }
  },
  components: {
    publicPass,
    publicButton,
    publicTips,
    tipsList
  },
  data() {
    return {
      walletPass1: '',
      walletPass2: '',
      errorTxt1: false, //密码输入框开始输入的时候显示
      errorTxt2: false, //两次密码不一致设置true
      formatError: false, //密码格式错误
      dontAgree: false, //两次密码不一致border
      showFormat: false, //密码提示不显示
      tipsTxt1: 'passTips.passFormat',
      tipsTxt2: 'passTips.passNoMatch',
      codeError: false,
      inviteCode: '',
      tipsCode: 'newWallet.codeIptError',
      codeDis: false
    }
  },
  created() {
    this.inviteCode = this.getQueryString('code') || ''
    if (this.getQueryString('code')) {
      this.codeDis = true
    }
  },
  computed: {
    //创建钱包按钮是否可点击
    createActive() {
      let pass1 = (this.walletPass1).replace(/\s+/g, "")
      let pass2 = (this.walletPass2).replace(/\s+/g, "")
      let code = (this.inviteCode).replace(/\s+/g, "")
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
        return _const.passReg.test(pass1) && pass1 == pass2 && code.length === 8 ? true : false
      }
    },

    
  },
  methods: {
    //失去焦点
    loseFocus() {
      this.showFormat = false
    },

    //得到焦点
    getFocus() {
      this.showFormat = true
    },

    //密码不能输入中文、空格
    passChange() {
      this.$nextTick(() => {
        this.walletPass1 = this.inputNull(this.walletPass1)
      })
    },

    //确认密码不能输入中文、空格
    confrimPassChange() {
      this.$nextTick(() => {
        this.walletPass2 = this.inputNull(this.walletPass2)
      })
    },

    codeChange () {
      this.$nextTick(() => {
        this.inviteCode = this.inputNull(this.inviteCode)
      })
    },

    //创建钱包
    createFrom () {
      let pass = (this.walletPass1).replace(/\s+/g, "")
      let inviteCode = this.inviteCode
      this.$emit("created", pass, inviteCode)
    }
  },
  watch: {
    inviteCode(newVal, oldVal) {
      if (newVal.length > 0 && newVal.length < 8) {
        this.codeError = true
      } else {
        this.codeError = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.create-pages {
  width: 20.6rem;
  h2 {
    padding: 7.4rem 0 2.1rem;
  }
  .ipt-arr {
    margin-top: 1rem;
  }
  .tips-list {
    padding: 0.6rem 0 1.8rem;
  }
  .code-input {
    border: 0.05rem solid #91a2aa;
    height: 2.3rem;
    background: #fff;
    border-radius: .5rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 1rem;
    margin-top: 1rem;
    @extend %flexCenter;
    input {
      border: 0;
      flex: 1;
    }
  }
}
</style>