<template>
  <view class="user-features">
    <!--#ifndef H5-->
    <button
      v-if="!mobile && isLogin"
      class="he-item he-item__btn flex justify-between"
      open-type="getPhoneNumber"
      hover-class=""
      @getphonenumber="getPhoneNumber"
    >
      <view class="flex">
        <view class="iconfont iconpersonalcenter_phone"></view>
        <text class="he-text">绑定手机号</text>
      </view>
      <view class="task-user-tips">{{ binding.remark || '' }}</view>
      <view class="iconfont iconbtn_arrow"></view>
    </button>
    <view class="he-item flex justify-between" v-else @click="bindPhone">
      <view class="flex">
        <view class="iconfont iconpersonalcenter_phone"></view>
        <text class="he-text">绑定手机号</text>
      </view>
      <view class="flex">
        <!-- <text class="he-mobile" v-if="mobile">{{ mobile }}</text> -->
        <view class="iconfont iconbtn_arrow"></view>
      </view>
    </view>
    <!--#endif-->
    <!--#ifdef H5-->
    <view class="he-item flex justify-between" @click="bindPhone">
      <view class="flex">
        <view class="iconfont iconpersonalcenter_address"></view>
        <text class="he-text">绑定手机号</text>
      </view>
      <view class="flex">
        <view class="task-user-tips" v-if="!mobile"> {{ binding.remark || '' }}</view>
        <text class="he-mobile" v-if="mobile">{{ mobile }}</text>
        <view class="iconfont iconbtn_arrow"></view>
      </view>
    </view>
    <!--#endif-->
    <view class="he-item flex justify-between" @click="navigateTo('/pages/user/shipping-address')">
      <view class="flex">
        <view class="iconfont iconpersonalcenter_address"></view>
        <text class="he-text">收货地址</text>
      </view>
      <view class="iconfont iconbtn_arrow"></view>
    </view>
    <template v-if="isLogin">
      <view class="he-item flex justify-between" @click="navigateTo('/plugins/task/userinfo')">
        <view class="flex">
          <view class="iconfont iconpersonalcenter_information"></view>
          <text class="he-text">个人信息</text>
        </view>
        <view class="task-user-tips"> {{ perfect.remark || '' }}</view>
        <view class="iconfont iconbtn_arrow"></view>
      </view>
      <view v-if="promoterShow" class="he-item flex justify-between" @click="routePromoter">
        <view class="flex">
          <view class="iconfont icona-personalcenter_distribution"></view>
          <text class="he-text">分销商中心</text>
        </view>
        <view class="iconfont iconbtn_arrow"></view>
      </view>
      <view v-if="recruitingShow" class="he-item flex justify-between" @click="routerRecruit">
        <view class="flex">
          <view class="iconfont icona-personalcenter_distribution"></view>
          <text class="he-text">分销商招募令</text>
        </view>
        <view class="iconfont iconbtn_arrow"></view>
      </view>
    </template>
    <view class="he-item flex justify-between" @click="clearStorage">
      <view class="flex">
        <view class="iconfont iconpersonalcenter_clearcache"></view>
        <text class="he-text">清除缓存</text>
      </view>
      <view class="iconfont iconbtn_arrow"></view>
    </view>
    <view class="he-item flex justify-between"
          v-if="storeSetting.contact.phone.bool && storeSetting.contact.phone.value" @click="isHeTell = true">
      <view class="flex">
        <view class="iconfont iconpersonalcenter_phone2"></view>
        <view class="he-content-text">
          <view class="he-text">电话客服</view>
          <view class="he-time" v-if="isEmpty(storeSetting.contact.phone)">{{ storeSetting.contact.phone.time }}</view>
        </view>
      </view>
      <view class="iconfont iconbtn_arrow"></view>
    </view>
    <!-- #ifndef H5 -->
    <button
      open-type="contact"
      class="he-item flex justify-between he-item__btn"
      v-if="storeSetting.contact.online.bool"
    >
      <view class="flex">
        <view class="iconfont iconpersonalcenter_contactus"></view>
        <view class="he-content-text">
          <view class="he-text">在线客服</view>
          <view class="he-time" v-if="isEmpty(storeSetting.contact.online)"
          >{{ storeSetting.contact.online.time }}
          </view>
        </view>
      </view>
      <view class="iconfont iconbtn_arrow"></view>
    </button>
    <!-- #endif -->
    <view class="he-item flex justify-between" v-if="storeSetting.contact.friend.bool" @click="isQrcode = true">
      <view class="flex">
        <view class="iconfont iconpersonalcenter_add"></view>
        <view class="he-content-text">
          <view class="he-text">加好友联系</view>
          <view class="he-time" v-if="isEmpty(storeSetting.contact.friend)"
          >{{ storeSetting.contact.friend.time }}
          </view>
        </view>
      </view>
      <view class="iconfont iconbtn_arrow"></view>
    </view>
    <he-tell v-if="storeSetting.contact.phone.bool && storeSetting.contact.phone.value" v-model="isHeTell"
             :phone-number="storeSetting.contact && storeSetting.contact.phone.value"></he-tell>
    <user-qrcode v-model="isQrcode"></user-qrcode>
    <!--清理缓存-->
    <he-clear-storage v-model="isClear"></he-clear-storage>
    <!--绑定手机-->
    <user-bind-phone v-model="isBind"></user-bind-phone>
    <template v-for="(item, index) in popupsList">
      <taskPopups :key="index" v-model="item.display" :title="item.remark" :index="index"/>
    </template>
  </view>
