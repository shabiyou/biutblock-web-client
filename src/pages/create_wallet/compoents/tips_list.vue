<template>
  <ul>
    <li v-for="(item, index) in this.tipsListKey" :key="item.id"> 
      <img :src="item.tips_img" alt=""  class="tips_img"> 
      <span>{{ $t(item.tips_cnt) }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'tipsList',
  props: {
    tipsListKey: Array
  },
  data () {
    return {
      
    }
  }
}
</script>

<style scoped>
  ul li {color: #42535B;font-size: .6rem;margin-bottom: .4rem;line-height: 1.5;display: flex;align-items: center;}
  ul li span {word-wrap:break-word;width: 23rem;}
  ul li:last-child {margin-bottom: 0;}
</style>