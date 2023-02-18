<template>
  <view :data-theme="theme">
    <view class="detail-basic-information">
      <view class="promoter" v-if="isPromoter">
        <text class="iconfont iconaftersalesdetails-refund"></text>
        <text>分销赚</text>
        <text>￥{{ commission }}</text>
      </view>
      <view class="base-box">
        <view class="he-top flex align-center justify-between">
          <view>
            <text class="he-price he-price_task" v-if="is_task"
              >{{ task.task_number }}
              <text style="font-size: 12px">积分+¥</text>
              {{ task.task_price }}
            </text>
            <text class="he-price" v-else>{{ price }}</text>
            <text class="he-old-price">¥{{ linePrice }}</text>
          </view>
          <text class="fr he-sale">已售{{ sales + virtual_sales }}{{ unit }}</text>
        </view>
        <view class="he-bottom flex justify-between">
          <text class="he-name he-line-2">{{ name }}</text>
          <view class="he-share flex flex-direction align-center justify-between" @click="setShare">
            <view class="iconfont iconproductdetails_share"></view>
            <text class="he-share__text">分享</text>
          </view>
        </view>
        <view class="he-subtitle" v-if="!$h.test.isEmpty(goodsIntroduce)">
          {{ goodsIntroduce }}
        </view>
        <view class="he-coupon flex align-center" @click="isCoupon = true" v-if="!$h.test.isEmpty(coupon)">
          <view class="he-coupon-left flex align-center">
            <view class="he-coupon-item flex align-center" :key="index" v-for="(item, index) in coupon">
              <view class="he-coupon-edge he-coupon-item-left">
                <view class="he-edge-doc"></view>
              </view>
              <view class="he-coupon-item-center">
                <template v-if="Number(item.min_price) > 0">
                  满{{ Number(item.min_price) }}减{{ Number(item.sub_price) }}
                </template>
                <template v-else> {{ Number(item.sub_price) }}元无门槛</template>
              </view>
              <view class="he-coupon-edge he-coupon-item-right">
                <view class="he-edge-doc"></view>
              </view>
            </view>
          </view>
          <view class="he-coupon-right flex align-center justify-end">
            <text class="he-coupon-right-text">领券</text>
            <text class="iconfont iconbtn_arrow"></text>
          </view>
        </view>
      </view>
    </view>
    <he-share
      @confirmPromoter="setPromoterMaterial"
      v-model="isShare"
      :post-data="{ goods_id: goodsId }"
      :is-promoter="isPromoter"
      :is_task="is_task"
    />
    <detail-coupon v-model="isCoupon" :coupon="newCoupon"></detail-coupon>
    <promotion-material :info="goods" v-model="showPromotionMaterial"></promotion-material>
  </view>
</template>

<script>
import heShare from '../../../components/he-share.vue';
import detailCoupon from './detail-coupon.vue';
import promotionMaterial from './../../../components/promotion-material.vue';

export default {
  name: 'detail-basic-information',
  components: {
    heShare,
    detailCoupon,
    promotionMaterial
  },
  props: {
    is_task: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    task: [Object, Array],
    name: {
      type: String,
      default: function () {
        return '';
      }
    },
    price: {
      type: String,
      default: function () {
        return '';
      }
    },
    unit: {
      type: String,
      default: function () {
        return '';
      }
    },
    linePrice: {
      type: String,
      default: function () {
        return '';
      }
    },
    sales: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    virtual_sales: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    goodsId: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    goods: {
      type: Object,
      default: function () {
        return {};
      }
    },
    // 副标题
    goodsIntroduce: {
      type: String,
      default: function () {
        return '';
      }
    },
    // 是否为分销商品
    isPromoter: {
      type: Number,
      default: function () {
        return 0;
      }
    },
    // 分销佣金
    commission: {
      type: String,
      default: function () {
        return '0';
      }
    }
  },
  data() {
    return {
      isShare: false,
      isCoupon: false,
      newCoupon: [],
      coupon: [],
      showPromotionMaterial: false
    };
  },
  methods: {
    setShare: function () {
      this.isShare = true;
    },
    getLen: function (list) {
      let str = '';
      list.forEach(item => {
        item.min_price = Number(item.min_price);
        item.sub_price = Number(item.sub_price);
        if (item.min_price > 0) {
          str += `满${item.min_price}减${item.sub_price}`;
        } else {
          str += `${item.sub_price}无门槛`;
        }
      });
      if (
        uni.upx2px(550) -
          str.length * uni.upx2px(24) -
          list.length * uni.upx2px(24) -
          (list.length - 1) * uni.upx2px(12) <
        0
      ) {
        this.coupon.pop();
        this.getLen(this.coupon);
      }
    },
    getCoupon: function () {
      let _this = this;
      this.$heshop
        .coupon('get', {
          behavior: 'coupon',
          goods_id: this.goodsId,
          type: 'all'
        })
        .then(function (response) {
          _this.newCoupon = response;
          _this.coupon = JSON.parse(JSON.stringify(response));
          _this.getLen(_this.coupon);
        })
        .catch(function (error) {
          _this.$toError(error);
        });
    },
    setPromoterMaterial() {
      this.showPromotionMaterial = true;
    }
  },
  mounted() {
    this.getCoupon();
  }
};
</script>

