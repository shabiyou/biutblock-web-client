<template>
  <el-container>
    <!-- 白色大背景 -->
    <main>
      <!-- 内容展示区域 -->
      <!-- 查看信息认证 -->
      <el-row>
        <el-col :xs="2" :sm="0" :md="0">&nbsp;</el-col>
        <el-col :xs="20" :sm="24" :md="24">
          <section class="content_list" v-if="transferPages == 1">
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
              <public-ipt-pass :placeholder="$t('passTips.passEncryption')" :class="walletPassError?'errorBorder':''"  maxlength="30" class="mt1" v-if="showPass" v-model="passVal"></public-ipt-pass>
              <tips-content :tipsTxt="walletPassErrorTxt" v-show="walletPassError"></tips-content>
              <public-btn class="key_store_btn"
                :disabled="!keyStoreActive" :class="keyStoreActive?'btn_active':''"
                @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
            <!-- 私钥登陆 -->
            <section class="private_key" v-if="radioPages == 1">
              <p>{{$t('walletInfo.inputPrivateKey1')}}</p>
              <textarea :placeholder="$t('walletInfo.inputPrivateKey2')" maxlength="64" :class="privateKeyError?'errorBorder':''" v-model="privateKeyVal"></textarea>
              <tips-content :tipsTxt="privateKeyErrorTxt" v-show="privateKeyError"></tips-content>
              <public-btn class="private_key_btn"
                :disabled="!privateKeyActive" :class="privateKeyActive?'btn_active':''"
                @click.native="walletInfoForm">{{$t('walletInfo.unlock')}}</public-btn>
            </section>
          </section>
          <!-- 转账信息 -->
          <section class="content_list" v-if="transferPages == 2">
            <h3>{{$t('transfer.youAddress')}}</h3>
            <public-ipt :placeholder="$t('transfer.youAddress')" max-length="40" v-model="address" type="text" readonly></public-ipt>
            <public-ipt :placeholder="$t('transfer.transferAdddress')" :class="addressError?'errorBorder':''" max-length="40" type="text" v-model="walletAddress" class="mt1"></public-ipt>
            <tips-content :tipsTxt="addressTxt" v-show="addressError"></tips-content>
            <section class="ipt_number mt1" :class="moneyShow?'errorBorder':''">
              <input type="text" :placeholder="$t('transfer.transferNumber')" v-model="walletMoney" maxlength="20">
              <span>SEC</span>
            </section>
            <section class="transfer_money">
              <section>
                <span>{{$t('transfer.balance')}} {{ allMoney }} SEC</span>
                <span @click="allTranferMoney">{{$t('transfer.all')}}</span>
              </section>
              <tips-content :tipsTxt="moneyTxt" v-show="moneyShow"></tips-content>
            </section>
            <public-btn class="transfer_btn" 
              :disabled="!transferActive" :class="transferActive?'btn_active':''"
              @click.native="transferFrom">{{$t('transfer.generateTrading')}}</public-btn>
          <!-- 内容展示区域结束 -->
          </section>
        </el-col>
      </el-row>    
      <!-- 公共背景底部 -->
      <content-footer></content-footer>
    </main>
    <!-- 遮罩层 -->
    <section v-if="maskShow">
      <section class="mask"></section>
      <!-- 确认转账信息 -->
      <section class="mask_cnt clearfix transfer_mask" v-if="maskPage==1">
        <h3>{{$t('transfer.confirmTransferInfo')}}</h3>
        <ul>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.orderInfo')}}</span>
            <span>{{$t('transfer.transferTxt')}}</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.collectionAddress')}}</span>
            <span>{{ walletAddress }}</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.paymentAddress')}}</span>
            <span>{{ address }}</span>
          </li>
          <li>
            <span :class="listChild?'firstChilds':'firstChild'">{{$t('transfer.transferAomunt')}}</span>
            <span>{{ walletMoney }} SEC</span>
          </li>
        </ul>
        <section>
          <button type="button" @click="closeTransfer">{{$t('mask.cancel')}}</button>
          <button type="button" @click="confirmTransfer">{{$t('mask.confirm')}}</button>
        </section>
      </section>
      <!-- 操作成功 -->
      <section class="mask_cnt clearfix" v-if="maskPage==2">
        <article>
          <img src="../../assets/images/success.png" alt="">
          {{$t('mask.tips')}}
        </article>
        <a :href="successUrl"> {{ successUrl }} </a>
        <button type="button" @click="closeTransfer">{{$t('mask.confirm')}}</button>
      </section>
    </section>
  </el-container>
