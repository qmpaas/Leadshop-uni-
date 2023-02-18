<template>
  <view
    class="he-page-content"
    :data-theme="theme"
    :class="loading ? 'flex justify-center align-center' : ''"
    @click="closeNavigationModel"
  >
    <he-loading size="50" mode="flower" v-if="loading" />
    <template v-else>
      <!-- 头部导航 -->
      <!-- #ifndef H5 -->
      <view :style="[navbarStyle]" class="he-navbar he-navbar-fixed">
        <view :style="{ height: statusBarHeight + 'px' }" />
        <view :style="[navbarInnerStyle]" class="flex">
          <view class="he-navigation" :style="[navigationStyle]">
            <text
              class="iconfont"
              :class="pagesCount > 1 ? 'iconbtn_back' : 'iconnav_home_normal'"
              @click="routerIndex"
            />
          </view>
          <view class="flex-sub" :style="[titleStyle]">动态</view>
        </view>
      </view>
      <!-- #endif -->
      <!-- 主体内容 -->
      <scroll-view :scroll-y="true" class="page-body" :style="[scrollStyle]" @scrolltolower="scrollToLower">
        <image :src="getPromoterPage.dynamic.bg_url" :style="[backgroundStyle]" class="he-background-url" />
        <button class="cu-btn publish-entry" v-if="isCreateDynamic" :style="[publishEntryStyle]" @click="createDynamic">
          <text class="iconfont icondynamic_release" />
        </button>
        <view class="list-body" :style="[listBodyStyle]">
          <view class="item" v-for="item in list" :key="item.id">
            <view class="item-head flex">
              <he-image
                :image-style="{
                  borderRadius: '50%'
                }"
                :src="item.user.avatar"
                :width="72"
                :height="72"
              />
              <view class="flex flex-direction justify-around">
                <view class="name">{{ item.user.nickname }}</view>
                <view class="time">{{ item.created_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
              </view>
            </view>
            <view class="item-body">
              <view :class="[{ 'he-line-4': !item.unfold }, 'content']">
                {{ item.content }}
                <template v-if="item.too_long">
                  <view class="block" v-if="!item.unfold">
                    &nbsp;&nbsp;&nbsp;....&nbsp;
                    <button class="cu-btn" @click="expandCollapse(item)">展开</button>
                  </view>
                  <button class="cu-btn unfold" @click="expandCollapse(item)">收起</button>
                </template>
              </view>
              <!-- 图片动态 -->
              <view class="image-list flex flex-wrap" v-if="item.type === 1">
                <he-image
                  class="image"
                  :src="img"
                  :key="imgKey"
                  :list="item.pic_list"
                  :is-preview="true"
                  v-for="(img, imgKey) in item.pic_list"
                  :image-style="{
                    borderRadius: '8rpx'
                  }"
                  :width="218"
                  :height="218"
                />
              </view>
              <!-- 视频动态 -->
              <view class="video" v-else-if="item.type === 2">
                <listVideo
                  :index="item.id"
                  v-model="videoCurrent"
                  :src="item.video_list.url"
                  :poster="item.video_cover"
                />
              </view>
            </view>
            <view class="item-footer">
              <view class="justify-between flex">
                <view>
                  <button
                    class="cu-btn"
                    v-if="!$h.test.isEmpty(item.link) && !$h.test.isEmpty(item.link.param)"
                    @click="seeDetails(item)"
                  >
                    查看详情
                  </button>
                  <button class="cu-btn" v-if="item.can_delete" @click="delDynamic(item)">删除</button>
                  <button class="cu-btn" v-if="item.can_edit" @click="editDynamic(item)">编辑</button>
                </view>
                <view class="like" @click="dynamicLike(item)" :class="[{ is_vote: item.is_vote }]">
                  <text class="iconfont" :class="[item.is_vote ? 'iconlike2' : 'iconlike1']"></text>
                  <text>{{ item.upvote_count }}</text>
                </view>
              </view>
              <view v-if="!$h.test.isEmpty(item.upvote)" class="like-list flex align-center">
                <text class="iconfont iconlike1"></text>
                <text class="he-line-1">{{ item.upvote | filterUpvote }}</text>
              </view>
            </view>
          </view>
          <he-load-more v-if="list.length > 0" :margin-top="35" :status="loadStatus" />
          <he-no-content-yet
            :image="ipAddress + '/order-background-empty.png'"
            v-if="isNothing"
            text="暂无任何动态记录"
          />
          <view class="safe-area-inset-bottom" />
        </view>
      </scroll-view>
      <heEmptyPopup
        :empty-style="{ height: '145rpx', lineHeight: '145rpx' }"
        title="确认删除这条动态？"
        :item="deleteItem"
        @confirm="deleteConfirm"
        v-model="showDelete"
      />
      <he-share v-model="isShare" :post-data="postData" />
      <HeLoginModel />
      <he-float-window :bottom="100" pages-url="promoter"></he-float-window>
      <image
        v-if="!isShare"
        @click="shareDynamic"
        :src="ipAddress + '/nav_home_normal.png'"
        class="he-share-image"
      ></image>
    </template>
  </view>
</template>

<script>
import { promoterzone, dynamicLike, dynamicDel, userDetail } from '../api';
import { mapGetters } from 'vuex';
import heNoContentYet from './../../components/he-no-content-yet.vue';
import heLoadMore from './../../components/he-load-more.vue';
import heLoading from '../../components/he-loading.vue';
import listVideo from './components/video.vue';
import heEmptyPopup from './../../components/he-empty-popup.vue';
import heShare from './../../components/he-share.vue';
import HeLoginModel from '../../components/he-login-layout.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';

let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// #ifndef H5
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif

export default {
  name: 'dynamic',
  props: {
    background: {
      type: Object,
      default() {
        return {
          background: '#ffffff'
        };
      }
    }
  },
  components: {
    heLoadMore,
    heNoContentYet,
    heLoading,
    listVideo,
    heEmptyPopup,
    heShare,
    HeLoginModel,
    heFloatWindow
  },
  data() {
    return {
      menuButtonInfo: menuButtonInfo,
      statusBarHeight: systemInfo.statusBarHeight,
      showNavigation: false,
      loading: true,
      list: [],
      page: {
        current: 1,
        pageCount: 1
      },
      loadStatus: 'loadmore',
      isNothing: false,
      videoCurrent: null,
      // 动态删除
      showDelete: false,
      deleteItem: null,
      UID: null,
      isShare: false,
      isPromoter: false,
      postData: null,
      user: {
        nickname: ''
      },
      shareOpen: true
    };
  },
  computed: {
    navbarStyle() {
      let style = {};
      Object.assign(style, this.background);
      return style;
    },
    navbarInnerStyle({ navbarHeight, statusBarHeight }) {
      let style = {};
      style.height = navbarHeight + 'px';
      // #ifdef H5
      style.paddingTop = '5px';
      // #endif
      // #ifdef MP-WEIXIN
      let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
      style.marginRight = rightButtonWidth + 'px';
      style.paddingTop = menuButtonInfo.top - statusBarHeight + 'px';
      // #endif
      return style;
    },
    navbarHeight({ height }) {
      // #ifdef H5
      return height ? height : 44;
      // #endif
      // #ifdef MP-WEIXIN
      let platformHeight = systemInfo.platform === 'ios' ? 44 : 48;
      return height ? height : platformHeight;
      // #endif
    },
    navigationStyle() {
      let style = {
        marginLeft: uni.upx2px(12) + 'px',
        width: '64rpx',
        height: '64rpx',
        textAlign: 'center',
        lineHeight: '64rpx'
      };
      // #ifdef MP-WEIXIN
      style.width = menuButtonInfo.height + 'px';
      style.height = menuButtonInfo.height + 'px';
      style.lineHeight = menuButtonInfo.height + 'px';
      // #endif
      return style;
    },
    titleStyle() {
      let style = {
        textAlign: 'right',
        fontWeight: 800,
        color: '#222222',
        fontSize: uni.upx2px(34) + 'px',
        paddingRight: '150rpx'
      };
      // #ifndef H5
      style.height = menuButtonInfo.height + 'px';
      style.lineHeight = menuButtonInfo.height + 'px';
      // #endif
      return style;
    },
    navigationModelStyle({ statusBarHeight }) {
      let style = {};
      let platformHeight = systemInfo.platform === 'ios' ? 44 : 48;
      //  #ifdef MP-WEIXIN
      style.top = platformHeight - (menuButtonInfo.top - statusBarHeight) + 6 + 'px';
      // #endif
      //  #ifdef H5
      style.top = platformHeight - (0 - statusBarHeight) + 6 + 'px';
      // #endif
      return style;
    },
    scrollStyle({ statusBarHeight, navbarHeight }) {
      let height = statusBarHeight + navbarHeight;
      // #ifndef H5
      return {
        height: `calc(100vh - ${height + 'px'})`
      };
      //  #endif
      // #ifdef H5
      return {
        height: `100vh`
      };
      //  #endif
    },
    backgroundStyle({ statusBarHeight, navbarHeight }) {
      let height = statusBarHeight + navbarHeight;
      // #ifndef H5
      return {
        top: height + 'px'
      };
      //  #endif
      // #ifdef H5
      return {
        top: 0
      };
      //  #endif
    },
    listBodyStyle({ navbarHeight, statusBarHeight }) {
      let height = statusBarHeight + navbarHeight - uni.upx2px(20);
      return {
        minHeight: `calc(100vh - ${height + 'px'})`
      };
    },
    publishEntryStyle({ navbarHeight, statusBarHeight }) {
      const style = {
        top: statusBarHeight + navbarHeight + uni.upx2px(32) + 'px'
      };
      style.transform = 'translateY(0)';
      return style;
    },
    // 分享数据
    shareData({ ipAddress, user, storeSetting }) {
      let imageUrl = '';
      // #ifndef H5
      imageUrl = `${ipAddress}/share-dynamic-space.png`;
      // #endif
      // #ifdef H5
      imageUrl = `${ipAddress}/share-dynamic-space-icon.png`;
      // #endif
      let name = user.nickname ? user.nickname : storeSetting.name;
      let id = user.id ? user.id : -1;
      return {
        title: `${name}的空间`,
        path: `/promoter/pages/dynamic?UID=${id}`,
        imageUrl: imageUrl,
        // #ifdef H5
        desc: '尖端好物，尽在我的空间，欢迎常来逛逛'
        // #endif
      };
    },
    ...mapGetters('setting', {
      getPromoterPage: 'getPromoterPage'
    }),
    pagesCount() {
      return getCurrentPages().length;
    },
    isCreateDynamic({ UID, $store }) {
      return UID == $store.state.apply.userInfo.id;
    }
  },
  onLoad(option) {
    // #ifdef H5
    this.$wechat.updateShareData(this.shareData);
    // #endif
    uni.$on('update', () => {
      this.getZoneList().then(response => {
        this.list = response;
        this.loadStatus = this.list.length < 10 ? 'nomore' : 'loadmore';
      });
    });
    this.UID = option.UID;
    if (option.scene) {
      // 查看他人的动态空间
      const scene = decodeURIComponent(option.scene);
      this.UID = this.$h.getSceneVariable(scene, 'UID');
    }
    // 获取当前动态详情的主人信息
    userDetail(this.UID).then(response => {
      this.user = response;
    });
    // 初次获取动态列表
    this.getZoneList()
      .then(response => {
        this.list = response;
        this.isNothing = response.length === 0;
        this.loadStatus = this.list.length < 10 ? 'nomore' : 'loadmore';
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    // 跳转到首页
    routerIndex() {
      if (this.pagesCount > 1) {
        uni.navigateBack({
          delta: 1
        });
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
    },
    closeNavigationModel() {
      this.showNavigation = false;
    },
    // 动态列表
    async getZoneList() {
      const response = await promoterzone(this.page.current, this.UID);
      const { data, pagination } = response;
      this.page = pagination;
      data.forEach(item => {
        let line = uni.upx2px(686) * 4;
        if (line - uni.upx2px(30) * item.content.length < 0) {
          item.too_long = true;
          item.unfold = false;
        }
      });
      return data;
    },
    // 动态点赞
    dynamicLike(data) {
      const userInfo = this.$store.state.apply.userInfo;

      dynamicLike(data.id).then(() => {
        let is_vote = data.is_vote;
        if (is_vote) {
          data.is_vote = 0;
          data.upvote_count--;
          data.upvote = data.upvote.filter(key => {
            return userInfo.id != key.UID;
          });
        } else {
          data.is_vote = 1;
          data.upvote_count++;
          data.upvote.push({
            user: userInfo,
            UID: userInfo.id
          });
        }
      });
    },
    // 查看详情
    seeDetails(item) {
      if (!this.$h.test.isEmpty(item.link)) {
        this.$h.MPageNavigate(item.link);
      }
    },
    // 删除动态
    delDynamic(item) {
      this.showDelete = true;
      this.deleteItem = item;
    },
    // 删除动态确认回调
    deleteConfirm(item) {
      dynamicDel(item.id).then(() => {
        const index = this.list.findIndex(obj => {
          return obj.id === item.id;
        });
        this.$delete(this.list, index);
      });
    },
    // 编辑动态
    editDynamic(item) {
      uni.navigateTo({
        url: `/promoter/pages/create-dynamic?id=${item.id}`
      });
    },
    // 创建动态
    createDynamic() {
      uni.navigateTo({
        url: `/promoter/pages/create-dynamic`
      });
    },
    // 展开收起
    expandCollapse(item) {
      item.unfold = !item.unfold;
    },
    // 滚动到底部
    scrollToLower() {
      let _this = this;
      if (this.page.pageCount > this.page.current) {
        this.page.current++;
        this.loadStatus = 'loading';
        this.getZoneList().then(response => {
          this.list = this.list.concat(response);
          _this.loadStatus = 'loadmore';
        });
      } else {
        this.loadStatus = 'nomore';
      }
    },
    //  分享动态
    shareDynamic() {
      if (!this.isLogin) {
        // #ifdef H5
        this.$store.commit('apply/setLoginModel', true);
        // #endif
      } else {
        // #ifdef H5
        this.$wechat.updateShareData(this.shareData);
        // #endif
        this.isShare = true;
        this.postData = {
          zoom: 1
        };
        // 进入的是别人的动态空间 就分享别人的海报
        if (this.UID !== this.$store.state.apply.userInfo.id) {
          this.postData.UID = this.UID;
        }
      }
    }
  },
  filters: {
    // 点赞列表过滤
    filterUpvote(array) {
      let str = '';
      array.forEach(item => {
        str += `${item.user.nickname}，`;
      });
      str = str.slice(0, str.length - 1);
      return str;
    }
  },
  // #ifdef H5
  beforeDestroy() {
    this.$wechat.updateShareData(this.$shareAppMessage());
  },
  // #endif
  // #ifndef H5
  onShareAppMessage() {
    return this.$shareAppMessage(this.shareData);
  },
  onShareTimeline() {
    return this.$shareAppMessage(this.shareData);
  }
  // #endif
};
</script>

<style scoped lang="scss">
@import '../main.less';

.he-navbar {
  width: 100%;

  &.he-navbar-fixed {
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
    z-index: 991;
  }

  .he-navigation {
    border-radius: 32px;
    border: 1px solid #eaeaea;
    //padding: 0 30px;
    position: relative;

    .he-line {
      width: 1px;
      height: 37px;
      background: #cccccc;
    }

    .iconnav_home_normal,
    .iconbtn_back {
      font-size: 32px;
      color: #000000;
    }

    .he-navigation-model {
      position: absolute;
      width: 232px;
      height: 176px;
      background-color: #ffffff;
      left: 0;
      border-radius: 8px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      padding: 8px 32px;

      .triangle {
        position: absolute;
        top: 0;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 12px solid #ffffff;
        transform: translate(-50%, -100%);
      }

      .navigation-item {
        height: 80px;
        font-size: 28px;
        @extend .font-family-sc;
        font-weight: 500;
        color: #222222;
        line-height: 40px;

        &:last-child {
          border-top: 1px solid #e5e5e5;
        }

        .iconnav_personalcenter_normal,
        .iconproductdetails_share {
          font-size: 27px;
          margin-right: 16px;
          margin-left: 7px;
        }
      }
    }
  }
}

.page-body {
  position: relative;

  .he-background-url {
    width: 750px;
    height: 375px;
    position: fixed;
  }

  .publish-entry {
    width: 80px;
    height: 80px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    position: fixed;
    top: 32px;
    right: 32px;
    z-index: 100;
    transition-duration: 0.1s;
    line-height: 80px;
    text-align: center;
    transform: translateY(-112px);

    .icondynamic_release {
      font-size: 40px;
      color: #ffffff;
    }
  }

  .list-body {
    border-radius: 16px 16px 0 0;
    background: #ffffff;
    padding: 0 32px;
    overflow: hidden;
    width: 100%;
    margin-top: 375px;
    z-index: 10;
    position: relative;
    top: -20px;

    .item {
      margin-top: 40px;
      padding-bottom: 40px;
      border-bottom: 1px solid #e5e5e5;
    }

    .item-head {
      margin-bottom: 24px;

      .justify-around.flex-direction {
        margin-left: 24px;
      }

      .name {
        font-size: 28px;
        @extend .font-family-sc;
        font-weight: 500;
        color: #222222;
        line-height: 36px;
      }

      .time {
        font-size: 22px;
        @extend .font-family-sc;
        line-height: 36px;
        font-weight: 400;
        color: #999999;
      }
    }

    .item-body {
      .content {
        font-size: 30px;
        @extend .font-family-sc;
        font-weight: 500;
        color: #222222;
        line-height: 40px;
        word-break: break-all;
        margin-bottom: 24px;
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

      .image-list {
        margin: 0 0 8px 0;

        .image {
          margin-bottom: 16px;
          // 除了3的倍数
          &:not(:nth-child(3n)) {
            margin-right: 16px;
          }
        }
      }

      .video {
        margin: 0 0 24px 0;
      }
    }

    .item-footer {
      .justify-between.flex {
        height: 40px;
        line-height: 40px;
      }

      .cu-btn {
        font-size: 28px;
        @extend .font-family-sc;
        font-weight: 500;
        color: #3273ea;
        padding: 0;
        height: auto;
        background-color: transparent;

        &:not(:last-child) {
          margin-right: 24px;
        }
      }

      .like {
        font-size: 28px;
        @extend .font-family-sc;
        font-weight: 500;
        color: #999999;
      }

      .iconfont {
        font-size: 28px;
        margin-right: 14px;
      }

      .is_vote {
        color: #ff3154;
      }

      .iconlike1 {
        color: #999999;
      }

      .iconlike2 {
        color: #ff3154;
      }

      .like-list {
        width: 686px;
        height: 72px;
        background: #f5f5f5;
        border-radius: 8px;
        padding: 0 42px 0 25px;
        margin-top: 16px;
      }
    }
  }
}

.he-share-image {
  width: 88px;
  height: 88px;
  position: fixed;
  border-radius: 50%;
  bottom: 80px;
  right: 24px;
  z-index: 100;
}
</style>
