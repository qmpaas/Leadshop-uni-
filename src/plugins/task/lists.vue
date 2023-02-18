<template>
  <view class="tasl-lists" :data-theme="theme">
    <view class="tasl-lists__header">
      <view class="__header_item first" @click="showModalDate = true">
        {{ date }}
        <le-icon type="iconarrow-down" size="24rpx" color="#BEBEBE" style="padding-left: 4rpx"></le-icon>
      </view>
      <view class="__header_item" @click="showModalType = true">
        {{ type == 0 ? '全部' : '' }}
        {{ type == 1 ? '收入' : '' }}
        {{ type == 2 ? '支出' : '' }}
        <le-icon type="iconarrow-down" size="24rpx" color="#BEBEBE" style="padding-left: 4rpx"></le-icon>
      </view>
    </view>
    <view class="tasl-lists__content">
      <view class="__item" v-for="(item, index) in logList" :key="index">
        <view class="__item_title">{{ item.remark }}</view>
        <view class="__item_date" v-if="item.start_time">{{ item.start_time | timeFormat('mm月dd日') }}</view>
        <view class="__item_number_add" v-if="item.type == 'add'">+{{ item.number }}</view>
        <view class="__item_number_del" v-if="item.type == 'del'">{{ item.number }}</view>
      </view>
      <!--<view class="__empty" v-if="logList.length<1">
                <image src="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/task-list-empty.png"></image>
                <view class="__empty_tips">暂无相关明细</view>
            </view> -->
    </view>
    <he-load-more v-if="logList.length > 0" :status="loadStatus"></he-load-more>
    <he-no-content-yet
      image="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/task-list-empty.png"
      v-if="isNothing"
      text="暂无相关明细"
    ></he-no-content-yet>
    <he-popup mode="bottom" v-model="showModalDate" :borderRadius="16">
      <view class="he-select-date" :data-theme="theme">
        <view class="he-header">
          <text class="he-header__title">时间筛选</text>
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
              "
            >
              <swiper-item v-for="index in 3" :key="index">
                <!-- #ifdef H5 -->
                <view class="he-body-date__item" :class="{ active: index == data1 + 1 }"
                  >{{ getYear(index) - 1 }}年</view
                >
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
          <view class="he-body-line" style="position: absolute; top: 40%"> </view>
        </view>
        <view class="he-body-btn" :style="{ backgroundColor: themeColor }" @click="handleModalDate"> 确定 </view>
      </view>
    </he-popup>
    <he-popup mode="bottom" v-model="showModalType" :borderRadius="16">
      <view class="he-select-sex" :data-theme="theme">
        <view class="he-header">
          <text class="he-header__title">类型筛选</text>
          <text class="iconfont iconpopup_close fr" @click="showModalType = false"></text>
        </view>
        <view class="he-body">
          <view class="he-body-sex">
            <swiper
              class="he-body-sex__swiper"
              :current="typeSelect"
              :autoplay="false"
              :vertical="true"
              next-margin="40px"
              previous-margin="40px"
              @change="
                e => {
                  typeSelect = e.detail.current;
                }
              "
            >
              <swiper-item>
                <view class="he-body-sex__item" :class="{ active: 0 === typeSelect }">全部</view>
              </swiper-item>
              <swiper-item>
                <view class="he-body-sex__item" :class="{ active: 1 === typeSelect }">收入</view>
              </swiper-item>
              <swiper-item>
                <view class="he-body-sex__item" :class="{ active: 2 === typeSelect }">支出</view>
              </swiper-item>
            </swiper>
          </view>
          <view class="he-body-line"> </view>
        </view>
        <view class="he-body-btn" :style="{ backgroundColor: themeColor }" @click="handleModalType"> 确定 </view>
      </view>
    </he-popup>
  </view>
</template>
<script type="text/javascript">
import heNoContentYet from '@/components/he-no-content-yet.vue';
import heLoadMore from '@/components/he-load-more.vue';
import hePopup from '@/components/he-popup.vue';

