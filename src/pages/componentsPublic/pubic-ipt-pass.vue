<template>
  <div class="ipt_arr">
    <input :type="typeIpt" 
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @blur="blur"
      @focus="focus"
      @input="$emit('input', $event.target.value)"/>
    <img :src="passUrl" alt="" @click="checkImg">
  </div>
</template>

<script>
import passImg from '../../assets/images/passImg.png'
import passImgs from '../../assets/images/passImgs.png'
export default {
  name: 'publicIptPass',
  props: ['placeholder', 'value', 'maxlength'],
  data () {
    return {
      passUrl: passImg,
      typeIpt: 'password',
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
    blur () {
      this.$emit('loseFocus')
    },
    focus () {
      this.$emit('getFocus')
    }
  },
}
</script>

<style scoped>
  .ipt_arr {height: 2.3rem;background:rgba(255,255,255,1);opacity:1;border-radius: 0.5rem;
    border: 0.05rem solid rgba(145,162,170,1);display: flex;display:-webkit-flex;
    justify-content: space-between;align-items: center;padding: 0 1rem;flex: 1;}
  .ipt_arr input {height: 1.5rem;line-height:1.5rem;flex: 1;border: none;border-radius: 0.5rem;font-size: .7rem;font-weight: normal;
  color: #42535B;}
  .ipt_arr img {width: .85rem;height: .75rem;}
</style>