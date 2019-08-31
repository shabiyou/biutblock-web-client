<template>
  <section class="transparent-content">
    <span>{{ $t(txt) }}</span>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    txt: String
  },
  data () {
    return {

    }
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.transparent-content {
  @extend %flexCenter;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  span {
    @extend %flexCenter;
    height: 3.2rem;
    padding: 0 2.2rem;
    background:#42535b;
    border-radius: .2rem;
    color: #fff;
    font-size: .7rem;
  }
}
</style>