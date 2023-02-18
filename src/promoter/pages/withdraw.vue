<template>
  <view class="he-page-content" :data-theme="theme" :class="loading ? 'flex justify-center align-center' : ''">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <view class="flex align-center flex-direction">
        <view class="he-title">待提现佣金</view>
        <view class="he-cash--withdrawal">{{ commission }}</view>
        <button class="cu-btn he-router--detail flex align-center" @click="routerWithDrawList">
          <text>提现明细</text>
          <text class="iconfont iconbtn_arrow"></text>
        </button>
      </view>
      <view class="he-card flex justify-between align-center he-method">
        <text class="he-title--line">提现方式</text>
        <button
          class="cu-btn flex align-center he-method--select"
          v-if="Array.isArray(withdrawalWay)"
          @click="showWithdrawalPicker = true"
        >
          <text v-if="!form.type">请选择提现方式</text>
          <text v-else class="select">{{ form.type.name }}</text>
          <text class="iconfont iconbtn_arrow"></text>
        </button>
        <text v-else class="he-title--line">{{ withdrawalWay.name }}</text>
      </view>
      <!-- 选中提现方式 且不是自动到账微信零钱 -->
      <view class="he-card he-form" v-if="form.type && form.type.value !== 'wechatDib'">
        <view
          class="he-form--item flex align-center"
          v-if="form.type.value === 'alipay' || form.type.value === 'wechat'"
        >
          <label class="he-title--line required">姓名</label>
          <input
            placeholder-class="he-placeholder--class"
            type="text"
            class="flex-sub"
            v-model="form.extra.name"
            placeholder="请填写姓名"
          />
        </view>
        <view class="he-form--item flex align-center" v-if="form.type.value === 'wechat'">
          <label class="he-title--line required">微信号</label>
          <input
            placeholder-class="he-placeholder--class"
            type="text"
            class="flex-sub"
            v-model="form.extra.wechat"
            placeholder="请填写微信号"
          />
        </view>
        <view class="he-form--item flex align-center" v-if="form.type.value === 'alipay'">
          <label class="he-title--line required">支付宝账号</label>
          <input
            placeholder-class="he-placeholder--class"
            type="text"
            class="flex-sub"
            v-model="form.extra.alipay"
            placeholder="请填写支付宝账号"
          />
        </view>
        <view class="he-form--item he-form--item-upload flex align-start"
              v-if="form.type.value === 'alipay' || form.type.value === 'wechat'">
          <label class="he-title--line">上传收款码</label>
          <he-upload-image :max-size="getPicLimit" @on-uploaded="uploaded" @on-remove="removeImage" :max-count="1"></he-upload-image>
        </view>
        <template v-if="form.type.value === 'bankCard'">
          <view class="he-form--item flex align-center">
            <label class="he-title--line">开户人</label>
            <input
              placeholder-class="he-placeholder--class"
              class="flex-sub"
              v-model="form.extra.bank_user_name"
              placeholder="请填写开户人"
            />
          </view>
          <view class="he-form--item flex align-center">
            <label class="he-title--line">开户行</label>
            <input
              placeholder-class="he-placeholder--class"
              class="flex-sub"
              v-model="form.extra.bank_name"
              placeholder="请填写开户行"
            />
          </view>
          <view class="he-form--item flex align-center">
            <label class="he-title--line">银行账号</label>
            <input
              placeholder-class="he-placeholder--class"
              class="flex-sub"
              v-model="form.extra.bank_no"
              placeholder="请填写银行账号"
            />
          </view>
        </template>
      </view>
      <view class="he-card he-amount">
        <view class="he-title--line">提现金额</view>
        <view class="flex he-price" @click="isKeyboard = true">
          <view class="he-price--number">
            {{ form.price }}
            <text v-if="isKeyboard" class="he-focus">|</text>
          </view>
        </view>
        <view v-if="withdrawalRange !== 0" class="he-error--message">
          {{ withdrawalRange === -1 ? '输入金额未达最低提现金额' : '输入金额超过每日最高提现金额' }}
        </view>
        <view class="he-price--prompt">
          最低提现金额￥{{ commissionSetting.min_money | floatPrice }}，每日最高提现金额￥{{
            commissionSetting.max_money | floatPrice
          }}， 提现手续费{{ commissionSetting.poundage }}%
        </view>
      </view>
      <!-- #ifndef H5 -->
      <button class="cu-btn he-withdraw--submit" @click="finance">提现</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <he-open-subscribe @open-subscribe-success="finance" :template-id="subTemplateId">
        <button class="cu-btn he-withdraw--submit">提现</button>
      </he-open-subscribe>
      <!-- #endif -->
      <view
        class="safe-area-inset-bottom"
        :style="[
          {
            height: isKeyboard ? '200rpx' : '0'
          }
        ]"
      />
      <number-keyboard v-model="isKeyboard" @onConfirm="onConfirm" :digital.sync="form.price"/>
      <withdrawal-picker
        v-if="Array.isArray(withdrawalWay)"
        @confirm="value => (form.type = value)"
        v-model="showWithdrawalPicker"
      />
    </template>
  </view>
