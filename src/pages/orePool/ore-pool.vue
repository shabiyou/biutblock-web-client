<template class="pool-container">
  <main>
    <section v-show="loginPage === 0">
      <!-- banner部分 -->
      <header class="pool-header">
        <h2>{{ $t("pool.poolBanner") }}</h2>
        <p>The Biut Mine Pool Is Officially Online.</p>
      </header>

      <section class="pool-body el-container">
        <section class="pool-body-flex pool-body-head1" :class="loginStatus ? 'flex-end' : ''">
          <!-- 不是登陆状态下隐藏 -->
          <figure v-show="!loginStatus">
            <figcaption>{{ address }}</figcaption>
            <img
              src="../../assets/images/go.png"
              alt=""
              @click="poolPage = 2"
              v-show="poolPage === 1" />
          </figure>

          <span class="login-btn" @click="goLogin" v-show="loginStatus">
            {{ $t("pool.poolIndexL") }}
          </span>
          <span class="login-btn" v-show="!loginStatus" @click="exitPage">
            {{ $t("pool.poolIndexE") }}
          </span>
        </section>

        <!-- 没有登陆 -->
        <section v-show="poolPage === 1">
          <section class="pool-body-flex pool-body-head2">
            <span>{{ $t("pool.poolIndexTit1") }}</span>
            <section>
              <input
                type="text"
                :placeholder="$t('pool.poolIndexIpt')"
                v-model="searchIpt" />
              <img
                :src="searchImg"
                alt=""
                @click="searchFrom"
                :class="searchDsb ? 'load' : ''" />
            </section>
          </section>

          <!-- 所有列表 -->
          <pool-list :itemList="itemLists" :poolName="searchIpt" />
        </section>

        <!-- 登录成功 -->
        <section v-show="poolPage === 2">
          <p class="tab-line"></p>
          <ul class="tab-list">
            <li :class="idx === 0 ? 'active-list' : ''" @click="tabClick(0)">矿池</li>
            <li :class="idx === 1 ? 'active-list' : ''" @click="tabClick(1)">邀请</li>
          </ul>
          <!-- 矿池 -->
          <section v-show="idx === 0">
            <pool-header />
            <pool-body 
              @lookAll="poolPage = 1"
              :itemList="addPoolList" />
            
            <!-- 收益列表 -->
            <pool-footer v-show="addPoolList.length > 0"/>
            
            <!-- 没有加入矿池展示 -->
            <h4 v-show="addPoolList.length === 0">无记录</h4>
          </section>

          <!-- 邀请 -->
          <section v-show="idx === 1">
            <invitation-header @look="lookRules"/>

            <invitation-list @look="lookRules"/>

            <invitation-mask 
              :maskPage="maskPage"
              v-show="maskShow"
              @close="closeInvitationMask"/>
          </section>

          
        </section>
      </section>
    </section>

    <section v-show="loginPage === 1">
      <pool-login @login="userLogin" />
    </section>
  </main>
</template>

<script>
import poolList from './components/ore-pool-list'
import poolHeader from './components/ore-pool-header'
import poolBody from './components/ore-pool-body'
import poolLogin from './login/ore-pool-login'
import invitationHeader from './invitation/invitation-header'
import invitationList from './invitation/invitation-list'
import invitationMask from './invitation/invitation-mask'
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
    poolLogin,
    invitationHeader,
    invitationList,
    invitationMask
  },
  props: {},
  data() {
    return {
      searchIpt: '', //搜索框
      searchImg: search,
      searchDsb: true,
      loginStatus: true,
      poolPage: 1,
      loginPage: 0,
      address: '',//钱包地址
      privateKey: '',//私钥
      maskPage: 1,
      maskShow: false,
      idx: 0,
      itemList: [
        {
          id: 0,
          poolNmae: '神马M20yanNerjks',
          poolMoney: '1100 BIUT'
        }
      ],
      addPoolList: [
        {
          id: 0,
          poolName: '神马M20yanNerjks',
          pooolMoney: '585454541.2345678 BIUT'
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
    if (this.ismobile()) {
      this.address = this.address.replace(/(.{6}).+(.{6})/, '$1...$2')
    }
  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //搜索内容
    searchFrom() {
      let ipt = this.searchIpt

      alert("搜索内容" + ipt)
    },

    //去登陆
    goLogin() {
      this.loginPage = 1
    },

    //登陆成功
    userLogin (e) {
      this.loginPage = 0
      this.address = e.userAddress
      this.privateKey = e.userPrivateKey 

      this.loginStatus = false
    },

    //退出登陆、退出成功之后再重新加载一次所有列表
    exitPage () {
      this.loginStatus = true
      
    },

    tabClick (index) {
      this.idx =  index
    },

    lookRules (e) {
      this.maskPage = e
      this.maskShow = true
    },

    closeInvitationMask () {
      this.maskShow = false
    }
  },
  watch: {
    searchIpt(newVal, oldVal) {
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
      box-sizing: border-box;
      padding: 0 4.4rem;
      height: 4.8rem;
    }
    .flex-end {
      justify-content: flex-end;      
    }
    h4 {
      text-align: center;
      color: #9CA6AA;
      font-size: .7rem;
      padding: 2.4rem 0 6.2rem;
      font-weight: normal;
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
          height: 2rem;
        }
        img {
          cursor: pointer;
          margin-left: 1rem;
        }
        .load {
          pointer-events: none;
        }
      }
    }
    .tab-line {
      height: .5rem;
      background:#f5f5f5;
    }
    .tab-list {
      @extend %flex;
      align-items: center;
      height: 4.1rem;
      @include border($c: #e6e6e6, $d: bottom);
      margin: 0;
      padding: 0 0 0 4.4rem;
      color: #9CA6AA;
      font-size: .9rem;
      box-sizing: border-box;
      li {
        width: 3.9rem;
        height: 100%;
        @extend %flexCenter;
        cursor: pointer;
        @include border($c: transparent, $d: bottom,$w: .15rem);
        margin-bottom: -.15rem;
        &:first-child {
          margin-right: 3.2rem;
        }
      }
      .active-list {
        color: #29D893;
        @include border($c: #29D893, $d: bottom, $w: .15rem);
        box-sizing: border-box;
      }
    }
  }
}

@media (max-width: 767px) {
  main {
    .pool-body {
      width: calc(100% - 30px);
      .pool-body-head1 {
        padding: 0.8rem 15px;
        flex-wrap: wrap;
        height: auto;
        figure {
          color: $colorGreen;
        }
      }
      .pool-body-head2 {
        padding: 1.6rem 15px 1.2rem;
        span {
          font-size: 1rem;
        }
        section {
          input {
            max-width: 6rem;
          }
          max-width: 12rem;
        }
      }
    }
  }
}
</style>