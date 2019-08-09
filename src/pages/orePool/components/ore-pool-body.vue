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
        <span class="list-btn">{{ $t("pool.poolIndexListTxt1") }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    itemList: Array
  },
  data() {
    return {
      
    }
  },
  methods: {
    lookAll() {
      this.$emit('lookAll')
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
        width: 4.8rem;
        height: 1.8rem;
        line-height: 1.8rem;
        @include border($c: #e6e6e6, $d: bor);
        color: #9ca6aa;
        text-align: center;
        border-radius: 0.9rem;
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