<template>
  <main>
    <el-container>
      <nav>
        <router-link tag="img" to="/" :src="logoUrl" alt="BIUT-Logo" title="BIUT"></router-link>
        <!-- 切换按钮 -->
        <section class="tabNav" @click="closeNav" v-show="navButton">
          <span></span>
          <span></span>
          <span></span>
        </section>

        <!-- 导航条 -->
        <transition>
            <ul class="clearfix" v-show="navShow">
              <router-link v-for="(item, index) in navList" 
                :key="item.id"
                @click.native="isClick(item.nav_cnt)" 
                tag="li" :to="item.urlPath"
                :class="[item.nav_cnt===navCnt?'check_color':'',distance?'li_margins':'li_margin']"> 
                {{ $t(item.nav_cnt) }}
              </router-link>

              <li @mouseover="hoverNavIn" @mouseout="hoverNavOut">
                {{$t('headerNav.Language')}}
                <img :src="languageImgUrl" alt="">
                <section class="languageList" v-show="languageShow">
                  <span v-for="(item, index) in languageList" 
                        :key="item.id"
                        :class="index===listIdx?'check_list':''"
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
  data () {
    return {
      logoUrl: logoUrl,
      navCnt: '', //控制导航栏样式
      listIdx: 0,//控制语言切换样式
      languageShow: 0,// 0 隐藏  1 显示
      languageImgUrl: languageImg,
      distance: true,//导航条距离
      navShow: false,
      navButton: false,
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
        // {
        //   'id': '6',
        //   'nav_cnt': 'headerNav.GetTestCoin',
        //   'img': '',
        //   'imgs': '',
        //   'urlPath': 'receiveSec'
        // },
        {
          'id': '3',
          'nav_cnt': 'headerNav.TransferSEC',
          'img': '',
          'imgs': '',
          'urlPath': 'transferAccounts'
        },
        {
          'id': '4',
          'nav_cnt': 'headerNav.Mapping',
          'img': '',
          'imgs': '',
          'urlPath': 'walletMapping'
        },
        {
          'id': '5',
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
    isClick (index) {
      sessionStorage.setItem('idx', index);
      this.navCnt = index
      let flg = this.ismobile()
      if (flg) {
        this.navShow = false //点击切换隐藏
      }
    },

    //语言切换
    tabLanguage (index) {
      this.listIdx = index
      let flg = this.ismobile()
      if (flg) {
        this.navShow = false //点击切换隐藏
      }
      if (index === 0) {
        this.$i18n.locale = 'zh'
        this.distance = false
      } else {
        this.$i18n.locale = 'en'
        this.distance = true
      }
    },

    //鼠标移入
    hoverNavIn () {
      this.languageImgUrl = languagesImg
      this.languageShow = 1
    },

    //鼠标移出去
    hoverNavOut () {
      this.languageImgUrl = languageImg
      this.languageShow = 0
    },

    // activeLastNav () {
    //   let flg = this.ismobile()
    //   if (flg) {
    //     this.navShow = false //点击切换隐藏
    //     if (this.languageShow == 0) {
    //       this.languageShow = 1
    //     } else {
    //       this.languageShow = 0
    //     }
    //   }
    // },

    closeNav () {
      this.navShow = !this.navShow
    },

    ismobile () {
      var mobileArry = ["iPhone", "iPad", "Android", "Windows Phone", "BB10; Touch", "BB10; Touch", "PlayBook", "Nokia"];
      var ua = navigator.userAgent;
      var res=mobileArry.filter(function(arr) {
        return ua.indexOf(arr) > 0;
      });
      return res.length > 0;
    }
  },
  mounted() {
    this.navCnt = sessionStorage.getItem('idx') || 'headerNav.Newallet'
  },
  created() {
    if (this.$i18n.locale == "en") {
      this.listIdx = 1
    } else {
      this.listIdx = 0
    }

    let flg = this.ismobile()
    if (flg) {
      this.navShow = false
      this.navButton = true
    } else {
      this.navShow = true
      this.navButton = false
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.navCnt = ""+val.meta.title+""
      },
      // 深度观察监听
      deep: true
    }
  },
}
</script>

<style scoped>
  main {background:rgba(66,83,91,1);}
  nav {height: 3.5rem;display: flex;align-items: center;justify-content: space-between;width: 100%;}
  nav ul {font-size: .8rem;font-weight: 300;color: #B9C4C2;height: 3.5rem;line-height: 3.5rem;
    padding: 0;margin: 0;font-family: source-Light;}
  nav ul li {float: left;position: relative;}
  nav ul .li_margin {margin-left: 2.2rem;}
  nav ul .li_margins {margin-left: 1.8rem;}
  nav ul li:first-child {margin-left: 0;}
  nav .tabNav {width: 1.25rem;display: block;position: relative;transition: all .5s ease;}
  nav .tabNav span {transition: transform .5s ease;height: .1rem;width: 100%;background: #fff;display: block; 
    margin-bottom: .25rem;}

  .v-enter,.v-leave-to {opacity:0;height:0;}
  .v-enter-active,.v-leave-to {transition: opacity 1s;height:auto;}
	
  .check_color {color: #00D69B;font-weight: 500;}
  .check_color:after {border-left: .45rem solid transparent;border-right: .45rem solid transparent;
    border-bottom: .45rem solid #F5F5F5;content: "";position: absolute;width: 0;
    bottom: 0;left: calc(50% - .45rem);}
  nav ul li:hover {cursor: pointer;}
  nav ul li:last-child:hover {color: #00D69B;}
  nav ul li:last-child {padding-left: 1.1rem;margin-left: 1.1rem;}

  .languageList {position: absolute;top: 3.5rem;right: 0;width: 8.7rem;height: 4.2rem;background:#fff;
    box-shadow:0 .15rem .3rem rgba(0,0,0,0.16);border-radius:0 0 .5rem .5rem;z-index: 99;}
  .languageList span {display: block;height: 2.1rem;line-height: 2.1rem;padding-left: .8rem;color: #B9C4C2;}
  .languageList span:hover {cursor: pointer;background: #29D893;color: #fff;}
  .languageList span:last-child:hover,.languageList span:last-child {border-radius:0 0 .5rem .5rem;}
  .languageList .check_list {background: #29D893;color: #fff;}

  @media (max-width: 767px) {
      nav {height: 4rem;padding: 0 1rem;}
      nav ul {display: flex;flex-direction: column;flex: 1;z-index: 99;position: absolute;
        top: 4rem;left: 0;right: 0;bottom: 0;height: auto;box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);}
      nav ul .li_margin {margin-left: 0;padding-left: 1.75rem;}
      nav ul .li_margins,nav ul li:last-child {margin-left: 0;padding-left: 1.75rem;}
      
      nav ul li {margin: 0;height: 2.5rem;line-height: 2.5rem;background:rgba(66,83,91,1);
        box-sizing: border-box;border-top: .05rem solid #B9C4C2;}

      .check_color:after {display: none;}
      .languageList {width: 100%;top: 2.4rem;}
   }
</style>