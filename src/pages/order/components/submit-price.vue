<template>
  <view class="submit-price" :data-theme="theme">
    <view class="he-item flex justify-between align-center">
      <text>商品总额</text>
      <text>¥{{ goodsAmount | floatPrice }}</text>
    </view>
    <view class="he-item flex justify-between align-center" v-if="is_task">
      <text>积分</text>
      <text>{{ totalAmount }}积分</text>
    </view>
    <view class="he-item flex justify-between align-center">
      <text>运费{{ freightAmount === 0 ? '(包邮免运费)' : '' }}</text>
      <text>¥{{ freightAmount | floatPrice }}</text>
    </view>
    <view class="he-item flex justify-between align-center" v-if="promoterReduced">
      <text>分销自购优惠</text>
      <text>¥{{ promoterReduced | floatPrice }}</text>
    </view>
    <template v-if="$manifest('task', 'status') && coupon_stacking && isTask">
      <view class="he-item flex justify-between align-center" @click="isCoupon = true">
        <text>优惠券</text>
        <view class="flex align-center">
          <text class="he-item-empty" v-if="possible === 0">暂无可用优惠券</text>
          <template v-else>
            <text class="he-coupon-num" v-if="$h.test.isEmpty(couponReduced)">{{ possible }}张可用</text>
            <text v-else class="he-coupon-price">-¥{{ couponReduced | floatPrice }}</text>
          </template>
          <text class="iconfont iconbtn_arrow"></text>
        </view>
      </view>
    </template>
    <template v-if="!isTask">
      <view class="he-item flex justify-between align-center" @click="isCoupon = true">
        <text>优惠券</text>
        <view class="flex align-center">
          <text class="he-item-empty" v-if="possible === 0">暂无可用优惠券</text>
          <template v-else>
            <text class="he-coupon-num" v-if="$h.test.isEmpty(couponReduced)">{{ possible }}张可用</text>
            <text v-else class="he-coupon-price">-¥{{ couponReduced | floatPrice }}</text>
          </template>
          <text class="iconfont iconbtn_arrow"></text>
        </view>
      </view>
    </template>
    <submit-coupon v-model="isCoupon" :coupon="coupon" :user-coupon-id="userCouponId" @apply="apply"></submit-coupon>
  </view>
</template>
<script>
import submitCoupon from './submit-coupon.vue';

export default {
  name: 'submit-price',
  data() {
    return {
      isCoupon: false,
      coupon: [],
      possible: 0
    };
  },
  components: {
    submitCoupon
  },
  computed: {
    isTask() {
      if (this.is_task == true) {
        return true;
      }
      if (this.is_task == 'true') {
        return true;
      }
      if (this.is_task == 1) {
        return true;
      }
      if (this.is_task == '1') {
        return true;
      }
      return false;
    },
    coupon_stacking() {
      let _t = this.$manifest('task', 'config.coupon_stacking');

      if (_t) {
        if (_t == 'false') {
          return false;
        }
        return true;
      }
    }
  },
  props: {
    goodsAmount: {
      type: Number
    },
    freightAmount: {
      type: Number
    },
    totalAmount: {
      type: Number,
      default: -1
    },
    goodsData: {
      type: Array
    },
    couponReduced: {
      type: [Number, String]
    },
    userCouponId: {
      type: Number
    },
    is_task: {
      type: [Number],
      default: 1
    },
    promoterReduced: {
      type: [Number, String],
      default: 0
    }
  },
  methods: {
    apply: function (user_coupon_id) {
      this.$emit('apply', user_coupon_id);
    },
    getCoupon: function () {
      let _this = this;
      return new Promise(function (resolve, reject) {
        let _array = _this.goodsData.map(function (item) {
          return item.goods_id;
        });
        _this.$heshop
          .coupon('get', {
            behavior: 'user',
            goods_id: _array,
            type: 'all'
          })
          .then(function (response) {
            let list = response;
            list.forEach(function (item) {
              item.radio = false;
              if (Number(item.coupon.min_price) > _this.goodsAmount) {
                item.isAvailable = 0;
              } else {
                item.isAvailable = 1;
              }
            });
            list = list.sort(function (a, b) {
              return b.isAvailable - a.isAvailable;
            });
            _this.possible = list.filter(item => item.isAvailable === 1).length;

            _this.coupon = list;
            resolve();
          })
          .catch(function (error) {
            _this.$toError(error);
            reject();
          });
      });
    }
  },
  mounted() {
    this.getCoupon();
  },
  filters: {}
};
</script>
<style scoped lang="scss">
.iconfont.iconbtn_arrow {
  font-size: 22px;
  color: #bebebe;
  margin-left: 14px;
}

.submit-price {
  width: 710px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 24px;
  margin: 16px 20px 0 20px;
}

.he-item {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  height: 64px;
}

.he-item-empty {
  color: #999999;
}

.he-coupon-price {
  @include font_color('font_color');
}

.he-coupon-num {
  display: inline-block;
  @include font_color('font_color');
  border: 2px solid transparent;
  @include border_color('border_color');
  border-radius: 4px;
  padding: 5px 5px;
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 500;
  // height: 32px;
  line-height: 1;
}
</style>
