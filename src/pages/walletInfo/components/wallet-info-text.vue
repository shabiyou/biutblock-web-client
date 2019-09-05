<template>
  <main class="info-content">
    <!-- 钱包信息列表 -->
    <ul>
      <li>
        <h4>{{ $t("walletInfo.walletAddress") }}</h4>
        <p>{{ infoAddress }}</p>
      </li>
      <li>
        <h4 class="look-key">{{ $t("walletInfo.walletPrivateKey") }} <img :src="infoKeyImg" @click="lookPriveKey"/></h4>
        <p>{{ infoKeyTxt }}</p>
      </li>
      <li>
        <h4>{{ $t("walletInfo.walletMoney") }}</h4>
        <section class="amount-list">
          <section class="amount-content">
            {{ getPointNum(infoMoneyC) }} <span>BIUT</span>
          </section>
          <p class="amount-list-txt">
            <span>{{ $t("public.available") }}：{{ getPointNum(availableAmount) }} BIUT</span>
            <span>{{ $t("public.guarantee") }}：{{ getPointNum(freezeAmount) }} BIUT</span>
          </p>
          <section class="amount-content">
            {{ getPointNum(infoMoneyN) }} <span>BIU</span>
          </section>
        </section>
      </li>
      <li>
        <h4>{{ $t("walletInfo.myCodeTxt") }}</h4>
        <section class="invite-list" v-show="Number(freezeAmount) > 0">
          <span id="invitationCode">{{ inviteCode }}</span>
          <img src="../../../assets/images/copy.png" alt="" @click="copyCode"
            data-clipboard-target="#invitationCode"
            class="copyButton"/>
          <button type="button" @click="shareMask">{{ $t("walletInfo.shareBtn") }}</button>
        </section>

        <section v-show="Number(freezeAmount) === 0" class="share-tips">
          {{ $t('invitation.invitationTipsTxt2') }}
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
import passImg from '../../../assets/images/passImg.png'
import passImgs from '../../../assets/images/passImgs.png'
import shareMask from '../../../components/wallet-share'
import walletTransparent from '../../../components/wallet-transparent'
import { log } from 'util';
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
    availableAmount: String,
    freezeAmount: String,
    inviteCode: String,
  },
  data() {
    return {
      shareShow: false,
      transparentShow: false,
      copySuccess: '',
      infoKeyTxt: '**************************************',
      infoKeyImg: passImg,
      infoKeyIdx: 1
    }
  },
  methods: {
    copyCode() {
      var clipboard = new Clipboard('.copyButton')
      clipboard.on('success', e => {
        clipboard.destroy()
        this.transparentShow = true
        this.copySuccess = 'tips.copySuccess'
        setTimeout(() => {
          this.transparentShow = false
        }, 3000)
      })
      clipboard.on('error', e => {
        this.copySuccess = 'tips.copyFailure'
        setTimeout(() => {
          this.transparentShow = false
        }, 3000)
        clipboard.destroy()
      })
    },

    lookPriveKey() {
      let idx = this.infoKeyIdx
      if (idx === 1) {
        this.infoKeyImg = passImgs
        this.infoKeyTxt = this.infoKey
        this.infoKeyIdx = 2
      } 
      if (idx === 2) {
        this.infoKeyImg = passImg
        this.infoKeyTxt = '**************************************'
        this.infoKeyIdx = 1
      }
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
      .look-key {
        display: flex;
        align-items: center;
        img {
          margin-left: 1rem;
          cursor: pointer;
        }
      }
      p {
        padding-top: 0.8rem;
        font-size: 0.8rem;
        font-weight: 500;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      .share-tips {
        color:#252F33;
        font-size: .7rem;
        white-space: normal;
        padding: .7rem 0 0 0;
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