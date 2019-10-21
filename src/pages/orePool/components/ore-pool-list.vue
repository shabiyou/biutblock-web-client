<template>
  <section>
    <ul>
      <li>
        <section>
          <span>{{ $t("pool.poolIndexListTit1") }}</span>
          <span>{{ $t("pool.poolIndexListTit2") }}</span>
          <span>{{ $t("pool.poolIndexListTit3") }}</span>
        </section>
        <span class="list-null"></span>
      </li>

      <!-- 搜索结果 -->
      <li class="search-result" v-show="itemList.length === 0">
        <p>
          {{ $t("pool.poolIndexSearch1") }} {{ itemList.length }}
          {{ $t("pool.poolIndexSearch2") }} {{ poolName }}
          {{ $t("pool.poolIndexSearch3") }}
        </p>
      </li>

      <!-- 搜索结果列表 -->
      <li
        v-for="(item, index) in itemList"
        :key="index"
        v-show="itemList.length > 0"
        v-if="item.poolAddress != '000000000000000000000000000000000009'">
        <section>
          <span>{{ item.poolName.replace(/(.{8}).+(.{3})/, "$1...") }}</span>
          <span>{{ item.poolMoney === -1 ? $t("pool.poolLoading") : getPointNum(item.poolMoney) + ' BIUT' }} </span>
          <span>{{ "0x" + item.poolAddress }}</span>
        </section>

        <!-- 判断是否 有加入的矿池，加入的话、第一个显示  后面不现实加入按钮、没有加入 所有按钮不可点击 -->
        <button type="button" class="list-btn" @click="joinMask(item)">{{
          $t("pool.poolIndexListTxt2")
        }}</button>
      </li>
    </ul>

    <!-- 分页 -->
    <!-- <wallet-page
      ref="pageList"
      class="page-list"
      :total="total"
      :totalPage=2
      @next="nextPage"
      @prev="prevPage"
      @goPage="goPage"
      v-show="itemList.length > 10" /> -->

    <!-- mask 弹窗 -->
    <pool-mask
      v-show="maskShow"
      :maskPage="maskPage"
      :address="address"
      :addressShort="addressShort"
      :mortgageShow="mortgageShow"
      :selectedItem="selectedItem"
      :privateKey="privateKey"
      :totalMoney="walletBalance.toString()"
      @close="closeMask"
      @updatePage="updatePage"
    />
  </section>
</template>

<script>
import poolMask from './ore-pool-mask'
import walletPage from '../../../components/wallet-page'
export default {
  name: '',
  components: {
    poolMask,
    walletPage
  },
  props: {
    itemList: Array,
    poolName: String,
    address: String,
    addressShort: String,
    privateKey: String,
    stus: Boolean,
    // walletBalance: Number,
    joinMaskPage: Number  // 0 没加入过  1 加入过
  },
  data() {
    return {
      maskShow: false,
      selectedItem: {},
      maskPage: 2, //弹窗显示页面  1 - 已经加入过了  2 - 还没有加入过
      mortgageShow: false
    }
  },
  computed: {
    total() {
      return this.itemList.length
    },
    walletBalance () {
      return this.$store.getters.availibleAmount
    }
  },
  methods: {
    closeMask() {
      this.maskShow = false
    },

    updatePage(ipt, address) {
      this.maskPage = 3
      this.$emit('updatePage', ipt, address)
    },

    joinMask(item) {
      /**
       * 判断是否已经加入矿池
       * 
       * 1
       */
      if (this.stus) {
        this.$emit('login')
      } else {
        this.maskShow = true
        if (this.joinMaskPage === 0) {
          this.maskPage = 2
          this.selectedItem = item
        } else {
          this.maskPage = 1
        }
      }
    },

    nextPage() {
      alert("下一页")
    },

    prevPage() {
      alert("上一页")
    },

    goPage(e) {
      if (e > this.itemList.length) {
        alert("请输入正确的页码")
        this.$refs.pageList.clearIpt()
        return
      } else {
        alert("跳转指定页" + e)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
ul {
  margin: 0;
  padding: 0 4.4rem;
  li {
    height: 3rem;
    font-size: 0.7rem;
    color: #2e3a40;
    @extend %flexBetween;
    @include border($c: #e6e6e6, $d: bottom);
    box-sizing: border-box;
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
    .list-btn {
      width: 4.8rem;
      height: 1.8rem;
      background: #00d69b;
      border-radius: 1.2rem;
      border: 0;
      color: #fff;
      font-size: 0.7rem;
    }
    .list-null {
      width: 4.8rem;
    }
    &:first-child {
      color: #9ca6aa;
      @include border($c: #e6e6e6, $d: bottom, $w: 0.1rem);
    }
  }
  .search-result {
    border: 0;
  }
}
.page-list {
  padding-right: 4.4rem;
}

@media (max-width: 767px) {
  ul {
    padding: 0 15px;
    li {
      section {
        justify-content: space-around;
        span {
          &:first-child {
            max-width: 3rem;
            overflow: hidden;
          }
          &:nth-child(2) {
            width: 6rem;
            margin: 0 .5rem;
            word-break: break-word;
          }
          &:last-child {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 2rem;
            flex: 1;
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

  .page-list {
    padding-right: 15px;
  }
}
</style>