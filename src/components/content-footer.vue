<template>
  <section class="content-bg">
    <p>{{ $t("footer.FooterCnt") }}：{{ email }}</p>
  </section>
</template>

<script>
export default {
  name: 'contentFooter',
  data() {
    return {
      email: 'contact@biut.io'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.content-bg {
  width: 100%;
  height: 10rem;
  @include bgCover("../assets/images/public_bg.png");
  p {
    font-size: .6rem;
    color: $colorGray;
    font-weight: 400;
    padding: 9rem 0 0 2.2rem;
  }
}
</style>