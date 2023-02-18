<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-sticky">
      <view class="he-search he-card">
        <input type="text" class="he-input" v-model="content" :focus="showInput" @input="blurInput" />
        <button v-if="!showInput" @click="openInput" class="cu-btn he-button flex align-center justify-start">
          <text class="iconfont iconsearchbar_search" />
          <text>输入商品名称/素材文案搜索</text>
        </button>
      </view>
      <view class="he-switch flex">
        <view class="flex-sub" id="he-switch--0" :class="{ active: currentIndex === 0 }" @click="clickTab(0)">
          全部
        </view>
        <view class="flex-sub" id="he-switch--1" :class="{ active: currentIndex === 1 }" @click="clickTab(1)">
          图片
        </view>
        <view class="flex-sub" id="he-switch--2" :class="{ active: currentIndex === 2 }" @click="clickTab(2)">
          视频
        </view>
        <view class="he-line" :style="[tabBarStyle]" />
      </view>
    </view>
    <view class="he-list">
      <view class="he-item" v-for="(item, index) in list" :key="index">
        <view :class="[{ 'he-line-4': !item.unfold }, 'content']">
          {{ item.content }}
          <template v-if="item.too_long">
            <view class="block" v-if="!item.unfold">
              &nbsp;&nbsp;&nbsp;...&nbsp;
              <button class="cu-btn" @click="expandCollapse(item)">展开</button>
            </view>
            <button class="cu-btn unfold" @click="expandCollapse(item)">收起</button>
          </template>
        </view>
        <!-- 图片 -->
        <view class="he-images flex flex-wrap" v-if="item.type === 1">
          <he-image
            class="he-img"
            :image-style="{ borderRadius: '8rpx' }"
            :width="218"
            :height="218"
            v-for="(image, key) in item.pic_list"
            :key="key"
            :src="image"
            :is-preview="true"
            :list="item.pic_list"
          />
        </view>
        <!-- 视频 -->
        <view class="he-video" v-else-if="item.type === 2">
          <listVideo :index="item.id" v-model="videoCurrent" :src="item.video_list.url" :poster="item.video_cover" />
        </view>
        <view class="he-created_time">
          发布时间: {{item.created_time | timeFormat('yyyy-mm-dd hh:MM:ss')}}
        </view>
        <view class="flex he-footer align-center justify-between">
          <view>
            <button class="cu-btn he-jump" v-if="item.goods_id" @click="routerGoods(item.goods_id)">查看商品</button>
            <text class="he-share--count">分享{{ item.share_count }}</text>
          </view>
          <view>
            <button class="cu-btn he-btn" @click="hairpin(item)">一键发圈</button>
            <button class="cu-btn he-btn" @click="routerCreateDynamic(item)">发动态</button>
          </view>
        </view>
      </view>
      <he-load-more v-if="list.length > 0" :margin-top="39" :margin-bottom="39" :status="loadStatus" />
      <view class="safe-area-inset-bottom" />
    </view>
    <he-no-content-yet v-if="isNothing" text="暂无相关素材" />
    <he-save-loading :title="loadingText" v-model="loading" />
    <he-float-window pages-url="promoter"></he-float-window>
  </view>
</template>

<script>
import heNoContentYet from './../../components/he-no-content-yet.vue';
import heLoadMore from './../../components/he-load-more.vue';
import heSaveLoading from './../../components/he-save-loading.vue';
import listVideo from './components/video.vue';
import { promotermaterial, promotermaterialShare } from '../api';
import heFloatWindow from '../../components/layout/he-float-window.vue';
// #ifdef H5
import FileSaver from 'file-saver';
// #endif

