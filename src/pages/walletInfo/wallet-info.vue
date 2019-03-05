<template>
  <el-container>
    <!-- 白色大背景 -->
    <main>
      <!-- 内容展示区域 -->
      <!-- 查看信息认证 -->
      <el-row>
        <el-col :xs="2" :sm="0" :md="0">&nbsp;</el-col>
        <el-col :xs="20" :sm="24" :md="24">
          <section class="content_list" v-if="infoPages == 1">
            <h2>{{$t('walletInfo.accessWallet')}}</h2>
            <!-- 按钮组 -->
            <section class="radio_arr">
              <section class="radio_box" v-for="(item, index) in radioList" :key="item.id">
                <label class="radio" :class="{'on':item.isChecked}"></label>
                <input class="ipt_radio" 
                  :checked='item.isChecked'
                  @click="checkTab(index)" type="radio"><span>{{ $t(item.value) }}</span>
              </section>
            </section>
        
            <!-- keyStore 登陆 -->
            <section class="key_store" v-if="radioPages == 0">
              <p>{{$t('walletInfo.checkKeyStore1')}}</p>
              <input type="file" accept="application/json" :placeholder="$t('walletInfo.checkKeyStore2')" @change="tirggerFile($event)">
              <section>
                <span>{{ $t(KeyStoreVal) }}</span>
              </section>
              <public-ipt :placeholder="$t('passTips.passEncryption')" :class="walletPassError?'errorBorder':''" maxlength="30" class="mt1" v-if="showPass" v-model="passVal"></public-ipt>
              <tips-content :tipsTxt="walletPassErrorTxt" v-show="walletPassError"></tips-content>
              <public-btn class="key_store_btn"
              :disabled="!keyStoreActive" :class="keyStoreActive?'btn_active':''"
              @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
            <!-- 私钥登陆 -->
            <section class="private_key" v-if="radioPages == 1">
              <p>{{$t('walletInfo.inputPrivateKey1')}}</p>

              <textarea :placeholder="$t('walletInfo.inputPrivateKey2')" maxlength="64" 
                  :class="privateKeyError?'errorBorder':''" 
                  v-model="privateKeyVal" :rows="textRows"></textarea>
              
              <tips-content :tipsTxt="privateKeyErrorTxt" v-show="privateKeyError"></tips-content>
              <public-btn class="private_key_btn"
                :disabled="!privateKeyActive" :class="privateKeyActive?'btn_active':''"
                @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
          </section>
        </el-col>
      </el-row>    
      <!-- 钱包信息 -->
      <section class="info_content" v-if="infoPages == 2">
        <section>
          <ul>
            <li>
              <h4>{{$t('walletInfo.walletAddress')}}</h4>
              <p>{{ walletAddress }}</p>
            </li>
            <li>
              <h4>{{$t('walletInfo.walletPrivateKey')}}</h4>
              <p>{{ walletKey }}</p>
            </li>
            <li>
              <h4>{{$t('walletInfo.walletMoney')}}</h4>
              <p>{{ walletMoney }} SEC</p>
            </li>
          </ul>
        </section>
        <section>
          <figcaption>
            <div>
              <qrcode :value="walletAddress" :options="{ size: 93 }"></qrcode>
            </div>
            <p>{{$t('walletInfo.qrCode')}}</p>
          </figcaption>
          <span @click="maskShow=true">{{$t('walletInfo.newKeyStore')}}</span>
        </section>
      <!-- 内容展示区域结束 -->
      </section>
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- 遮罩层 -->
    <section v-if="maskShow">
      <section class="mask"></section>
      <section class="mask_cnt info_mask clearfix">
        <p>{{$t('passTips.newWalletPass')}}</p>
        <public-ipt :placeholder="$t('passTips.newWalletPass')" :class="walletPassTxt?'errorBorder':''" maxlength="30" type="button" v-model="newWalletPass" class="info_mask_ipt"></public-ipt>
        <tips-content :tipsTxt="infoTxt" v-show="passTips"></tips-content>
        <section>
          <button type="button" @click="closeMask">{{$t('mask.cancel')}}</button>
          <button type="button" 
            :disabled="!passActive" 
            :class="passActive?'btn_active':''"
            @click="createWallet">{{$t('mask.confirm')}}</button>
        </section>
      </section>
    </section>
  </el-container>
