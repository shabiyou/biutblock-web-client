<template>
  <button 
    :type="btnType">
    <slot>{{ publicBtn }}</slot>
  </button>
</template>

<script>
export default {
  name: 'publicBtb',
  props: ['btnType'],
  data () {
    return {
      publicBtn: ''
    }
  }
}
</script>

<style scoped>
  button {width: 20.6rem;height: 2.7rem;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);
    opacity:1;border-radius: .5rem;font-size: .8rem;color: #fff;text-align: center;line-height: 2.7rem;
    border: 0;max-width: 100%!important;}
</style>