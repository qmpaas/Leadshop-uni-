<template>
  <view class="">
    <view class="he-item" v-if="video">
      <cover-view class="he-delete-icon iconfont iconevaluate_uploadpictures_deleto" @click="remove"></cover-view>
      <video id="myVideo" @click="play" :controls="false" :src="video" :show-center-play-btn="false"></video>
      <!--      <image class="image-cover" :src="cover" v-if="!isPlay"></image>-->
      <image :src="ipAddress + '/play.png'" class="play" v-if="!isPlay" @click="play"></image>
    </view>
    <button v-if="!video" @tap="chooseVideo" class="cu-btn he-item flex flex-direction justify-center align-center">
      <view class="iconfont iconshipin"></view>
      <view class="he-add-text">添加视频</view>
    </button>
    <he-toast v-model="loading">
      <view class="he-loading flex flex-direction align-center">
        <image :src="ipAddress + '/upload-loading.gif'" class="he-loading__image"></image>
        <text>视频上传中...</text>
      </view>
    </he-toast>
  </view>
</template>

<script>
import heToast from '@/components/he-toast.vue';

export default {
  name: 'he-upload-video',
  components: {
    heToast
  },
  props: {
    // 文件大小限制，单位为byte
    maxSize: {
      type: [String, Number],
      default: function () {
        return 2097152;
      }
    }
  },
  data() {
    return {
      video: null,
      loading: false,
      cover: '',
      videoContext: null,
      isPlay: false
    };
  },
  mounted() {
    this.videoContext = uni.createVideoContext('myVideo', this);
  },
  methods: {
    chooseVideo() {
      let self = this;
      uni.chooseVideo({
        count: 1,
        sourceType: ['camera', 'album'],
        success: function (res) {
          if (res.size > self.maxSize && self.maxSize > 0) {
            self.$h.toast('超出允许的文件大小');
            return;
          }
          self.loading = true;
          self.$heshop.uploadVideo(res.tempFilePath).then(response => {
            self.video = response;
            self.videoContext = uni.createVideoContext('myVideo', self);
            self.loading = false;
            self.$emit('on-success', {
              video: response
            });
          });
        }
      });
    },
    remove() {
      this.video = null;
      this.$emit('on-remove');
    },
    play() {
      if (!this.isPlay) {
        this.videoContext.play();
        this.isPlay = true;
      } else {
        this.videoContext.pause();
        this.isPlay = false;
      }
    }
  }
};
</script>

<style scoped>
.he-item {
  width: 150px;
  height: 150px;
  margin: 0 20px 20px 0;
  background: rgb(244, 245, 246);
  position: relative;
  border-radius: 8px;
}

video {
  width: 150px;
  height: 150px;
}

.he-delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  /*width: 60px;*/
  /*height: 60px;*/
  padding: 16px;
  transform: translate(50%, -50%);
  font-size: 28px;
  color: rgba(245, 33, 45, 1);
}

.he-preview-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: block;
}

.iconshipin {
  color: RGBA(102, 102, 102, 1);
  width: 48px;
  height: 48px;
  font-size: 48px;
  margin-bottom: 5px;
}

.he-add-text {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  margin-top: 5px;
}

.he-loading {
  width: 100%;
  height: 100%;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
}

.he-loading__image {
  width: 96px;
  height: 96px;
  margin-top: 52px;
  margin-bottom: 40px;
}

.image-cover {
  width: 150px;
  height: 150px;
}

.play {
  width: 52px;
  height: 52px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