</template>

<script>
import contentFooter from '../componentsPublic/content-footer'
import publicIpt from '../componentsPublic/pubic-ipt-pass'
import tipsContent from '../componentsPublic/tips-content'
import publicBtn from '../componentsPublic/public-btn'
import Qrcode from '@xkeshi/vue-qrcode'
import walletsHandler from '../../lib/WalletsHandler.js'
export default {
  name: '',
  data () {
    return {
      walletAddress: '',//钱包地址
      walletKey: '',//钱包私钥
      walletMoney: '',//钱包SEC币
      infoTxt: 'passTips.passFormat',
      privateKeyErrorTxt: 'walletInfo.invalidPrivateKey',
      walletPassErrorTxt: 'passTips.passError',
      infoPages: 1,//页面相关展示  1 登陆 2 信息
      maskShow: false,//弹窗显示与隐藏
      privateKeyError: false,//私钥错误true显示
      walletPassError: false,//密码
      walletPassTxt: false,
      textRows: 1,//多行文本框控制
      showPass: false,//默认不显示密码输入框
      radioPages: 0, //keyStore与私钥切换显示  0 显示keyStore  1 显示私钥
      KeyStoreVal: 'walletInfo.checkKeyStore2', //绑定keyStore的值
      keyStoreAddress:'',//keyStore上传文件地址
      passVal: '', //绑定pass的值
      privateKeyVal: '', //绑定私钥的值
      newWalletPass: '',//新钱包密码
      passTips: false,
      privateInoKey: "",
      userInoAddress: "",
      radioList:[
          {
            id: '0',
            value: 'Keystore',
            isChecked: true,
          },
          {
            id: '1',
            value: 'walletInfo.privateKey',
            isChecked: false,
          },
      ]
    }
  },
  methods: {
    walletInfoForm () {
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
      //1 私钥登陆  0 keyStore登陆
      
      if (this.radioPages === 1) {
        let privateVal = this.privateKeyVal
        var key = /^[A-Za-z0-9]+$/
        if (!key.test(privateVal)) {
          this.privateKeyError = true
          return
        } else {
          let flag1 = keystoreArr.some(item=> JSON.parse(item).privateKey === privateVal)
          let flag3 = keystoreArr.filter(item=> JSON.parse(item).privateKey === privateVal)
          if (flag1) {
            this.infoPages = 2
            this.walletAddress = JSON.parse(flag3[0]).address
            this.walletKey = JSON.parse(flag3[0]).privateKey
            this.walletMoney = JSON.parse(flag3[0]).amount
          } else {
            this.privateKeyError = true
          }
        }
      } else {
          var passVal = this.passVal
          let keyStoreAddress = this.KeyStoreVal.substring(3,43)
          let flag2 = keystoreArr.filter(item=> JSON.parse(item).address === keyStoreAddress)
          var userPass = JSON.parse(flag2[0]).pass
          var pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
          if (!pass.test(passVal)) {
            this.walletPassError = true
            return
          } else if (userPass!=passVal) {
            this.walletPassError = true
            return
          } else {
            this.infoPages = 2
            this.walletAddress = JSON.parse(flag2[0]).address
            this.walletKey = JSON.parse(flag2[0]).privateKey
            this.walletMoney = JSON.parse(flag2[0]).amount
          }
      }
    },
    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files; // (利用console.log输出看结构就知道如何处理档案资料)
      if (file.length === 1 && file[0].type == "application/json") {
        this.KeyStoreVal = file[0].name
        this.showPass = true
      } else {
        this.KeyStoreVal = 'walletInfo.checkKeyStore2'
        this.showPass = false
      }
    },
    //取消创建新钱包
    closeMask () {
      this.maskShow = false
      this.passTips = false
      this.newWalletPass = ''
    },
    //确认创建钱包
    createWallet () {
      let newPass = this.newWalletPass
      var pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      if (!pass.test(newPass)) {
          this.walletPassTxt = true
          this.infoTxt = 'passTips.passFormatError'
          return
      } else {
          this.walletPassTxt = false
          let keys = walletsHandler.getWalletKeys()
          this.privateInoKey = keys.privateKey //获取创建钱包的私钥
          this.userInoAddress = keys.userAddress //获取创建钱包的地址
          
          //存储密码、地址、私钥、余额
          let keystoreArr = localStorage.getItem("keystore") ? localStorage.getItem('keystore').split(/},{/).map((item,
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
          }) : []
          localStorage.setItem("keystore", [...keystoreArr, JSON.stringify({
            pass: this.newWalletPass,
            address: this.userInoAddress,
            privateKey: this.privateInoKey,
            amount: 0
          })])
        var json = "" + this.userInoAddress + ".json"
        this.download("SEC" + json + "", "{'version':3,'privateKey':'" + this.privateInoKey + "'}")
        this.closeMask()
      }
    },
    download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    //切换登陆方式
    checkTab (index) {
      this.radioPages = index
      this.radioList.forEach((item) => {
        item.isChecked = false;
      });
      this.radioList[index].isChecked = true;
    }
  },
  components: {
    contentFooter,
    publicIpt,
    tipsContent,
    publicBtn,
    qrcode: Qrcode
  },
  computed: {
    //keyStore按钮是否可点击
    keyStoreActive () {
      return this.passVal.length > 7 ? true : false
    },
    //私钥按钮是否可点击
    privateKeyActive () {
      if (this.privateKeyVal.length > 40) {
        this.textRows = 2
      } else {
        this.textRows = 1
      }
      return this.privateKeyVal.length > 63 ? true : false
    },
    //新钱包密码
    passActive () {
      if (this.newWalletPass.length > 0) {
        this.passTips = true
      } else {
        this.passTips = false
      }
      return this.newWalletPass.length > 7 ? true : false
    }
  },
  created () {
   
  },
}
</script>

