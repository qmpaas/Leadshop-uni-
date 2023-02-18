<template>
  <view class="he-page-content" :data-theme="theme" :class="loading ? 'flex justify-center align-center' : ''">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <template v-if="promoterStatus === -1 || promoterStatus === -2 || isApplyAgain">
        <image :src="promoterPage.apply.bg_url" class="he-ads"></image>
        <!-- 满足条件： 满足的条件 -->
        <view class="he-card he-condition flex flex-direction align-center" v-if="!isApply && type !== 1">
          <view class="flex align-center he-top">
            <text class="iconfont" :class="status ? 'iconsuccess' : 'iconwarning'"></text>
            <text class="he-title">
              {{ !status ? '很遗憾，您暂未满足成为分销商的条件' : '恭喜您，您满足成为分销商的条件' }}
            </text>
          </view>
          <view class="he-center">
            <template v-if="!status">
              <template v-if="type === 5">购买一件指定商品，方可申请成为分销商</template>
              <template v-else-if="type === 4"> 购买任意一件商品，方可申请成为分销商</template>
              <template v-else-if="type === 3 || type === 2">
                <template v-if="type === 3">
                  累计消费次数需达到
                  <text class="he-hit">{{ denominator }}</text>
                </template>
                <template v-else-if="type === 2">
                  累计消费金额需达到
                  <text class="he-hit">￥{{ denominator }}</text>
                </template>
                ，方可申请成为分销商
              </template>
            </template>
            <template v-else>
              <template v-if="type === 5">您已购买一件指定商品，可申请成为分销商</template>
              <template v-else-if="type === 4"> 您已购买任意一件商品，可申请成为分销商</template>
              <template v-else-if="type === 3 || type === 2">
                <template v-if="type === 3">
                  您的累计消费次数已达到
                  <text class="he-hit">{{ denominator }}</text>
                </template>
                <template v-else-if="type === 2">
                  您的累计消费金额已达到
                  <text class="he-hit">￥{{ denominator }}</text>
                </template>
                ，可申请成为分销商
              </template>
            </template>
          </view>
          <template v-if="type === 3 || type === 2">
            <view class="he-progress--bar">
              <view class="he-progress" :animation="animationProgress">
                <view class="he-slider"></view>
              </view>
            </view>
            <view class="he-bottom flex-sub flex align-center" :class="status ? 'justify-end' : 'justify-between'">
              <view>
                已消费
                <text class="he-hit">
                  <template v-if="type === 2"> ￥</template>
                  {{ status ? denominator : numerator }}
                </text>
                <template v-if="type === 3"> 次</template>
              </view>
              <view v-if="!status">
                <template v-if="type === 2"> ￥</template>
                {{ denominator }}
              </view>
            </view>
          </template>
          <button class="cu-btn he-btn" @click="routerGoods" v-if="!status">去逛逛</button>
          <button class="cu-btn he-btn" v-else @click="apply">立即申请</button>
        </view>
        <!-- 满足条件： 需要填写信息 -->
        <view class="he-card he-form" v-if="isApply && !!promoterSetting.need_apply">
          <view
            class="he-item he-hit"
            :style="[
              {
                lineHeight: isBeInvited ? '40rpx' : '80rpx'
              }
            ]"
          >
            欢迎加入【{{ storeSetting.name }}】，请填写申请信息
            <view class="__br"></view>
            {{ isBeInvited ? '邀请人：行走的CD' : '' }}
          </view>
          <view class="he-item flex align-center" v-for="(item, index) in apply_content" :key="index">
            <view class="he-hit">{{ item.name }}</view>
            <input type="text" v-model="item.value" :placeholder="`请输入${item.name}`" />
          </view>
          <view class="he-protocol flex align-center" v-if="isAgreement">
            <he-radio class="he-radio" v-model="isAgree"></he-radio>
            <text @click="isAgree = !isAgree">已阅读且同意协议</text>
            <button class="cu-btn" @click="routerProtocol">《分销商协议》</button>
          </view>
          <button class="cu-btn he-submit" @click="submitApply">提交申请</button>
        </view>
      </template>
      <!-- 提交成功 -->
      <view v-if="promoterStatus === 1" class="he-submit--box he-result--box flex flex-direction align-center">
        <image class="he-image" :src="ipAddress + '/promoter/apply-submit.png'"></image>
        <text class="he-text">申请提交成功，请耐心等待</text>
        <button class="cu-btn he-go-btn" @click="routerIndex">去逛逛</button>
      </view>
      <!-- 商家拒绝 -->
      <view
        v-if="promoterStatus === 3 && !isApplyAgain"
        class="he-refuse--box he-result--box flex flex-direction align-center"
      >
        <image class="he-image" :src="ipAddress + '/promoter/refuse-apply.png'"></image>
        <text class="he-text">不好意思，商家拒绝了您的申请</text>
        <text class="he-information--text" v-if="note">拒绝理由：{{ note }}</text>
        <view>
          <button class="cu-btn he-left-btn" @click="applyAgain">再次申请</button>
          <button class="cu-btn he-go-btn" @click="routerIndex">去逛逛</button>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import heRadio from './../../components/he-radio.vue';
