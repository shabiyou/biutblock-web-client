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
              <!-- input输入框组件 -->
              <public-ipt  
                  v-model="secAddress"
                  maxlength="42" 
                  type="text" 
                  :placeholder="$t('receiveSec.secAddress')" 
                  :class="tipsError?'errorBorder':''" 
                  @input="inputContent"/>
              <tips-content :tipsTxt="tipsTxt" v-show="tipsError"></tips-content>
              <!-- button按钮组件 -->
              <public-btn 
                  class="receive_btn" 
                  @click.native="receiveSec"
                  :disabled="!receiveActive" 
                  :class="receiveActive?'btn_active':''">
                  {{$t('receiveSec.receiveBtn')}}
              </public-btn>
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
import publicIpt from '../componentsPublic/pubic-ipt'
import publicBtn from '../componentsPublic/public-btn'
import tipsContent from '../componentsPublic/tips-content'
import contentFooter from '../componentsPublic/content-footer'
import walletMethods from '../../utils/publicMethode.js'
import rpc from '../../lib/rpc.js'
import SECSDK from '../../lib/SECSDK.bundle.js'
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
    //去掉开头空格
    inputContent () {
      this.secAddress = this.secAddress.replace(/(^\s*)|(\s*$)/g, "")
      this.$nextTick(()=> {
        this.secAddress = this.secAddress.replace(/[\u4E00-\u9FA5]/g,'')
      })
    },

    //领取SEC币 1000
    receiveSec () {
      let address = this.secAddress.replace(/^\s+|\s+$/g, '')
      var key = /^[A-Za-z0-9]+$/
      if (!key.test(address)) {
        this.tipsError = true
        return
      }
      walletMethods.updateAmount('1000', address)//修改金额
      this.maskShow = true
    },
    //关闭遮罩层
    closeMask () {
      this.maskShow = false
      this.secAddress = ''
    }
  },
  computed: {
    //领取测试币的按钮是否可点击
    receiveActive () {
      if (this.secAddress.length == 0) {
        this.tipsError = false
      }
      return this.secAddress.length > 39 ? true : false
    }
  },
  created() {
    let url = 'http://13.209.3.183:3001/rpctransfer/callrpc'

    //查询余额
    let postData = this.$qs.stringify({
        "method":"sec_getBalance",
        "params":["2ea55ca2492ba1a3da67f75cb773682d57bc8a13"]
    })


    //转账数据
    let privateVal = 'a262db30966fd7a8968b5f66014ac6a377df16b4d8a099b00612034f44d68dc0'
    let fromAddress = '75d1bd308cf2301b22db23c657e917a29f9b6f6a'
    let toAddress = 'e77b8994508ae42632f91cf462c5132c65cc7706'
    let amount = 10
    //签名
    const tx = "{\"privateKey\":\""+privateVal+"\",\"from\":\""+fromAddress+"\",\"to\":\""+toAddress+"\",\"value\":\""+amount+"\",\"inputData\":\"Test\"}"
    SECSDK.default.generateSecKeys()
    SECSDK.default.entropyToMnemonic(""+privateVal+"")
    SECSDK.default.mnemonicToEntropy("river position steel require girl someone build truck spoil size crouch wedding earn luxury holiday amateur parent entire potato vintage heavy trouble there define")
    let test = JSON.parse(SECSDK.default.txSign(tx))
    let postData3 = this.$qs.stringify(
      {
        "method":"sec_sendRawTransaction",
        "params":[
            {
            "timesTamp": "1551912659",
            "from": test.from,
            "to": test.to,
            "value": test.value,
            "contractAddress":"",
            "gasLimit":"0",
            "gas":"0",
            "gasPrice":"0",
            "data":"",
            "inputData":""
             }
            ]
      })

    //获取测试币
    let postData2 = this.$qs.stringify(
      {
        "method":"sec_freeCharge",
        "params":[
            {"to":"2ea55ca2492ba1a3da67f75cb773682d57bc8a13",
             "value":"1000"}
             ]
      })
    
    this.$axios({
        method: 'post',
        url:url,
        data:postData
    }).then((res)=>{
        console.log(res.data.result)
    })
  },
}
</script>

<style scoped>
  main h2 {margin: 11.5rem auto .6rem;font-size: 1.1rem;}
  main .receive_btn {margin: 1.8rem auto 9.9rem;}
</style>