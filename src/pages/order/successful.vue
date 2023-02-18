<template>
  <view class="he-page-content" :data-theme="theme" :class="loading ? 'flex justify-center align-center' : ''">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <view class="he-header">
        <view class="flex justify-center he-header__top">
          <image class="he-image" :src="ipAddress + '/success-image-order.png'"></image>
          <view class="flex flex-direction justify-center he-text">
            <view class="he-title">订单支付成功</view>
            <view class="he-total">￥{{ totalAmount }}</view>
          </view>
        </view>
        <view class="he-header__bottom flex justify-center">
          <button class="cu-btn" @click="switchTab">返回首页</button>
          <button class="cu-btn" @click="redirectTo('/pages/order/detail?id=' + orderId)">查看详情</button>
        </view>
        <view class="he-coupon" v-if="!$h.test.isEmpty(coupon)">
          <view class="he-coupon-head">
            <image class="he-coupon-head-img" :src="ipAddress + '/coupon-star-successful.png'" />
            <text class="he-coupon-head-text">恭喜！获得优惠券</text>
          </view>
          <scroll-view scroll-y class="he-coupon-body">
            <view class="he-coupon-item flex" v-for="(item, index) in coupon" :key="index">
              <view class="he-coupon-left">
                <view class="he-item-price">{{ item.coupon.sub_price | setNumber }}</view>
                <view class="he-item-condition">
                  <template v-if="Number(item.coupon.min_price) > 0">
                    满{{ item.coupon.min_price | setNumber }}可用
                  </template>
                  <template v-else> 无门槛</template>
                </view>
              </view>
              <view class="he-coupon-center">
                <view class="he-coupon-doc"></view>
                <view class="he-coupon-doc"></view>
                <view class="he-border-line" :style="[lineColor]"></view>
              </view>
              <view class="he-coupon-right flex">
                <view class="he-right-left">
                  <view class="he-item-name">{{ item.coupon.name }}</view>
                  <view class="he-item-prompt"
                    >{{ item.coupon.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
                  </view>
                </view>
                <view class="he-right-right flex align-center justify-center">
                  <button
                    class="cu-btn he-cu-btn he-right-right_btn"
                    @click="redirectTo('/pages/goods/search-list?coupon_id=' + item.coupon_id)"
                  >
                    去使用
                  </button>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="he-goods-list" :style="[goodsStyle]" v-if="goodsSetting.recommend_showpage.pay_success.value">
        <he-products-featured></he-products-featured>
      </view>
    </template>
    <template v-for="(item, index) in popupsList">
      <taskpopups v-model="item.display" :title="item.remark" :index="index" :top="300"></taskpopups>
    </template>
    <!-- 开启分销商 且有条件 且不是分销商 -->
    <he-empty-popup
      v-if="showApplyPromoter"
      :empty-style="{ height: '146rpx', lineHeight: '146rpx' }"
      v-model="applyPromoter"
      confirm-text="立即申请"
      cancel-text="暂不申请"
      title="恭喜您！您已获得成为分销资格"
      @confirm="routerPromoter"
    ></he-empty-popup>
  </view>
</template>
<script>
import heProductsFeatured from '@/components/he-products-featured.vue';
import heLoading from '../../components/he-loading.vue';
import heEmptyPopup from '../../components/he-empty-popup.vue';
import { mapGetters } from 'vuex';
import taskpopups from '@/plugins/task/components/popups.vue';

export default {
  name: 'successful',
  components: {
    heProductsFeatured,
    heLoading,
    taskpopups,
    heEmptyPopup
  },
  data() {
    return {
      popupsList: [],
      totalAmount: 0,
      orderId: null,
      coupon: [],
      loading: true,
      applyPromoter: false
    };
  },
  computed: {
    ...mapGetters('setting', {
      goodsSetting: 'goodsSetting',
      promoterSetting: 'getPromoter'
    }),
    lineColor: function () {
      return {
        backgroundImage: `linear-gradient(to bottom, ${this.themeColor} 0%, ${this.themeColor} 50%, transparent 0%)`
      };
    },
    goodsStyle: function () {
      let style = {
        borderRadius: '16rpx 16rpx 0 0'
      };
      if (!this.$h.test.isEmpty(this.coupon)) {
        style.borderRadius = '0';
      }
      return style;
    },
    userInfo: function ({ $store }) {
      return $store.state.apply.userInfo;
    },
    showApplyPromoter({ promoterSetting, userInfo }) {
      return (
        promoterSetting.status &&
        promoterSetting.conditions.type !== 1 &&
        (userInfo.promoter_status === -1 || userInfo.promoter_status === -2 || userInfo.promoter_status === 0)
      );
    }
  },
  onLoad(options) {
    this.orderId = options.order_id;
    this.popupsList = [];
    let _this = this;
    Promise.all([this.getOrder(parseInt(options.order_id)), this.getCoupon(options.order_sn)])
      .then(function () {
        _this.loading = false;
        //执行积分任务信息
        _this.setTaskOrder();
        // 申请监测 分销商
        if (_this.showApplyPromoter) {
          _this.$heshop
            .promoter('get', {
              behavior: 'apply_check'
            })
            .then(response => {
              if (response.pay_show) {
                _this.applyPromoter = true;
              }
            });
        }
      })
      .catch(function () {
        _this.loading = false;
      });
  },
  methods: {
    /**
     * 获取绑定状态
     * @return {[type]} [description]
     */
    setTaskOrder() {
      if (this.$manifest('task', 'status')) {
        this.$heshop
          .plugin('get', { include: 'task', model: 'score', type: 'single', keyword: 'order', status: 0 })
          .then(res => {
            if (res && res.task && res.task.status) {
              this.popupsList.push({
                display: true,
                remark: res.remark
              });
              setTimeout(res => {
                this.popupsList = [];
              }, 5000);
            }
          });
        this.$heshop
          .plugin('get', { include: 'task', model: 'score', type: 'single', keyword: 'goods', status: 0 })
          .then(res => {
            if (res && res.task && res.task.status) {
              this.popupsList.push({
                display: true,
                remark: res.remark
              });
              setTimeout(res => {
                this.popupsList = [];
              }, 5000);
            }
          });
      }
    },
    switchTab: function () {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    redirectTo: function (url) {
      uni.redirectTo({
        url
      });
    },
    getOrder: function (id) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .order('get', id)
          .then(function (res) {
            _this.totalAmount = res.pay_amount;
            resolve();
          })
          .catch(function (error) {
            _this.$toError(error);
            reject();
          });
      });
    },
    // 获取购买商品获得的优惠券
    getCoupon: function (order_sn) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .coupon('get', {
            status: 0, // 默认可用
            behavior: 'user', // 用户自己的
            type: 'all', // 全部无分页
            order_sn //订单编号
          })
          .then(function (response) {
            _this.coupon = response;
            resolve();
          })
          .catch(function (error) {
            _this.$toError(error);
            reject();
          });
      });
    },
    // 满足申请条件 跳转到分销页面
    routerPromoter() {
      uni.redirectTo({
        url: '/promoter/pages/recruit'
      });
    }
  },
  filters: {
    setNumber: function (num) {
      return Number(num);
    }
  }
};
</script>
<style scoped lang="scss">
.he-page-content {
  background-color: #ffffff;
  overflow: hidden;
}

