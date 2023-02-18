<template>
  <view>
    <he-popup v-model="showModal" mode="bottom" :border-radius="16">
      <view class="">
        <view class="he-header">
          <text class="header__title">推广素材</text>
          <text class="iconfont iconpopup_close fr" @click="showModal = false"></text>
        </view>
        <view class="he-body">
          <view class="text">这里有好物推荐，欢迎抢购，{{ info.name }}</view>
          <scroll-view scroll-y class="image-list">
            <view class="flex flex-wrap">
              <he-image
                class="image"
                :image-style="{
                  borderRadius: '8rpx'
                }"
                :width="218"
                :height="218"
                v-for="(item, index) in info.slideshow"
                :list="info.slideshow"
                :src="item"
                :key="index"
                :is-preview="true"
              ></he-image>
            </view>
          </scroll-view>
        </view>
        <view class="he-footer">
          <view class="flex radio">
            <he-radio class="he-radio" v-model="isRadio"></he-radio>
            <text>同步到个人空间</text>
          </view>
          <button class="cu-btn" @click="saveMaterial">保存素材</button>
        </view>
      </view>
    </he-popup>
    <he-save-loading title="正在保存图片…" v-model="loading"></he-save-loading>
  </view>
</template>

<script>
import hePopup from './he-popup.vue';
import heRadio from './he-radio.vue';
import heSaveLoading from './he-save-loading.vue';

export default {
  components: {
    hePopup,
    heRadio,
    heSaveLoading
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    info: {
      type: Object
    }
  },
  computed: {
    showModal: {
      get: function ({ value }) {
        return value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    }
  },
  data() {
    return {
      isRadio: false,
      loading: false
    };
  },
  methods: {
    saveMaterial() {
      const self = this;
      // #ifndef H5
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success() {
          self.loading = true;
          self.saveFile(self.info.slideshow);
        }
      });
      // #endif

      // #ifdef H5
      self.saveFile();
      // #endif

      // 发布动态
      if (this.isRadio) {
        this.publishDynamic({
          content: '这里有好物推荐，欢迎抢购，' + this.info.name,
          pic_list: this.info.slideshow
        });
      }
    },
    saveFile(data) {
      // #ifndef H5
      const self = this;
      let images = JSON.parse(JSON.stringify(data));
      const image = images.splice(0, 1)[0];
      wx.downloadFile({
        url: image,
        success(response) {
          wx.saveImageToPhotosAlbum({
            filePath: response.tempFilePath,
            success() {
              if (images.length > 0) {
                self.saveFile(images);
              } else {
                self.loading = false;
                self.uniCopy({
                  content: '这里有好物推荐，欢迎抢购，' + self.info.name,
                  success() {
                    uni.showToast({
                      title: '文案已复制， 图片已保存',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                });
              }
            },
            fail() {}
          });
        }
      });
      // #endif

      //  #ifdef H5
      this.uniCopy({
        content: '这里有好物推荐，欢迎抢购，' + this.info.name,
        success() {
          uni.showToast({
            title: '文案已复制， 请手动下载商品图片',
            icon: 'none',
            duration: 2000
          });
        }
      });

      //  #endif
    },
    publishDynamic(body = {}) {
      return new Promise((resolve, reject) => {
        this.$heshop.promoterzone('post', body).then(resolve).catch(reject);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.he-header {
  text-align: center;
  line-height: 60px;
  margin-top: 16px;
  padding: 0 32px;
}

.iconpopup_close {
  font-size: 20px;
  color: #999999;
}

.header__title {
  font-size: 28px;
  //@extend .font-family-sc;

  font-weight: 500;
  color: #999999;
}

.he-body {
  margin-top: 32px;
  padding: 0 32px;

  .text {
    font-size: 32px;
    //@extend .font-family-sc;

    font-weight: 500;
    color: #222222;
    line-height: 40px;
  }

  .image-list {
    margin-top: 25px;
    max-height: 520px;

    .image {
      margin: 0 16px 16px 0;

      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9) {
        margin-right: 0;
      }
    }
  }
}

.he-footer {
  padding: 32px 32px 20px 32px;

  .cu-btn {
    width: 686px;
    height: 80px;
    @include background_color('background_color');
    border-radius: 40px;
    font-size: 30px;
    //@extend .font-family-sc;
    font-weight: 500;
    color: #ffffff;
    margin-top: 36px;
  }

  .radio {
    font-size: 24px;
    //@extend .font-family-sc;
    font-weight: 500;
    color: #222222;

    /deep/ .he-item__check .he-radio {
      width: 32px !important;
      height: 32px !important;
    }

    & > .he-radio {
      margin-right: 21px;
    }
  }
}
</style>
