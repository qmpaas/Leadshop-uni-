<template>
  <view class="user-coupon" @click="navigateTo">
    <view class="he-coupon-content flex justify-between">
      <view class="flex align-center">
        <image
          :src="ipAddress + '/user-coupon-icon.png'"
          class="he-coupon-image"
        ></image>
        <text class="he-text he-left-text">优惠券</text>
      </view>
      <view class="flex align-center">
        <text class="he-text he-right-text">共{{couponTotal}}张可用</text>
        <text class="iconfont iconbtn_arrow"></text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "user-coupon",
  methods: {
    navigateTo: function () {
      uni.navigateTo({
        url: "/pages/coupon/index",
      });
    },
  },
  computed: {
    ...mapGetters({
      couponTotal: "user/couponTotal",
    }),
  },
};
</script>

<style scoped lang="scss">
.user-coupon {
  position: relative;
  margin: -94px 20px 0 20px;
  padding: 20px 0;
  background: #ffffff;
  border-radius: 16px;
  .he-coupon-content {
    height: 80px;
    padding: 0 20px 0 32px;
    .he-coupon-image {
      width: 56px;
      height: 56px;
      margin-right: 16px;
    }
    .he-text {
      font-family: PingFang SC;
    }
    .he-left-text {
      font-size: 28px;
      font-weight: 500;
      color: #222222;
    }
    .he-right-text {
      font-size: 24px;
      font-weight: 400;
      color: #999999;
    }
    .iconbtn_arrow {
      font-size: 22px;
      margin-left: 9px;
    }
  }
}
</style>