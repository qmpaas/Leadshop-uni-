<template>
  <view class="he-page-content">
    <view class="he-box he-goods">
      <view class="flex he-good" v-for="(item, index) in goods" :key="index">
        <he-image
          :width="120"
          :height="120"
          :src="item.goods_image"
          :image-style="{ borderRadius: '8rpx', marginRight: '24rpx' }"
        ></he-image>
        <view class="he-goods__content">
          <view class="he-goods__name he-line-1">{{ item.goods_name }}</view>
          <view class="he-goods__attr he-line-1">{{ item.show_goods_param }}</view>
          <view class="he-goods__number">x{{ item.goods_number }}</view>
        </view>
      </view>
    </view>
    <view class="he-box he-button">
      <view
        class="he-item flex align-center"
        @tap="redirectTo(0)"
        v-if="status === 201 || status === 203 || status === 202"
      >
        <image class="he-item__icon" :src="ipAddress + '/apply-icon-refund.png'"></image>
        <view class="he-item__content flex-sub">
          <view class="he-item__text">仅退款</view>
          <view class="he-item__description">没收到货，或与卖家协商同意仅退款</view>
        </view>
        <text class="iconfont iconbtn_arrow"></text>
      </view>
      <template v-if="status === 203 || status === 202">
        <view class="he-item flex align-center" @tap="redirectTo(1)">
          <image class="he-item__icon" :src="ipAddress + '/apply-icon-refunds.png'"></image>
          <view class="he-item__content flex-sub">
            <view class="he-item__text">退货退款</view>
            <view class="he-item__description">已收到货，需要退还收到的货物</view>
          </view>
          <text class="iconfont iconbtn_arrow"></text>
        </view>
        <view class="he-item flex align-center" @tap="redirectTo(2)" v-if="status === 203">
          <image class="he-item__icon" :src="ipAddress + '/apply-icon-exchange.png'"></image>
          <view class="he-item__content flex-sub">
            <view class="he-item__text">换货</view>
            <view class="he-item__description">对收到的商品不满意，可与商家协商换货</view>
          </view>
          <text class="iconfont iconbtn_arrow"></text>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  name: 'apply-after-sales',
  data() {
    return {
      goods: [],
      id: null,
      is_task: false,
      status: null,
      orderSn: ''
    };
  },
  methods: {
    redirectTo: function (type) {
      uni.redirectTo({
        url:
          '/pages/order/apply-detail?id=' +
          this.id +
          '&good=' +
          encodeURIComponent(JSON.stringify(this.goods)) +
          '&type=' +
          type +
          '&is_task=' +
          this.is_task +
          '&order_sn=' +
          this.orderSn
      });
    }
  },
  onLoad(options) {
    this.goods = JSON.parse(decodeURIComponent(options.good));
    this.id = options.id;
    this.is_task = options.is_task;
    this.orderSn = options.order_sn;
    this.status = parseInt(options.status);
  }
};
</script>

<style scoped>
.he-page-content {
  padding: 20px;
}

.he-box {
  width: 710px;
  background: #ffffff;
  border-radius: 16px;
}

.he-goods {
  margin-bottom: 16px;
  padding: 32px 24px 12px 24px;
}

.he-button {
  padding: 16px 24px;
}

.he-item {
  height: 136px;
}

.he-item:not(:last-child) {
  border-bottom: 1px solid #e5e5e5;
}

.he-item__icon {
  width: 88px;
  height: 88px;
  margin-right: 16px;
}

.iconbtn_arrow {
  width: 20px;
  height: 20px;
  font-size: 20px;
  color: RGBA(190, 190, 190, 1);
}

.he-item__content {
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 1.3;
}

.he-item__text {
  font-size: 28px;
  color: #222222;
  margin-bottom: 4px;
}

.he-item__description {
  font-size: 24px;
  color: #999999;
  margin-top: 4px;
}

.he-goods__content {
  padding-top: 9px;
  font-family: PingFang SC;
  font-weight: 500;
  width: 518px;
  font-size: 22px;
  color: #999999;
}

.he-goods__name {
  font-size: 26px;
  color: #222222;
  line-height: 1.3;
}

.he-goods__attr {
  margin-top: 7px;
}

.he-goods__number {
  margin-top: 8px;
}

.he-good {
  margin-bottom: 20px;
}
</style>
