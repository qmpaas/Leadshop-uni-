<template>
  <view class="detail-bottom-operating safe-area-inset-bottom" :data-theme="theme">
    <view class="he-buttons" :class="newStatus === 100 ? 'flex align-center justify-between' : 'fr'">
      <button
        class="cu-btn he-btn"
        v-if="newStatus >= 203 && isEvaluate === 0"
        @click="navigateTo('/pages/order/evaluation?id=' + orderId)"
      >
        评价晒单
      </button>
      <button
        class="cu-btn he-btn he-gray--btn"
        v-if="newStatus === 201 && goods.length > 1"
        @click.stop="navigateToApply(goods, status)"
      >
        整单退款
      </button>
      <button class="cu-btn he-btn" v-if="newStatus === 202" @click="receipt = true">确认收货</button>
      <template v-if="newStatus === 100">
        <view class="he-pay-price flex align-center">
          <text class="he-label">实付金额</text>
          <text class="he-value">¥{{ payAmount }}</text>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <button class="cu-btn he-btn he-buy" @click="onPay()" v-if="getBasicSetting.run_status === 1">立即支付</button>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <he-open-subscribe
          @open-subscribe-success="onPay"
          :template-id="tmplIds"
          v-if="getBasicSetting.run_status === 1"
        >
          <button class="cu-btn he-btn he-buy">立即支付</button>
        </he-open-subscribe>
        <!-- #endif -->
        <button class="cu-btn he-disabled" v-else>已打样</button>
      </template>
    </view>
    <he-empty-popup
      :empty-style="{ height: '146rpx', lineHeight: '146rpx' }"
      v-model="receipt"
      title="确认收到货了吗？"
      @confirm="receiptConfirm"
    ></he-empty-popup>
    <after-receipt v-model="isAfterReceipt" :order-id="orderId"></after-receipt>
  </view>
</template>
<script>
import heEmptyPopup from '@/components/he-empty-popup.vue';
import afterReceipt from './after-receipt.vue';
import heOpenSubscribe from '../../../components/he-open-subscribe.vue';

export default {
  name: 'detail-bottom-operating',
  components: {
    heEmptyPopup,
    afterReceipt,
    heOpenSubscribe
  },
  props: {
    status: Number,
    orderSn: String,
    totalAmount: String,
    orderId: Number,
    payAmount: String,
    isEvaluate: Number,
    goods: {
      type: Array,
      default: []
    },
    freightAmount: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      receipt: false,
      isAfterReceipt: false
    };
  },
  computed: {
    newStatus: {
      get: function () {
        return this.status;
      },
      set: function (val) {
        this.$emit('update:status', val);
      }
    },
    tmplIds: function () {
      let tpl = [
        this.$store.getters['setting/subscribe'].order_pay,
        this.$store.getters['setting/subscribe'].order_send
      ];
      if (this.$manifest('task', 'status')) {
        tpl.push(this.$store.getters['setting/subscribe'].task_refund_tpl);
      }
      return tpl;
    }
  },
  methods: {
    onPay: function () {
      let _this = this;
      // #ifdef MP_WEIXIN
      wx.requestSubscribeMessage({
        tmplIds: _this.tmplIds,
        success: function () {},
        fail: function () {},
        complete: function () {
          _this.submit();
        }
      });
      // #endif
      // #ifdef H5
      this.submit();
      // #endif
    },
    // 收货订单操作
    receiptConfirm: function () {
      let _this = this;
      this.$heshop
        .order('put', {
          id: this.orderId,
          behavior: 'received'
        })
        .then(function () {
          _this.newStatus = 203;
          _this.isAfterReceipt = true;
        })
        .catch(function (err) {
          _this.$toError(err);
        });
    },
    navigateTo: function (url) {
      uni.navigateTo({
        url: url
      });
    },
    submit: function () {
      let _this = this;
      this.$heshop
        .pay({
          order_sn: this.orderSn
        })
        .then(function (data) {
          // #ifdef MP_WEIXIN
          _this.newStatus = 201;
          uni.navigateTo({
            url: '/pages/order/successful?order_id=' + _this.orderId + '&order_sn=' + _this.order_sn
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
              _this.newStatus = 201;
              uni.navigateTo({
                url: '/pages/order/successful?order_id=' + _this.orderId + '&order_sn=' + _this.order_sn
              });
            },
            fail: function (err) {
              _this.$toError(err);
            },
            cancel: function () {}
          });
          // #endif
        })
        .catch(function (err) {
          if (err.status === 403) {
            _this.$h.toast(err.data.message);
            _this.$store.dispatch('setting/resetting');
            setTimeout(function () {
              uni.navigateBack({
                delta: 1
              });
            }, 1000);
          }
        });
    },
    // 整单退款
    navigateToApply(goods, status) {
      let is_task = 0;
      if (this.type === 'task') {
        is_task = 1;
      }
      uni.navigateTo({
        url: `/pages/order/apply-detail?id=0&good=${encodeURIComponent(
          JSON.stringify(goods)
        )}&status=${status}&is_task=${is_task}&type=0&is_entire=1&order_sn=${this.orderSn}&freight_amount=${
          this.freightAmount
        }`
      });
    }
  }
};
</script>
<style scoped lang="scss">
.detail-bottom-operating {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  z-index: 1;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
}

.he-buttons {
  padding: 20px;
  height: 96px;
}

.he-btn {
  background: #ffffff;
  border-width: 1px;
  border-style: solid;
  @include border_color('border_color');
  border-radius: 28px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  height: 56px;
  @include font_color('font_color');
  &.he-gray--btn {
    border-color: #cccccc !important;
    color: #222222 !important;
  }
}

.he-buy {
  color: #ffffff;
}

.he-pay-price {
  font-family: PingFang SC;
}

.he-label {
  font-size: 24px;
  font-weight: 500;
  color: #222222;
}

.he-value {
  font-size: 30px;
  font-weight: bold;
  @include font_color('font_color');
  margin-left: 7px;
}

.he-disabled {
  width: 142px;
  height: 56px;
  background: #cccccc !important;
  border-radius: 28px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff !important;
}
</style>