</template>

<script>
import contentFooter from '../componentsPublic/content_footer'
import publicIptPass from '../componentsPublic/pubic_ipt_pass'
import publicIpt from '../componentsPublic/pubic_ipt'
import publicBtn from '../componentsPublic/public_btn'
import tipsContent from '../componentsPublic/tips_content'
import SECSDK from '../../lib/SECSDK.bundle.js'
 import updateAmount from '../../utils/publicMethode.js'
export default {
  name: 'transferAccounts',
  data () {
    return {
      walletAddress: 'b6ee6eac01b6f4a4b56c9a453e8ad764d5825526',
      walletMoney: '',
      address: 'b6ee6eac01b6f4a4b56c9a453e8ad764d5825526',
      allMoney: 0,
      privateKeyErrorTxt: 'walletInfo.invalidPrivateKey',
      walletPassErrorTxt: 'passTips.passError',
      transferPages: 1,//页面相关展示  1 登陆 2 转账
      listChild: true, //默认英文版的长度
      privateKeyError: false,//私钥错误true显示
      walletPassError: false,//密码
      addressError: false,//转账地址无效
      maskShow: false,//遮罩层默认的状态下关闭
      maskPage: 1,//默认先显示确认转账信息
      showPass: false,//默认不显示密码输入框
      radioPages: 0, //keyStore与私钥切换显示  0 显示keyStore  1 显示私钥
      KeyStoreVal: 'walletInfo.checkKeyStore2', //绑定keyStore的值
      passVal: '', //绑定pass的值
      privateKeyVal: '', //绑定私钥的值
      newWalletPass: '',//新钱包密码
      addressTxt: 'transfer.transferAddressError',
      moneyTxt: 'transfer.transferMoney',
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
      ],
      successUrl: 'https://test.explorer.intchain.io/#/blockchain/txdetai'
    }
  },
  created() {
    
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
            this.transferPages = 2
            this.address = JSON.parse(flag3[0]).address
            this.allMoney = JSON.parse(flag3[0]).amount
          } else {
            this.privateKeyError = true
          }
        }
      } else {
        let passVal = this.passVal
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
            this.transferPages = 2
            this.address = JSON.parse(flag2[0]).address
            this.allMoney = JSON.parse(flag2[0]).amount
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
    //切换登陆方式
    checkTab (index) {
      this.radioPages = index
      this.radioList.forEach((item) => {
        item.isChecked = false;
      });
      this.radioList[index].isChecked = true;
    },
    //转账
    transferFrom () {
      var walletAddress = this.walletAddress
      var key = /^[A-Za-z0-9]+$/
      if (!key.test(walletAddress)) {
        this.addressError = true
        return
      }
      this.maskShow = true
      this.addressError = false
      if (this.$i18n.locale == 'zh') {
        this.listChild = false
      } else {
        this.listChild = true
      }
    },
    //全部转出
    allTranferMoney () {
      this.walletMoney = this.allMoney
    },
    //取消转账
    closeTransfer () {
      this.maskPage = 1
      this.maskShow = false
      this.walletAddress = ''
      this.walletMoney = ''
    },
    //确认转账
    confirmTransfer () {
      //  
      let privateVal = this.privateKeyVal //私钥
      let fromAddress = this.address  //发送地址
      let toAddress = this.walletAddress  //接收地址
      let amount = this.walletMoney  //转账金额
      let balance = Number(this.allMoney) - Number(amount) //余额
      this.allMoney = balance
      
      //转账信息
      // let transferData = this._encryptTransaction()
      // this.$JsonRPCClient.sendTransactions(this.walletAddress, transferData, (walletBalance) => {
      //       this.allMoney = walletBalance
      // })
      //签名
      // const tx = "{\"privateKey\":\""+privateVal+"\",\"from\":\""+fromAddress+"\",\"to\":\""+toAddress+"\",\"value\":\""+amount+"\",\"inputData\":\"Test\"}"
      // SECSDK.default.generateSecKeys()
      // SECSDK.default.entropyToMnemonic(""+privateVal+"")
      // SECSDK.default.mnemonicToEntropy("river position steel require girl someone build truck spoil size crouch wedding earn luxury holiday amateur parent entire potato vintage heavy trouble there define")
      // SECSDK.default.txSign(tx)

      this.maskPage = 2
      updateAmount(balance, fromAddress)

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
          if(keystore.address == toAddress){
            keystore.amount = Number(keystore.amount) + Number(amount)
            return keystore
          }
          return keystore
      })
      keystoreArr = JSON.stringify(keystoreArr)
      localStorage.setItem("keystore",keystoreArr.substring(1,keystoreArr.length-1))
    }
  },
  mounted() {
      
  },
  created () {

  },
  components: {
    contentFooter,
    publicIpt,
    publicBtn,
    tipsContent,
    publicIptPass
  },
  computed: {
    //转账是否可点击
    transferActive () {
      return this.walletAddress.length > 39 && this.walletMoney.length > 0 && Number(this.walletMoney) > 0 ? true : false
    },
    //转账数量
    moneyShow () {
      var num = /^(([1-9]\d*)|\d)(\.\d{1,8})?$/
      if (this.walletMoney == '') {
        return false
      }
      if (!num.test(this.walletMoney)) {
        this.moneyTxt = 'transfer.transferMoneyError'
        return true
      }
      if (Number(this.walletMoney) > Number(this.allMoney)) {
        this.moneyTxt = 'transfer.transferMoney'
        return true
      }
      if (Number(this.walletMoney) === 0) {
        this.moneyTxt = 'transfer.transferMoney1'
        return true
      }
    },
    //keyStore按钮是否可点击
    keyStoreActive () {
      return this.passVal.length > 7 ? true : false
    },
    //私钥按钮是否可点击
    privateKeyActive () {
      return this.privateKeyVal.length > 63 ? true : false
    },
  },
}
</script>

