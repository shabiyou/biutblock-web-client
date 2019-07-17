<template>
  <button class="publicBtn">{{ $t(text) }}</button>
</template>

<script>
export default {
  name: 'publicButton',
  props: {
    text: String
  },
  data() {
    return {

    }
  },
}
</script>

<style scoped>
button {
  height: 2.7rem;
  background: linear-gradient(90deg, #c2c2c2 0%, #a5a5a5 100%);
  box-sizing: border-box;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: #fff;
  border: 0;
  width: 100%;
}
</style>