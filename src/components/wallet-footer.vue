<template>
  <footer class="footer-text">
    Copyright &copy; 2019 BIUT
  </footer>
</template>

<script>
export default {
  name: 'walletFooter',
  data() {
    return {

    }
  },
  components: {

  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.footer-text {
  height: 3.2rem;
  line-height: 3.2rem;
  box-sizing: border-box;
  text-align: center;
  font-size: 0.6rem;
  @include border($d: top,$c: rgba(145,162,170,0.2));
  color: $colorGray2;
  background: #fff;
}
</style>