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
                  :disabled = "!receiveActive"
                  :readonly = "readonlyButton" 
                  :class="[receiveActive ? 'btn_active' : '',readonlyButton ? 'readonlyButton' : '']">
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
        <a :href="successUrl" target="_blank"> {{ successUrl }} </a>
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
let fetch = require('node-fetch')
let httpHeaderOption = {
  'content-type': 'application/json'
}

export default {
  name: 'receiveSec',
  data () {
    return {
      maskShow: false, //是否显示遮罩层
      secAddress: '',//SEC币领取地址
      tipsError: false,//sec地址不对的提示语是否显示
      tipsTxt: 'receiveSec.errorAddress',//地址提示语
      successUrl: '',
      readonlyButton: false
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
      this.readonlyButton = true
      let address = this.secAddress.replace(/^\s+|\s+$/g, '').replace("0x","")
      var key = /^[A-Za-z0-9]+$/
      if (!key.test(address)) {
        this.tipsError = true
        return
      }
      let url = _const.url
      let bodyRequest = {
        'method': 'sec_freeCharge',
        'params': [{"to":""+address+"","value":"1000"}]
      }
    	fetch(url, {
        method: 'post',
        body: JSON.stringify(bodyRequest), // request is a string
        headers: httpHeaderOption
     }).then( (res) => res.json()).then((text) => {
        this.successUrl = "http://54.250.166.137/accountdetails?address="+address+""
        this.maskShow = true
        this.readonlyButton = false
      })
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
      return this.secAddress.length > 41 ? true : false
    }
  },
  created() {
    
  },
}
</script>

<style scoped>
  main h2 {margin: 11.5rem auto .6rem;font-size: 1.1rem;}
  main .receive_btn {margin: 1.8rem auto 9.9rem;}
  .readonlyButton {background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%)!important;}
</style>