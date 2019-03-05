<template>
  <div class="tips_content">
    <img src="../../assets/images/tipsImg.png" alt="" class="tips_img">
    <span>{{ $t(this.tipsTxt) }}</span>
  </div>
</template>

<script>
export default {
  name: 'tipsContent',
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