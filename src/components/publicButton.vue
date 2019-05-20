<template>
  <button class="publicBtn" :type="type">{{ this.text }}</button>
</template>

<script>
export default {
  name: '',
  props: ["type","text"],
  data () {
    return {}
  }
}
</script>

<style scoped>
  button {height: 2.7rem;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);box-sizing: border-box;
    border-radius: .5rem;font-size: .8rem;color: #fff;border: 0;width: 100%;}
</style>