<style scoped>
  /* 信息内容 */
  .info_content {padding: 4.6rem 3.3rem 0;display: flex;justify-content: space-between;flex-wrap: wrap;}
  .info_content section:first-child {width: 35.8rem;max-width: 100%;}
  .info_content section:first-child ul li {border-bottom: .05rem solid #CFDEDB;color: #42535B;padding-top: 2.2rem;}
  .info_content section:first-child ul li:first-child {padding-top: 0rem;}
  .info_content section:first-child ul li:last-child {margin-bottom: 5.75rem;}
  .info_content section:first-child ul li h4 {margin: 0;font-size: 1rem;font-weight: 300;}
  .info_content section:first-child ul li p {padding: .8rem 0 2.3rem;font-size: .8rem;font-weight: 500;
    word-wrap:break-word;white-space:pre-wrap;width: calc(100% - 2.3rem);}
  .info_content section:last-child {display: flex;flex-direction: column;justify-content: space-between;
    color: #42535B;font-size: .7rem;font-weight: 300;align-items: flex-end;}
  .info_content section:last-child figcaption {display: flex;align-items: center;flex-direction: column;}
  .info_content section:last-child figcaption div {width: 4.65rem;height: 4.65rem;margin-bottom: .8rem;}
  .info_content section:last-child span {width: 10.85rem;border: 0;color: #fff;height: 2.2rem;border-radius: .5rem;
    background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);display: inline-block;
    text-align: center;line-height: 2.2rem;}
  .info_content section:last-child span:hover {cursor: pointer;}

  /* 弹窗 */
  .info_mask {padding: .8rem 1.2rem .6rem;}
  .info_mask .info_mask_ipt {width: 22.4rem;max-width: calc(100% - 2.4rem);}
  .info_mask p {color: #42535B;font-size: .8rem;padding-bottom: .6rem;}
  .info_mask section {float: right;padding-top: 1rem;}
  .info_mask section button {float: left;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}
  .info_mask section button:first-child {margin-right: .6rem;}
</style>