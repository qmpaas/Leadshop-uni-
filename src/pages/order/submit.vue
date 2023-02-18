<template>
  <view class="he-page-content" :class="loading ? 'flex justify-center align-center' : ''" :data-theme="theme">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <submit-address :consignee-info="consigneeInfo"></submit-address>
      <submit-product :is_task="is_task" :goods-data="detail.goods_data"></submit-product>
      <submit-price
        :is_task="is_task"
        :goods-amount="detail.goods_amount"
        :total-amount="detail.total_score"
        :freight-amount="detail.freight_amount"
        :goods-data="detail.goods_data"
        @apply="couponPreview"
        :coupon-reduced="detail.coupon_reduced"
        :user-coupon-id="userCouponId"
        :promoter-reduced="detail.promoter_reduced"
      ></submit-price>
      <submit-comments :note="note"></submit-comments>
      <view class="safe-area-inset-bottom">
        <view class="he-button-height" />
      </view>
      <submit-button
        @submit="submit"
        :disabled="disabled"
        :goods-number-amount="detail.goods_number_amount"
        :pay-amount="detail.pay_amount"
      ></submit-button>
    </template>
    <view class="task-popup" v-if="display">
      <view class="task-popup-mask"></view>
      <view class="task-popup-body">
        <view class="title">积分余额不足</view>
        <view class="msg">{{ msg }}</view>
        <view class="button" @click="toUrl('/plugins/task/index')" :style="{ backgroundColor: themeColor }"
          >去赚积分</view
        >
        <view class="link" @click="toUrl('/plugins/task/mall')" :style="{ color: themeColor }"
          >看看其他积分商品 <text class="iconfont iconbtn_arrow"></text
        ></view>
      </view>
    </view>
    <he-float-window pages-url="submit" :bottom="96"></he-float-window>
  </view>
