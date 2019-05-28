<template>
  <section class="info-content">
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
  </section>
</template>

<script>
export default {
  name: '',
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

<style scoped>
  .info-content {width: 31.5rem;}
  ul {padding: 0;margin: 0;}
  ul li {border-bottom: 1px solid #CFDEDB;color: #42535B;padding-top: 2.2rem;}
  ul li:first-child {padding-top: 0rem;}
  ul li:last-child {border: 0;}
  ul li h4 {margin: 0;font-size: 1rem;font-weight: normal;}
  ul li p {padding: .8rem 0 2.3rem;font-size: .8rem;font-weight: 500;word-wrap:break-word;white-space:pre-wrap;}
  .amount-list {display: flex;align-items: center;margin-top: .8rem;}
  .amount-list .amount-content {width: 13.5rem;height: 2.5rem;padding: 0 1rem;display: flex;align-items: center;
    border:.05rem solid rgba(185,196,194,1);justify-content: space-between;font-size: .7rem;
    border-radius: .5rem;}
  .amount-list .amount-content:first-child {margin-right: .5rem;}
  .amount-list .amount-content span {font-size: .6rem;}

  @media (max-width: 767px) {
    .info-content {width: 100%;}
    ul li {padding-top: 1.2rem;}
    ul li p {padding-bottom: 1.3rem;}
  }
</style>