</template>
<script>
import userQrcode from './user-qrcode.vue';
import heClearStorage from '@/components/he-clear-storage.vue';
import userBindPhone from './user-bind-phone.vue';
import heTell from '@/components/he-tell.vue';
import taskPopups from './../../../plugins/task/components/popups.vue';
import {mapGetters} from 'vuex';

export default {
  name: 'user-features',
  components: {
    userQrcode,
    heClearStorage,
    userBindPhone,
    heTell,
    taskPopups
  },
  computed: {
    // 获取绑定手机号码
    mobile: function () {
      let data = this.$store.state.apply.userInfo.mobile;
      if (!data) return null;
      data = data + '';
      if (data) {
        this.getTaskBinding();
      }
      return data
        ? data.match(/(\d{3})(\d{4})(\d{4})/).slice(1).reduce(function (value, item, index) {
            return index === 1 ? value + '****' : value + item;
          })
        : null;
    },
    recruitingShow({$store}) {
      return $store.state.apply.userInfo.recruiting_show === 1;
    },
    promoterShow({$store}) {
      const promoter_show = $store.state.apply.userInfo.promoter_show;
      return promoter_show === 1 || promoter_show === 2;
    },
    ...mapGetters('setting', {
      // 获取分销设置
      promoterSetting: 'getPromoter'
    })
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  data() {
    return {
      isQrcode: false,
      isTell: false,
      isClear: false,
      isHeTell: false,
      isBind: false,
      perfect: {},
      binding: {},
      popupsList: [],
      is_binding: false
    };
  },
  methods: {
    handleLoad() {
      this.popupsList = [];
      this.statusTaskBinding();
      this.statusTaskPerfect();
    },
    /**
     * 签到列表计算
     * @return {[type]} [description]
     */
    statusTaskBinding() {
      //判断当前任务是否打开
      this.$heshop.plugin('get', {include: 'task', model: 'task', keyword: 'binding'}).then(res => {
        if (res.status) {
          this.getTaskBinding(res);
        }
      });
    },
    /**
     * 获取获取设置状态
     * @return {[type]} [description]
     */
    getTaskBinding(e = {}) {
      //用于单次提示
      const value = uni.getStorageSync('statusTaskBinding');
      if (value) {
        return true;
      }
      this.$heshop
        .plugin('get', {include: 'task', model: 'score', type: 'single', keyword: 'binding', today: 0})
        .then(res => {
          //判断如果存在的状态下
          if (res && res.status === 0 && !this.is_binding) {
            this.binding = {};
            this.is_binding = true;
            this.popupsList.push({
              display: true,
              remark: res.remark
            });
            this.$parent.handleLoadData();
            uni.setStorageSync('statusTaskBinding', 1);
          } else if (res && res.status === 1) {
            this.binding = {};
            uni.setStorageSync('statusTaskBinding', 1);
          } else {
            //如果没有记录的状态下
            this.binding = e;
            this.setTaskBinding();
          }
        });
    },
    /**
     * 获取绑定状态
     * @return {[type]} [description]
     */
    setTaskBinding() {
      if (this.mobile) {
        this.$heshop
          .plugin(
            'post',
            {include: 'task', model: 'task'},
            {
              number: this.mobile,
              keyword: 'binding'
            }
          )
          .then(res => {
            if (res && res.msg) {
              this.getTaskBinding();
              // this.popupsList.push({
              //   display: true,
              //   remark: res.msg
              // })
              // uni.setStorageSync('statusTaskBinding', 1);
            }
          });
      }
    },
    /**
     * 执行用户绑定处理
     * @return {[type]} [description]
     */
    statusTaskPerfect() {
      let that = this;
      //判断当前任务是否打开
      that.$heshop.plugin('get', {include: 'task', model: 'task', keyword: 'perfect'}).then(res => {
        if (res.status) {
          // const value = uni.getStorageSync('statusTaskPerfect');
          // 逻辑有问题
          // if (!value) {
          //   this.perfect = res;
          // }
          this.getTaskPerfect(res);
        }
      });
    },
    /**
     * 获取获取设置状态
     * @return {[type]} [description]
     */
    getTaskPerfect(e = {}) {
      //用于单次提示
      const value = uni.getStorageSync('statusTaskPerfect');
      if (value) {
        return true;
      }
      this.$heshop
        .plugin('get', {include: 'task', model: 'score', type: 'single', keyword: 'perfect', today: 0})
        .then(res => {
          //判断如果存在的状态下
          if (res && res.status === 0) {
            this.perfect = {};
            this.popupsList.push({
              display: true,
              remark: res.remark
            });
            this.$parent.handleLoadData();
            uni.setStorageSync('statusTaskPerfect', 1);
          } else if (res && res.status === 1) {
            this.perfect = {};
            uni.setStorageSync('statusTaskPerfect', 1);
          } else {
            //如果没有记录的状态下
            this.perfect = e;
            this.setTaskPerfect();
          }
        });
    },
    /**
     * 获取绑定状态
     * @return {[type]} [description]
     */
    setTaskPerfect() {
      this.$heshop
        .plugin(
          'post',
          {include: 'task', model: 'task'},
          {
            number: 1,
            keyword: 'perfect'
          }
        )
        .then(res => {
          if (res && res.msg) {
            this.getTaskPerfect();
            // this.popupsList.push({
            //   display: true,
            //   remark: res.msg
            // });
            // this.$parent.handleLoadData();
            // this.perfect = {};
            // uni.setStorageSync('statusTaskPerfect', 1);
          }
        });
    },
    // 跳转
    navigateTo: function (url) {
      uni.navigateTo({url: url});
    },
    //  清理缓存
    clearStorage: function () {
      this.isClear = true;
    },
    bindPhone: function () {
      if (this.isLogin) {
        if (this.mobile) {
          this.isBind = true;
        } else {
          this.navigateTo('/pages/user/bind-phone');
        }
      } else {
        // #ifdef H5
        this.$store.commit('apply/setLoginModel', true);
        // #endif
      }
    },
    // #ifndef H5
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
                  })
                  .catch(function (err) {
                    _this.$toError(err);
                  });
              }, 800);
            } else {
              _this.$toError(res);
            }
          }
        });
      } else if (errMsg === 'getPhoneNumber:fail user deny') {
      }
    },
    // #endif
    isEmpty: function (data) {
      return !this.$h.test.isEmpty(data.time);
    },
    // 跳转分销中心
    routePromoter() {
      // 全部开放分销中心入口 还不是分销商
      if (this.$store.state.apply.userInfo.promoter_show === 2) {
        uni.navigateTo({
          url: '/promoter/pages/recruit'
        });
      } else {
        uni.navigateTo({
          url: '/promoter/pages/index'
        });
      }
    },
    routerRecruit() {
      const {promoter_status} = this.$store.state.apply.userInfo;
      // 1 已经申请在审核中 3 已拒绝
      if ((promoter_status === 1 || promoter_status === 3) && this.promoterSetting.status !== 0) {
        uni.navigateTo({
          url: '/promoter/pages/apply'
        });
      } else {
        uni.navigateTo({
          url: '/promoter/pages/recruit'
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.task-user-tips {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #e60b30;
  line-height: 78px;
  width: 50%;
  z-index: 1;
  position: absolute;
  right: 70px;
  text-align: right;
}

.user-features {
  margin: 20px 20px 0 20px;
  padding: 20px 0;
  background: #ffffff;
  border-radius: 16px;
}

.he-item {
  line-height: 80px;
  padding: 0 24px;

  .he-content-text {
    .he-text {
      text-align: left;
    }
  }

  .he-time {
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #8c8c8c;
    line-height: 1.2;
    margin-top: -10px;
    padding-left: 20px;
  }
}

.iconbtn_arrow {
  font-size: 22px;
}

.iconpersonalcenter_contactus,
.iconpersonalcenter_clearcache,
.iconpersonalcenter_phone,
.iconpersonalcenter_address,
.iconpersonalcenter_phone2,
.iconpersonalcenter_information,
.iconpersonalcenter_add,
.icona-personalcenter_distribution {
  font-size: 28px;
  color: #d7d7d7;
}

.he-text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-left: 20px;
}

/*#ifndef H5*/
.he-item__btn {
  background-color: #ffffff;
}

.he-item__btn:after {
  display: none;
}

/*#endif*/
.he-mobile {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  margin-right: 14px;
}
</style>
