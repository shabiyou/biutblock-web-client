<template>
  <div class="ipt_arr">
    <input :type="typeIpt" 
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="$emit('input', $event.target.value)"/>
    <img :src="passUrl" alt="" @click="checkImg">
  </div>
</template>

<script>
import passImg from '../../assets/images/passImg.png'
import passImgs from '../../assets/images/passImgs.png'
export default {
  name: 'publicIptPass',
  props: ['type', 'placeholder', 'value', 'maxlength'],
  data () {
    return {
      typeIpt: 'password',
      passUrl: passImg,
      typeIdx: 1
    }
  },
  methods: {
    checkImg () {
      if (this.typeIdx === 1) {
        this.typeIpt = 'text'
        this.passUrl = passImgs
        this.typeIdx = 0
      } else {
        this.typeIpt = 'password'
        this.passUrl = passImg
        this.typeIdx = 1
      }
    },
    updateValue(val) {
      this.$emit('input', val)
    }
  },
}
</script>

<style scoped>
  .ipt_arr {height: 2.3rem;background:rgba(255,255,255,1);opacity:1;border-radius: 0.5rem;
  border: 0.05rem solid rgba(145,162,170,1);display: flex;justify-content: space-between;align-items: center;
  padding: 0 1rem;flex: 1;}
  .ipt_arr input {height: 2rem;line-height:2rem;flex: 1;border: none;border-radius: 0.5rem;font-size: .7rem;font-weight: normal;
  color: #42535B;}
  .ipt_arr img {width: .85rem;height: .75rem;}
</style>