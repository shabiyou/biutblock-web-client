<template>
  <input v-bind="$attrs" v-on="listeners" />
</template>

<script>
export default {
  name: 'publicInput',
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event =>
          this.$emit('input', event.target.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
input {
  height: 2.4rem;
  line-height: 2.4rem;
  border-radius: .5rem;
  display: block;
  width: 100%;
  font-size: .7rem;
  font-weight: 400;
  text-indent: 1rem;
  box-sizing: border-box;
  color: $colorTips;
  @include border($d: bor);
}
</style>
