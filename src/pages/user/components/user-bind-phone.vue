<!--
 * @Author: fjt
 * @Date: 2021-05-16 17:54:36
 * @LastEditors: fjt
 * @LastEditTime: 2021-06-14 20:49:37
-->
<template>
  <he-popup v-model="showModal" mode="bottom" :border-radius="16">
    <view class="user-bind-phone flex flex-direction">
      <button class="cu-btn he-bind__item" @click="unBind">解绑该手机号</button>
      <!-- #ifdef H5 -->
      <button class="cu-btn he-bind__item" @click="navigateTo">更换绑定手机号</button>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <button class="cu-btn he-bind__item" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
        更换绑定手机号
      </button>
      <!-- #endif -->
      <button class="cu-btn he-bind__item" @click="showModal = false">取消</button>
    </view>
  </he-popup>
</template>
<script>
import HePopup from '@/components/he-popup';

export default {
  name: 'user-bind-phone',
  props: {
    value: Boolean
  },
  components: {
    HePopup
  },
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
  methods: {
    navigateTo: function () {
      uni.navigateTo({
        url: '/pages/user/bind-phone'
      });
      this.showModal = false;
    },
    unBind: function () {
      let _this = this;
      this.$heshop
        .users('put', {
          behavior: 'removeMobile'
        })
        .then(function () {
          _this.$h.toast('解绑手机号成功');
          _this.$store.state.apply.userInfo.mobile = '';
          let userInfo = uni.getStorageSync('userInfo');
          userInfo.mobile = '';
          uni.setStorageSync('userInfo', userInfo);
          _this.showModal = false;
        })
        .catch(function (error) {
          _this.$toError(error);
          _this.showModal = false;
        });
    },
    getPhoneNumber: function (e) {
      let _this = this;
      let errMsg = e.detail.errMsg;
      if (errMsg === 'getPhoneNumber:ok') {
        uni.login({
          success(res) {
            if (res.code) {
              setTimeout(function () {
                _this.$heshop
                  .users(
                    'put',
                    {
                      behavior: 'bindMobile'
                    },
                    {
                      code: res.code,
                      encryptedData: e.detail.encryptedData,
                      iv: e.detail.iv
                    }
                  )
                  .then(function (res) {
                    _this.$store.state.apply.userInfo.mobile = res.mobile;
                    let userInfo = uni.getStorageSync('userInfo');
                    userInfo.mobile = res.mobile;
                    uni.setStorageSync('userInfo', userInfo);
                    _this.showModal = false;
                  })
                  .catch(function (err) {
                    _this.$toError(err);
                    _this.showModal = false;
                  });
              }, 800);
            } else {
              _this.$toError(res);
            }
          }
        });
      } else if (errMsg === 'getPhoneNumber:fail user deny') {
      }
    }
  }
};
</script>
<style scoped>
.user-bind-phone {
  background-color: RGBA(245, 245, 245, 1);
}

.he-bind__item {
  height: 104px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  background-color: #ffffff;
}

.he-bind__item:first-child {
  border-bottom: 1px solid #e5e5e5;
  padding-top: 16px;
  height: 120px;
}

.he-bind__item:last-child {
  margin-top: 16px;
}
</style>
