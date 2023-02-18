<template>
  <view class="wrap" v-if="display">
    <view class="wrap-box">
      <view class="close" @click="toclose">
        <text class="iconfont iconpopup_close2"></text>
      </view>
      <view class="icon">
        <view class="bg">
          <img src="./img/bg.png" alt="" />
        </view>
        <view class="gold">
          <img src="./img/icon.png" alt="" />
        </view>
      </view>
      <view class="text">
        <view class="score">+{{ score }}积分</view>
        <view class="tip">
          <!--{{title}} -->
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    value: {
      type: [Number, Boolean],
      default: 0
    },
    score: {
      type: [String, Number],
      default: '10'
    },
    title: {
      type: [String, Number],
      default: '领取成功'
    }
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  computed: {
    display: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('input', 0);
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {},
  methods: {
    /**
     * 执行关闭
     * @return {[type]} [description]
     */
    toclose() {
      this.display = false;
    }
  }
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  .wrap-box {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -400px;
  }

  .close {
    display: block;
    position: absolute;
    width: 52px;
    height: 52px;
    top: 0;
    right: 0;
    z-index: 100;

    .iconfont {
      width: 52px;
      height: 52px;
      font-size: 52px;
      line-height: 52px;
      color: #ffffff;
    }
  }

  .icon {
    width: 100%;
    height: 100%;
    position: relative;

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        opacity: 0;
        width: 100%;
        height: 100%;
        animation-duration: 0.6s;
        animation-name: bg;
        animation-fill-mode: forwards;
      }
    }

    .gold {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -80px;
      margin-left: -80px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 160px;

      img {
        opacity: 0;
        animation-duration: 1.6s;
        animation-name: icon;
        animation-fill-mode: forwards;
        width: 100%;
        height: 100%;
      }
    }
  }

  .text {
    position: absolute;
    text-align: center;
    top: 400px;
    left: 0;
    width: 100%;
    opacity: 0;
    animation-delay: 1.2s;
    animation-duration: 0.4s;
    animation-name: text;
    animation-fill-mode: forwards;

    .score {
      font-size: 48px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #feb805;
      color: #e29c04;
      font-weight: 800;
    }

    .tip {
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 36px;
      color: #fff;
    }
  }
}

@keyframes icon {
  0% {
    opacity: 0;
    transform: scale3d(0.8, 0.8, 1);
  }

  25% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  37.5% {
    opacity: 1;
    transform: scale3d(0.05, 1, 1);
  }

  50% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  62.5% {
    opacity: 1;
    transform: scale3d(0.05, 1, 1);
  }

  75% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bg {
  0% {
    opacity: 0;
    transform: scale3d(0.6, 0.6, 1);
  }

  100% {
    opacity: 1;
    ransform: scale3d(1, 1, 1);
  }
}

@keyframes text {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
