<template>
  <main class="wallet-background">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24">
        <h2>{{ $t("walletInfo.accessWallet") }}</h2>
        <!-- 按钮组 -->
        <section class="radio-arr">
          <section
            class="radio-box"
            v-for="(item, index) in radioList"
            :key="item.id"
          >
            <label class="radio" :class="{ on: item.isChecked }"></label>
            <input
              type="radio"
              class="ipt-radio"
              :checked="item.isChecked"
              @click="checkTab(index)"
            />
            <span>{{ $t(item.value) }}</span>
          </section>
        </section>

        <!-- keyStore 登陆 -->
        <section class="key-store" v-show="radioPages == 0">
          <p>{{ $t("walletInfo.checkKeyStore1") }}</p>
          <input
            type="file"
            :placeholder="$t('walletInfo.checkKeyStore2')"
            @change="tirggerFile($event)"
          />
          <section>
            <span>{{ $t(KeyStoreVal) }}</span>
          </section>
          <!-- 密码输入框组件 -->
          <public-pass
            maxlength="30"
            v-if="showPass"
            v-model="passVal"
            :class="walletPassError ? 'error-border' : ''"
            :placeholder="$t('passTips.passEncryption')"
            @input="passChange"
          />
          <public-tips :tipsTxt="walletPassErrorTxt" v-show="walletPassError" />
          <!-- 按钮组件 -->
          <public-button
            class="key-store-btn"
            :disabled="!keyStoreActive"
            :class="keyStoreActive ? 'btn-active' : ''"
            :text="$t(keystoreUnlockBtn)"
            @click.native="walletInfoForm"
          />
        </section>

        <!-- 私钥登陆 -->
        <section class="private-key" v-show="radioPages == 1">
          <p>{{ $t("walletInfo.inputPrivateKey1") }}</p>
          <!-- 私钥输入组件 -->
          <public-pass
            maxlength="64"
            v-model="privateKeyVal"
            :placeholder="$t('walletInfo.inputPrivateKey2')"
            :class="privateKeyError ? 'error-border' : ''"
            @input="privateChange"
          />
          <public-tips :tipsTxt="privateKeyErrorTxt" v-show="privateKeyError" />
          <public-button
            class="private-key-btn"
            :disabled="!privateKeyActive"
            :class="privateKeyActive ? 'btn-active' : ''"
            :text="$t(keyUnlockBtn)"
            @click.native="walletInfoForm"
          />
        </section>
      </el-col>
    </el-row>
    <!-- 公共背景底部 -->
    <content-footer />

    <wallet-transparent :txt="systemErrorTxt" v-show="transparentShow" />
  </main>
</template>

<script>
const contentFooter = () => import("./content-footer")
const publicButton = () => import("./public-button")
const publicPass = () => import("./public-pass")
const publicTips = () => import("./public-tips")
const walletTransparent = () => import("./wallet-transparent")