<style scoped lang="scss">
.detail-basic-information {
  margin: 20px 20px 0 20px;
  background-color: #ffebde;
  border-radius: 16px;
}

.promoter {
  padding: 21px 24px;
  color: #ff7c24;

  text:not(:first-child) {
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
  }

  text:nth-child(2) {
    margin-right: 7px;
  }

  .iconaftersalesdetails-refund {
    font-size: 30px;
    margin-right: 12px;
  }
}

.base-box {
  background: #ffffff;
  padding: 32px 24px 28px 24px;
  border-radius: 16px;
}

.he-top {
  margin-bottom: 17px;
}

.he-price {
  font-size: 40px;
  font-family: DINPro;
  font-weight: bold;
  @include font_color('font_color');
}

.he-price:before {
  content: '￥';
  font-size: 30px;
}

.he-price.he-price_task:before {
  content: '';
  font-size: 30px;
}

.he-old-price {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  text-decoration: line-through;
  color: #999999;
  margin-left: 17px;
}

.he-sale {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-name {
  font-size: 28px;
  font-family: DINPro;
  font-weight: bold;
  color: #222222;
  line-height: 36px;
  width: 545px;
}

.he-share {
  width: 70px;
}

.he-share__text {
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.iconproductdetails_share {
  width: 32px;
  height: 32px;
  font-size: 32px;
  color: RGBA(153, 153, 153, 1);
}

.he-subtitle {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  line-height: 32px;
  margin: 20px 0 0 0;
  word-wrap: break-word;
  word-break: normal;
}

.he-coupon {
  width: 662px;
  height: 64px;
  margin-top: 16px;

  .he-coupon-left {
    width: 550px;
    height: 46px;

    .he-coupon-item {
      margin-right: 16px;
      height: 44px;
      overflow: hidden;
    }

    .he-coupon-item-center {
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      height: 44px;
      line-height: 42px;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      @include font_color('font_color');
      transform: rotateZ(360deg);
      @include border_color('border_color');
    }

    .he-coupon-edge {
      width: 16px;
      height: 44px;
      transform: rotateZ(360deg);
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      @include border_color('border_color');
      position: relative;
    }

    .he-coupon-item-left {
      border-left: 1px solid transparent;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .he-coupon-item-right {
      border-right: 1px solid transparent;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .he-edge-doc {
      width: 16px;
      height: 16px;
      position: absolute;
      border-radius: 50%;
      top: 50%;
      z-index: 10;
      border: 1px solid transparent;
      background: #ffffff;
      @include border_color('border_color');
    }

    .he-coupon-item-left .he-edge-doc {
      transform: translate(-50%, -50%);
      left: 0;
    }

    .he-coupon-item-right .he-edge-doc {
      transform: translate(50%, -50%);
      right: 0;
    }
  }

  .he-coupon-right {
    width: 112px;
    height: 44px;

    .iconbtn_arrow {
      font-size: 22px;
      margin-left: 4px;
      color: #bebebe;
    }

    .he-coupon-right-text {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
    }
  }
}
</style>
