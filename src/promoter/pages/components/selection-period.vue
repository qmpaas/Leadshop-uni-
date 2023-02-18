<template>
  <he-popup mode="bottom" v-model="showModal" :borderRadius="16">
    <view class="he-select-date" :data-theme="theme">
      <view class="he-header">
        <text class="he-header__title">时间筛选</text>
        <text class="iconfont iconpopup_close fr" @click="showModal = false"></text>
      </view>
      <view class="he-body flex align-center justify-between">
        <view class="he-body-date">
          <swiper
            class="he-body-date__swiper"
            :current="data1"
            :autoplay="false"
            :vertical="true"
            next-margin="160rpx"
            previous-margin="160rpx"
            @change="
              e => {
                data1 = e.detail.current;
              }
            "
          >
            <swiper-item v-for="index in 120" :key="index">
              <!-- #ifdef H5 -->
              <view class="he-body-date__item" :class="{ active: index == data1 + 1 }"
                >{{ getYear(index) - 1 }}年
              </view>
              <!-- #endif -->
              <!--  #ifdef MP-WEIXIN -->
              <view class="he-body-date__item" :class="{ active: index == data1 }">{{ getYear(index) }}年</view>
              <!-- #endif -->
            </swiper-item>
          </swiper>
        </view>
        <view class="he-body-date">
          <swiper
            class="he-body-date__swiper"
            :current="data2"
            :autoplay="false"
            :vertical="true"
            next-margin="160rpx"
            previous-margin="160rpx"
            @change="
              e => {
                data2 = e.detail.current;
              }
            "
          >
            <swiper-item v-for="index in 12" :key="index">
              <!-- #ifdef H5 -->
              <view class="he-body-date__item" :class="{ active: index == data2 + 1 }">{{ index }}月</view>
              <!-- #endif -->
              <!--  #ifdef MP-WEIXIN -->
              <view class="he-body-date__item" :class="{ active: index == data2 }">{{ index + 1 }}月</view>
              <!-- #endif -->
            </swiper-item>
          </swiper>
        </view>
        <view class="he-body-line" style="position: absolute; top: 40%"></view>
      </view>
      <view class="he-body-btn" :style="{ backgroundColor: themeColor }" @click="getDateStatus"> 确定</view>
    </view>
  </he-popup>
</template>

<script>
import hePopup from './../../../components/he-popup.vue';

export default {
  name: 'selection-period',
  components: {
    hePopup
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      data1: 119,
      data2: 0
    };
  },
  computed: {
    month() {
      let _month = this.data2 + 1;
      let _year = this.getYear(this.data1);
      this.data3 = 0;
      if ((_year % 4 == 0 && _year % 100 != 0) || _year % 400 == 0) {
        if (_month == 2) {
          return 29;
        }
      }
      if (_month == 2) {
        return 28;
      }
      if ([1, 3, 5, 7, 8, 10, 12].indexOf(_month) != -1) {
        return 31;
      }
      return 30;
    },
    showModal: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    getDateStatus() {
      let date = this.getYear(this.data1) + '-' + (this.data2 + 1) + '-01 00:00:00';
      this.$emit('confirm', new Date(date.replace(/-/g, '/')));
      this.showModal = false;
    },
    getYear(index) {
      let date1 = new Date();
      let date2 = date1.getFullYear() - 119;
      return date2 + index;
    }
  },
  mounted() {
    this.getYear();
  }
};
</script>

<style scoped lang="scss">
.he-header {
  height: 56px;
  line-height: 56px;
  text-align: center;
  margin-top: 16px;
}

.iconpopup_close {
  font-size: 28px;
  width: 28px;
  height: 28px;
  line-height: 1;
  color: #9d9d9d;
  margin-top: 18px;
}

.he-header__title {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-body {
  padding: 0 8px;
  margin-top: 32px;
  position: relative;
}
.he-body-line {
  position: absolute;
  width: 100%;
  height: 78px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.he-select-date {
  height: 598px;
  padding: 0 32px;
}

.he-body-date {
  width: 343px;
  height: 400px;
  position: relative;
  z-index: 100;
}

.he-body-date__swiper {
  height: 400px;
}

.he-body-date__item {
  height: 80px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  line-height: 80px;
  text-align: center;
}

.he-body-btn {
  width: 686px;
  height: 80px;
  background: #e60b30;
  border-radius: 40px;
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
  line-height: 80px;
}

.he-body-date__item.active {
  @include font_color('font_color');
}

.he-body-sex__item.active {
  @include font_color('font_color');
}
</style>
