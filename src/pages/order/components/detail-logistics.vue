<template>
  <view class="detail-logistics flex align-center" @click="navigateTo">
    <text class="iconfont iconorderdetails_logistics"></text>
    <view class="pk-info">
      {{ '订单被拆分为' + freight.length + '个包裹' }}
    </view>
    <text class="iconfont iconbtn_arrow"></text>
  </view>
</template>

<script>
export default {
  name: 'detail-logistics',
  props: {
    freight: {
      type: Array,
      default: []
    },
    orderId: {
      type: Number
    }
  },
  methods: {
    navigateTo() {
      uni.navigateTo({
        url: '/pages/order/package?id=' + this.orderId
      });
    }
  }
};
</script>

<style scoped lang="scss">
.detail-logistics {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 32px;
  justify-content: space-between;
}

.iconorderdetails_logistics {
  font-size: 40px;
  color: rgb(215, 215, 215);
  margin-right: 26px;
}

.he-text {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}

.he-data_now {
  padding-right: 32px;
}

.he-time {
  height: 36px;
  line-height: 36px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.iconbtn_arrow {
  font-size: 28px;
  color: #bebebe;
}

.he-number {
  margin-left: 19px;
}

.pk-info {
  width: 586px;
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  line-height: 34px;
}
</style>
