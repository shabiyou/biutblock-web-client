<template>
  <section class="wallet-page">
    <ul>
      <li>
        <span @click="prev">上一页</span>
        <section>
          <input
            type="text"
            placeholder="page"
            v-model="pageIpt"
            @blur="goPage"
            @input="pageNull"
            ref="inputVal"
          />
          <span>/ {{ total }}</span>
        </section>
        <span @click="next">下一页</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    total: Number
  },
  data() {
    return {
      pageIpt: ''
    }
  },
  methods: {
    prev() {
      this.$emit('prev')
    },

    next() {
      this.$emit('next')
    },

    goPage() {
      let idx = this.pageIpt
      this.$emit('goPage', idx)
    },

    pageNull() {
      this.$nextTick(() => {
        this.pageIpt = this.pageIpt.replace(/[^0-9]+/g, '')
      })
    },

    clearIpt() {
      this.pageIpt = ''
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.wallet-page {
  padding-top: 1.2rem;
  font-size: 0.7rem;
  ul {
    margin: 0;
    padding: 0;
    li {
      @extend %flexEnd;
      align-items: center;
      span {
        width: 4.8rem;
        height: 1.8rem;
        border-radius: 0.2rem;
        color: #99a1a6;
        font-size: 0.6rem;
        text-align: center;
        line-height: 1.8rem;
        @include border($c: #e6e6e6, $d: bor);
        cursor: pointer;
      }
      section {
        margin: 0 0.5rem;
        color: #99a1a6;
        input {
          border: 0;
          width: 1.8rem;
          height: 1.8rem;
          background: #f5f5f5;
          border-radius: 0.2rem;
          text-align: center;
          color: #99a1a6;
        }
        span {
          font-size: 0.7rem;
          border: 0;
          margin-left: 0.3rem;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  ul li {
    span {
      height: 1.6rem;
      line-height: 1.6rem;
    }
    input {
      width: 2rem;
      height: 1.6rem;
    }
  }
}
</style>