.he-header {
  width: 750px;
  background: #ffffff;
  padding: 0 20px;
}

.he-image {
  width: 156px;
  height: 156px;
  display: block;
  margin-right: 24px;
}

.he-text {
  margin-left: 24px;
}

.he-title {
  font-size: 36px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  line-height: 1.3;
  margin-bottom: 5px;
}

.he-total {
  font-size: 32px;
  font-family: DINPro;
  font-weight: bold;
  @include font_color('font_color');
  line-height: 1.3;
  margin-top: 5px;
}

.he-header__top {
  margin-top: 56px;
}

.he-header__bottom {
  margin-top: 48px;
  margin-bottom: 56px;
}

.he-coupon {
  width: 710px;
  max-height: 556px;
  background: #fdf5e1;
  border-radius: 16px;
  margin: 0 0 32px 0;
  padding-top: 20px;
  overflow: hidden;
}

.he-coupon-head {
  height: 56px;
  position: relative;
}

.he-coupon-head-text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #6b3713;
  z-index: 10;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.he-coupon-head-img {
  width: 100%;
  height: 56px;
  display: block;
}

.he-coupon-body {
  max-height: 452px;
  padding: 12px 20px 0px 20px;
  margin-bottom: 28px;
  overflow: hidden;

  .he-coupon-item {
    height: 160px;
    background: #ffffff;
    margin-bottom: 16px;
    border-radius: 16px;

    .he-coupon-left {
      width: 217px;
      border-top: 2px solid transparent;
      border-left: 2px solid transparent;
      border-bottom: 2px solid transparent;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      @include border_color('border_color');
      padding: 37px 0 35px 16px;
      text-align: center;

      .he-item-price {
        line-height: 52px;
        font-size: 50px;
        font-family: DIN-Bold;
        font-weight: Bold;
        @include font_color('font_color');
      }

      .he-item-price:before {
        content: '￥';
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        @include font_color('font_color');
        line-height: 14px;
      }

      .he-item-condition {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        @include font_color('font_color');
        line-height: 36px;
      }
    }

    .he-coupon-center {
      width: 16px;
      position: relative;
      overflow: hidden;

      .he-coupon-doc {
        width: 16px;
        height: 16px;
        position: absolute;
        border: 2px solid transparent;
        border-radius: 50%;
        background: #fdf5e1;
        @include border_color('border_color');
      }

      .he-coupon-doc:first-child {
        top: 0;
        transform: translateY(-50%);
      }

      .he-coupon-doc:nth-child(2) {
        bottom: 0;
        transform: translateY(50%);
      }

      .he-border-line {
        position: absolute;
        height: 132px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        background-size: 1px 14px;
        background-repeat: repeat-y;
      }
    }

    .he-coupon-right {
      width: 437px;
      border-top: 2px solid transparent;
      border-right: 2px solid transparent;
      border-bottom: 2px solid transparent;
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      @include border_color('border_color');

      .he-right-left {
        width: 297px;
        padding: 43px 11px 41px 32px;

        .he-item-name {
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
          line-height: 40px;
          margin-bottom: 4px;
        }

        .he-item-prompt {
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #999999;
          line-height: 28px;
          margin-top: 4px;
        }
      }

      .he-right-right {
        width: 140px;

        .he-cu-btn {
          width: 126px;
          height: 48px;
          border-radius: 24px;
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          padding: 0;
        }

        .he-left-right_btn {
          color: #ffffff;
          @include background_color('background_color');
        }

        .he-right-right_btn {
          border: 1px solid transparent;
          @include font_color('font_color');
          @include border_color('border_color');
          background-color: #ffffff;
        }
      }
    }
  }
}

.cu-btn {
  width: 190px;
  height: 64px;
  border-radius: 32px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  background-color: #ffffff;
}

.cu-btn:first-child {
  border: 1px solid #cccccc;
  color: #222222;
  margin-right: 20px;
}

.cu-btn:last-child {
  border-style: solid;
  border-width: 1px;
  @include font_color('font_color');
  @include border_color('border_color');
  margin-left: 20px;
}

.he-goods-list {
  background-color: #f5f5f5;
  overflow: hidden;
}
</style>
