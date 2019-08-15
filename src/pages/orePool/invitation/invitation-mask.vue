<template>
  <section class="mask">
    <section class="rules-content mask_cnt" v-show="maskPage === 1">
      <header class="public-head">
        <span>查看规则</span>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </header>

      <p class="rules-tit">每次邀请成功就会奖励BIUT，请注意查收哦</p>
      <ul>
        <li>
          <span>级别</span>
          <span>人数</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <figure>
            <img :src="item.portrait" alt="" />
            <figcaption>
              {{ item.level }}
            </figcaption>
          </figure>
          <span class="rules-number">
            {{ item.number }}
          </span>
        </li>
      </ul>
    </section>

    <section class="details-content mask_cnt" v-show="maskPage === 2">
      <header class="public-head">
        <span>查看明细</span>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </header>

      <p class="details-tit details-tit-top">地址</p>
      <p class="details-txt">
        {{ maskAddress }}
        <span>
          {{ maskLevel }}
        </span>
      </p>
      <p class="details-tit">总收益 (BIUT)</p>
      <p class="details-txt">
        {{ totalRevenue }}
      </p>

      <ul>
        <li>
          <span>时间</span>
          <span>奖励 (BUT)</span>
        </li>
        <li v-for="(item, index) in amountList" :key="index">
          <span>{{ item.maskTime }}</span>
          <span>{{ item.maskAmount }}</span>
        </li>
      </ul>

      <footer>
        <span class="page-number">
          共 {{ total }} 条记录
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
  </section>
</template>

<script>
import level1 from '../../../assets/images/level1.png'
import level2 from '../../../assets/images/level2.png'
import level3 from '../../../assets/images/level3.png'
import level4 from '../../../assets/images/level4.png'

import walletPage from '../../../components/wallet-page'
export default {
  name: '',
  components: {
    walletPage
  },
  props: {
    maskPage: Number // 1 查看规则  2 查看明细
  },
  data() {
    return {
      totalRevenue: '13',
      maskAddress: '0xa9ed4f5fdcee9a1d8c9cdf8a45afba73845a4630',
      maskLevel: '二级',
      total: 10,
      itemList: [
        {
          level: '铜牌合伙人',
          portrait: level1,
          number: '1-9'
        },
        {
          level: '银牌合伙人',
          portrait: level2,
          number: '10-99'
        },
        {
          level: '金牌合伙人',
          portrait: level3,
          number: '100-909'
        },
        {
          level: '超级合伙人',
          portrait: level4,
          number: '1000以上'
        }
      ],
      amountList: [
        {
          id: 0,
          maskTime: '2019/07/17 00:00',
          maskAmount: '1.345678'
        }
      ]
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },

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
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
.mask {
  .public-head {
    @extend %flexBetween;
    color: #252f33;
    font-size: 0.8rem;
    img {
      cursor: pointer;
    }
  }
  .rules-content {
    width: 18.3rem;
    background: #fff;
    padding: 0.8rem 1.2rem 1.4rem;
    .rules-tit {
      color: #99a1a6;
      font-size: 0.7rem;
      padding: 1.8rem 0 1.2rem;
    }
    ul {
      margin: 0;
      padding: 0;
      li {
        @extend %flexBetween;
        padding: 0.425rem 0;
        color: #42535b;
        font-size: 0.7rem;
        @include border($c: #e6e6e6, $d: bottom);
        box-sizing: border-box;
        &:first-child {
          background: #f7fbfa;
          border-bottom: 0;
          padding: 0.425rem 2.8rem 0.425rem 2.2rem;
          span:last-child {
            display: inline-block;
            width: 3rem;
            text-align: center;
          }
        }
        figure {
          @extend %flexBetween;
          margin: 0;
          img {
            margin-right: 1rem;
          }
        }
        .rules-number {
          display: inline-block;
          width: 3rem;
          text-align: center;
          margin-right: 2.8rem;
        }
      }
    }
  }
  .details-content {
    width: 24.6rem;
    padding: 1rem 1.2rem 1.2rem;
    .details-tit {
      color: #99a1a6;
      font-size: 0.7rem;
      padding-top: 1rem;
    }
    .details-tit-top {
      padding-top: 2rem;
    }
    .details-txt {
      color: #252f33;
      font-size: 0.8rem;
      padding-top: .4rem;
      span {
        display: inline-block;
        width: 2.8rem;
        height: 1.2rem;
        background: #f5a623;
        border-radius: 0.8rem;
        color: #fff;
        font-size: 0.7rem;
        text-align: center;
        line-height: 1.2rem;
        margin-left: 1rem;
      }
    }
    ul {
      margin: 0;
      padding: 1.6rem 0 0;
      li {
        display: flex;
        align-items: center;
        color: #252F33;
        font-size: .7rem;
        @include border($c:#E6E6E6,$d: bottom);
        padding: .6rem 0;
        box-sizing: border-box;
        span {
          display: inline-block;
          width: 50%;
          &:first-child {
            padding-left: .9rem;
          }
        }
        &:first-child {
          background: #F7FBFA;
          color: #99A1A6;
          border: 0;
        }
      }
    }
    footer {
      @extend %flexBetween;
      padding-top: 1rem;
      .page-number {
        color: #99A1A6;
        font-size: .7rem;
      }
      .page-list {
        padding: 0;
      }
    }
  }
}
</style>