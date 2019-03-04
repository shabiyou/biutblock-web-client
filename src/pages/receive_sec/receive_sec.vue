<template>
  <el-container>
    <!-- 白色大背景 -->
    <main>
      <!-- 内容展示区域 -->
       <el-row>
        <el-col :xs="2" :sm="0" :md="0">&nbsp;</el-col>
        <el-col :xs="20" :sm="24" :md="24">
          <section class="content_list">
            <!-- SEC地址 -->
            <section>
              <h2>{{$t('receiveSec.secAddress')}}</h2>
              <public-ipt :placeholder="$t('receiveSec.secAddress')" :class="tipsError?'errorBorder':''" max-length="40" type="text" v-model="secAddress"/>
              <tips-content :tipsTxt="tipsTxt" v-show="tipsError"></tips-content>
              <public-btn class="receive_btn" @click.native="receiveSec"
                :disabled="!receiveActive" :class="receiveActive?'btn_active':''">{{$t('receiveSec.receiveBtn')}}</public-btn>
            </section>
          <!-- 内容展示区域结束 -->
          </section>
        </el-col>
      </el-row>    
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- 遮罩层 -->
    <section v-show="maskShow">
      <section class="mask"></section>
      <section class="mask_cnt clearfix">
        <article>
          <img src="../../assets/images/success.png" alt="">
          {{$t('mask.tips')}}
        </article>
        <a :href="successUrl"> {{ successUrl }} </a>
        <button type="button" @click="closeMask">{{$t('mask.confirm')}}</button>
      </section>
    </section>
  </el-container>
</template>

<script>
import publicIpt from '../componentsPublic/pubic_ipt'
import publicBtn from '../componentsPublic/public_btn'
import tipsContent from '../componentsPublic/tips_content'
import contentFooter from '../componentsPublic/content_footer'
import rpc from '../../lib/rpc.js' 
export default {
  name: 'receiveSec',
  data () {
    return {
      maskShow: false, //是否显示遮罩层
      secAddress: '',//SEC币领取地址
      tipsError: false,//sec地址不对的提示语是否显示
      tipsTxt: 'receiveSec.errorAddress',//地址提示语
      successUrl: 'https://test.explorer.intchain.io/#/blockchain/txdetail?hash=1486a33583c239fd0dc42f72399ad875fd2fa10c33c6a016827dd6a388ca147d'
    } 
  },
  components: {
    publicIpt,
    publicBtn,
    tipsContent,
    contentFooter
  },
  methods: {
    //领取SEC币 1000
    receiveSec () {
      let address = this.secAddress
      var key = /^[A-Za-z0-9]+$/
      if (!key.test(address)) {
        this.tipsError = true
        return
      }
      var keystoreArr = localStorage.getItem("keystore").split(/},{/).map((item,
            index,arr) => {
            if(arr.length<2){
                return item
            }
            if (index == 0) {
              return item + '}'
            } else if (index == arr.length - 1) {
              return '{' + item
            } else {
              return '{' + item + '}'
            }
      })
       keystoreArr = keystoreArr.map(item=>{
          const keystore = JSON.parse(item)
          if(keystore.address == address){
            keystore.amount = '1000'
            return keystore
          }
          return keystore
        })
        keystoreArr = JSON.stringify(keystoreArr)
        localStorage.setItem("keystore",keystoreArr.substring(1,keystoreArr.length-1))
        this.maskShow = true
    },
    //关闭遮罩层
    closeMask () {
      this.maskShow = false
      this.secAddress = ''
    }
  },
  computed: {
    receiveActive () {
      return this.secAddress.length > 39 ? true : false
    }
  },
  created() {
    let walletAddress = "2ea55ca2492ba1a3da67f75cb773682d57bc8a13"
    // var x = this.$JsonRPCClient.getWalletBalance(walletAddress, (walletBalance) => {
    //   console.log(walletBalance)
    // })

    
    this.$JsonRPCClient.chargeWallet([{
      to: walletAddress,
      value: "1000"
    }], (err, result) => {
        console.log(result)
    })
  },
}
</script>

<style scoped>
  main h2 {margin: 11.5rem auto .6rem;font-size: 1.1rem;}
  main .receive_btn {margin: 1.8rem auto 9.9rem;}
</style>