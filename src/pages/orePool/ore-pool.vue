<template class="pool-container">
  <main>
    <section v-show="loginPage === 0">
      <header class="pool-header">
        <h2>{{ $t('pool.poolBanner') }}</h2>
        <p>The Biut Mine Pool Is Officially Online.</p>
      </header>

      <section class="pool-body el-container">
        <section class="pool-body-flex pool-body-head1">
          <!-- 不是登陆状态下隐藏 -->
          <figure>
            <figcaption>0xa9ed4f5fdcee9a1d8c9cdf8a45afba73845a4630</figcaption>
            <img src="../../assets/images/go.png" alt="" @click="poolPage = 2" v-show="poolPage === 1" />
          </figure>
          <span class="login-btn" @click="goLogin">{{ $t('pool.poolIndexL') }}</span>
        </section>

        <!-- 没有登陆 -->
        <section v-show="poolPage === 1">
          <section class="pool-body-flex pool-body-head2">
            <span>{{ $t('pool.poolIndexTit1') }}</span>
            <section>
              <input type="text" :placeholder="$t('pool.poolIndexIpt')" v-model="searchIpt"/>
              <img :src="searchImg" alt="" @click="searchFrom" :class="searchDsb ? 'load' : ''" />
            </section>
          </section>
          <pool-list :itemList="itemLists" :poolName="searchIpt" />
        </section>
        
        <!-- 登录成功 -->
        <section v-show="poolPage === 2">
          <pool-header />
          <pool-body 
            @lookAll="poolPage = 1"/>
          <pool-footer />
        </section> 

      </section>
    </section>

    <section v-show="loginPage === 1">
      <pool-login />
    </section>

  </main>
</template>

<script>
import poolList from './components/ore-pool-list'
import poolHeader from './components/ore-pool-header'
import poolBody from './components/ore-pool-body'
import poolLogin from './ore-pool-login'
import poolFooter from './components/ore-pool-footer'
import search from '../../assets/images/search.png'
import searchs from '../../assets/images/searchs.png'
export default {
  name: '',
  components: {
    poolList,
    poolHeader,
    poolBody,
    poolFooter,
    poolLogin
  },
  props: {},
  data() {
    return {
      searchIpt: '',
      searchImg: search,
      searchDsb: true,
      poolPage: 1,
      loginPage: 0,
      itemList: [
        {
          id: 0,
          poolNmae: '神马M20yanNerjks',
          poolMoney: '1100 BIUT'
        }
      ]
    }
  },
  computed: {
    itemLists() {
      return Array(10).fill(this.itemList[0])
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //搜索内容
    searchFrom () {
      let ipt = this.searchIpt
      alert("")
    },

    goLogin () {
      this.loginPage = 1
      //this.$router.push('/orePoolLogin')
    }
  },
  watch: {
    searchIpt (newVal, oldVal) {
      if (newVal.length > 0) {
        this.searchImg = searchs
        this.searchDsb = false
      } else {
        this.searchImg = search
        this.searchDsb = true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styless/public";
main {
  background: #f5f5f5;
  padding-bottom: 2rem;
  .pool-header {
    @include bgCover("../../assets/images/poolBanner.png");
    height: 26rem;
    text-align: center;
    color: #adbbc9;
    font-size: 0.7rem;
    h2 {
      color: #f5f7fa;
      font-size: 1.8rem;
      padding-top: 7rem;
    }
  }
  .pool-body {
    height: auto;
    margin-top: -4.8rem;
    padding: 0 0 1.8rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    .pool-body-flex {
      @extend %flexBetween;
      figure {
        margin: 0;
        @extend %flexBetween;
        color: #42535b;
        font-size: 0.7rem;
        img {
          margin-left: 1.2rem;
          cursor: pointer;
        }
      }
      .login-btn {
        width: 6.6rem;
        height: 2.4rem;
        @include border($c: #e6e6e6, $d: bor);
        text-align: center;
        line-height: 2.4rem;
        color: #9ca6aa;
        font-size: 0.7rem;
        box-sizing: border-box;
        border-radius: 0.2rem;
        cursor: pointer;
      }
    }
    .pool-body-head1 {
      @include border($c: #e6e6e6, $d: bottom);
      box-sizing: border-box;
      padding: 0 4.4rem;
      height: 4.8rem;
    }
    .pool-body-head2 {
      padding: 2.6rem 4.4rem 1.8rem;
      span {
        font-size: 1.2rem;
        color: #2e3a40;
      }
      section {
        width: 17rem;
        height: 2.4rem;
        @include border($c: #e6e6e6, $d: bor);
        border-radius: 0.2rem;
        @extend %flexBetween;
        box-sizing: border-box;
        padding: 0 1rem;
        input {
          flex: 1;
          border: 0;
        }
        img {
          cursor: pointer;
          margin-left: 1rem;
        }
        .load{
          pointer-events: none;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  main {
    .pool-body {
      width: calc(100% - 30px);
      .pool-body-head1 {
        padding: .8rem 15px;
        flex-wrap: wrap;
        height: auto;
      }
      .pool-body-flex {
        .login-btn {
          height: 1.6rem;
          line-height: 1.6rem;
          margin-top: .3rem;
        }
      }
      .pool-body-head2 {
        padding: 1.6rem 15px 1.2rem;
        section {
          max-width: 16rem;
        }
      }
    }
  }
}
</style>