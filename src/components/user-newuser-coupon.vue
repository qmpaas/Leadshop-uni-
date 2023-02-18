<!--
 * @Description: 新用户领取优惠券
 * @Author: fjt
 * @Date: 2021-06-05 14:29:30
 * @LastEditTime: 2021-06-05 17:02:18
 * @LastEditors: fjt
-->
<template>
  <he-popup mode="center" v-model="showModal" background-color="transparent" :zoom="false" width="100%" height="100%">
    <view @touchmove.stop.prevent="() => {}" class="le-popup">
      <view class="he-box">
        <view class="he-box__close flex align-center justify-center" @click="closeModal">
          <text class="iconfont iconpopup_close"></text>
        </view>
        <image class="le-box-image" :src="ipAddress + '/login-newuser-coupon.png'" />
        <view class="le-content">
          <scroll-view scroll-y class="le-body">
            <view class="he-item flex" v-for="(item, key) in coupon" :key="key">
              <view class="he-left">
                <view class="le-price">{{ item.coupon.sub_price | setNumber }}</view>
                <view class="le-limit">
                  <template v-if="Number(item.coupon.min_price) > 0">
                    满{{ Number(item.coupon.min_price) }}可用
                  </template>
                  <template v-else> 无门槛使用 </template>
                </view>
              </view>
              <view class="he-center">
                <view class="he-dot"></view>
                <view class="he-line"></view>
                <view class="he-dot"></view>
              </view>
              <view class="le-right flex-sub">
                <view class="le-name">{{ item.coupon.name }}</view>
                <view class="le-desc">{{ item.coupon.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}</view>
              </view>
            </view>
          </scroll-view>
          <view class="le-footer">优惠券已发放，请在优惠券账户查看</view>
        </view>
      </view>
    </view>
  </he-popup>
</template>

<script>
import HePopup from '@/components/he-popup';

export default {
  props: {
    value: Boolean,
    coupon: Array,
    // #ifdef H5
    wechatUrl: String
    // #endif
  },
  components: { HePopup },
  computed: {
    showModal: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    }
  },
  filters: {
    setNumber: function (num) {
      return Number(num);
    }
  },
  methods: {
    closeModal: function () {
      const _this = this;
      this.showModal = false;
      // #ifndef H5
      uni.navigateBack({
        delta: 1
      });
      // #endif
      // #ifdef H5
      uni.redirectTo({
        url: _this.wechatUrl,
        fail() {
          uni.switchTab({
            url: _this.wechatUrl
          });
        }
      });
      // #endif
    }
  }
};
</script>

<style lang="scss" scoped>
.le-popup {
  width: 100%;
  height: 100%;
}
.he-box {
  width: 660px;
  height: 804px;
  // #ifdef H5
  margin: 10vh auto 0 auto;
  // #endif
  //#ifndef H5
  margin: 15vh auto 0 auto;
  // #endif
  position: relative;
}
.he-box__close {
  width: 52px;
  height: 52px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: -84px;
}
.iconpopup_close {
  font-size: 20px;
  color: #ffffff;
}
.le-box-image {
  height: 252px;
  width: 100%;
  display: block;
}
.le-content {
  width: 630px;
  margin: 0 auto;
  background: #ee4444;
  border-radius: 0 0 16px 16px;
  padding: 32px 32px 0 32px;
  .le-body {
    min-height: 160px;
    max-height: 440px;
  }
  .he-item {
    height: 160px;
    margin-bottom: 16px;
  }
  .he-left {
    width: 217px;
    height: 100%;
    background: #fff;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    padding-left: 17px;
    text-align: center;
    .le-price {
      font-size: 66px;
      font-family: PingFang SC;
      font-weight: Bold;
      color: #e60b30;
      line-height: 52px;
      margin-top: 37px;
    }
    .le-price::before {
      content: '￥';
      font-size: 24px;
      font-weight: 500;
    }
    .le-limit {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #e60b30;
      line-height: 36px;
    }
  }
  .he-center {
    width: 16px;
    height: 100%;
    position: relative;
    background-color: #fff;
    .he-dot {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #ee4444;
    }
    .he-dot:first-child {
      top: 0;
      transform: translateY(-50%);
    }
    .he-dot:last-child {
      bottom: 0;
      transform: translateY(50%);
    }
    .he-line {
      width: 2px;
      height: 96%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-position: center;
      background-size: 2px 14px;
      background-repeat: repeat-y;
      background-image: linear-gradient(to top, #ee4444 0%, #ee4444 50%, transparent 0%);
    }
  }
  .le-right {
    height: 100%;
    background: #fff;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    padding-left: 32px;
    font-weight: 500;
    font-family: PingFang SC;
    .le-name {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 40px;
      margin-top: 43px;
    }
    .le-desc {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 28px;
      margin-top: 5px;
    }
  }
  .le-footer {
    height: 80px;
    line-height: 80px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #fefefe;
    text-align: center;
  }
}
</style>
