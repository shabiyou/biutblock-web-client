<template>
  <main>
    <header class="pool-login-header">
      <h2>{{ $t("pool.poolLogin") }}</h2>
    </header>
    <section class="pool-login-body el-container">
      <section
        :class="[keyError ? 'errorBorder' : '', margnB ? 'margin-bottom' : '']"
      >
        <input
          type="password"
          :placeholder="$t('pool.poolLoginIpt')"
          v-model="walletKey"
          maxlength="64"
        />
      </section>

      <p v-show="keyError">{{ $t(walletKeyErrTxt) }}</p>

      <public-button
        :text="$t(keyLoginBtn)"
        :class="loginBtn ? 'btn-active' : ''"
        :disabled="!loginBtn"
        @click.native="loginFrom"
      />
    </section>
  </main>
</template>

<script>
import publicButton from '../../../components/public-button'
const SECUtil = require('@biut-block/biutjs-util')
const dataCenterHandler = require('../../../lib/DataCenterHandler')
export default {
  name: '',
  components: {
    publicButton
  },
  props: {},
  data() {
    return {
      walletKey: '',
      keyError: false,
      margnB: false,
      walletKeyErrTxt: '',
      keyLoginBtn: 'pool.poolLoginBtn'
    }
  },
  computed: {
    loginBtn() {
      let key = this.walletKey.replace(/\s+/g, "")
      if (key.length > 0 && !_const.priverKeyReg.test(key)) {
        this.keyError = true
        this.margnB = true
      } else {
        this.keyError = false
        this.margnB = false
        return key.length == 64 && _const.priverKeyReg.test(key) ? true : false
      }
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    /**
     * 登陆成功：记录登陆状态、地址、私钥
     * 
     */
    loginFrom() {
      this.keyLoginBtn = 'pool.poolLoginBtns'
      try {
        let privateVal = this.walletKey.replace(/\s+/g, "")
        let privateKeyBuffer = SECUtil.privateToBuffer(privateVal)
        let extractAddress = SECUtil.privateToAddress(privateKeyBuffer).toString('hex')//钱包地址
        let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer).toString('hex')//钱包公钥
        let extractPhrase = SECUtil.entropyToMnemonic(privateKeyBuffer)//钱包助记词
        //传递给父级需要的参数
        let parm
        dataCenterHandler.findOutWallet({
          address: extractAddress
        }, (parent) => {
          if (parent === undefined || parent === "") {
            alert($('public.systemError'))
            this.keyLoginBtn = 'pool.poolLoginBtn'
          } else if (parent.status) {
            parm = {
              address: '0x' + extractAddress,
              privateKey: privateVal,
              englishWords: extractPhrase,
              publicKey: extractPublicKey,
              invitationCode: parent.doc[0].invitationCode,
              ownInvitationCode: parent.doc[0].ownInvitationCode,
              mortgagePoolAddress: parent.doc[0].mortgagePoolAddress,
              ownPoolAddress: parent.doc[0].ownPoolAddress,
              mortgageValue: parent.doc[0].mortgageValue,
              role: parent.doc[0].role
            }
            this.$emit('login', parm)
            this.walletKey = ""
            this.keyLoginBtn = 'pool.poolLoginBtn'
          } else {
            this._inputError()
            this.walletKeyErrTxt = 'pool.poolInvailidError'
          }
        })
      } catch (err) {
        this._inputError()
        this.walletKeyErrTxt = 'pool.poolLoginIptError'
      }
    },

    _inputError() {
      this.keyError = true
      this.margnB = true
      this.walletKey = ""
      this.keyLoginBtn = 'pool.poolLoginBtn'
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
main {
  background: #fff;
  .pool-login-header {
    @include bgCover("../../../assets/images/poolLogin.png");
    height: 10rem;
    h2 {
      font-size: 1.6rem;
      text-align: center;
      color: #fff;
      padding-top: 3.8rem;
    }
  }
  .pool-login-body {
    flex-direction: column;
    align-items: center;
    padding: 3.6rem 0 25rem;
    section {
      width: 21.4rem;
      padding: 0.4rem 0;
      margin-bottom: 3.1rem;
      @include border($d: bottom, $c: #e6e6e6);
      box-sizing: border-box;
      input {
        width: 100%;
        border: 0;
        height: 1.5rem;
        line-height: 1.5rem;
      }
    }
    .errorBorder {
      @include border($c: $colorRed!important, $d: bottom);
    }
    p {
      width: 21.4rem;
      color: $colorRed;
      font-size: 0.6rem;
      text-align: right;
      padding: 0.5rem 0 1.7rem;
    }
    button {
      width: 21.4rem;
      height: 2.4rem;
      font-size: 0.7rem;
    }
    .margin-bottom {
      margin-bottom: 0;
    }
  }
}

@media (max-width: 767px) {
  main {
    .pool-login-body {
      padding: 2.8rem 15px 15rem;
      section,
      button,
      p {
        max-width: 19rem;
      }
    }
  }
}
</style>