const SECUtil = require('@biut-block/biutjs-util')
const CryptoJS = require('crypto-js')
const dataCenterHandler = require('../lib/DataCenterHandler')
export default {
  name: 'walletEntren',
  components: {
    contentFooter,
    publicButton,
    publicPass,
    publicTips,
    walletTransparent
  },
  props: {},
  data() {
    return {
      passVal: '',  //密码
      privateKeyVal: '', //私钥
      KeyStoreUrl: '', //keystroe文件地址
      showPass: false,//默认不显示密码输入框
      privateKeyError: false,//私钥错误true显示
      walletPassError: false,//密码
      privateKeyErrorTxt: 'walletInfo.invalidPrivateKey',
      walletPassErrorTxt: 'passTips.passError',
      KeyStoreVal: 'walletInfo.checkKeyStore2', //绑定keyStore的值
      radioPages: 0, //keyStore与私钥切换显示  0 显示keyStore  1 显示私钥

      keystoreUnlockBtn: 'walletInfo.unlockBtn', //keystore导入按钮
      keyUnlockBtn: 'walletInfo.unlockBtn', //私钥导入按钮
      radioList: [
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
      transparentShow: false,
      systemErrorTxt: ''
    }
  },
  computed: {
    //keyStore按钮是否可点击
    keyStoreActive() {
      let passVal = this.passVal.replace(/\s+/g, "")
      if (passVal.length > 0 && !(_const.passReg.test(passVal))) {
        this.walletPassError = true
      } else {
        this.walletPassError = false
      }
      return _const.passReg.test(passVal) ? true : false
    },

    //私钥按钮是否可点击
    privateKeyActive() {
      let privateKeyVal = this.privateKeyVal.replace(/\s+/g, "")
      if (privateKeyVal.length > 0 && privateKeyVal.length < 64) {
        this.privateKeyError = true
      } else if (!(_const.priverKeyReg.test(privateKeyVal)) && privateKeyVal.length == 64) {
        this.privateKeyError = true
      } else {
        this.privateKeyError = false
      }
      return privateKeyVal.length == 64 && _const.priverKeyReg.test(privateKeyVal) ? true : false
    },
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //keyStore文件登陆不能输入中文
    passChange() {
      this.$nextTick(() => {
        this.passVal = this.inputNull(this.passVal)
      })
    },

    //私钥登陆不能输入中文
    privateChange() {
      this.$nextTick(() => {
        this.privateKeyVal = this.inputNull(this.privateKeyVal)
      })
    },

    //登陆钱包
    walletInfoForm() {
      //1 私钥登陆  0 keyStore登陆
      if (this.radioPages === 1) {
        this.keyUnlockBtn = 'walletInfo.unlockBtns'
        let privateVal = this.privateKeyVal.replace(/\s+/g, "")
        let privateKeyBuffer = SECUtil.privateToBuffer(privateVal)
        let extractAddress = SECUtil.privateToAddress(privateKeyBuffer).toString('hex')//钱包地址
        let extractPublicKey = SECUtil.privateToPublic(privateKeyBuffer).toString('hex')//钱包公钥
        let extractPhrase = SECUtil.entropyToMnemonic(privateKeyBuffer)//钱包助记词
        //传递给父级需要的参数
        let parm
        this._getWalletFromDB(extractAddress, (parent) => {
          if (parent === undefined || parent === "") {
            this.systemErrorTxt = 'public.systemError'
            this._keyError()
          } else if (parent.status) {
            parm = {
              address: '0x' + extractAddress,
              privateKey: privateVal,
              englishWords: extractPhrase,
              publicKey: extractPublicKey,
              invitationCode: parent.doc[0].invitationCode,
              ownInvitationCode: parent.doc[0].ownInvitationCode,
              mortgagePoolAddress: parent.doc[0].mortgagePoolAddress,
              ownPoolAddress: parent.doc[0].ownPoolAddress,
              mortgageValue: parent.doc[0].mortgageValue,
              role: parent.doc[0].role
            }
            this.$emit('login', parm)
            this.keyUnlockBtn = 'walletInfo.unlockBtn'
          } else {
            this.systemErrorTxt = 'pool.poolInvailidError'
            this._keyError()
          }
        })

      } else {
        let passVal = this.passVal.replace(/\s+/g, "")
        this.keystoreUnlockBtn = 'walletInfo.unlockBtns'
        let that = this
        //解锁钱包
        this.$axios.get('' + this.KeyStoreUrl + '').then((response) => {
          let jsonstr = response.data
          let keyData = CryptoJS.AES.decrypt(jsonstr.toString(), passVal).toString(CryptoJS.enc.Utf8)
          console.log(response)
          if (response.status == 200) {
            let walletData = keyData.split(':{')
            let arrData1 = '{' + walletData[1].replace("}}", "") + '}'
            let arrData = eval('(' + arrData1 + ')')
            let parm
            this._getWalletFromDB(arrData.walletAddress, (parent) => {
              if (parent === undefined || parent === "") {
                this.systemErrorTxt = 'public.systemError'
                this._keystoreError()
              } else if (parent.status) {
                parm = {
                  address: '0x' + arrData.walletAddress,
                  privateKey: arrData.privateKey,
                  englishWords: arrData.englishWords,
                  publicKey: arrData.publicKey,
                  invitationCode: parent.doc[0].invitationCode,
                  ownInvitationCode: parent.doc[0].ownInvitationCode,
                  mortgagePoolAddress: parent.doc[0].mortgagePoolAddress,
                  ownPoolAddress: parent.doc[0].ownPoolAddress,
                  mortgageValue: parent.doc[0].mortgageValue,
                  role: parent.doc[0].role
                }
                this.$emit('login', parm)
                this.keystoreUnlockBtn = 'walletInfo.unlockBtn'
              } else {
                this.systemErrorTxt = 'pool.poolInvailidError'
                this._keystoreError()
              }
            })
          } else {
            this.systemErrorTxt = 'public.systemError'
            this._keystoreError()
          }
        }).catch((error) => {
          this.systemErrorTxt = 'passTips.passError'
          this._keystoreError()
        });
      }
    },

    //私钥导入钱包要请码不存在
    _keyError() {
      this.transparentShow = true
      this.keyUnlockBtn = 'walletInfo.unlockBtn'
      setTimeout(() => {
        this.transparentShow = false
      }, 3000)
    },

    _keystoreError() {
      this.transparentShow = true
      this.keystoreUnlockBtn = 'walletInfo.unlockBtn'
      setTimeout(() => {
        this.transparentShow = false
      }, 3000)
    },

    //获取input file上传文件的相关属性
    tirggerFile(event) {
      var file = event.target.files; // (利用console.log输出看结构就知道如何处理档案资料)
      if (file.length === 1) {
        this.KeyStoreUrl = this.getObjectURL(file[0]) // 上传钱包获取本地地址
        this.KeyStoreVal = file[0].name
        this.showPass = true
      } else {
        this.KeyStoreVal = 'walletInfo.checkKeyStore2'
        this.passVal = ''
        this.walletPassError = false
        this.showPass = false
      }
    },

    //切换登陆方式
    checkTab(index) {
      this.radioPages = index
      this.radioList.forEach((item) => {
        item.isChecked = false
      });
      this.radioList[index].isChecked = true
    },

    _getWalletFromDB(walletAddress, callback) {
      dataCenterHandler.findOutWallet({ address: walletAddress }, (body) => {
        callback(body)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.el-row {
  height: 30.35rem;
}
/* 单选按钮组 */
.radio-arr {
  height: 1.5rem;
  @extend %flex;
  .radio-box {
    position: relative;
    height: 1.5rem;
    font-size: 0.8rem;
    color: $colorGray2;
    @extend %flexCenter;
    &:first-child {
      margin-right: 5rem;
    }
    .ipt-radio {
      display: inline-block;
      position: absolute;
      opacity: 0;
      width: 1.2rem;
      height: 1.2rem;
      left: 0;
      outline: none;
      -webkit-appearance: none;
      margin-right: 0.8rem;
      cursor: pointer;
    }
    .radio {
      display: inline-block;
      width: 1.2rem;
      height: 1rem;
      cursor: pointer;
      @include bgCover("../assets/images/radio.png");
    }
    .on {
      width: 1.2rem;
      height: 1rem;
      @include bgCover("../assets/images/radios.png");
    }
    span {
      margin-left: 0.8rem;
    }
  }
}

/* keyStore 与 私钥 */
.private-key,
.key-store,
.radio-arr,
h2 {
  width: 20.6rem;
  margin: 0 auto;
}

h2 {
  margin: 8.4rem auto 2.7rem;
}
.key-store,
.private-key {
  p {
    font-size: 0.9rem;
    color: $colorTips;
    font-weight: 500;
    padding: 1.45rem 0 0.55rem;
    font-family: source-Medium;
  }
}

.key-store .key-store-btn,
.private-key .private-key-btn {
  margin-top: 1.6rem;
}

.key-store {
  position: relative;
  input[type="file"] {
    width: 20.6rem;
    height: 2.4rem;
    position: absolute;
    top: 3rem;
    opacity: 0;
    max-width: 100% !important;
    font-family: source-Regular;
    &:hover {
      cursor: pointer;
    }
  }
  section {
    width: 20.6rem;
    height: 2.3rem;
    @include border($d: bor);
    text-align: center;
    border-radius: 0.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 2.4rem;
    color: $colorTips;
    font-size: 0.7rem;
    font-weight: 400;
    max-width: 100% !important;
    box-sizing: border-box;
    &:hover {
      cursor: pointer;
    }
  }
  .ipt-arr {
    margin-top: 20px;
  }
}

@media (max-width: 767px) {
  .private-key,
  .key-store,
  .radio-arr,
  h2 {
    width: 90%;
  }
  h2 {
    margin-top: 6.4rem;
  }
}
</style>