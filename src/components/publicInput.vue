<template>
  	<input
      v-bind="$attrs"
      v-on="listeners"
      onkeyup="this.value=this.value.replace(/\s+/g,'')"/>
</template>

<script>
export default {
  name: 'inputVue',
  components: {

  },
  props: {
    
  },
  data () {
    return {

    }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => 
          this.$emit('input', event.target.value)
      }
    }
  },
  created () {
    
  },
  mounted () {

  },
  destroyed () {},
  methods: {
    
  },
}
</script>

<style scoped>
  input {height: 2.4rem;line-height: 2.4rem;border: 0.05rem solid rgba(145,162,170,1);border-radius: .5rem;display: block;width: 100%;
    color: #42535B;font-size: .7rem;font-weight: 400;text-indent: 1rem;box-sizing: border-box;}
</style>
