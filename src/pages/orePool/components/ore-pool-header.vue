<template>
  <section>
    <ul>
      <li v-for="(item, index) in itemList" :key="index">
        <figure>
          <img :src="item.imgUrl" />
          <figcaption>
            <p>{{ $t(item.tit) }}</p>
            <p>{{ item.txt | currency("") }} BIU</p>
          </figcaption>
        </figure>
      </li>
    </ul>
  
    <section class="line" />
  </section>
</template>

<script>
import poolList1 from '../../../assets/images/poolList1.png'
import poolList2 from '../../../assets/images/poolList2.png'
import poolList3 from '../../../assets/images/poolList3.png'
import poolList4 from '../../../assets/images/poolList4.png'
export default {
  name: '',
  props: {},
  data() {
    return {
      itemList: [
        {
          id: 0,
          imgUrl: poolList1,
          tit: 'pool.poolIndexTxt1',
          txt: '12585.158954'
        },
        {
          id: 1,
          imgUrl: poolList2,
          tit: 'pool.poolIndexTxt2',
          txt: '2555.15893254'
        },
        {
          id: 2,
          imgUrl: poolList3,
          tit: 'pool.poolIndexTxt3',
          txt: '182555'
        },
        {
          id: 3,
          imgUrl: poolList4,
          tit: 'pool.poolIndexTxt4',
          txt: '100000000000000'
        }
      ]
    }
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/styless/public";
ul {
  margin: 0;
  padding: 2.5rem 4.4rem;
  @extend %flexBetween;
  li {
    text-align: center;
    height: 8.1rem;
    flex: 1;
    @include border($c: #e6e6e6, $d: right);
    figure {
      margin: 0;
      p {
        color: #2e3a40;
        font-size: 1rem;
        font-family: source-Medium;
        &:first-child {
          font-size: 0.7rem;
          font-family: source-Regular;
          padding: 0.6rem 0 0.2rem;
          color: #7e73e3;
        }
      }
    }
    &:nth-child(2) {
      figure p:first-child {
        color: #0672ff;
      }
    }
    &:nth-child(3) {
      figure p:first-child {
        color: #fbac10;
      }
    }
    &:nth-child(4) {
      figure p:first-child {
        color: #00d86d;
      }
    }
  }
}
.line {background: #F5F5F5;height: .5rem;}

@media (max-width: 767px) {
  ul {
    padding: 1.5rem 15px;
   flex-direction: column;
    li {
      width: 100%;
      border-right: 0;
      height: auto;
      padding-top: 1rem;
      &:first-child {
        padding-top: 0;
      }
    }
  }
}
</style>