export default {
  name: 'material',
  components: {
    heNoContentYet,
    heLoadMore,
    heSaveLoading,
    listVideo,
    heFloatWindow
  },
  data() {
    return {
      content: '',
      scrollBarLeft: 0,
      showInput: false,
      barFirstTimeMove: true,
      tabQueryInfo: [
        {
          left: uni.upx2px(32)
        },
        {
          left: uni.upx2px(32 + 228)
        },
        {
          left: uni.upx2px(32 + 228 + 228)
        }
      ],
      currentIndex: 0,
      tabWidth: 0,
      list: [],
      loadStatus: 'loadmore',
      isNothing: false,
      loading: false,
      page: {},
      loadingText: '',
      videoCurrent: null
    };
  },
  computed: {
    tabBarStyle({ barFirstTimeMove, scrollBarLeft }) {
      return {
        transform: `translate(${scrollBarLeft}px, -100%)`,
        'transition-duration': `${barFirstTimeMove ? 0 : '0.5s'}`
      };
    }
  },
  onLoad() {
    this.init();
  },
  methods: {
    init() {
      this.scrollByIndex();
      this.getList().then(() => {
        this.isNothing = this.list.length === 0;
      });
    },
    // 获取列表
    async getList() {
      try {
        const response = await promotermaterial(this.page.current, this.currentIndex, this.content);
        const { data, pagination } = response;
        data.forEach(item => {
          let line = uni.upx2px(686) * 4;
          if (line - uni.upx2px(30) * item.content.length < 0) {
            item.too_long = true;
            item.unfold = false;
          }
        });
        this.page = pagination;
        this.list = this.list.concat(data);
        // 暂无更多
        if (pagination.current === pagination.pageCount) {
          this.loadStatus = 'nomore';
        }
        return true;
      } catch (e) {
        //  Don't do
      }
    },
    // 展开收起
    expandCollapse(item) {
      item.unfold = !item.unfold;
    },
    // input失去焦点搜索
    blurInput() {
      this.list = [];
      if (this.$h.test.isEmpty(this.content)) {
        this.showInput = false;
      }
      this.page.current = 1;
      this.getList().then(() => {
        this.isNothing = this.list.length === 0;
      });
    },
    // 打开input搜索
    openInput() {
      this.showInput = !this.showInput;
      this.list = [];
    },
    // 点击tab
    clickTab(index) {
      this.currentIndex = index;
      this.page.current = 1;
      this.scrollByIndex();
      this.list = [];
      this.getList().then(() => {
        this.isNothing = this.list.length === 0;
      });
    },
    // tab滚动动画
    scrollByIndex() {
      let tabInfo = this.tabQueryInfo[this.currentIndex];
      if (!tabInfo) return;
      // 1 : 32
      // 2: 32 + 228
      // 3: 32 + 228 + 228
      let left = tabInfo.left + uni.upx2px(228) / 2;
      this.scrollBarLeft = left - uni.upx2px(228) / 4;
      if (this.barFirstTimeMove === true) {
        setTimeout(() => {
          this.barFirstTimeMove = false;
        }, 100);
      }
    },
    // 去新建动态
    routerCreateDynamic(item) {
      // 分享接口
      promotermaterialShare(item.id).then(() => {
        // 分享加一
        item.share_count++;
      });
      uni.navigateTo({
        url: '/promoter/pages/create-dynamic?data=' + JSON.stringify(item)
      });
    },
    // 一键发圈
    hairpin(item) {
      const self = this;
      // 分享接口
      promotermaterialShare(item.id).then(() => {
        // 分享加一
        item.share_count++;
      });
      if (item.type === 1) {
        this.loadingText = '正在保存图片…';
        // #ifndef H5
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            self.loading = true;
            self.saveFile(item.pic_list);
            self.uniCopy({
              content: item.content,
              success() {
                //  Dont do
              }
            });
          }
        });
        //  #endif
        //  #ifdef H5
        self.uniCopy({
          content: item.content,
          success() {
            uni.showToast({
              title: '内容已复制, 请手动下载素材图片',
              icon: 'none'
            });
          }
        });
        //  #endif
      } else if (item.type === 2) {
        // #ifndef H5
        this.loadingText = '正在保存视频…';
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            self.loading = true;
            self.saveVideoFile(item);
            self.uniCopy({
              content: item.content,
              success() {
                //  Dont do
              }
            });
          }
        });
        //  #endif
        //  #ifdef H5

        // let a = document.createElement('a');
        // //需要下载的数据内容,我这里放的就是BLOB，如果你有下载链接就不需要了
        // a.href = item.video_list.url;
        // a.download = "a.mp3";
        // a.click();

        self.uniCopy({
          content: item.content,
          success() {
            //  Dont do
          }
        });
        //  #endif
      }
    },
    // 图片保存
    saveFile(data) {
      const self = this;
      let images = JSON.parse(JSON.stringify(data));
      const image = images.splice(0, 1)[0];
      // #ifndef H5
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
                uni.showToast({
                  title: '文案已复制， 图片已保存',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail() {}
          });
        }
      });
      //  #endif
      //  #ifdef H5

      //  #endif
    },
    // 视频保存
    saveVideoFile(item) {
      const self = this;
      uni.downloadFile({
        url: item.video_list.url,
        success(response) {
          uni.saveVideoToPhotosAlbum({
            filePath: response.tempFilePath,
            success() {
              self.loading = false;
              self.uniCopy({
                content: item.content,
                success() {
                  uni.showToast({
                    title: '文案已复制， 视频已保存',
                    icon: 'none',
                    duration: 2000
                  });
                }
              });
            }
          });
        },
        fail() {}
      });
    },
    // 查看商品
    routerGoods(goodsId) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${goodsId}`
      });
    }
  },
  onReachBottom() {
    let _this = this;
    if (this.page.pageCount > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      this.getList().then(() => {
        _this.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  }
};
</script>

<style scoped lang="scss">
@import '../main.less';

.he-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

.he-search {
  width: 750px;
  height: 112px;
  padding: 24px 32px;
  position: relative;
  margin-bottom: 0;

  .he-input {
    width: 686px;
    height: 64px;
    background: #f7f7f7;
    border-radius: 32px;
    padding-left: 32px;
  }

  .he-button {
    position: absolute;
    top: 50%;
    width: 686px;
    background: transparent;
    left: 64px;
    transform: translateY(-50%);
    z-index: 10;
    font-size: 28px;
    padding: 0;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;

    .iconsearchbar_search {
      font-size: 28px;
      margin-right: 16px;
    }
  }
}

.he-switch {
  padding: 0 32px;
  height: 114px;
  text-align: center;
  position: relative;
  background: #f5f5f5;

  .he-line {
    width: 52px;
    height: 4px;
    @include background_color('background_color');
    position: absolute;
    bottom: 24px;
  }

  .active {
    @include font_color('font_color');
  }

  .flex-sub {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    line-height: 114px;
    transition-delay: 0.1s;
  }
}

.he-list {
  width: 750px;
  background: #ffffff;
  border-radius: 16px 16px 0 0;
  padding: 0 32px 0 32px;
  overflow: hidden;
  min-height: calc(100vh - 226px);
}

.he-item {
  border-bottom: 1px solid #e5e5e5;
  padding: 45px 0 24px 0;

  .content {
    font-size: 30px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 40px;
    margin-bottom: 24px;
    word-break: break-all;
    position: relative;

    .block {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #ffffff;
    }

    .cu-btn {
      height: auto;
      padding: 0;
      @extend .font-family-sc;
      font-weight: 500;
      font-size: 30px;
      color: #3273ea;
      line-height: 40px;
      background-color: #ffffff;
    }

    .unfold {
      display: inline-block;
    }
  }

  .he-images {
    margin: 24px 0 8px 0;

    .he-img {
      margin-bottom: 16px;

      &:not(:nth-child(3n)) {
        margin-right: 16px;
      }
    }
  }

  .he-video {
    margin: 0 0 24px 0;
  }

  .he-created_time {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #CCCCCC;
    line-height: 40px;
  }
  .he-footer {
    height: 80px;

    .he-jump {
      padding: 0;
      font-size: 28px;
      @extend .font-family-sc;
      font-weight: 500;
      color: #3273ea;
      background-color: transparent;
      margin-right: 24px;
    }

    .he-share--count {
      font-size: 28px;
      @extend .font-family-sc;
      font-weight: 500;
      color: #cccccc;
    }

    .he-btn {
      font-size: 24px;
      font-weight: 500;
      @include font_color('font_color');
      @include border_color('border_color');
      @extend .font-family-sc;
      border: 1px solid transparent;
      background: #ffffff;
      border-radius: 28px;
      padding: 0 24px;
      height: 56px;
      line-height: 54px;

      &:nth-child(2) {
        margin-left: 16px;
      }
    }
  }
}
</style>
