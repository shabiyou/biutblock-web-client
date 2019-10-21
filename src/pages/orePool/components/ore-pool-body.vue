<template>
  <section class="ore-pool-body">
    <header>
      <h2>{{ $t("pool.poolIndexTit2") }}</h2>
      <span @click="lookAll">{{ $t("pool.poolIndexTitLook") }}</span>
    </header>
    <ul>
      <li>
        <section>
          <span>{{ $t("pool.poolIndexListTit1") }}</span>
          <span>{{ $t("pool.poolIndexListTit2") }}</span>
          <span>{{ $t("pool.poolIndexListTit3") }}</span>
        </section>
        <span class="list-null"></span>
      </li>
      <li v-for="(item, index) in itemList" :key="index">
        <section>
          <span>{{ item.poolName.replace(/(.{8}).+(.{3})/, "$1...") }}</span>
          <span>{{ getPointNum(item.pooolMoney) }} BIUT</span>
          <span>{{ "0x" + item.poolAddress }}</span>
        </section>
        <button type="button" class="list-btn" @click="mortgageMask(item)">{{
          $t("pool.poolListBtn")
        }}</button>
      </li>
    </ul>

    <!-- mask 弹窗 -->
    <pool-mask
      v-show="maskShow"
      :nounce="nounce"
      :maskPage="maskPage"
      :address="address"
      :addressShort="addressShort"
      :mortgageShow="mortgageShow"
      :privateKey="privateKey"
      :selectedItem="selectedItem"
      @close="closeMask"
      @updatePage="updatePage"
    />
  </section>
</template>

<script>
import poolMask from './ore-pool-mask'
export default {
  name: '',
  components: {
    poolMask
  },
  props: {
    itemList: Array,
    // nounce: Number,
    address: String,
    addressShort: String,
    mortgageShow: Boolean,
    privateKey: String,
    // walletBalance: Number
  },
  data() {
    return {
      maskShow: false,
      selectedItem: {},
      joinIpt: '0',
      maskPage: 1
    }
  },
  computed: {
    walletBalance () {
      return this.$store.getters.availibleAmount
    },
    nounce () {
      return Number(this.$store.getters.nonce)
    }
  },
  methods: {
    lookAll() {
      this.$emit('lookAll')
    },

    closeMask() {
      //this.$emit('updatePage', ipt)
      this.maskShow = false
    },

    updatePage(ipt) {
      this.$emit('updatePage', ipt)
      this.maskPage = 3
      this.maskShow = true
      //this.joinIpt = ipt
    },

    mortgageMask(item) {
      /**
       * 显示弹窗
       */
      this.maskPage = 2
      this.maskShow = true
      this.selectedItem = item
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.ore-pool-body {
  padding: 2.6rem 4.4rem 3.4rem;
  header {
    @extend %flexBetween;
    padding-bottom: 0.5rem;
    h2 {
      margin: 0;
      color: #2e3a40;
      font-size: 1.2rem;
      //font-family: source-Medium;
    }
    span {
      width: 8.2rem;
      height: 2.4rem;
      line-height: 2.4rem;
      text-align: center;
      @include border($c: #e6e6e6, $d: bor);
      border-radius: 0.2rem;
      color: #9ca6aa;
      font-size: 0.7rem;
      cursor: pointer;
    }
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      height: 3rem;
      @extend %flexBetween;
      @include border($c: #e6e6e6, $d: bottom);
      font-size: 0.7rem;
      color: #2e3a40;
      section {
        flex: 1;
        display: flex;
        span:first-child {
          display: inline-block;
          width: 8rem;
        }
        span:nth-child(2) {
          display: inline-block;
          width: 10rem;
        }
        span:last-child {
          flex: 1;
        }
      }

      &:first-child {
        color: #9ca6aa;
      }
      .list-btn {
        width: 4.8rem;
        height: 1.8rem;
        @include border($c: #e6e6e6, $d: bor);
        color: #9ca6aa;
        border-radius: 0.9rem;
        background: #0b7fe6;
        color: #fff;
        font-size: 0.7rem;
        border: 0;
      }
      .list-null {
        width: 4.8rem;
      }
    }
  }
}

@media (max-width: 767px) {
  .ore-pool-body {
    padding: 2.6rem 15px 3.4rem;
    ul {
      li {
        section {
          justify-content: space-around;
          span {
            &:first-child {
              max-width: 3rem;
            }
            &:nth-child(2) {
              flex: 1;
            }
            &:last-child {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              width: 2rem;
            }
          }
        }
        .list-btn {
          width: 3rem;
          font-size: 0.6rem;
          height: 1.5rem;
          margin-left: 0.2rem;
        }
        .list-null {
          width: 3rem;
        }
      }
    }
    header {
      h2 {
        font-size: 1rem;
      }
      span {
        height: 1.8rem;
        line-height: 1.8rem;
      }
    }
  }
}
</style>