<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-box he-info">
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">头像</text>
        <view class="he-item__value">
          <button open-type="chooseAvatar" class="avatar-button" @chooseavatar="onChooseAvatar">
            <image :src="form.avatar" class="he-item__image" />
          </button>
        </view>
      </view>
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">ID</text>
        <text class="he-item__value">{{ form.id }}</text>
      </view>
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">昵称</text>
        <input
               type="nickname"
               v-model="form.nickname"
               :maxlength="15"
               @change="getNickname"
               class="he-item__value"
               placeholder-style="font-size: 26rpx;font-family: PingFang SC;font-weight: 500;color: #999999;"
               placeholder="请填写昵称" />
      </view>
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">姓名</text>
        <input
               type="text"
               v-model="form.realname"
               :maxlength="10"
               class="he-item__value"
               placeholder-style="font-size: 26rpx;font-family: PingFang SC;font-weight: 500;color: #999999;"
               placeholder="请填写姓名" />
      </view>
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">性别</text>
        <view class="flex align-center" @click="showModalSex = true">
          <text class="he-item__value he-area-text" v-if="form.gender">
            <text v-if="form.gender === 1">男</text>
            <text v-if="form.gender === 2">女</text>
          </text>
          <text v-else class="he-placeholder he-area-text">请选择性别</text>
          <view class="iconfont iconbtn_arrow"></view>
        </view>
      </view>
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">生日</text>
        <view class="flex align-center" @click="showModalDate = true">
          <text class="he-item__value he-area-text" v-if="form.birthday">
            {{ form.birthday }}
          </text>
          <text v-else class="he-placeholder he-area-text">请选择生日</text>
          <view class="iconfont iconbtn_arrow"></view>
        </view>
      </view>
      <view class="he-info__item flex align-center justify-between">
        <text class="he-item__label">地区</text>
        <view class="flex align-center" @click="isAddress = true">
          <template v-if="form.province && form.city && form.district">
            <text class="he-item__value he-area-text"> {{ form.province }}/{{ form.city }}/{{ form.district }} </text>
          </template>
          <template v-else>
            <text v-if="form.area" class="he-item__value he-area-text">
              {{ form.area }}
            </text>
            <text v-else class="he-placeholder he-area-text">请选择地区</text>
          </template>
          <view class="iconfont iconbtn_arrow"></view>
        </view>
      </view>
      <view class="he-info__item flex align-center justify-between" style="border-bottom: 0">
        <text class="he-item__label">微信号</text>
        <input
               type="text"
               v-model="form.wechat"
               :maxlength="20"
               class="he-item__value"
               placeholder-style="font-size: 26rpx;font-family: PingFang SC;font-weight: 500;color: #999999;"
               placeholder="请填写微信号" />
      </view>
    </view>
    <button class="cu-btn he-save" @click="submit" :style="{ backgroundColor: themeColor }">保存用户信息</button>
    <he-select-address v-model="isAddress" @select="selectArea" :select="form"></he-select-address>
    <he-popup mode="bottom" v-model="showModalSex" :borderRadius="16">
      <view class="he-select-sex" :data-theme="theme">
        <view class="he-header">
          <text class="he-header__title">选择性别</text>
          <text class="iconfont iconpopup_close fr" @click="showModalSex = false"></text>
        </view>
        <view class="he-body">
          <view class="he-body-sex">
            <swiper
                    class="he-body-sex__swiper"
                    :current="gender"
                    :autoplay="false"
                    :vertical="true"
                    next-margin="115rpx"
                    previous-margin="115rpx"
                    @change="setSex">
              <swiper-item>
                <view class="he-body-sex__item"> </view>
              </swiper-item>
              <swiper-item>
                <view class="he-body-sex__item" :class="{ active: 1 === gender }">男</view>
              </swiper-item>
              <swiper-item>
                <view class="he-body-sex__item" :class="{ active: 2 === gender }">女</view>
              </swiper-item>
            </swiper>
          </view>
          <view class="he-body-line"> </view>
        </view>
        <view class="he-body-btn" :style="{ backgroundColor: themeColor }" @click="setGenderStatus"> 确定 </view>
      </view>
    </he-popup>
    <he-popup mode="bottom" v-model="showModalDate" :borderRadius="16" @close="getDateStatus">
      <view class="he-select-date" :data-theme="theme">
        <view class="he-header">
          <text class="he-header__title">请选择生日</text>
          <text class="iconfont iconpopup_close fr" @click="showModalDate = false"></text>
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
                    ">
              <swiper-item v-for="index in 120" :key="index">
                <!-- #ifdef H5 -->
                <view class="he-body-date__item" :class="{ active: index == data1 + 1 }">{{ getYear(index) - 1 }}年
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
                    ">
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
          <view class="he-body-date">
            <swiper
                    class="he-body-date__swiper"
                    :current="data3"
                    :autoplay="false"
                    :vertical="true"
                    next-margin="160rpx"
                    previous-margin="160rpx"
                    @change="
                      e => {
                        data3 = e.detail.current;
                      }
                    ">
              <swiper-item v-for="index in month" :key="index">
                <!-- #ifdef H5 -->
                <view class="he-body-date__item" :class="{ active: index == data3 + 1 }">{{ index }}日</view>
                <!-- #endif -->
                <!--  #ifdef MP-WEIXIN -->
                <view class="he-body-date__item" :class="{ active: index == data3 }">{{ index + 1 }}日</view>
                <!-- #endif -->
              </swiper-item>
            </swiper>
          </view>
          <view class="he-body-line" style="position: absolute; top: 40%"> </view>
        </view>
        <view class="he-body-btn" :style="{ backgroundColor: themeColor }" @click="getDateStatus"> 确定 </view>
      </view>
    </he-popup>
  </view>
