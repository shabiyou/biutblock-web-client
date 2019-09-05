<template>
  <section class="invitation-list">
    <header>
      <span class="list-title">
        {{ $t("invitation.inListTit") }}
      </span>
      <!-- <section class="ipt-list">
        <input type="text" v-model="searchIpt" :placeholder="$t('invitation.inListSearch')" />
        <img src="../../../assets/images/search.png" alt="" />
      </section> -->
      <ul class="head-list">
        <li
          v-for="(item, index) in headList"
          :key="index"
          :class="enList ? 'en-hand-list' : ''"
        >
          <section>
            <span></span>
            <span>{{ $t(item.tit) }}：</span>
          </section>
          <span class="head-list-cnt">{{ item.txt }}</span>
        </li>
      </ul>
    </header>

    <main class="invitation-body">
      <ul>
        <li>
          <span>{{ $t("invitation.inListTxt1") }}</span>
          <span>{{ $t("invitation.inListTxt2") }}</span>
          <span>{{ $t("invitation.inListTxt3") }}</span>
          <span></span>
        </li>
        <li
          v-for="(item, index) in itemList"
          :key="index"
          v-show="!invitationNull"
        >
          <span>{{ "0x" + item.invitationAddress }}</span>
          <span>{{ item.invitationTime }}</span>
          <span>{{ getPointNum(item.invitationMoney) }}</span>
          <span @click="lookRules(item)">{{
            $t("invitation.inListTxt4")
          }}</span>
        </li>
      </ul>

      <h4 v-show="invitationNull">
        {{ $t(searchContent) }}
      </h4>
    </main>

    <!-- <footer> -->
    <!-- <span class="page-number" v-show="!searchRes">
        {{ $t('public.pageTotal') }} {{ total }} {{ $t('public.pageRecord') }}
      </span>
      <span class="page-number" v-show="searchRes">
        {{ $t('public.pageTotal') }} {{ searchTotal }} {{ $t('public.pageResults') }}
      </span> -->
    <!-- 分页 -->
    <!-- <wallet-page
        ref="pageList"
        class="page-list"
        :total="itemList.length"
        :totalPage=2
        @next="nextPage"
        @prev="prevPage"
        @goPage="goPage"
        v-show="itemList.length > 10" /> -->
    <!-- </footer> -->
    <wallet-transparent :txt="transparentTxt" v-show="transparentShow" />
  </section>
</template>

<script>
import walletPage from '../../../components/wallet-page'
import walletTransparent from '../../../components/wallet-transparent'
const dataCenterHandler = require('../../../lib/DataCenterHandler')
import WalletsHandler from '../../../lib/WalletsHandler'
const moment = require('moment-timezone')
export default {
  name: '',
  components: {
    walletPage,
    walletTransparent
  },
  props: {
    address: String
  },
  data() {
    return {
      searchIpt: '',
      searchContent: 'invitation.inListNull', //invitation.inListNull 列表内容为空  invitation.inListSearchNull 搜索结果为空
      total: 10,
      searchTotal: 1,
      searchRes: false,
      transparentShow: false,
      transparentTxt: 'invitation.inMask2ListNull',
      itemList: [],
      invitationNull: false,
      firstLevel: 0,
      firstLevelAmount: 0,
      secondLevel: 0,
      secondLevelAmount: 0,
    }
  },
  computed: {
    enList() {
      if (this.$i18n.locale == "zh") {
        return true
      } else {
        return false
      }
    },

    //头部数据
    headList() {
      return [
        {
          id: '1',
          tit: 'invitation.hiListHeadTxt1',
          txt: this.firstLevel
        },
        {
          id: '2',
          tit: 'invitation.hiListHeadTxt2',
          txt: this.firstLevelAmount + 'BIUT' //只保留 9位数字
        },
        {
          id: '3',
          tit: 'invitation.hiListHeadTxt3',
          txt: this.secondLevel
        },
        {
          id: '4',
          tit: 'invitation.hiListHeadTxt4',
          txt: this.secondLevelAmount + 'BIUT' //只保留 9位数字
        }
      ]
    }
  },
  created() {
    this.getInvitationList()
  },
  methods: {
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
    },

    lookRules(item) {
      if (item.invitationMoney > 0) {
        this.$emit('look', 2, item)
      } else {
        this.transparentShow = true
        setTimeout(() => {
          this.transparentShow = false
        }, 3000)
      }
    },

    getInvitationList() {
      dataCenterHandler.getInvitationDetails({ address: this.address }, (docs) => {
        let doc = docs.rewards
        if (docs.status && doc.length > 0) {
          this.invitationNull = false
          for (var i = 0; i < doc.length; i++) {

            let time = WalletsHandler.formatDate(moment(doc[i].insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
            if (doc[i].rewards !== '0' && doc[i].type === 'level1') {
              this.firstLevelAmount = this.cal.accAdd(this.firstLevelAmount, doc[i].rewards)
              this.firstLevel = this.firstLevel + 1
              this.itemList.push({
                id: '1',
                invitationAddress: doc[i].address,
                invitationTime: time.substring(0, 20),
                invitationMoney: (doc[i].rewards || 0)
              })
            } else if (doc[i].rewards !== '0' && doc[i].type === 'level2') {
              this.secondLevel = this.secondLevel + 1
              this.secondLevelAmount = this.cal.accAdd(this.secondLevelAmount, doc[i].rewards)
            }
          }
        } else {
          this.invitationNull = true
        }
      })
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
    .head-list {
      @extend %flex;
      padding: 0;
      margin: 0;
      li {
        @extend %flex;
        padding-left: 1.8rem;
        color: #42535b;
        font-family: Lato-Bold;
        font-size: 0.6rem;
        section {
          color: #6d7880;
          span:first-child {
            width: 0.3rem;
            height: 0.3rem;
            background: #388ed9;
            border-radius: 50%;
            display: inline-block;
            margin-right: 0.2rem;
          }
        }
        &:first-child {
          padding-left: 0;
        }
        &:first-child,
        &:nth-child(2) {
          section span:first-child {
            background: #f5a623;
          }
        }
      }
      .en-hand-list {
        font-size: 0.7rem;
      }
    }
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
        height: 1.5rem;
        line-height: 1.5rem;
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
            color: #29d893;
            cursor: pointer;
          }
        }
      }
    }
    h4 {
      text-align: center;
      color: #9ca6aa;
      font-size: 0.7rem;
      font-weight: normal;
      padding: 9.7rem 0 8.3rem;
    }
  }
  footer {
    @extend %flexBetween;
    padding-top: 1.3rem;
    .page-number {
      font-size: 0.7rem;
      color: #99a1a6;
    }
    .wallet-page {
      padding-top: 0;
    }
  }
}

@media (max-width: 767px) {
  .invitation-list {
    padding: 1.4rem 15px 0;
    // header {
    //   flex-direction: column;
    //   align-items: flex-start;
    //   .list-title {
    //     padding-bottom: .4rem;
    //   }
    // }
    .invitation-body ul li {
      span {
        word-wrap: break-word;
        padding-right: 0.8rem;
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
    header {
      flex-direction: column;
      align-items: flex-start;
      .list-title {
        padding-bottom: 0.5rem;
      }
      .head-list {
        flex-direction: column;
        width: 100%;
        li {
          width: 100%;
          padding: 0.7rem 0;
          justify-content: space-between;
          border-bottom: 1px solid #e6e6e6;
          color: #f5a623;
          section {
            span:first-child {
              display: none;
            }
          }
          &:nth-child(3),
          &:nth-child(4) {
            color: #0b7fe6;
          }
        }
      }
    }
  }
}
</style>