export default {
  name: 'index',
  components: {
    heNoContentYet,
    heLoadMore,
    hePopup
  },
  data() {
    return {
      typeSelect: 0,
      date: '',
      data1: 2,
      data2: 0,
      type: 0,
      showModalDate: false,
      showModalType: false,
      logList: [],
      isNothing: false,
      loadStatus: 'loadmore',
      page: {
        current: 1,
        count: 1
      },
      where: {
        date: '',
        type: 0
      }
    };
  },
  computed: {
    /**
     * 计算获取月
     * @return {[type]} [description]
     */
    month() {
      let _month = this.data2 + 1;
      let _year = this.getYear(this.data1);
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
   * 数据监听
   * @type {Object}
   */
  watch: {
    // showModalDate(value) {
    //     if (value === false) {
    //         this.handleInitialize();
    //     }
    // },
    showModalType(value) {
      if (value === false) {
      }
    }
  },
  /**
   * 页面加载时执行
   * @return {[type]} [description]
   */
  mounted() {
    this.data2 = this.getMonth();
    this.date = this.getYear(this.data1) + '年' + (this.data2 + 1) + '月';
    this.handleInitialize();
  },
  /**
   * 下拉更新数据
   * @return {[type]} [description]
   */
  onReachBottom() {
    let that = this;
    if (this.page.count > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      this.handleLoadData().then(function (res) {
        that.logList.push(...res);
        that.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  },
  methods: {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    format(date, fmt) {
      //author: meizz
      let t = this.timestampToTime(date);
      date = new Date(t);
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      return fmt;
    },
    /**
     * 年月日格式化
     * @param  {[type]} timestamp [description]
     * @return {[type]}           [description]
     */
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    /**
     * 处理年份
     * @return {[type]} [description]
     */
    getYear(index) {
      var date1 = new Date();
      var date2 = date1.getFullYear() - 3;
      return date2 + index + 1;
    },
    /**
     * 处理月份
     * @return {[type]} [description]
     */
    getMonth() {
      return new Date().getMonth();
    },
    /**
     * 设置日期
     * @return {[type]} [description]
     */
    handleModalDate() {
      this.date = this.getYear(this.data1) + '年' + (this.data2 + 1) + '月';
      this.handleInitialize();
      this.showModalDate = false;
    },
    /**
     * 选择类型
     * @return {[type]} [description]
     */
    handleModalType() {
      this.type = this.typeSelect;
      this.handleInitialize();
      this.showModalType = false;
    },
    /**
     * 执行初始化数据
     * @return {[type]} [description]
     */
    handleInitialize() {
      //执行数据加载
      this.handleLoadData(0, 1).then(data => {
        this.logList = data;
        this.isNothing = this.logList.length === 0;
        this.loadStatus = this.logList.length < 10 ? 'nomore' : 'loadmore';
      });
    },
    /**
     * 执行用户数据加载
     * @return {[type]} [description]
     */
    handleLoadData() {
      let that = this;
      return new Promise(function (resolve, reject) {
        that.$heshop
          .plugin('get', {
            include: 'task',
            model: 'log',
            year: that.getYear(that.data1),
            month: that.data2 + 1,
            type: that.type
          })
          .page(that.page.current, 20)
          .then(res => {
            let { data, headers } = res;
            // #ifdef MP-WEIXIN
            that.page = {
              current: +headers['X-Pagination-Current-Page'],
              count: +headers['X-Pagination-Page-Count']
            };
            // #endif
            // #ifdef H5
            that.page = {
              current: +headers['x-pagination-current-page'],
              count: +headers['x-pagination-page-count']
            };
            // #endif
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}

.tasl-lists {
  background-color: #f5f5f5;
  padding: 20px;
  min-height: 100vh;
  width: 750px;
  background-color: RGBA(245, 245, 245, 1);

  &__header {
    display: flex;
    width: 710px;
    height: 80px;
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 0;

    .__header_item {
      width: 355px;
      height: 48px;
      line-height: 48px;
      text-align: center;
    }

    .__header_item.first {
      border-right: 1px solid #e5e5e5;
    }
  }

  &__content {
    margin-bottom: 37px;

    .__item {
      position: relative;
      width: 710px;
      height: 120px;
      background: #ffffff;
      border-radius: 16px;
      margin-top: 16px;

      &_title {
        position: absolute;
        left: 23px;
        top: 26px;

        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        line-height: 36px;
      }

      &_date {
        position: absolute;
        left: 23px;
        top: 70px;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }

      &_number_add {
        position: absolute;
        right: 24px;
        top: 49px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #53c41a;
        line-height: 36px;
      }

      &_number_del {
        position: absolute;
        right: 24px;
        top: 49px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #53c41a;
        line-height: 36px;
      }
    }

    .__empty {
      width: 100%;
      text-align: center;

      image {
        width: 320px;
        height: 320px;
      }
    }

    .__empty_tips {
      width: 100%;
      text-align: center;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 34px;
    }
  }

  .he-select-date {
    height: 620px;
    padding: 0 32px;
  }

  .he-body-date {
    width: 50%;
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
    height: 80px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    top: 145px;
    left: 0;
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

  .he-select-sex {
    height: 460px;
    padding: 0 32px;
  }

  .he-body-sex {
    position: relative;
  }

  .he-select-sex .he-body-line {
    top: 80px;
    left: 0;
    position: absolute;
  }

  .he-body-sex__swiper {
    height: 240px;
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

  .he-body-sex__item.active {
    color: #e60b30;
  }
}

.he-body-date__item.active {
  @include font_color('font_color');
}

.he-body-sex__item.active {
  @include font_color('font_color');
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
  margin-top: 20px;
}
</style>
