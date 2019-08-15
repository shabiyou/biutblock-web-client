<template>
  <main class="info-content">
    <!-- 钱包信息列表 -->
    <ul>
      <li>
        <h4>{{ $t("walletInfo.walletAddress") }}</h4>
        <p>{{ infoAddress }}</p>
      </li>
      <li>
        <h4>{{ $t("walletInfo.walletPrivateKey") }}</h4>
        <p>{{ infoKey }}</p>
      </li>
      <li>
        <h4>{{ $t("walletInfo.walletMoney") }}</h4>
        <section class="amount-list">
          <section class="amount-content">
            {{ infoMoneyC }} <span>BIUT</span>
          </section>
          <p class="amount-list-txt">
            <span>冻结：{{ availableAmount }}BIUT</span>
            <span>可用：{{ freezeAmount }}BIUT</span>
          </p>
          <section class="amount-content">
            {{ infoMoneyN }} <span>BIU</span>
          </section>
        </section>
      </li>
      <li>
        <h4>我的邀请码</h4>
        <section class="invite-list">
          <span id="invitationCode">{{ inviteCode }}</span>
          <img src="../../../assets/images/copy.png" alt="" @click="copyCode"
            data-clipboard-target="#invitationCode"
            class="copyButton"/>
          <button type="button" @click="shareMask">一键分享</button>
        </section>
      </li>
    </ul>

    <share-mask 
      :inviteCode="inviteCode"
      @close="closeMask"
      v-show="shareShow" />

    <wallet-transparent 
      :txt="copySuccess"
      v-show="transparentShow" />
  </main>
</template>

<script>
import Clipboard from 'clipboard'
import shareMask from '../../../components/wallet-share'
import walletTransparent from '../../../components/wallet-transparent'
export default {
  name: 'walletInfoText',
  components: {
    shareMask,
    walletTransparent
  },
  props: {
    infoAddress: String,
    infoKey: String,
    infoMoneyC: String,
    infoMoneyN: String,
    availableAmount: Number,
    freezeAmount: Number,
    inviteCode: String,
  },
  data() {
    return {
      shareShow: false,
      transparentShow: false,
      copySuccess: ''
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

    shareMask () {
      this.shareShow = true
    },

    closeMask () {
      this.shareShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.info-content {
  width: 31.5rem;
  ul {
    padding: 0;
    margin: 0;
    li {
      color: $colorTips;
      padding-top: 2.2rem;
      &:first-child {
        padding-top: 0rem;
      }
      h4 {
        margin: 0;
        font-size: .7rem;
        color: #99A1A6;
        font-weight: normal;
      }
      p {
        padding-top: 0.8rem;
        font-size: 0.8rem;
        font-weight: 500;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      .amount-list {
        margin-top: 0.8rem;
        .amount-content {
          height: 2.5rem;
          @include border($d: bottom);
          @extend %flexBetween;
          font-size: 0.8rem;
          color: #252F33;
        }
        .amount-list-txt {
          color: #99A1A6;
          font-size: .65rem;
          padding: .7rem 0 0;
          span:first-child {
            margin-right: 1.6rem;
          }
        }
      }
      .invite-list {
        @extend %flexCenter;
        justify-content: flex-start;
        padding-top: 1rem;
        color: #252F33;
        font-size: .7rem;
        img {
          cursor: pointer;
          margin:  0 1.2rem 0 .5rem;
        }
        button {
          width: 5.4rem;
          height: 1.8rem;
          background:#fff;
          @include border($d: bor,$c: #E6E6E6);
          color: $colorGreen;
          font-size: .7rem;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .info-content {
    width: 100%;
    li {
      padding-top: 1.2rem;
      p {
        padding-bottom: 1.3rem;
      }
    }
  }
}
</style>