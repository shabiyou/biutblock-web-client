<template>
  <div class="tips_content">
    <img src="../assets/images/tipsImg.png" alt="" class="tips_img">
    <span>{{ $t(tipsTxt) }}</span>
  </div>
</template>

<script>
export default {
  name: 'publicTips',
  props: {
    tipsTxt: String
  },
  data () {
    return { }
  },
  created() {
  },
}
</script>

<style scoped>

</style>