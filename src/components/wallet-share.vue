<template>
  <section class="mask">
    <section class="share-content mask_cnt">
      <section class="close-img">
        <img src="../assets/images/closeMasks.png" alt="" @click="close"/>
      </section>
      <h2>BIUT- PC矿工POW</h2>
      <h2>挖矿邀请码</h2>
      <p class="share-txt">我的邀请码</p>
      <p class="share-cnt">{{ inviteCode }}</p>

      <!-- 二维码 -->
      <figure>
        <qrcode :value="walletQr" :options="{ size: 93 }" />
        <figcaption>用浏览器扫一扫即可查看</figcaption>
      </figure>
    </section>
    <button type="button" @click="saveImg">保存图片</button>
  </section>
</template>

<script>
import qrcode from '@xkeshi/vue-qrcode'
export default {
  name: '',
  components: {
    qrcode
  },
  props: {
    inviteCode: String
  },
  data() {
    return {
      walletQr: '123'
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },

    saveImg () {
      alert("点击了保存图片")
      this.close()
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/styless/public";
.mask {
  flex-direction: column;
  height: auto;
  overflow: auto;
  .share-content {
    width: 15.8rem;
    padding: 0.6rem 0.6rem 1.5rem;
    text-align: center;
    color: #42535b;
    font-size: 0.7rem;
    .close-img {
      text-align: right;
      img {
        cursor: pointer;
      }
    }
    h2 {
      font-size: 1.2rem;
    }
    .share-txt {
      padding: 4.5rem 0 .5rem;
    }
    .share-cnt {
      width: 12.5rem;
      height: 3.5rem;
      background: #f7fbfa;
      border-radius: 0.5rem;
      line-height: 3.5rem;
      margin: 0 auto 1.7rem;
    }
    figure {
      margin: 0;
      figcaption {
        padding-top: .5rem;
      }
    }
  }
  button {
    width: 4.8rem;
    height: 1.8rem;
    background:linear-gradient(90deg,#29d893 0%,#0cc5b7 100%);
    border-radius: .5rem;
    border: 0;
    color: #fff;
    margin-top: .8rem;
  }
}
</style>