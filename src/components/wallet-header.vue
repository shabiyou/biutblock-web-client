<template>
  <main>
    <el-container>
      <nav>
        <router-link
          tag="img"
          to="/"
          alt="BIUT-Logo"
          title="BIUT"
          class="logo-img"
          :src="logoUrl"
        />
        <!-- 移动端切换按钮 -->
        <section class="tabNav" @click="closeNav">
          <span></span>
          <span></span>
          <span></span>
        </section>

        <!-- 导航条 -->
        <transition>
          <ul class="clearfix" v-show="navShow">
            <router-link
              active-class="check_color"
              exact
              tag="li"
              v-for="(item, index) in navList"
              :key="item.id"
              :class="distance ? 'li_margins' : 'li_margin'"
              :to="item.urlPath"
              @click.native="isClick">
              {{ $t(item.nav_cnt) }}
            </router-link>

            <li @mouseover="hoverNavIn" @mouseout="hoverNavOut">
              {{ $t("headerNav.Language") }}
              <img :src="languageImgUrl" alt="" />
              <section class="languageList" v-show="languageShow">
                <span
                  v-for="(item, index) in languageList"
                  :key="item.id"
                  :class="index === listIdx ? 'check_list' : ''"
                  @click="tabLanguage(index)">
                  {{ item.cnt }}
                </span>
              </section>
            </li>
          </ul>
        </transition>
      </nav>
    </el-container>
  </main>
</template>

<script>
import languageImg from '../assets/images/language.png'
import languagesImg from '../assets/images/languages.png'
import logoUrl from '../assets/images/logo.png'
export default {
  name: 'walletHeader',
  data() {
    return {
      logoUrl,//导航栏logo
      listIdx: 0,//控制语言切换样式
      languageShow: 0,// 0 隐藏  1 显示
      languageImgUrl: languageImg,//语言图片
      distance: true,//导航条距离
      navShow: true, //导航栏默认 PC样式展示
      languageList: [
        {
          id: '01',
          cnt: '中文'
        },
        {
          id: '02',
          cnt: 'English'
        }
      ],
      navList: [
        {
          'id': '1',
          'nav_cnt': 'headerNav.Newallet',
          'img': '',
          'imgs': '',
          'urlPath': 'createWallet'
        },
        {
          'id': '2',
          'nav_cnt': 'headerNav.ViewWalletInfo',
          'img': '',
          'imgs': '',
          'urlPath': 'walletInfo'
        },
        {
          'id': '3',
          'nav_cnt': 'headerNav.TransferSEC',
          'img': '',
          'imgs': '',
          'urlPath': 'transferAccounts'
        },
        {
          'id': '4',
          'nav_cnt': 'headerNav.orePool',
          'img': '',
          'imgs': '',
          'urlPath': 'orePool'
        },
        {
          'id': '5',
          'nav_cnt': 'headerNav.Mapping',
          'img': '',
          'imgs': '',
          'urlPath': 'walletMapping'
        },
        {
          'id': '6',
          'nav_cnt': 'headerNav.Guide',
          'img': '',
          'imgs': '',
          'urlPath': 'walletHelp'
        }
      ]
    }
  },
  methods: {
    //切换导航
    isClick() {
      if (this.ismobile()) {
        this.navShow = false //点击切换隐藏
        document.body.removeAttribute("class", "body-hidden");
      }
    },

    //语言切换
    tabLanguage(index) {
      this.listIdx = index
      if (this.ismobile()) {
        this.navShow = false //点击切换隐藏
        document.body.removeAttribute("class", "body-hidden");
      }
      if (index === 0) {
        this.$i18n.locale = 'zh'
        this.distance = false
      } else {
        this.$i18n.locale = 'en'
        this.distance = true
      }
    },

    //语言鼠标移入
    hoverNavIn() {
      this.languageImgUrl = languagesImg
      this.languageShow = 1
    },

    //语言鼠标移出去
    hoverNavOut() {
      this.languageImgUrl = languageImg
      this.languageShow = 0
    },

    //移动端关闭导航栏
    closeNav() {
      if (this.navShow) {
        this.navShow = false
        document.body.removeAttribute("class", "body-hidden");
      } else {
        this.navShow = true
        document.getElementsByTagName("body")[0].className = "body-hidden"
      }
    }
  },
  mounted() {

  },
  created() {
    if (this.$i18n.locale == "en") {
      this.listIdx = 1
    } else {
      this.listIdx = 0
    }
    if (this.ismobile()) {
      this.navShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
main {
  background: #42535b;
}
nav {
  height: 3.5rem;
  @extend %flexBetween;
  width: 100%;
  .logo-img {
    width: 4.4rem;
    height: 1.6rem;
  }
  ul {
    font-size: 0.8rem;
    font-weight: 300;
    color: $navColor;
    height: 3.5rem;
    line-height: 3.5rem;
    padding: 0;
    margin: 0;
    font-family: source-Light;
    li {
      float: left;
      position: relative;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        padding-left: 1.1rem;
        margin-left: 1.1rem;
        &:hover {
          color: $colorGreen;
        }
      }
      .languageList {
        position: absolute;
        top: 3.5rem;
        right: 0;
        width: 8.7rem;
        height: 4.2rem;
        background: #fff;
        box-shadow: 0 0.15rem 0.3rem #00000029;
        border-radius: 0 0 0.5rem 0.5rem;
        z-index: 99;
        span {
          display: block;
          height: 2.1rem;
          line-height: 2.1rem;
          padding-left: 0.8rem;
          color: $navColor;
          &:hover {
            cursor: pointer;
            background: $navActive;
            color: #fff;
          }
          &:last-child {
            border-radius: 0 0 0.5rem 0.5rem;
            &:hover {
              border-radius: 0 0 0.5rem 0.5rem;
            }
          }
        }
        .check_list {
          background: $navActive;
          color: #fff;
        }
      }
    }
    .li_margin {
      margin-left: 2.2rem;
    }
    .li_margins {
      margin-left: 1.8rem;
    }
    .check_color {
      color: $colorGreen;
      font-weight: 500;
      &:after {
        @include border($w: 0.45rem, $c: transparent, $d: left);
        @include border($w: 0.45rem, $c: transparent, $d: right);
        @include border($w: 0.45rem, $c: #00D69B, $d: bottom);
        content: "";
        position: absolute;
        width: 0;
        bottom: 0;
        left: calc(50% - 0.45rem);
      }
    }
  }
}

.v-enter,
.v-leave-to {
  opacity: 0;
  height: 0;
}
.v-enter-active,
.v-leave-to {
  transition: opacity 1s;
  height: auto;
}
@media (max-width: 767px) {
  nav {
    height: 4rem;
    padding: 0 1rem;
    ul {
      display: flex;
      flex-direction: column;
      flex: 1;
      z-index: 9999;
      position: absolute;
      top: 4rem;
      left: 0;
      right: 0;
      bottom: 0;
      height: auto;
      li {
        margin: 0;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #42535b;
        box-sizing: border-box;
        @include border($c: #b9c4c2, $d: top);
        .languageList {
          width: 100%;
          top: 2.4rem;
        }
      }
      .li_margin,
      .li_margins,
      li:last-child {
        margin-left: 0;
        padding-left: 1.75rem;
      }
      .check_color:after {
        display: none;
      }
    }

    .tabNav {
      width: 1.25rem;
      display: block;
      position: relative;
      transition: all 0.5s ease;
      span {
        transition: transform 0.5s ease;
        height: 0.1rem;
        width: 100%;
        background: #fff;
        display: block;
        margin-bottom: 0.25rem;
      }
    }
  }
}
</style>