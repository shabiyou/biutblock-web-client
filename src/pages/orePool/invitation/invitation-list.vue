<template>
  <section class="invitation-list">
    <header>
      <span class="list-title">
        {{ $t('invitation.inListTit') }}
      </span>
      <section class="ipt-list">
        <input type="text" v-model="searchIpt" :placeholder="$t('invitation.inListSearch')" />
        <img src="../../../assets/images/search.png" alt="" />
      </section>
    </header>

    <main class="invitation-body">
      <ul>
        <li>
          <span>{{ $t('invitation.inListTxt1') }}</span>
          <span>{{ $t('invitation.inListTxt2') }}</span>
          <span>{{ $t('invitation.inListTxt3') }}</span>
          <span></span>
        </li>
        <li v-for="(item, index) in itemLists" :key="index">
          <span>{{ item.invitationAddress }}</span>
          <span>{{ item.invitationTime }}</span>
          <span>{{ item.invitationMoney }}</span>
          <span @click="lookRules">{{ $t('invitation.inListTxt4') }}</span>
        </li>
      </ul>

      <h4>
        {{ $t(searchContent) }}
      </h4>
    </main>

    <footer>
      <span class="page-number" v-show="!searchRes">
        {{ $t('public.pageTotal') }} {{ total }} {{ $t('public.pageRecord') }}
      </span>
      <span class="page-number" v-show="searchRes">
        {{ $t('public.pageTotal') }} {{ searchTotal }} {{ $t('public.pageResults') }}
      </span>
      <!-- 分页 -->
      <wallet-page
        ref="pageList"
        class="page-list"
        :total="total"
        :totalPage=2
        @next="nextPage"
        @prev="prevPage"
        @goPage="goPage" />
    </footer>
  </section>
</template>

<script>
import walletPage from '../../../components/wallet-page'
export default {
  name: '',
  components: {
    walletPage
  },
  props: {},
  data() {
    return {
      searchIpt: '',
      searchContent: 'invitation.inListNull', //invitation.inListNull 列表内容为空  invitation.inListSearchNull 搜索结果为空
      total: 10,
      searchTotal: 1,
      searchRes: false,
      itemList: [
        {
          id: 0,
          invitationAddress: '0xa9ed4f5fdcee9a1d8c9cdf8a45afba73845a4630',
          invitationTime: '2019/07/21 13:50:46 GMT+8',
          invitationMoney: '1234.12345678',
        }
      ]
    }
  },
  computed: {
    itemLists() {
      return Array(10).fill(this.itemList[0])
    }
  },
  methods: {
    nextPage () {
      alert("下一页")
    },

    prevPage () {
      alert("上一页")
    },

    goPage (e) {
      if (e > this.itemList.length) {
        alert("请输入正确的页码")
        this.$refs.pageList.clearIpt()
        return
      } else {
        alert("跳转指定页" + e)
      }
    },

    lookRules () {
      this.$emit('look', 2)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.invitation-list {
  padding: 2.8rem 4.4rem 0;
  header {
    @extend %flexBetween;
    padding-bottom: 1.1rem;
    .list-title {
      color: #2e3a40;
      font-size: 1.2rem;
    }
    .ipt-list {
      @extend %flexBetween;
      width: 17rem;
      height: 2.4rem;
      @include border($c: #e6e6e6, $d: bor);
      border-radius: 0.2rem;
      padding: 0 1rem;
      box-sizing: border-box;
      input {
        border: 0;
        flex: 1;
      }
      img {
        cursor: pointer;
      }
    }
  }
  .invitation-body {
    ul {
      margin: 0;
      padding: 0;
      font-size: 0.7rem;
      li {
        padding: 0.825rem 0;
        @include border($d: bottom, $c: #e6e6e6);
        color: #252f33;
        @extend %flex;
        &:first-child {
          color: #9fa9ad;
        }
        span {
          display: inline-block;
          &:first-child {
            width: 40%;
          }
          &:nth-child(2) {
            width: 27%;
          }
          &:nth-child(3) {
            width: 25%;
          }
          &:nth-child(4) {
            width: 8%;
            text-align: right;
            color: #29D893;
            cursor: pointer;
          }
        }
      }
    }
    h4 {
      text-align: center;
      color: #9CA6AA;
      font-size: .7rem;
      font-weight: normal;
      padding: 9.7rem 0 8.3rem;
    }
  }
  footer {
    @extend %flexBetween;
    padding-top: 1.3rem;
    .page-number {
      font-size: .7rem;
      color: #99A1A6;
    }
    .wallet-page {
      padding-top: 0;
    }
  }
}

@media (max-width: 767px) {
  .invitation-list {
    padding: 1.4rem 15px 0;
    header {
      flex-direction: column;
      align-items: flex-start;
      .list-title {
        padding-bottom: .4rem;
      }
    }
    .invitation-body ul li {
      span {
        word-wrap: break-word;
        padding-right: .8rem;
        display: inline-block;
        &:first-child {
          width: 8rem;
          word-break: break-all;
        }
        &:nth-child(2) {
          width: 6rem;
        }
        &:nth-child(3) {
          width: 8rem;
        }
        &:last-child {
          width: 4rem;
          padding-right: 0;
          word-break: normal;
        }
      }
    } 
  }
}
</style>