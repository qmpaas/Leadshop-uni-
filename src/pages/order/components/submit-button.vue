<template>
  <view class="submit-button safe-area-inset-bottom" :data-theme="theme">
    <view class="he-button flex justify-between align-center">
      <view class="flex align-center">
        <text class="he-number">共{{ goodsNumberAmount }}件</text>
        <text class="he-text">实付金额</text>
        <text class="he-price">¥{{ payAmount | floatPrice }}</text>
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <button class="cu-btn he-submit-btn" v-if="getBasicSetting.run_status === 1" :disabled="disabled" @click="submit">
        提交订单
      </button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <he-open-subscribe
        @open-subscribe-success="submit"
        :template-id="subTemplateId"
        v-if="getBasicSetting.run_status === 1"
      >
        <button class="cu-btn he-submit-btn" :disabled="disabled">提交订单</button>
      </he-open-subscribe>
      <!-- #endif -->
      <button class="cu-btn he-disabled" v-else-if="getBasicSetting.run_status === 0">已打烊</button>
    </view>
  </view>
</template>
<script>
// #ifdef H5
import heOpenSubscribe from '../../../components/he-open-subscribe.vue';
// #endif
export default {
  name: 'submit-button',
  // #ifdef H5
  components: {
    heOpenSubscribe
  },
  // #endif
  props: {
    goodsNumberAmount: {
      type: Number
    },
    payAmount: {
      type: Number
    },
    disabled: {
      type: Boolean
    }
  },
  computed: {
    subTemplateId: function () {
      let tpl = [];
      const { order_pay, order_send } = this.$store.getters['setting/subscribe'];
      order_pay ? tpl.push(order_pay) : null;
      order_send ? tpl.push(order_send) : null;
      if (this.$manifest('task', 'status')) {
        tpl.push(this.$store.getters['setting/subscribe'].task_refund_tpl);
      }
      return tpl;
    }
  },
  methods: {
    submit: function () {
      let _this = this;
      if (this.disabled) return;
      // #ifdef MP-WEIXIN
      wx.requestSubscribeMessage({
        tmplIds: this.subTemplateId,
        success: function () {},
        fail: function () {},
        complete: function () {
          _this.$emit('submit');
        }
      });
      // #endif
      // #ifdef H5
      _this.$emit('submit');
      // #endif
    }
  }
};
</script>
<style scoped lang="scss">
.submit-button {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 1;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
  background: #ffffff;
}

.he-button {
  height: 96px;
  padding: 0 20px;
}

.he-submit-btn {
  width: 180px;
  height: 72px;
  @include background_color('background_color');
  border-radius: 36px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
}

.he-submit-btn[disabled] {
  background: #cccccc !important;
  color: #ffffff;
}

.he-number {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  margin-right: 11px;
}

.he-text {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-right: 7px;
}

.he-price {
  font-size: 32px;
  font-family: DINPro;
  font-weight: bold;
  @include font_color('font_color');
}

.he-disabled {
  width: 180px;
  height: 72px;
  background: #cccccc;
  border-radius: 36px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #ffffff;
}
</style>
