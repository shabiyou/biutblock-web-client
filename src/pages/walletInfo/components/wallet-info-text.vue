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
          <section class="amount-content">
            {{ infoMoneyN }} <span>BIU</span>
          </section>
        </section>
      </li>
    </ul>
  </main>
</template>

<script>
export default {
  name: 'walletInfoText',
  props: {
    infoAddress: String,
    infoKey: String,
    infoMoneyC: String,
    infoMoneyN: String
  },
  data() {
    return {

    }
  },
  methods: {

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
      @include border($c: #cfdedb, $d: bottom);
      color: $colorTips;
      padding-top: 2.2rem;
      &:first-child {
        padding-top: 0rem;
      }
      &:last-child {
        border: 0;
      }
      h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: normal;
      }
      p {
        padding: 0.8rem 0 2.3rem;
        font-size: 0.8rem;
        font-weight: 500;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      .amount-list {
        @extend %flexBetween;
        margin-top: 0.8rem;
        .amount-content {
          width: 13.5rem;
          height: 2.5rem;
          padding: 0 1rem;
          @include border($d: bor);
          @extend %flexBetween;
          font-size: 0.7rem;
          border-radius: 0.5rem;
          &:first-child {
            margin-right: 0.5rem;
          }
          span {
            font-size: 0.6rem;
          }
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