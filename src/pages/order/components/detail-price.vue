<template>
  <view class="detail-price" :data-theme="theme">
    <template v-if="detail.type === 'task'">
      <view class="he-item flex justify-between">
        <text class="he-label">商品总额</text>
        <text class="he-value">{{ detail.total_score }}积分+¥{{ goodsAmount }}</text>
      </view>
    </template>
    <template v-else>
      <view class="he-item flex justify-between">
        <text class="he-label">商品总额</text>
        <text class="he-value">¥{{ goodsAmount }}</text>
      </view>
    </template>
    <template v-else>
      <view class="he-item flex justify-between">
        <text class="he-label">商品总额</text>
        <text class="he-value">¥{{ goodsAmount }}</text>
      </view>
    </template>
    <view class="he-item flex justify-between">
      <text class="he-label">运费</text>
      <text class="he-value">¥{{ freightAmount }}</text>
    </view>
    <view class="he-item flex justify-between" v-if="isPromoter === 1">
      <text class="he-label">分销自购优惠</text>
      <text class="he-value">-￥{{ promoterReduced }}</text>
    </view>
    <view class="he-item flex justify-between" v-if="Number(couponReduced)">
      <text class="he-label">优惠券</text>
      <text class="he-value">-¥{{ couponReduced }}</text>
    </view>
    <view class="he-item flex justify-between" v-if="Number(storeReduced)">
      <text class="he-label">商家改价</text>
      <text class="he-value">-¥{{ storeReduced | floatPrice }}</text>
    </view>
    <view class="he-item flex justify-between" v-if="status !== 101 && status !== 102 && status !== 103">
      <text class="he-value">实付金额</text>
      <text class="he-value he-pay">¥{{ payAmount }}</text>
    </view>
  </view>
</template>
<script>
export default {
  name: 'detail-price',
  props: {
    detail: Object,

    goodsAmount: {
      type: String,
      default: function () {
        return '';
      }
    },
    freightAmount: {
      type: String,
      default: function () {
        return '';
      }
    },
    payAmount: {
      type: String,
      default: function () {
        return '';
      }
    },
    status: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    couponReduced: {
      type: String,
      default: function () {
        return '';
      }
    },
    storeReduced: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    isPromoter: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    promoterReduced: {
      type: String,
      default: function () {
        return '0.00';
      }
    }
  }
};
</script>

<style scoped lang="scss">
.detail-price {
  margin-top: 16px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 24px 8px 24px;
}

.he-item {
  font-family: PingFang SC;
  font-size: 26px;
  font-weight: 500;
  margin-bottom: 24px;
}

.he-label {
  color: #999999;
}

.he-value {
  color: #222222;
}

.he-pay {
  font-weight: bold;
  @include font_color('font_color');
}
</style>
