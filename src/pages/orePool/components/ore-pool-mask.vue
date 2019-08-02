<template>
  <section class="mask">
    <!-- 已经加入过的弹窗 -->
    <section class="mask_cnt"  v-show="maskPage === 1">
      <section class="join-content clearfix">
        <p>{{ $t('mask.poolTips') }}</p>
        <figure>
          <img src="../../../assets/images/errorImg.png" alt="" />
          <figcaption>{{ $t('mask.poolTxt') }}</figcaption>
        </figure>
        <button type="button" @click="close">{{ $t('mask.poolBtn') }}</button>
      </section>
    </section>

    <!-- 申请加入的弹窗 -->
    <section class="mask_cnt apply-mask" v-show="maskPage === 2">
      <section class="join-container">
        <header>
          <span>{{ $t('pool.poolIndexTit2') }}</span>
          <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
        </header>
        <section class="error-list">
          <p class="join-txt1">{{ $t('mask.poolNumber') }} <label>*</label></p>
          <p>{{ $t('mask.poolNumberError') }}</p>
        </section>
        <section class="ipt-list">
          <input type="text" placeholder="1000.00" v-model="joinIpt" />
          <span>BIUT</span>
        </section>
        <p class="join-txt-all">
          {{ $t('transfer.balance') }}：{{ totalMoney }}  BIUT
          <span @click="allMoney">{{ $t('transfer.all') }}</span>
        </p>
        <p class="join-txt2">{{ $t('mask.poolTxt1') }}</p>
        <public-button 
          :text="$t('mask.poolBtn1')"
          :class="joinBtn ? 'btn-active' : ''"
          :disabled="!joinBtn"
          @click.native="joinFrom"/>
      </section>
    </section>
  </section>
</template>

<script>
import publicButton from '../../../components/public-button'
export default {
  name: '',
  components: {
    publicButton
  },
  props: {
    maskPage: Number
  },
  data() {
    return {
      joinIpt: '',
      totalMoney: 100
    }
  },
  computed: {
    joinBtn () {
      let ipt = this.joinIpt
      return ipt > 1000 ? true : false
    }
  },
  methods: {
    close () {
      this.$emit('close')
      this.joinIpt = ''
    },

    joinFrom () {
      this.close() 
    },

    allMoney() {
      this.joinIpt = this.totalMoney
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.mask_cnt {
  padding-bottom: .8rem;
  .join-content {
    p {color: #252F33;font-size: .8rem;font-family: source-Medium;}
    figure {
      display: flex;
      align-items: center;
      color: #5e6466;
      font-size: 0.7rem;
      margin: 0;
      padding: 1.05rem 0 2.3rem;
      img {
        margin-right: 0.6rem;
      }
    }
    button {
      border-radius: 0.2rem;
    }
  }
}
.apply-mask {
  padding-bottom: 1.3rem;
  width: 15.6rem;
  .join-container {
    color: #9CA6AA;
    header {
      @extend %flexBetween;
      align-items: flex-start;
      color: #252F33;
      font-size: .8rem;
      img {
        cursor: pointer;
      }
    }
    .error-list {
       padding: 1.6rem 0 .8rem;
      @extend %flexBetween;
      p:last-child {
        color: $colorRed;
        font-size: .6rem;
        width: 8.25rem;
      }
    }
    .ipt-list {
      @extend %flexBetween;
      height: 2.4rem;
      background: #F5FAF9;
      font-size: .7rem;
      padding: 0 1.2rem 0 .8rem;
      input {
        flex: 1;
        background: #F5FAF9;
        border: 0;
        color: #2E3A40;
        margin-right: .8rem;
      }
    }
    .join-txt1 {
      font-size: .8rem;
      label {
        color: $colorRed;
      }
    }
    .join-txt2 {
      font-family: source-Light;
      font-size: .6rem;
      padding: .9rem 0 1.4rem;
    }
    .join-txt-all {
      @extend %flexEnd;
      padding-top: .5rem;
      font-size: .6rem;
      span {
        cursor: pointer;
        color: $colorGreen;
        margin-left: .5rem;
      }
    }
    button {
      height: 2.4rem;
    }
  }
}
</style>