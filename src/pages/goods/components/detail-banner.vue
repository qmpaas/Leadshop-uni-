<template>
  <view class="he-swiper-wrap" id="detail-banner">
    <swiper
      class="he-swiper-notice"
      autoplay
      vertical
      :style="[navbarInnerStyle]"
      v-if="orderList.length && goodsSetting.order_list_roll"
    >
      <swiper-item v-for="(item, index) in orderList" :key="index">
        <view class="he-item flex align-center">
          <image class="he-item__img" :src="item.avatar"></image>
          <view class="he-item__text flex">
            <view class="he-line-1 flex-sub">{{ item.nickname }}</view>
            <view class="flex-sub">下单成功</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <swiper
      :current="elCurrent"
      @change="change"
      :interval="3000"
      circular
      :duration="500"
      :style="{
        height: '750rpx',
        backgroundColor: bgColor
      }"
    >
      <swiper-item class="he-swiper-item" v-if="isVideo">
        <view class="he-video-img" @click="setPay" v-if="!play">
          <view
            class="he-swiper-image he-swiper-img-one"
            :style="{
              backgroundImage: `url(${videoCover ? videoCover : list[0][name] || list[0]})`
            }"
          >
            <view class="he-video-play">
              <view class="iconfont iconbofang"></view>
            </view>
          </view>
        </view>
        <video
          @click="stopVideo"
          :src="video.url"
          enable-play-gesture
          :autoplay="play"
          :controls="false"
          class="he-video"
          v-else
        ></video>
      </swiper-item>
      <swiper-item class="he-swiper-item" v-for="(item, index) in list" :key="index">
        <view class="he-list-image-wrap" @tap.stop.prevent="listClick(index)">
          <!--#ifndef H5-->
          <image
            class="he-swiper-image"
            :src="item[name] || item"
            mode="aspectFill"
            @tap="doPreviewImage(index, list)"
          ></image>
          <!--#endif-->
          <!--#ifdef H5-->
          <img class="he-swiper-image" v-lazy="item[name] || item" />
          <!--#endif-->
        </view>
      </swiper-item>
    </swiper>
    <view class="he-swiper-indicator">
      <view class="he-indicator-item-number">{{ uCurrent + 1 }}/{{ list.length + (isVideo ? 1 : 0) }}</view>
    </view>
  </view>
</template>
<script>
let systemInfo = uni.getSystemInfoSync();

export default {
  name: 'detail-banner',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    name: {
      type: String,
      default: 'image'
    },
    bgColor: {
      type: String,
      default: '#f3f4f6'
    },
    current: {
      type: [Number, String],
      default: 0
    },
    goodsId: {
      type: Number,
      default: 0
    },
    video: {
      type: [Object, Array, String]
    },
    isVideo: {
      type: Number
    },
    videoCover: {
      type: String
    }
  },
  watch: {
    list(nVal, oVal) {
      if (nVal.length !== oVal.length) this.uCurrent = 0;
    },
    current(n) {
      this.uCurrent = n;
    }
  },
  data() {
    return {
      uCurrent: this.current,
      orderList: [],
      play: false,
      statusBarHeight: systemInfo.statusBarHeight
    };
  },
  computed: {
    elCurrent() {
      return Number(this.current);
    },
    // 导航栏内部盒子的样式
    navbarInnerStyle() {
      let height = systemInfo.platform == 'ios' ? 44 : 48;
      let style = {};
      style.top = height + this.statusBarHeight + 'px';
      return style;
    }
  },
  methods: {
    listClick(index) {
      this.$emit('click', index);
    },
    change(e) {
      let current = e.detail.current;
      this.uCurrent = current;
      this.$emit('change', current);
    },
    getOrder: function () {
      let _this = this;
      this.$heshop
        .goods('get', {
          goods_id: this.goodsId,
          behavior: 'goods_order'
        })
        .then(function (res) {
          _this.orderList = res;
        })
        .catch(function () {});
    },
    setPay: function () {
      this.play = true;
    },
    doPreviewImage: function (index, list) {
      this.$utils.doPreviewImage(index, list);
    },
    stopVideo: function () {
      this.play = false;
    }
  },
  mounted() {
    this.getOrder();
  }
};
</script>

<style scoped lang="scss">
.he-swiper-wrap {
  position: relative;
  overflow: hidden;
  transform: translateY(0);
}

.he-video {
  width: 100%;
  height: 100%;
}

.he-swiper-image {
  width: 100%;
  will-change: transform;
  height: 100%;
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  /* #ifdef H5 */
  pointer-events: none;
  object-fit: contain;
  /* #endif */
}

.he-swiper-indicator {
  padding: 0 24px;
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 100%;
  z-index: 1;
  justify-content: flex-end;
  top: auto;
  bottom: 12px;
}

.he-indicator-item-number {
  padding: 6px 16px;
  line-height: 1;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  font-size: 26px;
  color: rgba(255, 255, 255, 0.8);
}

.he-list-image-wrap {
  width: 100%;
  height: 100%;
  flex: 1;
  transition: all 0.5s;
  overflow: hidden;
  box-sizing: content-box;
  position: relative;
}

.he-swiper-item {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-items: center;
}

.he-swiper-notice {
  position: absolute;
  z-index: 88;
  top: 188px;
  left: 32px;
  height: 60px;
  width: 296px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 30px;

  .he-item__img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px 0 10px 10px;
  }

  .he-item__text {
    width: 204px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-left: 7px;
  }
}

.he-video-img {
  height: 750px !important;
  width: 750px !important;
  position: relative;

  .he-video-play {
    display: block;
    width: 120px;
    height: 120px;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 3px solid #fff;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000 !important;
    transform: translate(-50%, -50%);
  }

  .iconbofang {
    font-size: 36px;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.he-swiper-img-one {
  height: 750px !important;
  width: 750px !important;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  // object-fit: contain;
}
</style>
