<template>
  <section class="mask">
    <!-- 确认弹窗 -->
    <section class="mask_cnt mask-list" v-if="maskPages == 1">
      <h4 class="title-line">
        {{ $t('mapping.confirmMapping') }}
      </h4>
      <ul>
        <li v-for="(item, index) in maskList" :key="index">
          <span :class="maskWidth ? 'enWidth' : ''"> {{ $t(item.tit) }}: </span>
          <span> {{item.txt}} </span>
        </li>
      </ul>
      <section>
        <!-- 映射按钮 --> 
        <public-button
          type="button"
          :text="$t('mask.cancel')"
          @click.native="closeMask" />
        
        <!-- 映射按钮 --> 
        <public-button
          type="button"
          class="btn-active"
          :text="$t('mask.confirm')"
          @click.native="confirmMapping" />
      </section>
    </section>

    <!-- 结果弹窗 -->
    <section class="mask_cnt mask-res" v-if="maskPages == 2">
      <section>
        <p>{{ $t("mapping.tipTxt") }}</p>
        <figure>
          <img :src="mappingResImg" alt="">
          <figcaption>
            {{ $t("mapping.mappingSuccess") }}
          </figcaption>
        </figure>
      </section>

      <section>
        <!-- 映射按钮 --> 
        <public-button
          type="button"
          class="btn-active"
          :text="$t('mask.confirm')"
          @click.native="closeMask" />
      </section>
      
    </section>
  </section>
</template>

<script>
import successImg from '../../../assets/images/success.png'
import failureImg from '../../../assets/images/tipsImg.png'
import publicButton from '../../../components/publicButton'
export default {
  name: '',
  props: {
    ethprivateKey: String,
    biutAddress: String
  },
  components: {
    publicButton
  },
  data () {
    return {
      maskPages: 1,
      mappingResImg: successImg,
      //mappingResTxt: 'mapping.mappingSuccess', // 映射失败，请添加微信客服号进行咨询！
    }
  },
  created() {
    
  },
  computed: {
    maskWidth () {
      if (this.$i18n.locale == 'zh') {
        return true
      } else {
        return false
      }
    },

    maskList () {
      return [
        {
          id: '03',
          tit: 'mapping.ethprivateKey',
          txt: this.ethprivateKey
        },
        {
          id: '02',
          tit: 'mapping.biutAddress',
          txt: this.biutAddress
        }
      ]
    }
  },
  methods: {
    closeMask () {
      let maskPages = this.maskPages
      this.$emit('close', maskPages)
      this.maskPages = 1
    },

    /** 确认映射 */
    confirmMapping () {
      this.maskPages = 2
    }
  },
  watch: {
    
  },
}
</script>

<style scoped>
  .mask-list {width: 27.3rem;}
  .mask-list h4 {font-size: .9rem;color: #252F33;font-weight: 500;padding-bottom: .7rem;
    border-bottom: .05rem solid #E6E6E6;margin-bottom: 1.2rem;}
  .mask-list ul {margin: 0;padding: 0;}
  .mask-list ul li {font-size: .7rem;padding-bottom: 1.1rem;color: #252F33;display: flex;}
  .mask-list ul li span:first-child {margin-right: 1rem;display: inline-block;color: #566066;width: 8rem;}
  .mask-list ul li span:last-child {word-break:break-all;flex: 1;}
  .mask-list section {display: flex;justify-content: flex-end;}
  .mask-list section button {width: 5.4rem;height: 1.8rem;}
  .mask-list section button:last-child {margin-left: .6rem;}
  .mask-list ul li .enWidth {width: 5rem!important;}

  .mask-res {height: 7.6rem;display: flex;flex-direction: column;justify-content: space-between;}
  .mask-res section:last-child {display: flex;justify-content: flex-end;}
  .mask-res button {width: 5.4rem;height: 1.8rem;}
  .mask-res p {color: #252F33;font-size: .8rem;margin-bottom: 1.2rem;}
  .mask-res figure {margin: 0;display: flex;align-items: flex-start;color: #4A5D66;font-size: .7rem;}
  .mask-res figure img {width: 16px;height: 16px;}
  .mask-res figure figcaption {line-height: 1.5;margin-left: .6rem;}

  @media (max-width: 767px) {
     .mask-list {width: 80%;}
  }
</style>