import heLoading from '../../components/he-loading.vue';
import { applyAudit, applyMonitoring, applyPromoter, useAgreement } from '../api';
import { mapGetters } from 'vuex';

export default {
  name: 'apply',
  components: {
    heRadio,
    heLoading
  },
  data() {
    return {
      loading: true,
      isBeInvited: false,
      // 是否统一协议
      isAgree: false,
      // 是否启用分销协议
      isAgreement: 0,
      // 申请条件是否满足
      status: false,
      animationProgress: null,
      type: 1, // 1 无条件 2 累计消费金额 3 累计消费次数 4 购买任意商品 5 购买指定商品
      numerator: null,
      denominator: null,
      isApply: false,
      // 是否为再次申请
      isApplyAgain: false,
      // 申请内容
      apply_content: [],
      // 拒绝理由
      note: null
    };
  },
  computed: {
    promoterStatus: {
      get({ $store }) {
        return $store.state.apply.userInfo.promoter_status; // -2 清退后接到招募令 -1 接到招募令 0 普通用户 1 申请待审核 2 审核通过 3 已拒绝 4 已清退
      },
      set(value) {
        this.$store.state.apply.userInfo.promoter_status = value;
      }
    },
    ...mapGetters('setting', {
      // 获取分销设置
      promoterSetting: 'getPromoter',
      promoterPage: 'getPromoterPage'
    }),
    subTemplateId({ $store }) {
      return [$store.getters['setting/subscribe'].promoter_verify];
    }
  },
  mounted() {
    // 设置页面标题
    uni.setNavigationBarTitle({
      title: this.promoterPage.apply.title
    });
    // 是否启用分销协议
    useAgreement().then(response => {
      this.isAgreement = response;
    });
    // 接到招募令 检测申请条件是否满足
    if (this.promoterStatus < 0) {
      this.getMonitoring().then(response => {
        this.apply_content = this.promoterSetting.apply_content.map(item => {
          return {
            name: item.name,
            value: ''
          };
        });
        this.loading = false;
        // 异步保证元素存在
        this.$nextTick(() => {
          this.progressAnimation(response.percentage);
        });
      });
    } else if (this.promoterStatus === 3) {
      // 申请被拒绝 获取拒绝理由
      applyAudit().then(response => {
        this.note = response.note;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  },
  methods: {
    // 进度条动画
    progressAnimation(number) {
      let pieceAnimation = uni.createAnimation({
        duration: 500,
        timingFunction: 'ease-in',
        delay: 250
      });
      pieceAnimation.width(number + '%').step();
      this.animationProgress = pieceAnimation.export();
    },
    routerProtocol() {
      uni.navigateTo({
        url: '/promoter/pages/protocol'
      });
    },
    // 跳转到首页
    routerIndex() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    routerGoods() {
      const { type, goods_list } = this.promoterSetting.conditions;
      if (type === 5) {
        const list = goods_list.map(item => {
          return item.id;
        });
        uni.navigateTo({
          url: `/pages/goods/search-list?goods_id=${JSON.stringify(list)}`
        });
      } else {
        uni.navigateTo({
          url: `/pages/goods/search-list`
        });
      }
    },
    // 检测申请条件是否满足
    async getMonitoring() {
      const response = await applyMonitoring();
      const { denominator, numerator, status, type } = response;
      this.type = type; // type 条件 1 无条件
      if (this.type === 1) {
        this.isApply = true;
      }
      this.status = status;
      this.denominator = denominator; // 分母
      this.numerator = numerator; // 分子
      let percentage = 0;
      if (status) {
        percentage = 100;
      } else {
        percentage = (numerator / denominator) * 100;
      }
      return {
        percentage
      };
    },
    // 再次申请
    applyAgain() {
      const { conditions, need_apply } = this.promoterSetting;
      // 无需填写 没有条件 但是需要审核
      if (conditions.type === 1 && !need_apply) {
        uni.redirectTo({
          url: '/promoter/pages/recruit'
        });
      } else {
        this.isApplyAgain = true;
        this.loading = true;
        // 需要再次监测是否满足条件
        this.getMonitoring().then(response => {
          this.apply_content = this.promoterSetting.apply_content.map(item => {
            return {
              name: item.name,
              value: ''
            };
          });
          this.loading = false;
          // 异步保证元素存在
          this.$nextTick(() => {
            this.progressAnimation(response.percentage);
          });
        });
      }
    },
    // 提交申请
    submitApply() {
      const self = this;

      // 需要填写申请信息
      function apply() {
        // 判断表单信息不能为空
        const item = self.apply_content.find(item => {
          return !item.value;
        });
        if (item) {
          uni.showToast({
            title: `填写完整${item.name}`,
            icon: 'none'
          });
        } else {
          // 条件通过 可调用接口申请
          // #ifdef MP-WEIXIN
          wx.requestSubscribeMessage({
            tmplIds: self.subTemplateId,
            success: function () {},
            fail: function () {},
            complete: function () {
              self.applyRequest();
            }
          });
          // #endif
          //  #ifdef H5
          self.applyRequest();
          //  #endif
        }
      }

      if (this.isAgreement) {
        if (this.isAgree) {
          apply();
        } else {
          uni.showToast({
            title: '请勾选分销协议',
            icon: 'none'
          });
        }
      } else {
        apply();
      }
    },
    // 立即申请
    apply() {
      // 是否需要填写申请信息
      if (!!this.promoterSetting.need_apply) {
        this.isApply = 1;
        this.apply_content = this.promoterSetting.apply_content.map(item => {
          return {
            name: item.name,
            value: ''
          };
        });
      } else {
        // 不需要填写申请信息 直接申请
        this.applyRequest();
      }
    },
    applyRequest() {
      applyPromoter(this.apply_content).then(response => {
        let userInfo = uni.getStorageSync('userInfo');
        const { status } = response;
        // status 1 待审核 2 审核通过
        userInfo.promoter_status = status;
        // 审核通过
        if (status === 2) {
          uni.redirectTo({
            url: '/promoter/pages/index'
          });
          // promoter_show 原本就是1的话 是清退用户 入口一直存在 不需要修改
          if (userInfo.promoter_show === 0) {
            // 开启分销中心入口
            userInfo.promoter_show = 1;
          }
        }
        // 如果是再申请的情况下关闭申请
        if (this.isApplyAgain) {
          this.isApplyAgain = false;
        }
        this.promoterStatus = status;
        uni.setStorageSync('userInfo', userInfo);
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import './../main.less';

.he-page-content {
  overflow: hidden;
}

.he-ads {
  width: 100%;
  height: 360px;
}

.he-card {
  margin: 24px 20px 46px 20px;
}

.he-condition {
  padding: 72px 0 80px 0;
  background-color: #fff;

  .he-progress--bar {
    margin-top: 56px;
    margin-bottom: 16px;
    width: 560px;
    height: 16px;
    background: #fef3f4;
    border-radius: 8px;

    .he-slider {
      width: 40px;
      height: 40px;
      @include background_color('background_color');
      border: 8px solid #ffffff;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      position: absolute;
      right: 0;
      transform: translateY(-12px);
    }

    .he-progress {
      border-radius: 8px;
      height: 16px;
      width: 0;
      position: relative;
      @include background_color('background_color');
    }
  }

  .he-top {
    margin-bottom: 24px;
  }

  .he-title {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 36px;
  }

  .iconwarning,
  .iconsuccess {
    font-size: 40px;
    margin-right: 16px;
  }

  .iconwarning {
    color: #fbad15;
  }

  .iconsuccess {
    color: #53c41a;
  }

  .he-center {
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #666666;
    line-height: 36px;
  }

  .he-hit {
    @include font_color('font_color');
  }

  .he-btn {
    width: 400px;
    height: 80px;
    margin-top: 80px;
    border-radius: 40px;
    @include background_color('background_color');
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #ffffff;
  }

  .he-bottom {
    width: 560px;
    height: 40px;
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #666666;
  }
}

.he-form {
  padding: 16px 25px 40px 25px;
  overflow: hidden;

  .he-hit {
    font-size: 26px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
  }

  .he-item {
    border-bottom: 1px solid #e5e5e5;
    height: 100px;

    &:first-child {
      height: auto;
      min-height: 80px;
    }

    .he-hit {
      width: 155px;
    }
  }

  .he-textarea {
    padding-top: 37px;
    height: auto;

    .he-input {
      height: 150px;
    }
  }

  .he-protocol {
    margin: 32px 0 0 0;
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;

    .cu-btn {
      padding: 0;
      background-color: transparent;
      height: auto;
      font-size: 24px;
      @extend .font-family-sc;
      font-weight: 500;
      color: #1890ff;
    }

    .he-radio /deep/ {
      display: inline-block;
      margin-right: 9px;

      .he-radio {
        width: 24px;
        height: 24px;
      }

      .he-select {
        font-size: 15px;
      }
    }
  }

  .he-submit {
    @include background_color('background_color');
    height: 80px;
    border-radius: 40px;
    width: 100%;
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #ffffff;
    margin-top: 40px;
  }
}

.he-result--box {
  padding-top: 160px;

  .he-image {
    width: 317px;
    height: 320px;
  }

  .he-text {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 34px;
  }

  .he-go-btn {
    height: 80px;
    @include background_color('background_color');
    border-radius: 40px;
    padding: 26px 80px;
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #ffffff;
    margin-top: 45px;
  }
}

.he-refuse--box {
  .he-information--text {
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;
    line-height: 34px;
    margin-top: 8px;
    max-width: 480px;
    word-break: break-all;
  }

  .cu-btn {
    &:first-child {
      margin-right: 20px;
      height: 80px;
      border: 1px solid transparent;
      @include border_color('border_color');
      font-size: 28px;
      @extend .font-family-sc;
      font-weight: 500;
      @include font_color('font_color');
      border-radius: 40px;
      background-color: transparent;
      padding: 26px 64px;
    }

    &:last-child {
      margin-left: 20px;
    }
  }
}
</style>
