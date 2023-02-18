<template>
  <view class="he-page-content">
    <view class="le-content">
      <userTop />
      <view class="user-task" v-if="isLogin">
        <view class="user-task_item" @click="navToTask">
          <view>
            <text class="user-task_item__title">
              {{ userTask.number }}
            </text>
            <text class="user-task_item__unit">
              {{ taskTips }}
            </text>
          </view>
          <view class="user-task_item__tips" v-if="taskTipsShow">
            {{ taskTipsShow }}
          </view>
          <view class="user-task_item__explain" v-else> 积分 </view>
          <img src="@/static/img/task_score_icon.png" class="user-task_icon" />
        </view>
        <view class="user-task_item" @click="navToCoupon">
          <view>
            <text class="user-task_item__title">
              {{ couponTotal }}
            </text>
          </view>
          <view class="user-task_item__explain"> 优惠券 </view>
          <img src="@/static/img/task_coupon_icon.png" class="user-task_icon" />
        </view>
      </view>
      <userMyOrder />
      <userFeatures ref="features" />
      <heProductsFeatured v-if="goodsSetting.recommend_showpage.personal_center.value" />
    </view>
    <template v-for="(item, index) in popupsList">
      <taskPopups :key="index" v-model="item.display" :title="item.remark" :index="index" />
    </template>
    <he-copyright></he-copyright>
    <HeLoginModel />
    <HeInformationModel />
  </view>
</template>

<script>
import userTop from './components/user-top.vue';
import userCoupon from './components/user-coupon.vue';
import userMyOrder from './components/user-my-order.vue';
import userFeatures from './components/user-features.vue';
import heProductsFeatured from '../../components/he-products-featured.vue';
import heCopyright from './components/he-copyright.vue';
import taskPopups from '../../plugins/task/components/popups.vue';
import { mapActions, mapGetters } from 'vuex';
import HeLoginModel from '../../components/he-login-layout.vue';
import HeInformationModel from '../../components/he-information-layout.vue';

