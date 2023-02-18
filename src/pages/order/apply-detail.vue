<template>
  <view class="he-page-content" :data-theme="theme">
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
    <apply-detail-operating
      :freight-amount="freight_amount"
      :is-entire="is_entire"
      v-model="data"
      :goods="goods"
    ></apply-detail-operating>
    <apply-detail-description v-model="data.user_note"></apply-detail-description>
    <apply-detail-upload-certificate :list.sync="data.images"></apply-detail-upload-certificate>
    <!-- #ifdef MP-WEIXIN -->
    <button class="cu-btn he-submit-btn" :disabled="isSubmit" @click="submit">提交</button>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <he-open-subscribe @open-subscribe-success="submit" :template-id="tmplIds">
      <button class="cu-btn he-submit-btn" :disabled="isSubmit">提交</button>
    </he-open-subscribe>
    <!-- #endif -->
  </view>
</template>
<script>
import applyDetailOperating from './components/applyDetail-operating.vue';
import applyDetailDescription from './components/applyDetail-description.vue';
import applyDetailUploadCertificate from './components/applyDetail-upload-certificate.vue';
import heOpenSubscribe from '../../components/he-open-subscribe.vue';

export default {
  name: 'apply-after-sales-detail',
  computed: {
    isSubmit: function () {
      return this.data.type !== 2 && !this.data.return_reason;
    },
    tmplIds: function () {
      let tmplIds = [this.$store.getters['setting/subscribe'].order_sale_verify];
      if (this.data.type !== 2) {
        tmplIds.push(this.$store.getters['setting/subscribe'].order_refund_tpl);
      }
      if (this.$manifest('task', 'status')) {
        tmplIds.push(this.$store.getters['setting/subscribe'].task_refund_tpl);
      }
      return tmplIds;
    }
  },
  components: {
    applyDetailOperating,
    applyDetailDescription,
    applyDetailUploadCertificate,
    heOpenSubscribe
  },
  data() {
    return {
      is_task: 0,
      goods: [],
      data: {
        order_goods_id: 0,
        type: 2,
        return_number: 1,
        return_amount: 0,
        return_reason: '',
        images: [],
        user_note: ''
      },
      is_entire: 0,
      // 运费
      freight_amount: 0
    };
  },
  onLoad(options) {
    this.goods = JSON.parse(decodeURIComponent(options.good));
    //此处一定要做类型转换，否则判断会错误的
    this.is_task = Number(options.is_task);
    this.is_entire = Number(options.is_entire);
    if (!this.$h.test.isEmpty(options.freight_amount)) {
      this.freight_amount = Number(options.freight_amount);
    }
    let goods_number = 0;
    let pay_amount = 0;
    let score_amount = 0;
    for (let i = 0; i < this.goods.length; i++) {
      goods_number += this.goods[i].goods_number;
      pay_amount += this.goods[i].pay_amount;
      score_amount += this.goods[i].score_amount;
    }
    this.data = {
      order_type: this.is_task ? 'task' : 'base',
      order_goods_id: parseInt(options.id),
      type: parseInt(options.type),
      return_number: goods_number,
      return_amount: pay_amount,
      return_score: score_amount || 0,
      return_reason: '',
      images: [],
      user_note: '',
      order_sn: options.order_sn
    };
  },
  methods: {
    submit: function () {
      let _this = this;
      // #ifdef MP_WEIXIN
      wx.requestSubscribeMessage({
        tmplIds: _this.tmplIds,
        success: function () {},
        fail: function (e) {},
        complete: function () {
          _this.$heshop
            .orderafter('post', _this.data)
            .then(function () {
              uni.redirectTo({ url: '/pages/order/after-sales-records' });
            })
            .catch(function (err) {
              _this.$toError(err);
            });
        }
      });
      // #endif
      // #ifdef H5
      this.$heshop
        .orderafter('post', this.data)
        .then(function () {
          uni.redirectTo({ url: '/pages/order/after-sales-records' });
        })
        .catch(function (err) {
          _this.$toError(err);
        });
      // #endif
    }
  }
};
</script>
<style scoped lang="scss">
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

.he-goods__image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  margin-right: 24px;
  display: block;
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

.he-submit-btn {
  width: 710px;
  height: 80px;
  @include background_color('background_color');
  border-radius: 40px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  margin: 80px 0 44px 0;
}

.he-submit-btn[disabled] {
  background: #cccccc !important;
  color: #ffffff;
}
</style>
