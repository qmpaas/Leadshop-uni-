<template>
  <he-popup
    v-model="showModal"
    mode="center"
    :border-radius="16"
    background-color="transparent"
    :zoom="false"
    width="100%"
    height="100%"
  >
    <view class="he-poster flex justify-center align-center" @touchmove.stop.prevent="() => {}" :data-theme="theme">
      <view class="he-poster__box" v-if="!loading">
        <view class="he-poster__close flex align-center justify-center" @click="showModal = false">
          <text class="iconfont iconpopup_close"></text>
        </view>
        <view>
          <image class="he-wechat__image" v-if="path" :src="path" :style="[boxSize]"></image>
          <!-- #ifndef H5 -->
          <button class="he-poster__save cu-btn" @click="saveImage">保存图片</button>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <button class="he-poster__save cu-btn">长按图片保存</button>
          <!-- #endif -->
        </view>
      </view>
    </view>
  </he-popup>
</template>
<script>
import hePopup from './he-popup.vue';

export default {
  name: 'detail-poster',
  props: {
    is_task: {
      type: [Boolean, Number],
      default: 0
    },
    value: Boolean,
    postData: {
      type: Object
    },
    couponType: {
      type: String
    }
  },
  components: {
    hePopup
  },
  data() {
    return {
      path: '',
      base: {},
      loading: false,
      poster: ''
    };
  },
  watch: {
    showModal(value) {
      if (value) {
        uni.showLoading({
          title: '生成中……'
        });
        this.loading = true;
        this.onLoadImage();
      }
    }
  },
  computed: {
    showModal: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    },
    background: function () {
      return {
        background: 'url(' + this.poster + ')'
      };
    },
    boxSize: function () {
      if (this.couponType === 'coupon') {
        return {
          height: '613rpx'
        };
      } else if (this.couponType === 'store') {
        return {
          height: '545rpx'
        };
      } else {
        return {
          height: '784rpx'
        };
      }
    }
  },
  methods: {
    onLoadImage() {
      let _this = this;
      let type = 1;
      // #ifndef H5
      type = 2;
      // #endif
      let data = {
        type: type,
        is_task: this.is_task,
        ...this.postData
      };
      this.$heshop
        .poster('get', data)
        .then(function (response) {
          _this.path = response;
          uni.hideLoading();
          _this.loading = false;
        })
        .catch(function () {
          uni.showToast({
            title: '生成失败，请检查网络',
            icon: 'none',
            duration: 3000
          });
          _this.showModal = false;
          uni.hideLoading();
          _this.loading = false;
        });
    },
    saveImage: function () {
      let save = uni.getFileSystemManager();
      let number = Math.random();
      save.writeFile({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        data: this.path.slice(22),
        encoding: 'base64',
        success: () => {
          uni.saveImageToPhotosAlbum({
            filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
            success: function () {
              uni.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 2000
              });
            },
            fail: function () {
              uni.showToast({
                title: '保存失败',
                icon: 'error',
                duration: 2000
              });
            }
          });
        },
        fail: () => {
          uni.showToast({
            title: '保存失败',
            icon: 'error',
            duration: 2000
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.he-poster {
  height: 100vh;
}

.he-poster__box {
  position: relative;
  width: 562px;
}

.he-poster__close {
  width: 52px;
  height: 52px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  margin: 0 0 32px 510px;
}

.he-poster__image {
  width: 562px;
  height: 784px;
  border-radius: 16px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.he-poster__save {
  width: 380px;
  height: 80px;
  border-radius: 40px;
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  margin: 40px 91px 0 91px;
  @include background_color('background_color');
}

.iconpopup_close {
  font-size: 20px;
  color: #ffffff;
}

.he-wechat__image {
  width: 562px;
}
</style>
