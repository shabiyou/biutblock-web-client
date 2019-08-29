<template>
  <section class="ore-pool-body">
    <header>
      <h2>{{ $t("pool.poolIndexTit2") }}</h2>
      <span @click="lookAll">{{ $t("pool.poolIndexTitLook") }}</span>
    </header>
    <ul>
      <li>
        <section>
          <span>{{ $t("pool.poolIndexListTit1") }}</span>
          <span>{{ $t("pool.poolIndexListTit2") }}</span>
        </section>
        <span></span>
      </li>
      <li v-for="(item, index) in itemList" :key="index">
        <section>
          <span>{{ item.poolName }}</span>
          <span>{{ item.pooolMoney }} BIUT</span>
        </section>
        <span class="list-btn" @click="mortgageMask">{{ $t("pool.poolListBtn") }}</span>
      </li>
    </ul>

    <!-- mask 弹窗 -->
    <pool-mask 
      v-show="maskShow" 
      :nounce="nounce"
      :maskPage="maskPage"
      :address="address"
      :mortgageShow="mortgageShow"
      :selectedItem="selectedItem"
      :privateKey="privateKey"
      :totalMoney="walletBalance.toString()"
      @close="closeMask"
      @updatePage="updatePage" />
  </section>
</template>

<script>
import poolMask from './ore-pool-mask'
export default {
  name: '',
  components: {
    poolMask
  },
  props: {
    itemList: Array
  },
  data() {
    return {
      maskShow: false,
      mortgageShow: true
    }
  },
  methods: {
    lookAll() {
      this.$emit('lookAll')
    },

    closeMask () {
      this.maskShow = false
    },

    updatePage () {
      this.maskPage = 3
    },

    mortgageMask () {
      /**
       * 显示弹窗
       */
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.ore-pool-body {
  padding: 2.6rem 4.4rem 3.4rem;
  header {
    @extend %flexBetween;
    padding-bottom: 0.5rem;
    h2 {
      margin: 0;
      color: #2e3a40;
      font-size: 1.2rem;
      font-family: source-Medium;
    }
    span {
      width: 8.2rem;
      height: 2.4rem;
      line-height: 2.4rem;
      text-align: center;
      @include border($c: #e6e6e6, $d: bor);
      border-radius: 0.2rem;
      color: #9ca6aa;
      font-size: 0.7rem;
      cursor: pointer;
    }
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      height: 3rem;
      @extend %flexBetween;
      @include border($c: #e6e6e6, $d: bottom);
      font-size: 0.7rem;
      color: #2e3a40;
      section span:first-child {
        display: inline-block;
        width: 11rem;
      }
      &:first-child {
        color: #9ca6aa;
      }
      .list-btn {
        height: 1.8rem;
        line-height: 1.8rem;
        @include border($c: #e6e6e6, $d: bor);
        color: #9ca6aa;
        text-align: center;
        border-radius: 0.9rem;
        background: #0B7FE6;
        color: #fff;
        cursor: pointer;
        font-size: .7rem;
        padding: 0 1rem;
      }
    }
  }
}

@media (max-width: 767px) {
  .ore-pool-body {
    padding: 2.6rem 15px 3.4rem;
    ul li section {
      display: flex;
      span:first-child {
        max-width: 8rem;
      }
    }
    header {
      h2 {
        font-size: 1rem;
      }
      span {
        height: 1.8rem;
        line-height: 1.8rem;
      }
    }
  }
}
</style>