</template>
<script>
import submitAddress from './components/submit-address.vue';
import submitProduct from './components/submit-product.vue';
import submitPrice from './components/submit-price.vue';
import submitButton from './components/submit-button.vue';
import submitComments from './components/submit-comments.vue';
import heLoading from '../../components/he-loading.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'submit',
  components: {
    submitAddress,
    submitProduct,
    submitPrice,
    submitButton,
    submitComments,
    heLoading,
    heFloatWindow
  },
  data() {
    return {
      display: false,
      msg: '',
      /**
       * 任务中心新增字段
       * 判断是否积分商城下单
       * @type {Boolean}
       */
      is_task: false,
      detail: {
        goods_data: [],
        pay_amount: 0,
        coupon_reduced: null
      },
      goodsData: [],
      consigneeInfo: null,
      userCouponId: null,
      note: '',
      loading: true,
      disSubmit: false
    };
  },
  computed: {
    disabled: function () {
      let goodsData = this.detail.goods_data ? this.detail.goods_data : [];
      let bool = goodsData.findIndex(function (item) {
        return item.failure_reason;
      });
      return bool > -1 ? true : false;
    },
    ...mapGetters('setting', {
      floatWindow: 'getFloatWindow'
    })
  },
  methods: {
    toUrl(url) {
      uni.redirectTo({ url: url });
    },
    getAddress: function () {
      let _this = this;
      return new Promise(function (resolve, reject) {
        // 获取默认地址
        _this.$heshop
          .address('get', {
            behavior: 'default'
          })
          .then(function (res) {
            if (res) {
              _this.consigneeInfo = res;
              resolve();
            } else {
              // 获取地址列表
              _this.$heshop
                .address('get')
                .then(function (res) {
                  if (!_this.$h.test.isEmpty(res)) {
                    _this.consigneeInfo = res[0];
                  }
                  resolve();
                })
                .catch(function () {
                  reject();
                });
            }
          })
          .catch(function (err) {
            _this.$toError(err);
            reject();
          });
      });
    },
    getPreview: function () {
      let _this = this;

      return new Promise(function (resolve, reject) {
        _this.$heshop
          .order(
            'post',
            {
              calculate: 'calculate',
              task: _this.is_task
            },
            {
              goods_data: _this.goodsData,
              consignee_info: _this.consigneeInfo,
              user_coupon_id: _this.userCouponId,
              type: _this.is_task ? 'task' : 'base'
            }
          )
          .then(function (res) {
            _this.detail = res;
            resolve();
          })
          .catch(function (err) {
            if (err.status === 416) {
              _this.display = true;
              _this.msg = err.data.message;
            } else {
              _this.$toError(err);
              reject();
            }
          });
      });
    },
    couponPreview: function (user_coupon_id) {
      this.userCouponId = user_coupon_id;
      this.getPreview();
    },
    submit: function () {
      let _this = this;

      if (this.$h.test.isEmpty(this.consigneeInfo))
        return uni.showToast({
          title: '收货地址不能为空',
          icon: 'none'
        });
      if (this.disSubmit) return;
      this.disSubmit = true;
      this.$heshop
        .order('post', {
          goods_data: this.goodsData,
          consignee_info: this.consigneeInfo,
          note: this.note,
          type: this.is_task ? 'task' : 'base',
          user_coupon_id: this.userCouponId,
          source: 1
        })
        .then(function (res) {
          _this.$store.commit('cart/setCartAdd', true);
          if (res.pay_total_amount !== 0) {
            _this.$heshop
              .pay({
                order_sn: res.order_sn
              })
              .then(function (data) {
                // #ifdef MP_WEIXIN
                uni.redirectTo({
                  url: '/pages/order/successful?order_id=' + res.order_id + '&order_sn=' + res.order_sn
                });
                // #endif
                // #ifdef H5
                _this.$wechat.chooseWXPay({
                  nonceStr: data.nonceStr,
                  packAge: data.package,
                  paySign: data.paySign,
                  signType: data.signType,
                  timestamp: data.timeStamp,
                  success: function () {
                    uni.redirectTo({
                      url: '/pages/order/successful?order_id=' + res.order_id + '&order_sn=' + res.order_sn
                    });
                  },
                  fail: function (err) {
                    _this.$toError(err);
                  },
                  cancel: function () {
                    uni.redirectTo({
                      url: '/pages/order/index?tabCur=unpaid'
                    });
                  }
                });
                // #endif
              })
              .catch(function (err) {
                if (err.status === 403) {
                  _this.$h.toast(err.data.message);
                }
                if (err.errMsg === 'requestPayment:fail cancel') {
                  uni.redirectTo({ url: '/pages/order/index?tabCur=unpaid' });
                }
              });
          } else {
            uni.redirectTo({
              url: '/pages/order/successful?order_id=' + res.order_id + '&order_sn=' + res.order_sn
            });
          }
        })
        .catch(function (err) {
          if (err.status === 416) {
            _this.display = true;
            _this.msg = err.data.message;
          } else if (err.status === 403) {
            _this.$h.toast(err.data.message);
            _this.$store.dispatch('setting/resetting');
            setTimeout(function () {
              uni.navigateBack({
                delta: 1
              });
            }, 1000);
          } else {
            _this.$toError(err);
          }
        });
    }
  },
  async onLoad(options) {
    let _this = this;
    // #ifdef H5
    _this.$wechat.init();
    // #endif

    /**
     * 任务中心新增字段，用于判断是否为积分商城下单
     * @type {Boolean}
     */
    this.is_task = Boolean(options.is_task);
    if (options.is_task === 'false' || options.is_task === '0') {
      this.is_task = false;
    }

    if (options.data) {
      _this.goodsData = JSON.parse(options.data);
    }

    const eventChannel = this.getOpenerEventChannel();
    eventChannel.once('acceptDataFromOpenerPage', function (params) {
      _this.goodsData = params.data;
    });

    await _this.getAddress();
    await _this.getPreview();
    _this.loading = false;
  },
  onShow() {
    //获取插件设置
    this.$store.dispatch('plugins/getPlugins');
    let address_submit = this.getStorageSync(this.$storageKey.address_submit);
    let comments_submit = this.getStorageSync(this.$storageKey.comments_submit);
    // 选择地址
    if (address_submit) {
      this.consigneeInfo = address_submit;
      this.getPreview();
      uni.removeStorageSync(this.$storageKey.address_submit);
    }
    // 留言
    if (comments_submit) {
      this.note = comments_submit;
      uni.removeStorageSync(this.$storageKey.comments_submit);
    }
  }
};
</script>

<style type="text/css" lang="less">
.he-button-height {
  height: 112px;
}

.task-popup {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  .task-popup-mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
  }

  .task-popup-body {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 590px;
    height: 416px;
    margin-left: -295px;
    margin-top: -208px;
    background: #ffffff;
    border-radius: 16px;
    z-index: 101;

    .title {
      width: 190px;
      height: 31px;
      font-size: 32px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #222222;
      position: absolute;
      width: 100%;
      margin-top: 46px;
      text-align: center;
    }

    .msg {
      width: 100%;
      height: 25px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
      margin-top: 124px;
      text-align: center;
    }

    .button {
      position: absolute;
      width: 242px;
      height: 72px;
      background: #e60b30;
      border-radius: 36px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      left: 174px;
      top: 208px;
      text-align: center;
      line-height: 72px;
    }

    .link {
      position: absolute;
      width: 100%;
      text-align: center;
      height: 23px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;

      top: 313px;

      .iconfont {
        font-size: 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
      }
    }
  }
}
</style>
