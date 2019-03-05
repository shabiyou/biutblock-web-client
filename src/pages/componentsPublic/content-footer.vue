<template>
  <section class="content_bg">
    <p>{{$t('footer.FooterCnt')}}：{{ email }}</p>
  </section>
</template>

<script>
export default {
  name: 'contentFooter',
  data () {
    return {
      email: 'partnerli@secblock.io'
    }
  }
}
</script>

<style scoped>

</style>