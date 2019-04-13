<template>
  <input class="ipt" 
    :type="type" 
    ref="input"
    :value="value"
    :placeholder="placeholder"
    :maxlength="maxlength"
    @input="$emit('input', $event.target.value)"
    onkeyup="this.value=this.value.replace(/\s+/g,'')">
</template>

<script>
export default {
  name: 'pubicIpt',
  props:['type', 'placeholder', 'value', 'maxlength'],
  data () {
    return { }
  }
}
</script>

<style scoped>
  .ipt {width: 100%;height: 2.4rem;border: .05rem solid rgba(145,162,170,1);border-radius: .5rem;box-sizing: border-box;
    color: #42535B;font-size: .7rem;font-weight: 400;text-indent: 1rem;}
</style>