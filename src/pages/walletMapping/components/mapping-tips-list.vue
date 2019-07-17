<template>
  <section class="mapping-tips">
    <!-- 映射提示语 -->
    <ul>
      <li v-for="(item, index) in itemList" :key="index">
        <span>{{ item.id }}、</span>
        <span>{{ $t(item.cnt) }}</span>
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

  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.mapping-tips {
  @extend %flex;
  background: rgba(238, 28, 57, 0.1);
  padding: 0.85rem 0.9rem 0.7rem;
  margin-bottom: 2rem;
  img {
    width: 0.8rem;
    height: 0.8rem;
    margin: 0.15rem 0.5rem 0 0;
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      @extend %flex;
      span {
        color: $colorTips;
        font-size: 0.6rem;
        line-height: 1.8;
      }
    }
  }
}
</style>