<template>
  <view
    class="pages fitment-pages"
    :style="{
      background: background
    }"
    v-if="!is_skip"
  >
    <openidad @confirm="handleConfirm"></openidad>
    <!-- #ifndef H5 -->
    <he-navbar
      :is-back="false"
      title-bold
      title-size="32"
      :title="fixed ? '' : title"
      :background="{ background: '#fff' }"
    >
      <view
        class="he-search flex align-center"
        v-if="fixed"
        :style="{ height: menuButtonInfo.height + 'px' }"
        @click="navigateToDetail"
      >
        <text class="iconfont iconsearchbar_search"></text>
        <text class="he-search-text">请输入关键字搜索</text>
      </view>
    </he-navbar>
    <view :style="[topHeight]"></view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <he-navbar v-if="fixed" :is-back="false" title-bold title-size="32" :background="{ background: '#fff' }">
      <view class="he-search flex align-center" @click="navigateToDetail">
        <text class="iconfont iconsearchbar_search"></text>
        <text class="he-search-text">请输入关键字搜索</text>
      </view>
    </he-navbar>
    <!-- #endif -->
    <view v-for="(item, index) in page" :key="index">
      <view v-if="item.name === 'notice'" :id="item.name + '_' + index">
        <component is="notice" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'rubik'" :id="item.name + '_' + index">
        <component is="rubik" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'title'" :id="item.name + '_' + index">
        <component is="titles" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'navigation'" :id="item.name + '_' + index">
        <component is="navigation" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'video'" :id="item.name + '_' + index">
        <component is="videos" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'separate'" :id="item.name + '_' + index">
        <component is="separate" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'banner'" :id="item.name + '_' + index">
        <component is="banner" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'search'" id="search">
        <component is="search" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'goods'" :id="item.name + '_' + index">
        <component is="goods" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'blank'" :id="item.name + '_' + index">
        <component is="blank" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'tabs'" :id="item.name + '_' + index">
        <component
          :background="background"
          :page-index="index"
          is="tabs"
          :facade="item.facade"
          :content="item.content"
          :data-index="index"
        ></component>
      </view>
      <view v-else-if="item.name === 'coupon'" :id="item.name + '_' + index">
        <component
          :background="background"
          :page-index="index"
          is="coupon"
          :facade="item.facade"
          :content="item.content"
          :data-index="index"
        ></component>
      </view>
      <view v-else-if="item.name === 'task'" :id="item.name + '_' + index">
        <component
          :background="background"
          :page-index="index"
          is="task"
          :facade="item.facade"
          :content="item.content"
          :data-index="index"
        ></component>
      </view>
      <!-- #ifndef H5 -->
      <view v-else-if="item.name === 'wechat'" :id="item.name + '_' + index">
        <component is="wechat" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <view v-else-if="item.name === 'wechatLive'" :id="item.name + '_' + index">
        <component is="wechatLive" :facade="item.facade" :content="item.content" :data-index="index"></component>
      </view>
      <!--#endif-->
    </view>
    <!-- #ifndef H5 -->
    <favorites v-model="isFavorites"></favorites>
    <!--#endif-->
    <!-- #ifdef H5 -->
    <user-newuser-coupon
      v-model="isNewuser"
      :coupon="userInfo.register && userInfo.register.coupon_list"
      :wechatUrl="wechatUrl"
    ></user-newuser-coupon>
    <!--#endif-->
    <!-- 优化展现形式 -->
    <taskpopups
      v-model="item.display"
      :title="item.remark"
      :index="index"
      v-for="(item, index) in popupsList"
      :key="index"
    ></taskpopups>
    <!-- 测试使用 -->
    <HeLoginModel />
    <!-- #ifdef H5 -->
    <he-float-window :bottom="100" pages-url="index"></he-float-window>
    <!--#endif-->
    <!-- #ifndef H5 -->
    <he-float-window pages-url="index"></he-float-window>
    <!--#endif-->
    <he-become-distributor
      v-if="
        getPromoter.status === 1 &&
        !getPromoter.need_check &&
        !getPromoter.need_apply &&
        getPromoter.conditions.type === 1 &&
        isLogin
      "
    ></he-become-distributor>
<!--    <float></float>-->
  </view>
</template>

