<template>
  <view class="video-box">
    <video v-if="value === index" class="video" :src="src" :autoplay="isPlay"></video>
    <view class="poster" v-if="!isPlay">
      <image mode="aspectFill" class="poster-image" :src="poster" />
      <view class="play" @click="playVideo">
        <text class="iconfont iconbofang"></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'video',
  props: {
    src: {
      type: String,
      required: true
    },
    poster: {
      type: String
    },
    value: {
      type: [Number, null]
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      isPlay: false
    };
  },
  methods: {
    playVideo() {
      if (!this.isPlay) {
        this.$emit('input', this.index);
      } else {
        this.$emit('input', null);
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this.index) {
          this.isPlay = false;
        } else {
          this.isPlay = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.video-box {
  width: 686px;
  height: 386px;
  background-color: #000000;
  position: relative;

  .video {
    width: 100%;
    height: 100%;
  }

  .poster {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;

    &.opacity {
      opacity: 0;
    }

    .poster-image {
      width: 100%;
      height: 100%;
    }

    .play {
      width: 128px;
      height: 128px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      line-height: 128px;

      .iconbofang {
        font-size: 56px;
        color: #ffffff;
      }
    }
  }
}
</style>
