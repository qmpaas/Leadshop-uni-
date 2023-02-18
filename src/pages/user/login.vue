<template>
  <view class="he-page-content" :data-theme="theme">
    <image class="he-background__box" :src="ipAddress + '/login-background-login.png'"></image>
    <view class="he-background__box he-content flex flex-direction align-center">
      <image class="he-icon" :src="storeSetting.logo" mode="aspectFit"></image>
      <view class="he-text">请授权微信登录</view>
      <view class="he-other__text"> 以便我们为您提供更好的服务 </view>
      <!-- #ifndef H5 -->
      <button v-if="canIUseGetUserProfile" class="cu-btn he-login" @click="login">微信一键授权登录</button>
      <button v-else class="cu-btn he-login" open-type="getUserInfo" @getuserinfo="login">微信一键授权登录</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button class="cu-btn he-login" @click="decryptUserInfo">微信一键授权登录</button>
      <!-- #endif -->
      <button class="cu-btn he-out" @click="notLogin">暂不登录</button>
    </view>
    <user-newuser-coupon
      v-model="isNewuser"
      :coupon="userInfo.register && userInfo.register.coupon_list"
    ></user-newuser-coupon>
  </view>
</template>
<script>
import { mapActions } from 'vuex';
import userNewuserCoupon from '../../components/user-newuser-coupon.vue';

export default {
  name: 'login',
  components: { userNewuserCoupon },
  data() {
    return {
      isNewuser: false
    };
  },
  methods: {
    ...mapActions({
      decryptUserInfo: 'user/decryptUserInfo',
      getUserProfile: 'user/getUserProfile'
    }),
    notLogin: function () {
      if (getCurrentPages().length === 1) {
        uni.reLaunch({ url: '/pages/index/index' });
      } else {
        uni.navigateBack({ delta: 1 });
      }
    },
    login: function () {
      if (this.canIUseGetUserProfile) {
        this.getUserProfile().then(() => {
          if (!this.$h.test.isEmpty(this.userInfo.register.coupon_list)) {
            this.isNewuser = true;
          } else {
            uni.navigateBack({
              delta: 1,
              fail() {
                uni.switchTab({
                  url: '/pages/index/index'
                });
              }
            });
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
        });
      } else {
        this.decryptUserInfo().then(() => {
          if (!this.$h.test.isEmpty(this.userInfo.register.coupon_list)) {
            this.isNewuser = true;
          } else {
            uni.navigateBack({
              delta: 1,
              fail() {
                uni.switchTab({
                  url: '/pages/index/index'
                });
              }
            });
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
        });
      }
    }
  },
  computed: {
    // #ifndef H5
    canIUseGetUserProfile: function () {
      return uni.canIUse('getUserProfile');
    },
    // #endif
    userInfo: function () {
      return this.$store.state.apply.userInfo;
    }
  }
};
</script>
<style scoped lang="scss">
.he-page-content {
  background: #ffffff;
}

.he-background__box {
  width: 100%;
  height: 960px;
}

.he-icon {
  width: 180px;
  height: 180px;
}

.he-content {
  position: absolute;
  top: 0;
  padding-top: 160px;
}

.cu-btn {
  width: 560px;
  height: 80px;
  border-radius: 40px;
  font-family: PingFang SC;
  font-weight: 500;
}

.he-out {
  background: #ffffff;
  font-size: 28px;
  font-weight: 500;
  color: #999999;
  margin-top: 16px;
}

.he-login {
  font-size: 30px;
  color: #ffffff;
  @include background_color('background_color');
  margin-top: 88px;
}

.he-text {
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-top: 64px;
}

.he-other__text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  margin-top: 24px;
}
</style>
