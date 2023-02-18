<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-card content">
      <textarea
        :value="content"
        placeholder="请输入动态内容"
        class="he-textarea"
        :disable-default-padding="true"
        :hold-keyboard="true"
        @input="setTextarea"
      />
    </view>
    <view class="he-card image">
      <view class="he-top">
        <text class="he-title">添加素材</text>
      </view>
      <view class="he-switch flex" @click="switchType">
        <view class="switch-item" :style="[switchStyle]">{{ type === 1 ? '添加图片' : '添加视频' }}</view>
        <view class="item" :style="[switchItemStyle]">{{ type === 1 ? '添加视频' : '添加图片' }}</view>
      </view>
      <view class="he-bottom">
        <he-upload-image
          v-show="type === 1"
          :sizeType="['compressed']"
          @on-remove="removeImage"
          @on-uploaded="uploaded"
          :max-count="9"
          ref="uploadImage"
          :max-size="getPicLimit"
        />
        <view class="he-tip" v-show="type === 1">最多上传9张图片</view>
        <view class="flex" v-show="type === 2">
          <he-upload-video
            ref="uploadVideo"
            :max-size="getVideoLimit"
            @on-success="successVideo"
            @on-remove="removeVideo"
          />
          <he-upload-image
            :sizeType="['compressed']"
            @on-remove="removeVideoCover"
            @on-uploaded="uploadVideoCover"
            :max-count="1"
            ref="uploadCover"
            add-text="视频封面"
            :max-size="getPicLimit"
          />
        </view>
      </view>
    </view>
    <view class="he-card goods flex justify-between align-center" @click="routerDynamicGoods">
      <view class="flex flex-sub">
        <template v-if="$h.test.isEmpty(link.param)">
          <text class="iconfont iconpersonalcenter_add"></text>
          <text class="add-goods">添加商品</text>
        </template>
        <template v-else>
          <he-image
            :image-style="{
              borderRadius: '8rpx'
            }"
            :width="100"
            :height="100"
            :src="link.param.slideshow[0]"
          ></he-image>
          <view class="item-content flex flex-direction justify-center">
            <view class="item-name he-line-1">{{ link.param.name }}</view>
            <view class="item-price">￥{{ link.param.price }}</view>
          </view>
          <view class="flex-sub item-change">更改</view>
        </template>
      </view>
      <text class="iconfont iconbtn_arrow"></text>
    </view>
    <button class="cu-btn publish-dynamic" :disabled="submitDisabled" @click="publishDynamic">
      {{ id ? '发布动态' : '发布动态' }}
    </button>
    <view class="safe-area-inset-bottom" />
  </view>
</template>

<script>
import heUploadImage from './../../components/he-upload-image.vue';
import heUploadVideo from './../../components/he-upload-video.vue';
import {mapGetters} from 'vuex';
import {dynamicDetail, dynamicEdit, publishDynamic} from '../api.js';

