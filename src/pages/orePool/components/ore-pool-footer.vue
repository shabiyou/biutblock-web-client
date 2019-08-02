<template>
  <section class="pool-foot">
    <h2>{{ $t("pool.poolIndexTit3") }}</h2>
    <ul>
      <li v-for="(item, index) in itemLists" :key="index">
        <span>{{ item.poolTime }}</span>
        <span>{{ item.poolMoney }}</span>
      </li>
    </ul>

    <!-- 分页 -->
    <wallet-page
      ref="pageList"
      :total="total"
      @next="nextPage"
      @prev="prevPage"
      @goPage="goPage"
    />
  </section>
</template>

<script>
import walletPage from '../../../components/wallet-page'
export default {
  name: '',
  props: {},
  components: {
    walletPage
  },
  data() {
    return {
      total: 20,
      itemList: [
        {
          id: 0,
          poolTime: '2019/01/24 11:01:25    GMT+8',
          poolMoney: '+ 0.12345678BIU'
        }
      ]
    }
  },
  computed: {
    itemLists() {
      return Array(5).fill(this.itemList[0])
    }
  },
  methods: {
    nextPage() {
      alert("下一页")
    },

    prevPage() {
      alert("上一页")
    },

    goPage(e) {
      if (e > this.total) {
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
.pool-foot {
  padding: 3.2rem 4.4rem 0;
  h2 {
    margin: 0;
    color: #2e3a40;
    font-size: 1.2rem;
    font-family: source-Medium;
    padding-bottom: 1.5rem;
  }
  ul {
    padding: 0;
    margin: 0;
    li {
      @extend %flexBetween;
      @include border($c: #e6e6e6, $d: bottom);
      font-size: 0.7rem;
      color: #2e3a40;
      height: 2.7rem;
    }
  }
}

@media (max-width: 767px) {
  .pool-foot {
     padding: 1.5rem 15px 0;
     h2 {
       padding-bottom: .2rem;
     }
  }
}
</style>