<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-box">
      <view class="he-item flex align-center" @click="navigateTo">
        <view class="he-item__label">物流公司</view>
        <view class="flex-sub flex align-center justify-between">
          <view class="he-placeholder" :class="user_freight_info.logistics_company ? 'he-is-name' : ''">{{
            user_freight_info.logistics_company ? user_freight_info.logistics_company : '请填写物流公司'
          }}</view>
          <text class="iconfont iconbtn_arrow"></text>
        </view>
      </view>
      <view class="he-item flex align-center">
        <view class="he-item__label">物流单号</view>
        <input
          type="text"
          class="he-item__input flex-sub"
          onkeyup="user_freight_info.freight_sn=user_freight_info.freight_sn.replace(/[^\d]/g,'')"
          maxlength="20"
          v-model="user_freight_info.freight_sn"
          placeholder-class="he-placeholder"
          placeholder="请填写物流单号"
        />
      </view>
    </view>
    <!--上传凭证-->
    <view class="he-upload-certificate">
      <view class="he-top">
        <text class="he-text">上传凭证</text>
        <text class="he-help">({{ user_freight_info.images.length }}/4)</text>
        <text class="he-help he-desc">选填</text>
      </view>
      <view class="he-bottom">
        <he-upload-image @on-uploaded="uploaded" @on-remove="removeImage" :max-count="4"></he-upload-image>
      </view>
    </view>
    <button class="cu-btn he-submit-btn" :disabled="isSubmit" @click="submit">提交</button>
  </view>
</template>
<script>
import heUploadImage from '@/components/he-upload-image.vue';

export default {
  name: 'fill-return-information',
  components: {
    heUploadImage
  },
  computed: {
    isSubmit: function () {
      return !this.user_freight_info.logistics_company || !this.user_freight_info.freight_sn;
    }
  },
  data() {
    return {
      id: null,
      user_freight_info: {
        logistics_company: '',
        freight_sn: '',
        images: [],
        code: ''
      },
      list: []
    };
  },
  onLoad(option) {
    this.id = option.id;
    this.user_freight_info.logistics_company = option.name;
    this.user_freight_info.code = option.code;
    this.user_freight_info.mobile = option.mobile;
  },
  methods: {
    uploaded: function (v) {
      this.user_freight_info.images = v.map(function (item) {
        return item.response;
      });
    },
    removeImage: function (v) {
      this.user_freight_info.images.slice(v, 1);
    },
    submit: function () {
      let _this = this;
      this.$heshop
        .orderafter(
          'put',
          {
            id: this.id,
            behavior: 'salesexchange'
          },
          { user_freight_info: this.user_freight_info }
        )
        .then(function () {
          _this.$store.commit('order/setShip', {
            bool: true,
            id: _this.id
          });
          uni.navigateBack({
            delta: 1
          });
        })
        .catch(function (err) {
          _this.$toError(err);
        });
    },
    navigateTo: function () {
      uni.redirectTo({
        url: '/pages/other/logisticsCompany?id=' + this.id + '&mobile=' + this.user_freight_info.mobile
      });
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
  height: 233px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 16px;
}

.he-item {
  height: 100px;
}

.he-item:first-child {
  border-bottom: 1px solid rgba(229, 229, 229, 1);

  .he-placeholder {
    margin-left: 55px;
  }

  .he-is-name {
    color: #222222;
  }

  .iconbtn_arrow {
    font-size: 20px;
    color: #bebebe;
  }
}

.he-item .he-item__label {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}

.he-item .he-item__input {
  margin-left: 55px;
  color: #222222;
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
}

.he-placeholder {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-upload-certificate {
  width: 710px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 0px 12px 24px;
}

.he-top {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
}

.he-text {
  color: #222222;
}

.he-help {
  color: #999999;
  margin-left: 16px;
}

.he-desc {
  font-size: 24px;
}

.he-bottom {
  margin-top: 24px;
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
  margin-top: 80px;
}

.he-submit-btn[disabled] {
  background: #cccccc !important;
  color: #ffffff;
}
</style>
