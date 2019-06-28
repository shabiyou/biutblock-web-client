<template>
  <section class="mapping-tips">
    <!-- <img src="../../assets/images/tipsImg.png" alt=""> -->
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

<style scoped>
  .mapping-tips {display: flex;background:rgba(238,28,57,0.1);padding: .85rem .9rem .7rem;margin-bottom: 2rem;}
  .mapping-tips img {width: .8rem;height: .8rem;margin: .15rem .5rem 0 0;}
  .mapping-tips ul {margin: 0;padding: 0;}
  .mapping-tips ul li {display: flex;}
  .mapping-tips ul li span {color: #42535B;font-size: .6rem;line-height: 1.8;}
</style>