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
const publicPass = () => import("../../../components/public-pass")
const publicButton = () => import("../../../components/public-button")
const publicTips = () => import("../../../components/public-tips")
const tipsList = () => import("./wallet-tips-list")
export default {
  name: 'createWallet',
  props: {
    tipsListPass: Array
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

    //创建钱包
    createFrom() {
      let pass = (this.walletPass1).replace(/\s+/g, "")
      this.$emit("created", pass)
    }
  },
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
}
</style>