<script type="text/javascript">
let menuButtonInfo = {};
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
//组件列表
import titles from '../fitment/title/title.vue';
import navigation from '../fitment/navigation/navigation.vue';
import videos from '../fitment/video/video.vue';
import separate from '../fitment/separate/separate.vue';
import blank from '../fitment/blank/blank.vue';
import banner from '../fitment/banner/banner.vue';
import search from '../fitment/search/search.vue';
import goods from '../fitment/goods/goods.vue';
import tabs from '../fitment/tabs/tabs.vue';
import rubik from '../fitment/rubik/rubik.vue';
import notice from '../fitment/notice/notice.vue';
import advertising from '../fitment/advertising/advertising.vue';
import coupon from '../fitment/coupon/coupon.vue';
import task from '../fitment/task/task.vue';
// #ifndef H5
import wechat from '../fitment/wechat/wechat.vue';
import favorites from './components/favorites.vue';
import wechatLive from '../fitment/wechatLive/wechatLive.vue';
// #endif
import heNavbar from '../../components/he-navbar.vue';
// #ifdef H5
import userNewuserCoupon from '../../components/user-newuser-coupon.vue';
// #endif
import { mapGetters, mapActions } from 'vuex';

import openidad from './ad.vue';
import cartoon from '@/plugins/task/components/cartoon.vue';
import taskpopups from '@/plugins/task/components/popups.vue';
import HeLoginModel from '../../components/he-login-layout.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';
import heBecomeDistributor from '../../components/he-become-distributor';
import float from "./../../components/layout/float";

