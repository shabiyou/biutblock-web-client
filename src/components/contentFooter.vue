<template>
  <section class="content-bg">
    <p>{{$t('footer.FooterCnt')}}：{{ email }}</p>
  </section>
</template>

<script>
export default {
  name: 'contentFooter',
  data () {
    return {
      email: 'alanlee@secblock.io'
    }
  }
}
</script>

<style scoped>
  .content-bg {width: 100%;background: url('../assets/images/public_bg.png') no-repeat;
    background-size: cover;height: 6.65rem;}
  .content-bg p {font-size: .6rem;color: #728087;font-weight: 400;padding: 4.5rem 0 0 2.2rem;}
</style>