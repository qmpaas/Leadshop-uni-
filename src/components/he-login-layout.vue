<template>
  <view class="" :data-theme="theme">
    <he-popup v-model="showModal" mode="center" :border-radius="16" :zoom="false" width="590rpx" height="746rpx">
      <view class="he-login-box flex flex-direction align-center">
        <image class="login-bg" :src="ipAddress + '/login-model-bg.png'"></image>
        <view class="title">请授权微信登录</view>
        <view class="assist-text">以便我们为您提供更好的服务</view>
        <!-- #ifndef H5 -->
        <button v-if="canIUseGetUserProfile" class="cu-btn" @click="login">微信一键授权登录</button>
        <button v-else class="cu-btn" open-type="getUserInfo" @getuserinfo="login">微信一键授权登录</button>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <button class="cu-btn" @click="decryptUserInfo">微信一键授权登录</button>
        <!-- #endif -->
        <view class="assist-text" @click="notLogIn">暂不登录</view>
      </view>
    </he-popup>
    <user-newuser-coupon
      v-model="isNewuser"
      :coupon="userInfo.register && userInfo.register.coupon_list"
    ></user-newuser-coupon>
  </view>
</template>

<script>
import hePopup from './he-popup.vue';
import { mapActions } from 'vuex';
import userNewuserCoupon from './user-newuser-coupon.vue';

export default {
  name: 'he-login-model',
  components: {
    hePopup,
    userNewuserCoupon
  },
  data() {
    return {
      isNewuser: false
    };
  },
  computed: {
    showModal: {
      get({ $store }) {
        return $store.state.apply.showLoginModel;
      },
      set(value) {
        this.$store.commit('apply/setLoginModel', value);
      }
    },
    // #ifndef H5
    canIUseGetUserProfile: function () {
      return uni.canIUse('getUserProfile');
    },
    // #endif
    userInfo: function () {
      return this.$store.state.apply.userInfo;
    }
  },
  methods: {
    ...mapActions({
      decryptUserInfo: 'user/decryptUserInfo',
      getUserProfile: 'user/getUserProfile'
    }),
    notLogIn() {
      this.$store.commit('apply/setLoginModel', false);
    },
    login: function () {
      if (this.canIUseGetUserProfile) {
        this.getUserProfile().then(() => {
          if (!this.$h.test.isEmpty(this.userInfo?.register.coupon_list)) {
            this.isNewuser = true;
          } else {
          }
          setTimeout(() => {
            let index = this.$store.getters['setting/getCartIndex'];
            this.$store.dispatch('cart/getCartNumber').then(response => {
              if (response !== 0) {
                uni.setTabBarBadge({
                  index: index,
                  text: response + ''
                });
              } else {
                uni.removeTabBarBadge({
                  index: index
                });
              }
            });
          }, 1000);
          this.$store.commit('apply/setLoginModel', false);
          if (this.$parent.__route__ === 'pages/user/index' || this.$parent.__route__ === 'pages/cart/index') {
            this.$parent.getShowData();
          }
          const promoterUid = uni.getStorageSync('promoterUid');
          if (promoterUid) {
            this.$store.dispatch('plugins/bindPromoterSuperior', { parent_id: promoterUid }).then(() => {
              uni.removeStorageSync('promoterUid');
            });
          }
        });
      } else {
        this.decryptUserInfo().then(() => {
          if (!this.$h.test.isEmpty(this.userInfo.register.coupon_list)) {
            this.isNewuser = true;
          } else {
          }
          setTimeout(() => {
            let index = this.$store.getters['setting/getCartIndex'];
            this.$store.dispatch('cart/getCartNumber').then(response => {
              if (response !== 0) {
                uni.setTabBarBadge({
                  index: index,
                  text: response + ''
                });
              } else {
                uni.removeTabBarBadge({
                  index: index
                });
              }
            });
          }, 1000);
          this.$store.commit('apply/setLoginModel', false);
          if (this.$parent.__route__ === 'pages/user/index' || this.$parent.__route__ === 'pages/cart/index') {
            this.$parent.getShowData();
          }
          const promoterUid = uni.getStorageSync('promoterUid');
          if (promoterUid) {
            this.$store.dispatch('plugins/bindPromoterSuperior', { parent_id: promoterUid }).then(() => {
              uni.removeStorageSync('promoterUid');
            });
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.he-login-box {
  padding: 80px 87px 51px 87px;
  height: 100%;

  .title {
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
    line-height: 32px;
    margin-top: 64px;
    margin-bottom: 24px;
  }

  .login-bg {
    width: 416px;
    height: 280px;
  }

  .cu-btn {
    width: 420px;
    height: 80px;
    border-radius: 40px;
    @include background_color('background_color');
    margin-top: 40px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 43px;
  }

  .assist-text {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
    line-height: 26px;
  }
}
</style>
