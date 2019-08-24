<template>
  <section class="mask">
    <section class="rules-content mask_cnt" v-show="maskPage === 1">
      <header class="public-head">
        <span>{{ $t('invitation.rules') }}</span>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </header>

      <p class="rules-tit">{{ $t('invitation.inMaskTxt') }}</p>
      <ul>
        <li>
          <span>{{ $t('invitation.inMaskListTxt1') }}</span>
          <span>{{ $t('invitation.inMaskListTxt2') }}</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <figure>
            <img :src="item.portrait" alt="" />
            <figcaption>
              {{ $t(item.level) }}
            </figcaption>
          </figure>
          <span class="rules-number">
            {{ $t(item.number) }}
          </span>
        </li>
      </ul>
    </section>

    <section class="details-content mask_cnt" v-show="maskPage === 2">
      <header class="public-head">
        <span>{{ $t('invitation.inListTxt4') }}</span>
        <img src="../../../assets/images/closeMask.png" alt="" @click="close" />
      </header>

      <p class="details-tit details-tit-top">{{ $t('invitation.inListTxt1') }}</p>
      <p class="details-txt">
        {{ maskAddress }}
        <span>
          {{ maskLevel }}
        </span>
      </p>
      <p class="details-tit">{{ $t('invitation.inListTxt3') }}</p>
      <p class="details-txt">
        {{ totalRevenue | currency("") }}
      </p>

      <ul>
        <li>
          <span>{{ $t('invitation.inMask2ListTxt1') }}</span>
          <span>{{ $t('invitation.inMask2ListTxt2') }}</span>
        </li>
        <li v-for="(item, index) in amountLists" :key="index">
          <span>{{ item.maskTime }}</span>
          <span>{{ item.maskAmount | currency("") }}</span>
        </li>
      </ul>

      <footer>
        <span class="page-number">
          {{ $t('public.pageTotal') }} {{ total }} {{ $t('public.pageRecord') }}
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
          level: 'invitation.level1',
          portrait: level1,
          number: '1-9'
        },
        {
          level: 'invitation.level2',
          portrait: level2,
          number: '10-99'
        },
        {
          level: 'invitation.level3',
          portrait: level3,
          number: '100-909'
        },
        {
          level: 'invitation.level4',
          portrait: level4,
          number: 'invitation.level4Txt'
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
  computed: {
    amountLists () {
      return Array(2).fill(this.amountList[0])
    },
  },
  mounted() {
    if (this.ismobile()) {
      this.maskAddress = e.maskAddress.replace(/(.{6}).+(.{6})/, '$1...$2')
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
            width: 6rem;
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
          width: 6rem;
          text-align: center;
          margin-right: 2.8rem;
        }
      }
    }
  }
  .details-content {
    max-width: 24.6rem;
    min-height: 26.2rem;
    padding: 1rem 1.2rem 1.2rem;
    .details-tit {
      color: #99a1a6;
      font-size: 0.7rem;
      padding-top: 1rem;
    }
    .details-tit-top {
      padding-top: 1.6rem;
    }
    .details-txt {
      color: #252f33;
      font-size: 0.8rem;
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
      padding: 1.2rem 0 0;
      height: 13.8rem;
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

@media (max-width: 767px) {
  .mask .details-content .details-txt span {
    margin: .2rem 0 0 0;
  }
}
</style>