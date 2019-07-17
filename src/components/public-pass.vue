<template>
  <div class="ipt-arr">
    <input
      ref="input"
      :type="typeIpt"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @blur="blur"
      @focus="focus"
      @input="$emit('input', $event.target.value)"
    />
    <img :src="passUrl" alt="" @click="checkImg" />
  </div>
</template>

<script>
import passImg from '../assets/images/passImg.png'
import passImgs from '../assets/images/passImgs.png'
export default {
  name: 'publicPass',
  props: ['placeholder', 'value', 'maxlength'],
  data() {
    return {
      passUrl: passImg,
      typeIpt: 'password',
      typeIdx: 1
    }
  },
  methods: {
    checkImg() {
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
    blur() {
      this.$emit('loseFocus')
    },
    focus() {
      this.$emit('getFocus')
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";

.ipt-arr {
  @extend %flexCenter;
  @include border($d: bor);
  height: 2.3rem;
  background: #fff;
  border-radius: .5rem;
  box-sizing: border-box;
  padding: 0 1rem;
  input {
    height: 1.5rem;
    line-height: 1.5rem;
    flex: 1;
    border: none;
    border-radius: .5rem;
    font-size: .7rem;
    font-weight: normal;
    color: $colorTips;
  }
  img {
    width: .85rem;
    height: .75rem;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>