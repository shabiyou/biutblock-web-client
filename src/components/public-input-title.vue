<template>
  <main>
    <section class="tit-list">
      <p>{{ $t(iptTitle) }}<label v-show="!iptRd">*</label></p>
      <public-tips v-show="errorShow" :tipsTxt="errorTxt" />
    </section>

    <public-input
      v-model="mappingVal"
      value="iptVal"
      :readonly="iptRd"
      :placeholder="$t(iptPlc)"
      :class="errorShow ? 'error-border' : ''"
      :maxlength="iptLength"
      @input="inputChange"
    />
  </main>
</template>

<script>
const publicTips = () => import("./public-tips")
const publicInput = () => import("./public-input")
export default {
  name: '',
  components: {
    publicInput,
    publicTips
  },
  props: {
    iptTitle: String,
    iptPlc: String,
    iptLength: Number,
    errorShow: Boolean,
    errorTxt: String,
    iptRd: Boolean,
    iptVal: String,
  },
  data() {
    return {
      mappingVal: this.iptVal,
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    //输入框不能输入中文、空格
    inputChange() {
      this.$nextTick(() => {
        this.mappingVal = this.inputNull(this.mappingVal)
      })
    },

    //清空组件的值
    clearIpt() {
      this.mappingVal = ''
    }
  },
  watch: {
    mappingVal(newVal, oldVal) {
      this.$emit("change", newVal.replace(/\s+/g, ""))
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.tit-list {
  @extend %flexBetween;
  &/deep/.tips_content {
    padding-top: 0;
    font-size: .7rem;
  }
  p {
    font-size: .8rem;
    color: $colorTips;
    padding-bottom: .4rem;
    font-family: source-Bold;
  }
  label {
    color: $colorRed;
  }
}

@media (max-width: 767px) {
  .input-content {
    display: block;
    margin: 0 !important;
    .input-text {
      width: 100%;
      margin-top: 1.2rem;
    }
  }
}
</style>