<template>
  <view
    class="he-page-content he-coupon"
    :data-theme="theme"
    :class="loading ? 'flex justify-center align-center' : ''"
  >
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <view
        class="le-coupon-detail"
        :class="detail.status === 0 || (detail.status === 1 && couponShare) ? 'he-normal' : 'he-invalid'"
      >
        <view class="le-coupon-detail-top">
          <image
            class="he-item-image"
            v-if="!couponShare && detail.status !== 0"
            :src="detail.status | img(ipAddress)"
          />
          <view class="le-coupon-doc-line flex justify-center">
            <view class="le-coupon-doc-item" v-for="item in 17" :key="item">
              <view class="le-coupon-doc"></view>
            </view>
          </view>
          <view class="le-coupon-heade-body flex flex-direction align-center">
            <view
              class="le-coupon-share flex flex-direction align-center justify-between"
              @click="setShare"
              v-if="
                (detail.enable_share && detail.status === 0 && !couponShare) || (detail.enable_share && !shareReceive)
              "
            >
              <view class="iconfont iconproductdetails_share"></view>
              <text class="he-share__text">分享</text>
            </view>
            <view class="le-coupon-name">{{ detail.name }}</view>
            <view class="le-coupon-price">{{ detail.sub_price | setNumber }}</view>
            <view class="le-coupon-condition">
              <template v-if="Number(detail.min_price) > 0"> 满{{ Number(detail.min_price) }}可用 </template>
              <template v-else> 无门槛使用 </template>
              ，{{ detail.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
            </view>
            <template v-if="(!couponShare && detail.status === 0) || couponShare">
              <!-- #ifdef MP-WEIXIN -->
              <button class="cu-btn le-coupon-btn" v-if="couponShare && shareReceive" @click="receive()">
                立即领取
              </button>
              <!-- #endif -->
              <!-- #ifdef H5 -->
              <he-open-subscribe
                @open-subscribe-success="receive"
                :template-id="subTemplateId"
                v-if="couponShare && shareReceive"
              >
                <button class="cu-btn le-coupon-btn">立即领取</button>
              </he-open-subscribe>
              <!-- #endif -->
              <button class="cu-btn le-coupon-btn le-coupon-use-btn" v-else @click="redirectTo()">立即使用</button>
            </template>
          </view>
        </view>
        <view class="le-coupon-detail-center">
          <view class="le-coupon-doc"></view>
          <view class="le-coupon-line" :style="[lineColor]"></view>
          <view class="le-coupon-doc"></view>
        </view>
        <view class="le-coupon-detail-bottom">
          <view class="le-coupon-bottom-body">
            <view class="le-coupon-title">可用时间</view>
            <view class="le-coupon-text">
              <template v-if="detail.expire_type === 1"> 领取后{{ detail.expire_day }}天内 </template>
              <template v-else>
                {{ detail.begin_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}-{{
                  detail.end_time | timeFormat('yyyy-mm-dd hh:MM:ss')
                }}
              </template>
            </view>
            <view class="le-coupon-title">使用说明</view>
            <text class="le-coupon-text">{{ detail.content }} </text>
          </view>
          <view class="le-coupon-doc-line flex justify-center">
            <view class="le-coupon-doc-item" v-for="item in 17" :key="item">
              <view class="le-coupon-doc"></view>
            </view>
          </view>
        </view>
      </view>
      <he-products-featured v-if="goodsSetting.recommend_showpage.coupon_detail.value"></he-products-featured>
      <he-share v-model="isShare" :post-data="{ coupon_id: shareId }" coupon-type="coupon"></he-share>
    </template>
    <detail-invalid v-model="isInvaild" :title="invaildStr"></detail-invalid>
    <HeLoginModel />
  </view>
</template>
<script>
import { mapGetters } from 'vuex';
import heProductsFeatured from '../../components/he-products-featured.vue';
import heShare from '../../components/he-share.vue';
import detailInvalid from './components/detail-invalid.vue';
import heLoading from '../../components/he-loading.vue';
import HeLoginModel from '../../components/he-login-layout.vue';
// #ifdef H5
import heOpenSubscribe from '@/components/he-open-subscribe.vue';
// #endif
// #ifdef H5
let menuList = [
  // 分享给朋友
  'menuItem:share:appMessage',
  // 分享到朋友圈
  'menuItem:share:timeline',
  // 分享到QQ
  'menuItem:share:qq',
  // 分享到微博
  'menuItem:share:weiboApp',
  // 分享到QQ空间
  'menuItem:share:QZone'
];
// #endif
export default {
  name: 'detail',
  data() {
    return {
      isShare: false,
      loading: true,
      isInvaild: false,
      invaildStr: '',
      couponShare: null,
      shareReceive: true,
      detail: {},
      id: null,
      behavior: null,
      shareOpen: true
    };
  },
  computed: {
    shareData: function () {
      let imageUrl = '';
      let title = '';
      let id = null;
      // #ifndef H5
      imageUrl = this.ipAddress + '/coupon-share-applets-background.png';
      title = this.storeSetting.name;
      // #endif
      // #ifdef H5
      imageUrl = this.ipAddress + '/coupon-share-wechat-background.png';
      title = '送你优惠券，赶快来抢吧！';
      // #endif
      if (!this.couponShare) {
        id = this.detail.coupon_id;
      } else {
        id = this.detail.id;
      }
      return {
        title,
        path: '/pages/coupon/detail?id=' + id + '&couponShare=1',
        imageUrl,
        // #ifdef H5
        desc: '商家发福利啦！斥巨资帮助买家省钱'
        // #endif
      };
    },
    // 海报分享ID
    shareId: function () {
      let id = null;
      if (!this.couponShare) {
        id = this.detail.coupon_id;
      } else {
        id = this.detail.id;
      }
      return id;
    },
    lineColor: function () {
      let color = this.themeColor;
      if (!this.couponShare && this.detail.status !== 0) {
        color = '#cccccc';
      }
      return {
        backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} 50%, transparent 0%)`
      };
    },
    subTemplateId: function () {
      return [this.$store.getters['setting/subscribe'].coupon_expire];
    },
    ...mapGetters({
      goodsSetting: 'setting/goodsSetting'
    })
  },
  components: {
    heProductsFeatured,
    heShare,
    heLoading,
    detailInvalid,
    // #ifdef H5
    heOpenSubscribe,
    // #endif
    HeLoginModel
  },
  onLoad(options) {
    let id = null;
    let couponShare = null;
    let behavior = 'coupon';
    if (this.isLogin) {
      behavior = 'user';
    }
    if (options.scene) {
      id = parseInt(this.getQueryVariable(options, 'id'));
      couponShare = this.getQueryVariable(options, 'couponShare');
    } else {
      id = parseInt(options.id);
      couponShare = options.couponShare;
    }
    this.couponShare = couponShare;
    // 分享进入的并不是自己的优惠券
    if (this.couponShare) {
      behavior = 'coupon';
      uni.setNavigationBarTitle({
        title: '领取优惠券'
      });
    } else {
      uni.setNavigationBarTitle({
        title: '优惠券详情'
      });
    }
    this.id = id;
    this.behavior = behavior;
    // #ifdef MP-WEIXIN
    uni.hideShareMenu();
    // #endif
    this.getDetail();
  },
  onShow() {
    // 登入后重新进入页面判断是否可以领取
    if (!this.$h.test.isEmpty(this.detail)) {
      uni.startPullDownRefresh();
    }
  },
  methods: {
    getQueryVariable: function (options, variable) {
      let query = decodeURIComponent(options.scene);
      let vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return null;
    },
    setShare: function () {
      this.isShare = true;
    },
    getDetail: function () {
      let _this = this;
      this.$heshop
        .coupon('get', this.id, {
          behavior: this.behavior
        })
        .then(function (response) {
          _this.detail = response;
          // #ifdef H5
          if (response.enable_share) {
            _this.$wechat.updateShareData(_this.shareData);
          } else {
            // 隐藏转发按钮
            _this.$wechat.hideMenuItems({
              menuList: menuList
            });
          }
          // #endif
          _this.loading = false;
        })
        .catch(function (error) {
          _this.loading = false;
          _this.$toError(error);
        });
    },
    receive: function () {
      let _this = this;
      if (this.isLogin) {
        function couponRequire() {
          _this.$heshop
            .coupon('post', {
              id: _this.detail.id
            })
            .then(function () {
              _this.shareReceive = false;
            })
            .catch(function (error) {
              if (error.status === 403) {
                _this.invaildStr = error.data.message;
                _this.isInvaild = true;
              }
            });
        }
        // #ifdef MP-WEIXIN
        wx.requestSubscribeMessage({
          tmplIds: _this.subTemplateId,
          success: function () {},
          fail: function () {},
          complete: function () {
            couponRequire();
          }
        });
        // #endif
        // #ifdef H5
        couponRequire();
        // #endif
      } else {
        // #ifdef H5
        _this.$store.commit('apply/setLoginModel', true);
        // #endif
      }
    },
    redirectTo: function () {
      uni.redirectTo({
        url: '/pages/goods/search-list?coupon_id=' + this.detail.coupon_id
      });
    }
  },
  filters: {
    setNumber: function (value) {
      return Number(value);
    },
    img: function (type, ipAddress) {
      let str = ipAddress;
      if (type === 1) {
        str += '/coupon-used-icon.png';
      } else if (type === 2) {
        str += '/coupon-expired-icon.png';
      } else if (type === 3) {
        str += '/coupon-unable-icon.png';
      }
      return str;
    }
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
  // #ifndef H5
  onShareAppMessage() {
    return this.$shareAppMessage(this.shareData);
  },
  onShareTimeline() {
    return this.$shareAppMessage(this.shareData);
  },
  // #endif
  onPullDownRefresh() {
    this.getDetail();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>
<style scoped lang="scss">
.he-coupon {
  overflow: hidden;
}

.le-coupon-detail {
  width: 710px;
  overflow: hidden;
  background: #ffffff;
  border-radius: 16px;
  margin: 20px 20px 25px 20px;
}

.le-coupon-detail-top {
  border: 2px solid transparent;
  border-bottom: none;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  position: relative;

  .le-coupon-doc {
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .he-item-image {
    width: 120px;
    height: 120px;
    position: absolute;
    top: 0;
    right: 0;
  }
}

.le-coupon-heade-body {
  height: 437px;
  padding: 72px 0 0 0;
  position: relative;

  .le-coupon-share {
    position: absolute;
    right: 40px;
    top: 32px;
    width: 70px;

    .iconproductdetails_share {
      font-size: 32px;
      color: RGBA(153, 153, 153, 1);
    }

    .he-share__text {
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
    }
  }

  .le-coupon-name {
    font-size: 36px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    line-height: 48px;
  }

  .le-coupon-price {
    font-size: 70px;
    font-family: DIN-Bold;
    font-weight: Bold;
    line-height: 80px;
    margin-top: 24px;
  }

  .le-coupon-price::before {
    content: '￥';
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
  }

  .le-coupon-condition {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
    line-height: 36px;
    margin-top: 24px;
  }

  .le-coupon-btn {
    width: 280px;
    height: 72px;
    // padding: 0;
    border-radius: 36px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-top: 32px;
    @include background_color('background_color');
  }

  .le-coupon-btn.le-coupon-use-btn {
    background-color: #ffffff !important;
    @include font_color('font_color');
    border: 1px solid transparent;
    @include border_color('border_color');
  }
}

.le-coupon-detail-bottom {
  border: 2px solid transparent;
  border-top: none;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;

  .le-coupon-doc {
    bottom: 0;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%, 50%);
  }
}

.le-coupon-bottom-body {
  padding: 32px 40px 52px 40px;

  .le-coupon-title {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
    line-height: 48px;
  }

  .le-coupon-text {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
    line-height: 32px;
    margin-bottom: 24px;
  }
}

.le-coupon-detail-center {
  height: 16px;
  position: relative;

  .le-coupon-doc {
    top: 50%;
  }

  .le-coupon-doc:first-child {
    left: 0;
    transform: translate(-50%, -50%);
  }

  .le-coupon-doc:last-child {
    right: 0;
    transform: translate(50%, -50%);
  }

  .le-coupon-line {
    width: 96%;
    height: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-position: center;
    background-size: 14px 2px;
    background-repeat: repeat-x;
  }
}

.le-coupon-doc-line {
  width: 710px;
  height: 8px;
}

.le-coupon-doc-item {
  width: 40px;
  height: 8px;
  position: relative;
  z-index: 100;
}

.le-coupon-doc {
  width: 16px;
  height: 16px;
  position: absolute;
  border: 2px solid transparent;
  border-radius: 50%;
  background: RGBA(245, 245, 245, 1);
}

.he-normal {
  .le-coupon-detail-top {
    @include border_color('border_color');
  }

  .le-coupon-price {
    @include font_color('font_color');
  }

  .le-coupon-detail-bottom {
    @include border_color('border_color');
  }

  .le-coupon-doc {
    @include border_color('border_color');
  }
}

.he-invalid {
  .le-coupon-detail-top {
    border-color: #ccc;
  }

  .le-coupon-price {
    color: #999999;
  }

  .le-coupon-detail-bottom {
    border-color: #ccc;
  }

  .le-coupon-doc {
    border-color: #ccc;
  }
}
</style>