<style scoped>
  .content_list h3 {font-size: 1rem;margin: 7.2rem 0 .6rem;}
  .content_list .ipt_number {height: 2.4rem;border: .05rem solid rgba(145,162,170,1);border-radius: .5rem;
    color: #42535B;font-size: .7rem;font-weight: 400;padding: 0 1rem;display: flex;align-items: center;
    justify-content: space-around;max-width: 100%!important;}
  .content_list .ipt_number input {height: 2rem;flex: 1;border: 0;}
  .content_list .transfer_btn {margin: 1.8rem 0 5.9rem;}

  .transfer_money {display: flex;align-items: center;justify-content: space-between;font-size: .7rem;
    color: #91A2AA;width: 20.6rem;padding-top: .6rem;}
  .transfer_money section span:last-child {color: #29D893;padding-left: .8rem;}
  .transfer_money section span:last-child:hover {cursor: pointer;}
  .transfer_money div {padding: 0!important;}
  
  .transfer_mask {margin-top: -6.25rem!important;}
  .transfer_mask h3 {font-size: .8rem;color: #42535B;font-weight: 500;padding-bottom: .5rem;margin: 0;
    border-bottom: .05rem solid #CFDEDB;}
  .transfer_mask ul li {color: #42535B;font-size: .7rem;padding-top: .65rem;display: flex;}
  .transfer_mask ul li:first-child {padding-top: .8rem;}
  
  .transfer_mask ul li span:first-child {display: inline-block;}
  .transfer_mask ul li .firstChild {width: 4rem;}
  .transfer_mask ul li .firstChilds {width: 6.2rem;}

  .transfer_mask section {float: right;padding-top: 1.5rem;}
  .transfer_mask section button {float: left;}
  .transfer_mask section button:first-child {background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);
    margin-right: .6rem;}
</style>