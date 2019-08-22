<template>
  <section class="invitation-header">
    <header>
      <section class="header-level">
        <span>{{ $t('invitation.level') }}</span>

        <figure>
          <figcaption>
            {{ $t('walletInfo.myCodeTxt') }}：
            <span id="invitationCode" v-show="!invitationShow">{{ invitationCode }}</span>
            <span v-show="invitationShow">--</span>
          </figcaption>
          <img
            src="../../../assets/images/copy.png"
            alt=""
            v-show="!invitationShow"
            @click="copyCode"
            data-clipboard-target="#invitationCode"
            class="copyButton"
          />
          <img src="../../../assets/images/exclamationImg.png" v-show="invitationShow" alt="" @mouseover="showInvitation1(item)" @mouseout="showInvitation2(item)"/>

          <button type="button" class="shar-btn" @click="shareShow = true" v-show="!invitationShow">
            {{ $t('walletInfo.shareBtn') }}
          </button>

          <transition name="fade">
            <section class="invitation-tips" v-show="showInvitation">
              {{ $t('invitation.invitationTipsTxt1') }}
            </section>
          </transition>
        </figure>

      </section>

      <section class="header-img">
        <figure>
          <img src="../../../assets/images/levels1.png" alt="" />
          <figcaption>
            <p>{{ partner }}</p>
            <p>{{ $t('invitation.medal') }}</p>
            <section class="progress-list clearfix">
              <el-progress :percentage="progress" color="#29D893" />
              <span>{{ progress }} / {{ levelNumber }}</span>
            </section>
          </figcaption>
        </figure>

        <button type="button" @click="lookRules" class="look-btn">
          {{ $t('invitation.rules') }}
        </button>
      </section>
    </header>

    <share-mask
      :inviteCode="invitationCode"
      @close="shareShow = false"
      v-show="shareShow" />

    <wallet-transparent :txt="copySuccess" v-show="transparentShow" />
  </section>
</template>

<script>
import Clipboard from 'clipboard'
import wechat from '../../../assets/images/levels1.png'
import shareMask from '../../../components/wallet-share'
import walletTransparent from '../../../components/wallet-transparent'
export default {
  name: '',
  props: {},
  components: {
    shareMask,
    walletTransparent
  },
  data() {
    return {
      invitationCode: 'AK654321',
      shareShow: false,
      transparentShow: false,
      copySuccess: '',
      progress: 1,
      levelNumber: 9,
      partner: '铜牌合伙人',

      showInvitation: false, //邀请码tips提示
      invitationShow: true  //判断是否有锁仓
    }
  },
  methods: {
    copyCode() {
      var clipboard = new Clipboard('.copyButton')
      clipboard.on('success', e => {
        clipboard.destroy()
        this.transparentShow = true
        this.copySuccess = 'Copy success'
        setTimeout(() => {
          this.transparentShow = false
        }, 3000)
      })
      clipboard.on('error', e => {
        this.copySuccess = 'Copy the failure'
        setTimeout(() => {
          this.transparentShow = false
        }, 3000)
        clipboard.destroy()
      })
    },

    lookRules() {
      this.$emit('look', 1)
    },

    showInvitation1() {
      this.showInvitation = true
    },

    showInvitation2() {
      this.showInvitation = false
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.invitation-header {
  padding: 2.8rem 4.4rem 2.1rem;
  @include border($c: #e6e6e6, $d: bottom);
  box-sizing: border-box;
  header {
    .header-level {
      @extend %flexBetween;
      color: #2e3a40;
      font-size: 1.2rem;
      position: relative;
      figure {
        @extend %flexBetween;
        font-size: 0.7rem;
        margin: 0;
        img {
          cursor: pointer;
          margin-left: 0.7rem;
        }
        .shar-btn {
          width: 5.4rem;
          height: 1.8rem;
          color: #29d893;
          font-size: 0.7rem;
          background: #ffffff;
          @include border($c: #e6e6e6, $d: bor);
          box-sizing: border-box;
          margin-left: 1.2rem;
        }
      }
      .invitation-tips {
        position: absolute;
        right: 0;
        top: 2rem;
        color: #C9D1D4;
        font-size: .7rem;
        width: 9.2rem;
        height: 3.4rem;
        background:rgba(66,83,91,1);
        box-shadow: 0 .5rem .5rem rgba(66,83,91,0.2);
        @extend %flexCenter;
        padding: 0 .8rem;
      }
    }
    .header-img {
      @extend %flexBetween;
      padding-top: 2.8rem;
      align-items: flex-end;
      figure {
        flex: 1;
        margin: 0;
        @extend %flexBetween;
        align-items: flex-start;
        img {
          height: 3.4rem;
          width: 3.4rem;
          margin-right: 0.6rem;
        }
        figcaption {
          flex: 1;
          padding-right: 1.8rem;
          p {
            color: #42535b;
            font-size: 0.9rem;
            &:last-child {
              font-size: 0.7rem;
            }
          }
          .progress-list {
            height: 0.5rem;
            line-height: 0.3rem;
            padding-top: .3rem;
            span {
              float: left;
              vertical-align: middle;
              margin-left: .6rem;
              color: #42535B;
              font-size: .7rem;
            }
          }
        }
      }

      .look-btn {
        width: 5.4rem;
        height: 1.8rem;
        color: #29d893;
        font-size: 0.7rem;
        background: #ffffff;
        @include border($c: #e6e6e6, $d: bor);
        box-sizing: border-box;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .invitation-header {
    padding: 2.8rem 15px 2.1rem;
    header {
      .header-level,.header-img {
        flex-direction: column;
        align-items: flex-start;
      }
      .header-img {
        padding-top: 1.4rem;
        figure {
          width: 100%;
          padding-bottom: 1rem;
          figcaption {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>