</template>

<script>
import numberKeyboard from '../../components/keyboard/number-keyboard.vue';
import withdrawalPicker from './components/withdrawal-picker.vue';
// #ifdef H5
import heOpenSubscribe from '../../components/he-open-subscribe.vue';
// #endif
import {mapGetters} from 'vuex';
import {finance, personalCenter} from '../api';
import heLoading from '../../components/he-loading.vue';
import heUploadImage from '@/components/he-upload-image.vue';

// 支付方式
const payMethods = {
  wechatDib: '自动到账微信零钱',
  wechat: '提现到微信',
  alipay: '提现到支付宝',
  bankCard: '提现到银行卡'
};
export default {
  name: 'withdraw',
  components: {
    numberKeyboard,
    withdrawalPicker,
    // #ifdef H5
    heOpenSubscribe,
    // #endif
    heLoading,
    heUploadImage
  },
  data() {
    return {
      commission: '0.00',
      form: {
        price: '',
        type: null,
        extra: {
          name: '',
          bank_name: '',
          bank_no: '',
          bank_user_name: '',
          wechat: '',
          alipay: '',
          receiveCode: ''
        }
      },
      isKeyboard: false,
      showWithdrawalPicker: false,
      withdrawalRange: 0,
      loading: true,
      can_cash: 0
    };
  },
  computed: {
    ...mapGetters('setting', {
      commissionSetting: 'getCommissionSetting',
      getPicLimit: "getPicLimit",
    }),
    withdrawalWay({commissionSetting}) {
      if (commissionSetting.withdrawal_way.length > 1) {
        return commissionSetting.withdrawal_way;
      } else {
        let item = {
          value: commissionSetting.withdrawal_way[0],
          name: payMethods[commissionSetting.withdrawal_way[0]]
        };
        this.form.type = item;
        return item;
      }
    },
    subTemplateId({$store}) {
      let arr = [];
      $store.getters['setting/subscribe'].promoter_withdrawal_success
        ? arr.push($store.getters['setting/subscribe'].promoter_withdrawal_success)
        : null;
      $store.getters['setting/subscribe'].promoter_withdrawal_success
        ? arr.push($store.getters['setting/subscribe'].promoter_withdrawal_error)
        : null;
      return arr;
    },
  },
  methods: {
    routerWithDrawList() {
      uni.navigateTo({
        url: '/promoter/pages/withdraw-list'
      });
    },
    // 提现金额输入确认
    onConfirm() {
      if (this.form.price > this.can_cash) {
        this.withdrawalRange = 1;
      } else if (this.form.price < this.commissionSetting.min_money) {
        this.withdrawalRange = -1;
      } else {
        this.withdrawalRange = 0;
      }
    },
    finance() {
      if (this.withdrawalRange !== 0) return;
      const form = JSON.parse(JSON.stringify(this.form));
      const self = this;
      let type = null;
      if (!form.type) return;
      switch (form.type.value) {
        case 'wechatDib':
          type = 'wechatDib';
          break;
        case 'wechat':
          type = 'wechat';
          break;
        case 'alipay':
          type = 'alipay';
          break;
        case 'bankCard':
          type = 'bankCard';
          break;
      }
      form.type = type;
      try {
        // #ifndef H5
        wx.requestSubscribeMessage({
          tmplIds: self.subTemplateId,
          success: function () {
          },
          fail: function () {
          },
          complete: function () {
            // 提现接口
            finance(form)
              .then(() => {
                uni.showToast({
                  title: '提交成功',
                  icon: 'none',
                  success() {
                    setTimeout(() => {
                      uni.navigateTo({
                        url: '/promoter/pages/withdraw-list'
                      });
                    }, 1000);
                  }
                });
              })
              .catch(error => {
                uni.showToast({
                  title: error.data.message,
                  icon: 'none'
                });
              });
          }
        });
        // #endif
        // #ifdef H5
        finance(form)
          .then(() => {
            uni.showToast({
              title: '提交成功',
              icon: 'none',
              success() {
                setTimeout(() => {
                  uni.navigateTo({
                    url: '/promoter/pages/withdraw-list'
                  });
                }, 1000);
              }
            });
          })
          .catch(error => {
            uni.showToast({
              title: error.data.message,
              icon: 'none'
            });
          });
        // #endif
      } catch (e) {
      }
    },
    removeImage() {
      this.form.extra.receiveCode = "";
    },
    uploaded(val) {
      this.form.extra.receiveCode = val[0];
    }
  },
  async onLoad(option) {
    this.commission = option.commission;
    const response = await personalCenter();
    await this.$store.dispatch('setting/getSetting');
    this.loading = false;
    this.can_cash = response.can_cash;
  },
  watch: {
    isKeyboard: {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            uni.pageScrollTo({
              scrollTop: 1000
            });
          });
        } else {
          this.onConfirm();
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../main.less';

.iconbtn_arrow {
  font-size: 20px;
  margin-left: 8px;
}

.he-text--center {
  text-align: center;
}

.he-title {
  font-size: 28px;
  font-weight: 500;
  color: #999999;
  line-height: 48px;
  margin-bottom: 8px;
  @extend .font-family-sc;
}

.he-cash--withdrawal {
  font-size: 56px;
  font-weight: bold;
  color: #222222;
  line-height: 56px;
  margin-bottom: 16px;
  @extend .font-family-sc;

  &:before {
    content: '￥';
    margin-left: -20px;
  }
}

.he-router--detail {
  font-size: 28px;
  font-weight: 500;
  color: #999999;
  height: 48px;
  background: transparent;
  margin-bottom: 48px;
  @extend .font-family-sc;

  .iconbtn_arrow {
    color: #bebebe;
  }
}

.he-page-content {
  background: #f5f5f5;
  padding: 48px 20px 50px 20px;
}

.he-title--line {
  font-size: 26px;
  font-weight: 500;
  color: #222222;
  @extend .font-family-sc;
}

.he-method {
  padding: 38px 25px;

  .iconbtn_arrow {
    color: #cccccc;
  }
}

.he-method--select {
  padding: 0;
  height: 30px;
  font-size: 26px;
  font-weight: 500;
  color: #cccccc;
  @extend .font-family-sc;
  background: transparent;

  .select {
    color: #222222;
  }
}

.he-form {
  padding: 16px 24px;

  .he-form--item {
    height: 100px;

    &:not(:last-child) {
      border-bottom: 1px solid #e5e5e5;
    }

    .he-title--line {
      width: 156px;

      &.required:before {
        content: "*";
        color: #F5212D;
      }
    }
  }

  .he-form--item-upload {
    height: 224px;
    padding: 37px 0;
  }
}

.he-amount {
  padding: 16px 24px 24px 24px;

  .he-title--line {
    line-height: 80px;
  }

  .he-price {
    color: #222222;
    line-height: 120px;
    border-bottom: 1px solid #e5e5e5;
    @extend .font-family-sc;
  }

  .he-price--number {
    font-size: 88px;
    font-weight: bold;
    display: table-cell;
    vertical-align: bottom;
    @extend .font-family-sc;

    &:before {
      content: '￥';
      font-size: 60px;
      font-weight: 500;
      margin-right: 16px;
    }
  }

  .he-amount--footer {
    //padding-top: 24px;
  }

  .he-error--message {
    font-size: 26px;
    font-weight: 500;
    color: #f5212d;
    line-height: 32px;
    margin-top: 26px;
    @extend .font-family-sc;
  }

  .he-price--prompt {
    font-size: 26px;
    font-weight: 500;
    color: #999999;
    line-height: 32px;
    margin-top: 26px;
    @extend .font-family-sc;
  }
}

.he-withdraw--submit {
  width: 100%;
  height: 80px;
  @extend .font-family-sc;
  @include background_color('background_color');
  border-radius: 40px;
  font-size: 28px;
  font-weight: 500;
  color: #ffffff;
  margin-top: 64px;
}

.he-focus {
  animation: focus 1.2s infinite;
  display: inline-block;
  transform: scaleX(0.3);
  color: #4e6ef2;
}

@keyframes focus {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
