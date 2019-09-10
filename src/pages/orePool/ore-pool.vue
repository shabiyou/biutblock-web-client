<template class="pool-container">
  <main>
    <section v-if="loginPage === 0">
      <!-- banner部分 -->
      <header class="pool-header">
        <h2>{{ $t("pool.poolBanner") }}</h2>
      </header>

      <section class="pool-body el-container">
        <section
          class="pool-body-flex pool-body-head1"
          :class="loginStatus ? 'flex-end' : ''"
        >
          <!-- 不是登陆状态下隐藏 -->
          <figure v-if="!loginStatus">
            <figcaption>0x{{ addressShort }}</figcaption>
            <img
              src="../../assets/images/go.png"
              alt=""
              @click="poolPage = 2"
            />
          </figure>

          <span class="login-btn" @click="goLogin" v-show="loginStatus">
            {{ $t("pool.poolIndexL") }}
          </span>
          <span class="login-btn" v-show="!loginStatus" @click="exitPage">
            {{ $t("pool.poolIndexE") }}
          </span>
        </section>

        <!-- 没有登陆 -->
        <section v-if="poolPage === 1">
          <section class="pool-body-flex pool-body-head2">
            <span>{{ $t("pool.poolIndexTit1") }}</span>
            <!-- <section>
              <input
                type="text"
                :placeholder="$t('pool.poolIndexIpt')"
                v-model="searchIpt" />
              <img
                :src="searchImg"
                alt=""
                @click="searchFrom"
                :class="searchDsb ? 'load' : ''" />
            </section> -->
          </section>

          <!-- 所有列表 -->
          <pool-list
            :itemList="itemLists"
            :joinMaskPage="joinMaskPage"
            :poolName="searchIpt"
            :stus="loginStatus"
            :nounce="nounce"
            :address="address"
            :addressShort="addressShort"
            :privateKey="privateKey"
            :walletBalance="walletBalance"
            @login="goLogin"
            @updatePage="onUpdatePage"
          />
        </section>

        <!-- 登录成功 -->
        <section v-if="poolPage === 2">
          <p class="tab-line"></p>
          <ul class="tab-list">
            <li :class="idx === 0 ? 'active-list' : ''" @click="tabClick(0)">
              {{ $t("pool.poolTabTxt1") }}
            </li>
            <li :class="idx === 1 ? 'active-list' : ''" @click="tabClick(1)">
              {{ $t("pool.poolTabTxt2") }}
            </li>
          </ul>
          <!-- 矿池 -->
          <section v-if="idx === 0">
            <pool-header
              :walletBalance="walletBalance"
              :poolLastWeek="lastWeekReward"
              :poolInComing="myReward"
              :poolMortgage="poolTimeLock"
            />
            <pool-body
              @lookAll="poolPage = 1"
              :itemList="addPoolList"
              :poolName="searchIpt"
              :stus="loginStatus"
              :nounce="nounce"
              :address="address"
              :addressShort="addressShort"
              :mortgageShow="poolAddress.length > 2"
              :privateKey="privateKey"
              :walletBalance="walletBalance"
              @updatePage="onUpdatePage"
            />
            <!-- 没有加入矿池展示 -->
            <h4 v-show="addPoolList.length === 0">
              {{ $t("pool.poolListNull") }}
            </h4>

            <!-- 收益列表 -->
            <pool-footer v-show="rewardList.length > 0" :itemList="rewardList"/>
            <!-- 收益列表为空 -->
            <h4 v-show="rewardList.length === 0">
              {{ $t("pool.poolListNull") }}
            </h4>

          </section>

          <!-- 邀请 -->
          <section v-if="idx === 1">
            <invitation-header
              :invitationCode="invitationCode"
              :progress="invitatedAmount"
              :invitationShow="poolTimeLock"
              :minerType="minerLevel"
              @look="lookRules"
            />

            <invitation-list :address="address" @look="lookRules" />

            <invitation-mask
              :maskPage="maskPage"
              :maskLevel="maskLevel"
              :maskAddress="maskAddress"
              :maskList="maskList"
              :maskReward="maskReward"
              v-show="maskShow"
              @close="closeInvitationMask"
            />
          </section>
        </section>
      </section>
    </section>

    <section v-if="loginPage === 1">
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

