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
          type="text"
          :placeholder="$t('pool.poolLoginIpt')"
          v-model="walletKey"
          maxlength="64"
        />
      </section>

      <p v-show="keyError">{{ $t("pool.poolLoginIptError") }}</p>

      <public-button
        :text="$t('pool.poolLoginBtn')"
        :class="loginBtn ? 'btn-active' : ''"
        :disabled="!loginBtn"
        @click.native="loginFrom"
      />
    </section>
  </main>
</template>

<script>
import publicButton from '../../components/public-button'
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
      margnB: false
    }
  },
  computed: {
    loginBtn() {
      let key = this.walletKey
      if (key.length > 0 && !_const.priverKeyReg.test(key)) {
        this.keyError = true
        this.margnB = true
      } else {
        this.keyError = false
        this.margnB = false
        return key.length == 64 ? true : false
      }
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    loginFrom() {
      this.$router.push({ name: 'orePool' })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styless/public";
main {
  background: #fff;
  .pool-login-header {
    @include bgCover("../../assets/images/poolLogin.png");
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
      padding: 0.8rem 0;
      margin-bottom: 3.1rem;
      @include border($d: bottom, $c: #e6e6e6);
      box-sizing: border-box;
      input {
        width: 100%;
        border: 0;
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
      section,button {
        max-width: 19rem;
      }
    }
  }
}
</style>