<template>
  <he-popup v-model="showModal" mode="bottom" :border-radius="16">
    <view>
      <view class="he-header">
        <text class="header__title">提现方式</text>
        <text class="iconfont iconpopup_close" @click="showModal = false" />
      </view>
      <view class="he-body">
        <swiper
          class="he-body__swiper"
          :current="index"
          :autoplay="false"
          :vertical="true"
          next-margin="115rpx"
          previous-margin="115rpx"
          @change="changePicker"
        >
          <swiper-item v-for="(item, key) in withdrawalWay" :key="key">
            <view class="he-body__item" :class="[{ active: key === index }]">{{ item.name }} </view>
          </swiper-item>
        </swiper>
        <view class="he-body-line" />
      </view>
      <button class="cu-btn" @click="confirm">确定</button>
      <view class="safe-area-inset-bottom" />
    </view>
  </he-popup>
</template>

<script>
import hePopup from './../../../components/he-popup.vue';
import { mapGetters } from 'vuex';

// 支付方式
const payMethods = {
  wechatDib: '自动到账微信零钱',
  wechat: '提现到微信',
  alipay: '提现到支付宝',
  bankCard: '提现到银行卡'
};

export default {
  name: 'withdrawal-picker',
  components: {
    hePopup
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      index: 0
    };
  },
  computed: {
    showModal: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    ...mapGetters('setting', {
      commissionSetting: 'getCommissionSetting'
    }),
    withdrawalWay({ commissionSetting }) {
      return commissionSetting.withdrawal_way.map(item => {
        return {
          name: payMethods[item],
          value: item
        };
      });
    }
  },
  methods: {
    changePicker(data) {
      this.index = data.detail.current;
    },
    // 确定选择
    confirm() {
      //提现方式 1--自动打款 2--微信打款 3--支付宝打款 4--银行转账

      this.$emit('confirm', this.withdrawalWay[this.index]);
      this.showModal = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import './../../main.less';

.he-header {
  text-align: center;
  line-height: 60px;
  margin-top: 16px;
  padding: 0 32px;
  position: relative;
}

.iconpopup_close {
  font-size: 28px;
  color: #999999;
  position: absolute;
  right: 32px;
}

.header__title {
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
}

.he-body {
  height: 306px;
  position: relative;

  .he-body__swiper {
    height: 320px;
    position: relative;
    z-index: 100;
  }

  .he-body__item {
    height: 85px;
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #666666;
    line-height: 85px;
    text-align: center;
  }

  .he-body__item.active {
    @include font_color('font_color');
  }
}

.he-body-line {
  position: absolute;
  width: 686px;
  height: 85px;
  margin: 0 32px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  top: 115px;
  left: 0;
}

.cu-btn {
  width: 686px;
  height: 80px;
  @include background_color('background_color');
  border-radius: 40px;
  font-size: 30px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #ffffff;
  margin: 20px 32px;
}
</style>