</template>
<script>
import heSelectAddress from '@/components/he-select-address.vue';
import heSwitch from '@/components/he-switch.vue';
import hePopup from '@/components/he-popup.vue';

export default {
  name: 'address-edit',
  components: {
    heSelectAddress,
    heSwitch,
    hePopup
  },
  data() {
    return {
      userinfo: {},
      gender: 1,
      date: '',
      data1: 100,
      data2: 0,
      data3: 0,
      showModalSex: false,
      showModalDate: false,
      form: {
        realname: null,
        avatar: '',
        gender: 1,
        birthday: null,
        area: null,
        wechat: null
      },
      id: null,
      isAddress: false
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
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {
    this.getLoadUserInfo();
  },
  methods: {
    setGenderStatus() {
      this.form.gender = this.gender;
      this.showModalSex = false;
    },
    getDateStatus() {
      this.form.birthday = this.getYear(this.data1) + '年' + (this.data2 + 1) + '月' + (this.data3 + 1) + '日';
      this.showModalDate = false;
    },
    /**
     * [getLoadUserInfo description]
     * @return {[type]} [description]
     */
    getLoadUserInfo() {
      this.$heshop
        .users('get', { behavior: 'info' })
        .then(res => {
          this.form = res;
          this.gender = res.gender;
        })
        .catch(err => { });
    },
    /**
     * [getLoadUserInfo description]
     * @return {[type]} [description]
     */
    submit() {
      if (this.form.province && this.form.city && this.form.district) {
        this.form.area = this.form.province + '/' + this.form.city + '/' + this.form.district;
      }
      this.$heshop
        .users('put', { behavior: 'setting' }, this.form)
        .then(res => {
          uni.showToast({
            title: '保存成功',
            duration: 2000
          });
          setTimeout(function () {
            uni.switchTab({ url: '/pages/user/index' });
          }, 2000);
        })
        .catch(err => { });
    },
    /**
     * 选择男女
     * @param {[type]} e [description]
     */
    setSex(e) {
      if (e.detail.current === 0) {
        this.gender = e.detail.current;
        this.$nextTick(() => {
          this.gender = 1;
        });
      }
      if (e.detail.current > 0) {
        this.gender = e.detail.current;
      } else {
        this.gender = e.detail.current;
        this.$nextTick(() => {
          this.gender = 1;
        });
      }
    },
    /**
     * 处理年份
     * @return {[type]} [description]
     */
    getYear(index) {
      var date1 = new Date();
      var date2 = date1.getFullYear() - 120;
      return date2 + index;
    },
    chooseAddress: function () {
      let _this = this;
      uni.chooseAddress({
        success: function (res) {
          _this.form.name = res.userName;
          _this.form.mobile = res.telNumber;
          _this.form.province = res.provinceName;
          _this.form.city = res.cityName;
          _this.form.address = res.detailInfo;
          _this.form.district = res.countyName;
        },
        fail: function (err) {
          _this.$toError(err);
        }
      });
    },
    getAddress: function (id) {
      let _this = this;
      this.$heshop
        .address('get', id)
        .then(function (res) {
          _this.form = res;
        })
        .catch(function (err) {
          _this.$toError(err);
        });
    },
    setArea: function (e) {
      this.form.address = e.detail.value;
    },
    setStatus: function () {
      this.form.status = this.form.status === 0 ? 1 : 0;
    },
    selectArea: function (area) {
      this.form.province = area[0].name;
      this.form.city = area[1].name;
      this.form.district = area[2].name;
    },
    onChooseAvatar: function (e) {
      this.uploadImg(e.detail.avatarUrl)
    },
    getNickname(e) {
      this.form.nickname = e.detail.value;
    },
    uploadImg(filePath) {
      let _this = this;
      this.$h.srcToBase64(filePath).then(function (res) {
        _this.$heshop
          .upload(res)
          .then(function (data) {
            _this.form.avatar = data;
          });
      });
    }
  },
  onLoad(options) {
    this.getYear();
    if (options.id) {
      this.id = parseInt(options.id);
    }
  },
  watch: {
    id: function (val) {
      this.getAddress(val);
    },
    selectList: function (val) {
      this.form.province = val[0].name;
      this.form.city = val[1].name;
      this.form.district = val[2].name;
    }
  }
};
</script>
<style scoped lang="scss">
.he-select-sex {
  height: 520px;
  padding: 0 32px;
}

.he-body-sex {
  position: relative;
}

.he-select-sex .he-body-line {
  top: 115px;
  left: 0;
  position: absolute;
}

.he-body-sex__swiper {
  height: 320px;
  position: relative;
  z-index: 100;
}

.he-body-sex__item {
  height: 80px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  line-height: 80px;
  text-align: center;
}

.he-item__image {
  display: inline-block;
  width: 72px;
  height: 72px;
  border-radius: 50%;
}

.avatar-button {
  padding: 0;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0;
}

.he-select-date {
  height: 598px;
  padding: 0 32px;
}

.he-body-date {
  width: 225px;
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

.he-page-content {
  padding: 20px;
}

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

.he-body-item {
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #e5e5e5;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  text-align: center;
  line-height: 80px;
}

.he-body-item.active {
  color: #e60b30;
}

.he-body-line {
  position: absolute;
  width: 100%;
  height: 78px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.he-box {
  background: #ffffff;
  border-radius: 16px;
}

.he-get-address {
  height: 96px;
  line-height: 96px;
  padding: 0 24px 0 32px;
  margin-bottom: 16px;
}

.he-get-address .he-text {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-left: 20px;
}

.iconbtn_arrow {
  width: 22px;
  height: 22px;
  font-size: 22px;
  color: #bebebe;
}

.iconaddress_wechataddress {
  width: 36px;
  height: 36px;
  font-size: 36px;
  color: RGBA(70, 187, 54, 1);
}

.he-info {
  padding: 16px 24px;
  margin-bottom: 16px;
}

.he-info__item {
  height: 100px;
  border-bottom: 1px solid #e5e5e5;
}

.he-item__label {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}

.he-item__value {
  display: inline-block;
  width: 506px;
}

.he-area-text {
  width: 484px;
}

.he-placeholder {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-info__itemOther {
  padding: 38px 0 0 0;
}

.he-info__itemOther .he-item__label {}

.he-info__itemOther .he-item__value {
  height: 127px;
}

.he-default {
  height: 96px;
  padding: 0 24px;
}

.he-default .he-text {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}

.cu-btn {
  width: 710px;
  height: 80px;
  border-radius: 40px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
}

.he-save {
  margin-top: 80px;
  @include background_color('background_color');
  color: #ffffff;
}

.he-delete {
  background: #ffffff;
  border: 1px solid #cccccc;
  color: #222222;
  margin-top: 24px;
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
