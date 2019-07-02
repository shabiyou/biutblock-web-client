<template>
  <section class="mask">
    <!-- 确认弹窗 -->
    <section class="mask_cnt mask-list" v-if="maskPages == 1">
      <h4 class="title-line">
        {{ $t("mapping.confirmMapping") }}
      </h4>
      <ul>
        <li v-for="(item, index) in maskList" :key="index">
          <span :class="maskWidth ? 'enWidth' : ''"> {{ $t(item.tit) }}: </span>
          <span> {{ item.txt }} </span>
        </li>
        <!-- <li v-show="timeoutShow">
          <p>{{ $t("mask.maskTimeout") }}</p>
        </li> -->
      </ul>
      <section>
        <!-- 映射按钮 -->
        <public-button
          type="button"
          :text="$t('mask.cancel')"
          :disabled="maskConfirmBtn"
          @click.native="closeMask"
        />

        <!-- 映射按钮 -->
        <public-button
          type="button"
          class="btn-active"
          :disabled="maskConfirmBtn"
          :text="confirmButton"
          @click.native="confirmMapping"
        />
      </section>
    </section>

    <!-- 结果弹窗 -->
    <section class="mask_cnt mask-res" v-if="maskPages == 2">
      <section>
        <p>{{ $t("mapping.tipTxt") }}</p>
        <figure>
          <img :src="mappingResImg" alt="" />
          <figcaption>
            {{ $t(mappingResTxt) }}
          </figcaption>
        </figure>
      </section>

      <section>
        <!-- 映射按钮 -->
        <public-button
          type="button"
          class="btn-active"
          :text="$t('mask.confirm')"
          @click.native="closeMask"
        />
      </section>
    </section>
  </section>
</template>

<script>
import successImg from '../../../assets/images/success.png'
import failureImg from '../../../assets/images/tipsImg.png'
import publicButton from '../../../components/public-button'
let fetch = require('node-fetch')
let httpHeaderOption = {
  'content-type': 'application/json'
}
export default {
  name: '',
  props: {
    ethAddress: String,
    txhash: String
  },
  components: {
    publicButton
  },
  data() {
    return {
      maskPages: 1,
      mappingResImg: successImg,
      maskConfirmBtn: false,
      confirmButton: 'mask.confirm',
      mappingResTxt: 'mapping.mappingSuccess', //  mapping.mappingFailure 失败
      //timeoutShow: false,
      //source: null, //存放取消的请求方法
    }
  },
  created() {

  },
  computed: {
    //中英文宽度
    maskWidth() {
      if (this.$i18n.locale == 'zh') {
        return true
      } else {
        return false
      }
    },

    //确认数据列表
    maskList() {
      return [
        {
          id: '03',
          tit: 'mapping.ethwalletddress',
          txt: this.ethAddress
        },
        // {
        //   id: '02',
        //   tit: 'mapping.biutwalletAddress',
        //   txt: this.biutAddress
        // },
        {
          id: '03',
          tit: 'mapping.mappingHash',
          txt: this.txhash
        }
      ]
    }
  },
  methods: {
    //关闭遮罩层
    closeMask() {
      let maskPages = this.maskPages
      this.$emit('close', maskPages)
      this.maskPages = 1
      this.confirmButton = 'mask.confirm'
      this.maskConfirmBtn = false
      //this.timeoutShow = false
    },

    /** 确认映射 */
    confirmMapping() {
      let _that = this
      //this.timeoutShow = false
      _that.maskConfirmBtn = true
      _that.confirmButton = 'mapping.mappingButtonAcitve'
      let ethaddress = _that.ethAddress.replace("0x", "")
      let txhash = _that.txhash.replace("0x", "").toLowerCase()

      let postData = {
        ethaddress: ethaddress,
        txhash: txhash
      }

      fetch(_const.url_mapping, {
        method: 'post',
        body: JSON.stringify(postData), // request is a string
        headers: httpHeaderOption
      }).then((resp) => {
        _that.maskPages = 2
        if (resp.status == 200) {
          _that.mappingResTxt = 'mapping.mappingSuccess'
          _that.mappingResImg = successImg
        } else if (resp.statusText == 'txhash not found in eth network') {
          _that.mappingResTxt = 'mapping.mappingFailure1'
          _that.mappingResImg = failureImg
        } else if (resp.statusText == 'txhash duplicated') {
          _that.mappingResTxt = 'mapping.mappingFailure2'
          _that.mappingResImg = failureImg
        } else {
          _that.mappingResTxt = 'mapping.mappingFailure3'
          _that.mappingResImg = failureImg
        }
      })
    },
  }
}
</script>

<style scoped>
.mask-list {
  width: 27.3rem;
}
.mask-list h4 {
  font-size: 0.9rem;
  color: #252f33;
  font-weight: 500;
  padding-bottom: 0.7rem;
  border-bottom: 0.05rem solid #e6e6e6;
  margin-bottom: 1.2rem;
}
.mask-list ul {
  margin: 0;
  padding: 0;
}
.mask-list ul li {
  font-size: 0.7rem;
  padding-bottom: 1.1rem;
  color: #252f33;
  display: flex;
  line-height: 1.5;
}
.mask-list ul li span:first-child {
  margin-right: 1rem;
  display: inline-block;
  color: #566066;
  width: 8rem;
}
.mask-list ul li span:last-child {
  word-break: break-all;
  flex: 1;
}
.mask-list section {
  display: flex;
  justify-content: flex-end;
}
.mask-list section button {
  width: 5.4rem;
  height: 1.8rem;
  background: linear-gradient(
    90deg,
    rgba(194, 194, 194, 1) 0%,
    rgba(165, 165, 165, 1) 100%
  );
}
.mask-list section button:last-child {
  margin-left: 0.6rem;
}
.mask-list ul li .enWidth {
  width: 5.5rem !important;
}
.mask-list ul li p {
  color: #ee1c39;
}

.mask-res {
  height: 7.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.mask-res section:last-child {
  display: flex;
  justify-content: flex-end;
}
.mask-res button {
  width: 5.4rem;
  height: 1.8rem;
}
.mask-res p {
  color: #252f33;
  font-size: 0.8rem;
  margin-bottom: 1.2rem;
}
.mask-res figure {
  margin: 0;
  display: flex;
  align-items: flex-start;
  color: #4a5d66;
  font-size: 0.7rem;
}
.mask-res figure img {
  width: 16px;
  height: 16px;
}
.mask-res figure figcaption {
  line-height: 1.5;
  margin-left: 0.6rem;
}

@media (max-width: 767px) {
  .mask-list {
    width: 80%;
  }
}
</style>