export default {
  components: {
    userTop,
    userMyOrder,
    userFeatures,
    heProductsFeatured,
    heCopyright,
    userCoupon,
    taskPopups,
    HeLoginModel,
    HeInformationModel,
  },
  data() {
    return {
      binding: {},
      perfect: {
        remark: ''
      },
      is_binding: false,
      is_perfect: false,
      userTask: {
        number: 0
      },
      taskTips: '',
      taskNumber: 0,
      signNumber: 0,
      /**
       * 以下两个参数
       * @type {Object}
       */
      popupsList: []
    };
  },
  onLoad() {
    let _this = this;
    // #ifdef H5
    let userInfo = uni.getStorageSync('userInfo');
    if (userInfo && userInfo.mobile) {
      _this.$store.state.apply.userInfo.mobile = userInfo.mobile;
    }
    // #endif
    
  },
  computed: {
    ...mapGetters({
      goodsSetting: 'setting/goodsSetting',
      couponTotal: 'user/couponTotal'
    }),
    /**
     * 处理底部信息显示与不显示
     * @return {[type]} [description]
     */
    taskTipsShow() {
      if (this.taskNumber) {
        this.taskTips = '积分';
        return this.taskNumber + '积分待领取';
      }
      if (this.signNumber) {
        this.taskTips = '积分';
        return '签到+' + this.signNumber + '积分';
      }
      this.taskTips = '';
      return false;
    },
  },
  methods: {
    ...mapActions({
      getOrderTotal: 'user/getOrderTotal',
      getCouponTotal: 'user/getCouponTotal',
      setCartNumber: 'cart/setCartNumber'
    }),
    navToCoupon: function () {
      uni.navigateTo({
        url: '/pages/coupon/index'
      });
    },
    navToTask() {
      uni.navigateTo({
        url: '/plugins/task/index'
      });
    },
    /**
     * 处理新用户邀请的
     * @return {[type]} [description]
     */
    handleTaskInvite() {
      if (this.isLogin) {
        //获取邀请记录
        const value = uni.getStorageSync('taskInviteLog');
        //判断邀请记录是否存在
        if (value) {
          try {
            let data = JSON.parse(value);
            //判断用户的创建时间必须大于缓存时间
            if (this.$store.state.apply.userInfo.created_time > data['task_time']) {
              this.$store.dispatch('plugins/onInvite', { UID: data['task_uid'] });
            }
          } catch (err) {
            //  Don't do
          }
        }
      }
    },
    /**
     * 执行用户数据加载
     * @return {[type]} [description]
     */
    handleLoadData() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'user' })
        .then(res => {
          this.userTask = res;
          this.handleTaskLog();
        })
        .catch(() => { });
    },
    /**
     * 获取日志
     * @return {[type]} [description]
     */
    handleTaskLog() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'score' })
        .then(res => {
          let taskNumber = 0;
          for (let index in res) {
            let item = res[index];
            taskNumber += item.number;
          }
          this.taskNumber = taskNumber;
        })
        .catch(() => { });
    },
    /**
     * 获取日志
     * @return {[type]} [description]
     */
    handleTaskSign() {
      let that = this;
      //获取签到任务
      that.$heshop.plugin('get', { include: 'task', model: 'task', keyword: 'signin' }).then(res => {
        if (res.status) {
          /**
           * 处理数据
           * @param  {[type]} res [description]
           * @return {[type]}     [description]
           */
          that.$heshop
            .plugin('get', {
              include: 'task',
              model: 'score',
              type: 'single',
              keyword: 'signin',
              status: 1
            })
            .then(v => {
              if (v) {
                that.signNumber = 0;
              } else {
                that.signNumber = res.acquire;
              }
            });
        }
      });
    },
    /**
     * 查找统换
     * @return {[type]} [description]
     */
    sprintf() {
      let arg = arguments,
        str = arg[0] || '',
        i,
        n;
      for (i = 1, n = arg.length; i < n; i++) {
        str = str.replace(/%s/, arg[i]);
      }
      return str;
    },
    getShowData() {
      if (this.isLogin) {
        this.getOrderTotal();
        this.getCouponTotal();
        this.handleLoadData();
        this.setCartNumber();
        //处理积分领取
        this.popupsList = [];
        this.handleTaskSign();
        this.$store.dispatch('user/getUserInfo');
        //延时执行数据
        setTimeout(() => {
          this.$refs['features'].handleLoad();
          this.handleTaskInvite();
        }, 1000);
      }
      uni.login();
    }
  },
  onShow() {
    let _this = this;
    this.getShowData();
    // #ifndef H5
    let userInfo = uni.getStorageSync('userInfo');
    if (userInfo && !userInfo.is_edit) {
      _this.$store.state.apply.showInformationModal = true;
    }
    // #endif
  }
};
</script>

<style lang="less">
.he-page-content {
  overflow: hidden;
  position: relative;
}

.le-content {
  min-height: calc(100vh - 168px);
}

.user-task {
  width: 750px;
  padding: 10px;
  display: flex;
  margin-top: -130px;
  position: relative;
  z-index: 100;

  .user-task_item {
    position: relative;
    width: 345px;
    height: 124px;
    background: #ffffff;
    border-radius: 16px;
    margin: 20px 10px;
    padding: 30px 0 0 28px;
  }

  .user-task_icon {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 80px;
    width: 120px;
  }

  .user-task_item__title {
    font-size: 40px;
    font-family: DIN;
    font-weight: bold;
    color: #222222;
    line-height: 36px;
  }

  .user-task_item__unit {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 36px;
    padding-left: 8px;
  }

  .user-task_item__tips {
    padding-top: 5px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #e60b30;
    line-height: 36px;
  }

  .user-task_item__explain {
    padding-top: 5px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 36px;
  }
}
</style>
