<template>
  <section class="invitation-header">
    <header>
      <section class="header-level">
        <span>我的等级</span>
        <figure>
          <figcaption>
            我的邀请码：
            <span id="invitationCode">{{ invitationCode }}</span>
          </figcaption>
          <img
            src="../../../assets/images/copy.png"
            alt=""
            @click="copyCode"
            data-clipboard-target="#invitationCode"
            class="copyButton"
          />
          <button type="button" class="shar-btn" @click="shareShow = true">
            一键分享
          </button>
        </figure>
      </section>

      <section class="header-img">
        <figure>
          <img src="../../../assets/images/levels1.png" alt="" />
          <figcaption>
            <p>铜牌合伙人</p>
            <p>金牌</p>
            <section class="progress-list clearfix">
              <el-progress :percentage="progress" color="#29D893" />
              <span>{{ progress }} / {{ levelNumber }}</span>
            </section>
          </figcaption>
        </figure>

        <button type="button" @click="lookRules" class="look-btn">
          查看规则
        </button>
      </section>
    </header>

    <share-mask
      :inviteCode="invitationCode"
      @close="shareShow = false"
      v-show="shareShow"
    />

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
</style>