export default {
  name: 'create-dynamic',
  components: {
    heUploadImage,
    heUploadVideo
  },
  data() {
    return {
      content: '',
      pic_list: [],
      link: {
        param: null
      },
      id: null,
      type: 1,
      video_cover: '',
      video_list: {
        url: '',
        cover: ''
      }
    };
  },
  computed: {
    ...mapGetters('setting', {
      getPicLimit: 'getPicLimit',
      getVideoLimit: 'getVideoLimit'
    }),
    submitDisabled({ content, $h }) {
      return $h.test.isEmpty(content);
    },
    switchStyle({ type }) {
      if (type === 1) {
        return {
          transform: 'translateX(0)'
        };
      } else {
        return {
          transform: 'translateX(142rpx)'
        };
      }
    },
    switchItemStyle({ type }) {
      if (type === 2) {
        return {
          transform: 'translateX(-142rpx)'
        };
      } else {
        return {
          transform: 'translateX(0)'
        };
      }
    }
  },
  methods: {
    // 删除图片
    removeImage: function (index) {
      this.pic_list.slice(index, 1);
      this.$delete(this.pic_list, index);
    },
    // 添加图片回调赋值
    uploaded: function (list) {
      this.pic_list = list.map(function (item) {
        return item.response;
      });
    },
    uploadVideoCover(list) {
      this.video_cover = list[0].response;
    },
    removeVideoCover() {
      this.video_cover = '';
    },
    async publishDynamic() {
      try {
        if (this.id) {
          await dynamicEdit(this.id, {
            content: this.content,
            pic_list: this.pic_list,
            video_list: this.video_list,
            video_cover: this.video_cover,
            link: this.link,
            type: this.type
          });
          uni.$emit('update');
          uni.navigateBack({
            delta: 1
          });
        } else {
          await publishDynamic({
            content: this.content,
            pic_list: this.pic_list,
            video_list: this.video_list,
            video_cover: this.video_cover,
            link: this.link,
            type: this.type
          });
          uni.$emit('update');
          uni.navigateBack({
            delta: 1
          });
        }
      } catch (e) {
        //  Don't do
      }
    },
    setTextarea(event) {
      // if (str.length > 200) {
      //   str = str.substring(0, 200);
      // }
      this.content = event.detail.value;
    },
    routerDynamicGoods() {
      uni.navigateTo({
        url: '/promoter/pages/dynamic-goods'
      });
    },
    switchType() {
      if (this.type === 1) {
        this.type = 2;
      } else {
        this.type = 1;
      }
    },
    removeVideo() {
      this.video_list = {
        url: '',
        cover: ''
      };
    },
    successVideo(data) {
      this.video_list = {
        url: data.video,
        cover: ''
      };
    }
  },
  onShow() {
    let storage = uni.getStorageSync(this.$storageKey.dynamic_goods);
    if (storage) {
      this.link = storage;
      uni.removeStorageSync(this.$storageKey.dynamic_goods);
    }
  },
  async onLoad(option) {
    if (option.id) {
      try {
        this.id = option.id;
        let { content, pic_list, link, type, video_list, video_cover } = await dynamicDetail(option.id);
        this.type = type;
        this.content = content;
        this.link = link ? JSON.parse(link) : link;
        if (this.type === 1) {
          this.pic_list = pic_list;

          this.$nextTick(() => {
            this.$refs.uploadImage.lists = pic_list.map(item => {
              return {
                url: item,
                response: item
              };
            });
          });
        } else {
          video_list = JSON.parse(video_list);
          this.video_list = video_list;
          this.video_cover = video_cover;
          this.$nextTick(() => {
            this.$refs.uploadVideo.video = video_list.url;
            if (video_cover) {
              this.$refs.uploadCover.lists = [
                {
                  url: video_cover,
                  response: video_cover
                }
              ];
            }
          });
        }
      } catch (e) {}
    } else if (option.data) {
      const { pic_list, content, type, video_cover, video_list, goods } = JSON.parse(option.data);
      this.type = type;
      this.content = content;
      if (type === 1) {
        this.pic_list = pic_list;
        this.$nextTick(() => {
          this.$refs.uploadImage.lists = pic_list.map(item => {
            return {
              url: item,
              response: item
            };
          });
        });
      } else {
        this.video_list = video_list;
        this.video_cover = video_cover;
        this.$nextTick(() => {
          this.$refs.uploadVideo.video = video_list.url;
          if (video_cover) {
            this.$refs.uploadCover.lists = [
              {
                url: video_cover,
                response: video_cover
              }
            ];
          }
        });
      }
      if (!this.$h.test.isEmpty(goods)) {
        uni.setStorageSync(this.$storageKey.dynamic_goods, {
          extend: true,
          index: 2,
          name: '单一商品',
          param: {
            ...goods,
            slideshow: JSON.parse(goods.slideshow)
          },
          path: '/pages/goods/detail'
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import './../main.less';

.he-page-content {
  padding: 20px;
}

.content {
  padding: 24px;

  .he-textarea {
    width: 662px;
    height: 280px;
  }

  .he-area__num {
    font-size: 24px;
    font-weight: 500;
    @extend .font-family-sc;
    color: #999999;
    line-height: 1.1;
    text-align: right;
  }
}

.image {
  padding: 0 0 24px 24px;

  .he-top {
    height: 72px;
    @extend .font-family-sc;
    line-height: 72px;
    font-size: 26px;
    font-weight: 500;

    .he-title {
      color: #222222;
    }

    .he-number {
      color: #999999;
      margin-left: 15px;
    }
  }
}

.he-switch {
  height: 56px;
  width: 284px;
  background: #f5f5f5;
  border-radius: 28px;
  margin-bottom: 32px;

  .switch-item {
    width: 142px;
    height: 54px;
    line-height: 52px;
    background: #ffffff;
    border: 1px solid transparent;
    @include border_color('border_color');
    @include font_color('font_color');
    border-radius: 28px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    text-align: center;
    transform: translateX(142px);
    transition-duration: 0.2s;
    position: relative;
    z-index: 10;
  }

  .item {
    width: 142px;
    height: 54px;
    line-height: 52px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    text-align: center;
    color: #666666;
  }
}

.goods {
  padding: 24px;

  .iconpersonalcenter_add {
    font-size: 28px;
    color: #d7d7d7;
    margin-right: 18px;
  }

  .iconbtn_arrow {
    font-size: 20px;
    color: #bebebe;
  }

  .add-goods {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 36px;
  }
}

.item-content {
  width: 420px;
  height: 100px;
  margin-left: 24px;
}

.item-name {
  font-size: 26px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #222222;
  line-height: 48px;
}

.item-price {
  font-size: 22px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
  line-height: 40px;
}

.item-change {
  height: 100px;
  line-height: 100px;
  font-size: 22px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
  padding-left: 45px;
}

.he-tip {
  font-size: 22px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
}

.publish-dynamic {
  margin-top: 80px;
  width: 100%;
  height: 80px;
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #ffffff;
  border-radius: 40px;
  @include background_color('background_color');

  &[disabled] {
    background: #cccccc !important;
    color: #ffffff;
  }
}
</style>