const dataCenterHandler = require('../../lib/DataCenterHandler')
import WalletsHandler from '../../lib/WalletsHandler'
const moment = require('moment-timezone')
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
      poolTimeLock: 0,
      myReward: 0,
      lastWeekReward: 0,
      totalPoolMoney: 0,
      walletBalance: 0,
      loginPage: 0,
      address: '',//钱包地址
      addressShort: '',
      privateKey: '',//私钥
      maskPage: 1,
      maskShow: false,
      maskLevel: '',
      maskAddress: '',
      maskReward: '',
      maskList: [],
      invitationList: [],
      invitationCode: '',
      invitatedAmount: 0,
      minerLevel: '0',
      mortgageValue: '0',
      idx: 0,
      itemList: [],
      addPoolList: [],
      rewardList: [],
      nounce: 0,
      joinMaskPage: 0,
      poolAddress: []
    }
  },
  computed: {
    itemLists() {
      return this.itemList
    }
  },
  created() {
    let poolAddress = []
    dataCenterHandler.getAllPool((pools) => {
      for (let pool of pools) {
        if (pool.ownPoolAddress !== "") {
          poolAddress.push(pool.ownPoolAddress[0])
        }
      }
      this.getContractInfoSync(poolAddress).then(infos => {
        for (let info of infos) {
          if (Object.keys(info).length > 0) {
            //let poolName = info.hasOwnProperty("tokenName") ? info.tokenName.split('-')[2] : ''
            let poolAddress = info.hasOwnProperty("tokenName") ? info.tokenName.split('-')[1] : ''
            this.getWalletBalance(poolAddress, 'SEC').then((balance) => {
              dataCenterHandler.getMiningPool({ address: poolAddress }, (body) => {
                this.itemList.push({
                  id: 0,
                  poolName: body.miningPool ? body.miningPool.poolName : '',
                  poolAddress: poolAddress,
                  poolMoney: balance
                })
              })
            })
          }
        }
      })
    })
  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //搜索内容
    searchFrom() {
      let ipt = this.searchIpt
    },

    //去登陆
    goLogin() {
      this.loginPage = 1
    },

    //登陆成功
    userLogin(e) {
      this.poolPage = 2
      this.loginPage = 0
      this.addPoolList = []
      this.rewardList = []
      this.invitationList = []
      this.address = e.address.replace('0x', '')
      this.invitationCode = e.ownInvitationCode
      this.mortgageValue = e.mortgageValue
      if (this.ismobile()) {
        this.addressShort = e.address.replace('0x', '').replace(/(.{6}).+(.{6})/, '$1...$2')
      } else {
        this.addressShort = e.address.replace('0x', '')
      }
      this.privateKey = e.privateKey
      this.loginStatus = false
      let poolAddress = []
      if (e.mortgagePoolAddress.length > 1) {
        this.joinMaskPage = 1
      } else {
        this.joinMaskPage = 0
      }

      for (let pool of e.mortgagePoolAddress) {
        if (pool !== "") {
          poolAddress.push(pool.replace('0x', ''))
        }
      }
      for (let pool of e.ownPoolAddress) {
        if (pool !== "") {
          poolAddress.push(pool.replace('0x', ''))
        }
      }
      poolAddress = Array.from(new Set(poolAddress))
      this.poolAddress = poolAddress

      /**获取钱包余额 */
      this.getWalletBalance(e.address.replace('0x', '')).then((balance) => {
        this.walletBalance = Number(this.scientificNotationToString(balance))
      })

      dataCenterHandler.getMinerLevel({
        address: this.address
      }, (body) => {
        if (body.status) {
          this.invitatedAmount = body.amount
          this.minerLevel = body.minerType
        }
      })

      dataCenterHandler.getLastProfit({
        address: this.address
      }, (body) => {
        if (body.status) {
          this.lastWeekReward = Number(this.scientificNotationToString(body.profit))
        }
      })

      if (e.role === 'Miner') {
        dataCenterHandler.getTotalProfit({
          address: this.address
        }, (body) => {
          this.myReward = Number(this.scientificNotationToString(body.profit))
        })
      } else {
        dataCenterHandler.getMyPoolProfit({
          address: this.address
        }, (body) => {
          this.myReward = Number(this.scientificNotationToString(body.profit))
        })
      }
      
      dataCenterHandler.getProfitHistory({
        address: this.address
      }, (body) => {
        if (body.status) {
          for (let detail of body.profitHistory) {
            let time = WalletsHandler.formatDate(moment(detail.insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
            this.rewardList.push({
              id: 1,
              poolTime: time,
              poolMoney: `+ ${detail.profit}`
            })
          }
        }
      })

      /** 获取这个钱包对应加入矿池的信息 */
      this._getAllContractInfos(poolAddress)
      // this._getRelatedMiner()
      this._getNounce()
    },

    onUpdatePage(ipt, poolAddress) {
      this.addPoolList = []
      this.maskPage = 3
      this.mortgageValue = String(this.cal.accAdd(this.mortgageValue, ipt))

      this.joinMaskPage = 1
      if (poolAddress !== '') {
        this.poolAddress.push(poolAddress)
      }
      this._getAllContractInfos(this.poolAddress)
      dataCenterHandler.getMyTotalReward({
        address: this.address
      }, (body) => {
        if (body.status) {
          this.myReward = Number(this.scientificNotationToString(body.rewards))
        }
      })
      this.getWalletBalance(this.address).then((balance) => {
        this.walletBalance = Number(this.scientificNotationToString(balance))
      })
    },

    _getAllContractInfos(poolAddress) {
      let freezeMoney = 0
      this.getContractInfoSync(poolAddress).then((infos) => {
        for (let i = 0; i < infos.length; i++) {
          if (Object.keys(infos[i]).length === 0) {
            continue
          }
          /**计算自己在矿池中抵押了多少钱 */
          let timeLock = infos[i].timeLock
          if (timeLock && timeLock.hasOwnProperty(this.address) && timeLock[this.address].hasOwnProperty(this.address)) {
            let benifitAddress = timeLock[this.address][this.address]
            for (let i = 0; i < benifitAddress.length; i++) {
              freezeMoney = this.cal.accAdd(freezeMoney, benifitAddress[i].lockAmount)
            }
          }
          /**计算加入矿池的矿池总收入 */
          this.getWalletBalance(infos[i].tokenName.split('-')[1], 'SEC').then((balance) => {
            dataCenterHandler.getMiningPool({ address: infos[i].tokenName.split('-')[1] }, (body) => {
              if (body.status && body.miningPool && body.miningPool.poolName !== '') {
                this.addPoolList.push({
                  id: 0,
                  poolName: body.miningPool.poolName,
                  poolAddress: infos[i].tokenName.split('-')[1],
                  pooolMoney: `${balance}`
                })
              }
            })
          })
        }
        this.poolTimeLock = Number(this.scientificNotationToString(freezeMoney))
      })
    },

    _getNounce() {
      let httpHeaderOption = {
        'content-type': 'application/json'
      }
      let nonceData = {
        "jsonrpc": "2.0",
        "id": "1",
        'method': 'sec_getNonce',
        "params": [this.address]
      }
      fetch(_const.url, {
        method: 'post',
        body: JSON.stringify(nonceData), // request is a string
        headers: httpHeaderOption
      }).then((res) => res.json()).then((text) => {
        this.nonce = JSON.parse(text.body).result.Nonce
      })
    },

    //退出登陆、退出成功之后再重新加载一次所有列表
    exitPage() {
      this.loginStatus = true
      this.poolPage = 1
    },

    tabClick(index) {
      this.idx = index
    },

    lookRules(page, item) {
      let details = []
      if (item) {
        dataCenterHandler.getInvitationDetails({
          address: item.invitationAddress
        }, (body) => {
          if (body.status) {
            for (let detail of body.rewards) {
              if (detail.type === 'level1') {
                details.push({
                  id: 0,
                  maskAddress: detail.addressFrom ? `0x${detail.addressFrom}` : '',
                  maskTime: WalletsHandler.formatDate(moment(detail.insertAt).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
                  maskAmount: detail.rewards
                })
              }
              
            }
            this.maskList = details
          }
        })
      }
      this.maskLevel = item.level.toString()
      this.maskAddress = item.invitationAddress
      this.maskReward = item.invitationMoney
      this.maskPage = page
      this.maskShow = true
    },

    closeInvitationMask() {
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
      color: #9ca6aa;
      font-size: 0.7rem;
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
          line-height: 2rem;
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
      height: 0.5rem;
      background: #f5f5f5;
    }
    .tab-list {
      @extend %flex;
      align-items: center;
      height: 4.1rem;
      @include border($c: #e6e6e6, $d: bottom);
      margin: 0;
      padding: 0 0 0 4.4rem;
      color: #9ca6aa;
      font-size: 0.9rem;
      box-sizing: border-box;
      li {
        padding: 0 0.9rem 0 1.2rem;
        height: 100%;
        @extend %flexCenter;
        cursor: pointer;
        @include border($c: transparent, $d: bottom, $w: 0.15rem);
        margin-bottom: -0.15rem;
        &:first-child {
          margin-right: 3.2rem;
        }
      }
      .active-list {
        color: #29d893;
        @include border($c: #29d893, $d: bottom, $w: 0.15rem);
        box-sizing: border-box;
      }
    }
  }
}

@media (max-width: 767px) {
  main {
    .pool-header {
      height: 16rem;
      font-size: 0.65rem;
      h2 {
        color: #f5f7fa;
        font-size: 1.4rem;
        padding-top: 3.5rem;
      }
    }
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
      .tab-list {
        padding: 0 15px;
        justify-content: space-between;
        li:first-child {
          margin: 0;
        }
      }
    }
  }
}
</style>