export default {
  components: {
    videos,
    separate,
    blank,
    banner,
    search,
    goods,
    navigation,
    tabs,
    titles,
    rubik,
    notice,
    advertising,
    coupon,
    task,
    // #ifndef H5
    wechat,
    favorites,
    wechatLive,
    // #endif
    heNavbar,
    // #ifdef H5
    userNewuserCoupon,
    // #endif
    openidad,
    taskpopups,
    cartoon,
    HeLoginModel,
    heFloatWindow,
    heBecomeDistributor,
    float
  },
  data() {
    return {
      is_cartoon: 1,
      popupsList: [],
      is_skip: false,
      background: '#F7F7F7',
      page: [],
      empty: {
        name: 'blank',
        icon: this.ipAddress + '/pageicon/blank-icon.png',
        title: '辅助空白',
        content: {},
        facade: {
          height: 10,
          background_color: '#FFFFFF'
        }
      },
      // #ifndef H5
      title: '首页',
      isFavorites: true,
      // #endif
      menuButtonInfo: menuButtonInfo,
      // #ifdef H5
      isNewuser: false,
      wechatUrl: '/',
      // #endif
      isShareCount: null
    };
  },
  // #ifdef H5
  beforeCreate() {
    let _this = this;
    this.is_skip = true;
    let q = window.location.search.substring(1).split('_skip=')[1];
    if (q) {
      let code = this.$h.getQueryVariable('code');
      if (code) {
        if (this.$store.state.apply.is_login) {
          this.is_skip = false;
        } else {
          this.wechatUrl = q;
          this.$store
            .dispatch('user/weChatLogin', { code })
            .then(function () {
              _this.is_skip = false;
              if (!_this.$h.test.isEmpty(_this.userInfo.register.coupon_list)) {
                _this.isNewuser = true;
              } else {
                uni.redirectTo({
                  url: q,
                  fail() {
                    uni.switchTab({
                      url: q
                    });
                  }
                });
              }
            })
            .catch(function () {
              _this.is_skip = false;
            });
        }
      }
    } else {
      this.is_skip = false;
    }
  },
  // #endif
  computed: {
    ...mapGetters({
      searchTop: 'components/getSearchTop',
      fixed: 'components/getSearchFixed',
      searchHeight: 'components/getSearchHeight',
      navbarHeight: 'setting/getNavBarHeight',
      statusBarHeight: 'setting/statusBarHeight',
      getPromoter: 'setting/getPromoter'
    }),
    is_ad() {
      return uni.getStorageSync('openingad') || false;
    },
    topHeight: function () {
      return {
        height: `${this.statusBarHeight + this.navbarHeight}px`,
        // #ifdef H5
        lineHeight: `${this.statusBarHeight + this.navbarHeight}px`
        // #endif
      };
    },
    userInfo: function () {
      return this.$store.state.apply.userInfo;
    },
    shareData: function () {
      return {
        title: this.shareSetting?.describe
          ? this.shareSetting?.describe
          : `欢迎光临${this.storeSetting?.name} 挑选好物`,
        path: '/pages/index/index',
        imageUrl: this.shareSetting?.cover_img ? this.shareSetting?.cover_img : this.storeSetting?.logo
      };
    }
  },
  /**
   * 页面显示时
   * @return {[type]} [description]
   */
  onShow() {
    this.$nextTick().then(() => {
      let is_ad = uni.getStorageSync('openingad');
      if (!is_ad) {
        uni.hideTabBar();
        setTimeout(() => {
          //设置延迟执行
          this.handlePageLoading();
        }, 1000);
      } else {
        uni.showTabBar();
        this.handlePageLoading();
      }
    });
    // #ifndef H5
    // 是否显示收藏小程序
    this.isFavorites = !uni.getStorageSync('isfavorites');
    // #endif
    if (this.isLogin) {
      this.setCartNumber();
    }
  },
  methods: {
    handler() {},
    ...mapActions({
      setCartNumber: 'cart/setCartNumber'
    }),
    handleConfirm(value) {
      uni.showTabBar();
      this.handlePageLoading();
    },
    /**
     * 获取日志
     * @return {[type]} [description]
     */
    handleTaskShare() {
      //用于单次提示
      const value = uni.getStorageSync('handleTaskShare');
      if (value) {
        this.binding = {};
        return true;
      }
      /**
       * 处理数据
       * @param  {[type]} res [description]
       * @return {[type]}     [description]
       */
      this.$heshop
        .plugin('get', { include: 'task', model: 'score', type: 'single', keyword: 'share', status: 0 })
        .then(res => {
          if (res && res.status === 0) {
            this.$nextTick(() => {
              this.popupsList.push({
                display: true,
                remark: res.remark
              });
              clearInterval(this.isShareCount);
              uni.setStorageSync('handleTaskShare', 1);
            });
          }
        });
    },
    /**
     * 执行页面保存操作
     * @return {[type]} [description]
     */
    handlePageLoading() {
      try {
        const value = this.getStorageSync('micropage');
        if (value) {
          // #ifdef H5
          uni.setNavigationBarTitle({
            title: value.name
          });
          // #endif
          // #ifndef H5
          this.title = value.name;
          // #endif
          this.background = value.background;
          this.page = JSON.parse(value.content);
          const num = this.page.findIndex(function (item) {
            return item.name === 'search';
          });
          this.$store.commit('components/setSearchIndex', num);
          this.$store.commit('components/setPage', this.page);
          this.handleLoadData(value);
        } else {
          this.handleLoadData();
        }
      } catch (error) {
        this.handleLoadData();
      }
    },
    /**
     * 加载数据信息
     * @return {[type]} [description]
     */
    handleLoadData(value) {
      let _this = this;
      this.$heshop
        .pages('GET')
        .then(function (data) {
          _this.background = data.background;
          if (!(value && _this.$heshop.MD5(value) == _this.$heshop.MD5(data))) {
            _this.page = JSON.parse(data.content);
            const num = _this.page.findIndex(function (item) {
              return item.name === 'search';
            });
            _this.$store.commit('components/setSearchIndex', num);
            _this.$store.commit('components/setPage', _this.page);
            uni.setStorageSync('micropage', data);
            // #ifdef H5
            uni.setNavigationBarTitle({
              title: data.name
            });
            // #endif
            // #ifndef H5
            _this.title = data.name;
            // #endif
          }
        })
        .catch(function (error) {
          _this.$toError(error);
        });
    },
    navigateToDetail() {
      uni.navigateTo({
        url: '/pages/goods/search'
      });
    }
  },
  onLoad() {
    // #ifdef H5
    this.$wechat.updateShareData(this.$shareAppMessage());
    // #endif
  },
  // #ifdef H5
  beforeDestroy() {
    // 显示转发按钮
    this.$wechat.showMenuItems({
      menuList: menuList
    });
    this.$wechat.updateShareData(this.$shareAppMessage());
  },
  // #endif
  onPageScroll(e) {
    let that = this;
    let scrollTop = parseInt(e.scrollTop);
    let isSatisfy = scrollTop >= that.searchTop + this.navbarHeight ? true : false;
    if (that.searchFixed === isSatisfy) {
      return false;
    }
    this.$store.commit('components/setSearchFixed', isSatisfy);
  }
};
</script>
<style lang="scss" scoped>
.pages {
  width: 100%;
  min-height: 100vh;
  background-color: RGBA(245, 245, 245, 1);
}

.he-page-title {
  background-color: #fff;
  position: fixed;
  z-index: 10;
  width: 100%;
  top: 0;
  text-align: center;
  // #ifndef H5
  padding-top: 95px;
  // #endif
}

.he-search {
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-radius: 32px;
  margin: 0 20px;
  width: 100%;
  padding-left: 24px;
  // #ifdef H5
  height: 63px;
  // #endif
}

.he-search-text {
  display: inline-block;
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  margin-left: 12px;
}

.iconsearchbar_search {
  font-size: 24px;
}
</style>
