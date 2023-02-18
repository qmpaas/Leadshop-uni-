<template>
  <view class="detail-product-info">
    <view class="he-title">商品信息</view>
    <view class="he-goods" :data-theme="theme">
      <view class="he-item" v-for="(item, index) in goods" :key="index">
        <view class="he-body flex" @tap="navigateToDetail(`/pages/goods/detail?id=${item.goods_id}`)">
          <view class="he-item__image">
            <he-image
              :image-style="{ borderRadius: '8rpx' }"
              :src="item.goods_image"
              :width="160"
              :height="160"
            ></he-image>
            <view class="he-item__after" v-if="item.after_sales === 1">
              {{ item.after | afterStatus }}
            </view>
          </view>
          <view class="he-item__content flex">
            <view class="he-item-content-content">
              <view class="he-item__name he-line-1">{{ item.goods_name }} </view>
              <view class="he-item__attr he-line-2">{{ item.show_goods_param }}</view>
              <view class="he-price-number">
                <text class="he-number">{{ item.goods_number }}</text>
              </view>
            </view>
            <view class="flex-sub he-item-content-price">
              <template v-if="Number(item.total_amount) > Number(item.pay_amount)">
                <view class="flex align-center justify-end">
                  <text class="he-item-price-prompt">优惠后</text>
                  <text class="he-item-payAmount"
                    >￥{{ Math.floor((item.pay_amount / item.goods_number) * 100) / 100 }}</text
                  >
                </view>
                <view class="he-item-price-prompt">￥{{ item.goods_price }}</view>
              </template>
              <template v-else>
                <view class="he-item-payAmount">￥{{ item.goods_price }}</view>
              </template>
            </view>
          </view>
        </view>
        <view class="he-footer flex justify-end" v-if="status === 201 || status === 202 || status === 203">
          <button
            class="cu-btn he-footer__btn"
            @click.stop="navigateToApply(item, status)"
            v-if="item.after_sales === 0"
          >
            申请售后
          </button>
          <button class="cu-btn he-footer__btn" v-else @click.stop="navigateTo(item.id)">售后记录</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'detail-product-info',
  props: {
    goods: Array,
    detail: Object,
    status: Number,
    orderId: Number,
    orderSn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      is_task: 0
    };
  },
  methods: {
    navigateToDetail: function (url) {
      if (this.detail.type && this.detail.type === 'task') {
        url = url + '&is_task=1';
      }
      uni.navigateTo({ url });
    },
    navigateToApply: function (item, status) {
      this.is_task = 0;
      if (this.detail.type && this.detail.type === 'task') {
        this.is_task = 1;
      }
      uni.navigateTo({
        url:
          '/pages/order/apply?id=' +
          item.id +
          '&good=' +
          encodeURIComponent(JSON.stringify([item])) +
          '&status=' +
          status +
          '&is_task=' +
          this.is_task +
          '&order_sn=' +
          this.orderSn
      });
    },
    navigateTo: function (id) {
      this.is_task = 0;
      if (this.detail.type && this.detail.type === 'task') {
        this.is_task = 1;
      }
      uni.navigateTo({
        url: '/pages/order/after-sales-details?id=' + id + '&behavior=order_goods&is_task=' + this.is_task
      });
    }
  },
  filters: {
    afterStatus: function (after) {
      if (after.status === 200) {
        if (after.type === 0) {
          return '已退款';
        } else if (after.type === 1) {
          return '已退款';
        } else if (after.type === 2) {
          return '已换货';
        }
      } else if (after.status === 101) {
        return '已拒绝';
      } else if (after.status === 201) {
        return '已拒绝';
      } else {
        return '售后中';
      }
    }
  }
};
</script>
<style scoped lang="scss">
.detail-product-info {
  margin-top: 16px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 24px 32px 24px;
}

.he-title {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-top: 8px;
}

.he-item {
  margin-top: 32px;
}

.he-item__image {
  width: 160px;
  height: 160px;
  position: relative;

  .he-item__after {
    position: absolute;
    bottom: 0;
    width: 160px;
    height: 40px;
    border-radius: 0 0 8px 8px;
    @include background_color('background_color');
    line-height: 40px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
  }
}

.he-item__content {
  padding: 5px 0 0 24px;
  width: 502px;
}

.he-item-content-content {
  width: 285px;
}

.he-item-content-price {
  text-align: right;
}

.he-item-payAmount {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}

.he-item-price-prompt {
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-item__name {
  margin: 3px 0 10px 0;
}

.he-item__attr {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-price-number {
  font-family: PingFang SC;
  font-weight: 500;
}

.he-number {
  font-size: 22px;
  color: #999999;
  margin-right: 22px;
}

.he-number:before {
  content: '×';
}

.he-price {
  font-size: 24px;
  color: #222222;
}

.he-footer {
  padding: 16px 0 0 0;
}

.he-footer__btn {
  height: 56px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 28px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}
</style>
