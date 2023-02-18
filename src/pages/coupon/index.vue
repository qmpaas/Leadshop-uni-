<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-tabs flex" id="he-tabs">
      <view
        class="he-tab-item flex-sub"
        id="he-tab-item-unused"
        @tap="clickTab(0)"
        :class="status === 0 ? 'he-tab-item-active' : ''"
      >
        未使用
      </view>
      <view
        class="he-tab-item flex-sub"
        id="he-tab-item-used"
        @tap="clickTab(1)"
        :class="status === 1 ? 'he-tab-item-active' : ''"
      >
        已失效
      </view>
      <view class="he-tab-bar" :style="[tabBarStyle]"></view>
    </view>
    <view class="he-list">
      <view
        class="he-list-item"
        @click="navigateTo('/pages/coupon/detail?id=' + item.id)"
        :class="status === 1 ? 'he-item-expired' : 'he-item-available'"
        v-for="(item, index) in list"
        :key="index"
      >
        <view class="he-item-top flex">
          <view class="he-item-number">
            <view class="he-item-price">{{ item.coupon.sub_price | setNumber }}</view>
            <view class="he-item-condition">
              <template v-if="Number(item.coupon.min_price) > 0"> 满{{ Number(item.coupon.min_price) }}可用 </template>
              <template v-else> 无门槛使用 </template>
            </view>
          </view>
          <view class="he-item-text">
            <view class="he-item-name">{{ item.coupon.name }}</view>
            <view class="he-item-prompt">{{ item.coupon.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}</view>
          </view>
          <view class="he-item-button flex-sub flex justify-end align-center" v-if="item.status === 0">
            <button
              class="cu-btn he-button"
              @click.stop="navigateTo('/pages/goods/search-list?coupon_id=' + item.coupon_id)"
            >
              立即使用
            </button>
          </view>
          <image class="he-item-image" v-else :src="item.status | img(ipAddress)" mode="" />
        </view>
        <view class="he-item-center">
          <view class="he-doc he-doc-left"></view>
          <view class="he-doc he-doc-right"></view>
          <view class="he-border-line" :style="[lineColor]"></view>
        </view>
        <view class="he-item-bottom">
          <view class="he-bottom-content flex align-center justify-between">
            <view class="he-item-text">
              {{ item.begin_time | timeFormat('yyyy-mm-dd hh:MM:ss') }} -
              {{ item.end_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}
            </view>
            <view class="flex align-center">
              <text class="he-item-text">详细</text>
              <text class="iconfont iconbtn_arrow"></text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
    <he-no-content-yet
      :image="ipAddress + '/coupon-index-nothing.png'"
      v-if="isNothing"
      text="该分类下暂无优惠券"
    ></he-no-content-yet>
  </view>
</template>
<script>
import heNoContentYet from '../../components/he-no-content-yet.vue';
import heLoadMore from '../../components/he-load-more.vue';

export default {
  name: 'index',
  components: {
    heNoContentYet,
    heLoadMore
  },
  data() {
    return {
      barFirstTimeMove: true,
      tabQueryInfo: [],
      status: 0,
      scrollBarLeft: uni.upx2px(750 / 4),
      list: [],
      isNothing: false,
      page: {
        current: 1,
        count: 1
      },
      loadStatus: 'loadmore'
    };
  },
  computed: {
    tabBarStyle: function () {
      let style = {
        transform: `translate(${this.scrollBarLeft}px, -100%)`,
        'transition-duration': `${this.barFirstTimeMove ? 0 : 0.5}s`
      };
      return style;
    },
    lineColor: function () {
      let color = this.themeColor;
      if (this.status === 1) {
        color = '#CCCCCC';
      }
      return {
        backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} 50%, transparent 0%)`
      };
    }
  },
  watch: {
    status: {
      handler() {
        this.$nextTick(() => {
          this.scrollByIndex();
        });
      }
    }
  },
  methods: {
    async init() {
      let _this = this;
      this.getTabRect();
      this.getList(0, 1).then(function (data) {
        _this.list = data;
        _this.isNothing = _this.list.length === 0;
        _this.loadStatus = _this.list.length < 10 ? 'nomore' : 'loadmore';
      });
    },
    clickTab(index) {
      if (index == this.status) return;
      let _this = this;
      this.getList(index, 1).then(function (data) {
        _this.list = data;
        _this.isNothing = _this.list.length === 0;
        _this.loadStatus = _this.list.length < 10 ? 'nomore' : 'loadmore';
        _this.status = index;
      });
    },
    getTabRect() {
      let _this = this;
      let query = uni.createSelectorQuery().in(this);
      query.select(`#he-tab-item-unused`).fields({
        size: true,
        rect: true
      });
      query.select(`#he-tab-item-used`).fields({
        size: true,
        rect: true
      });
      query.exec(
        function (res) {
          _this.tabQueryInfo = res;
          _this.scrollByIndex();
        }.bind(this)
      );
    },
    scrollByIndex: function () {
      let tabInfo = this.tabQueryInfo[this.status];
      if (!tabInfo) return;
      this.scrollBarLeft = tabInfo.left + tabInfo.width / 2 - uni.upx2px(24) / 2;
      if (this.barFirstTimeMove == true) {
        setTimeout(() => {
          this.barFirstTimeMove = false;
        }, 100);
      }
    },
    getList: function (status, current) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .coupon('get', {
            status: status,
            behavior: 'user'
          })
          .page(current, 10)
          .then(function (response) {
            let { data, headers } = response;
            resolve(data);
            // #ifdef MP-WEIXIN
            _this.page = {
              current: +headers['X-Pagination-Current-Page'],
              count: +headers['X-Pagination-Page-Count']
            };
            // #endif
            // #ifdef H5
            _this.page = {
              current: +headers['x-pagination-current-page'],
              count: +headers['x-pagination-page-count']
            };
            // #endif
          })
          .catch(function () {
            reject();
          });
      });
    },
    navigateTo: function (url) {
      uni.navigateTo({ url });
    }
  },
  onLoad() {
    let _this = this;
    setTimeout(function () {
      _this.init();
    }, 300);
  },
  filters: {
    img: function (type, ipAddress) {
      if (type === 1) {
        return ipAddress + '/coupon-used-icon.png';
      } else if (type === 2) {
        return ipAddress + '/coupon-expired-icon.png';
      } else if (type === 3) {
        return ipAddress + '/coupon-unable-icon.png';
      }
    },
    setNumber: function (num) {
      return Number(num);
    }
  },
  onReachBottom() {
    let _this = this;
    if (this.page.count > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      this.getList(this.status, this.page.current).then(function (res) {
        _this.list.push(...res);
        _this.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  }
};
</script>
<style scoped lang="scss">
.he-page-content {
  overflow: hidden;
}

.he-tabs {
  background: #ffffff;
  height: 96px;
  position: fixed;
  z-index: 2;
  top: 0;

  .he-tab-item {
    width: 375px;
    text-align: center;
    line-height: 96px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
  }

  .he-tab-item-active {
    @include font_color('font_color');
  }

  .he-tab-bar {
    position: absolute;
    width: 24px;
    height: 4px;
    @include background_color('background_color');
    border-radius: 2px;
    bottom: 16px;
  }
}

.he-list {
  padding: 0 20px;
  margin-top: 96px;
  overflow: hidden;

  .he-list-item {
    width: 710px;
    overflow: hidden;
    margin-top: 17px;

    .he-item-top {
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-top: 1px solid transparent;
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      height: 152px;
      background: #ffffff;
      padding: 0 23px 0 16px;
      position: relative;

      .he-item-number {
        width: 200px;
        padding: 36px 0 28px 0;
        text-align: center;
      }

      .he-item-price {
        font-size: 50px;
        font-family: DIN;
        font-weight: bold;
        line-height: 52px;
      }

      .he-item-condition {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 36px;
      }

      .he-item-price::before {
        content: '￥';
        font-size: 24px;
        font-weight: 500;
      }

      .he-item-text {
        max-width: 327px;
        padding: 42px 0 34px 16px;
      }

      .he-item-name {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        line-height: 40px;
        margin-bottom: 4px;
      }

      .he-item-prompt {
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 28px;
        margin-top: 4px;
      }

      .he-item-button {
        .he-button {
          width: 126px;
          height: 48px;
          line-height: 48px;
          @include background_color('background_color');
          border-radius: 24px;
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
          padding: 0;
        }
      }

      .he-item-image {
        width: 120px;
        height: 120px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    .he-item-center {
      height: 16px;
      background: #ffffff;
      position: relative;

      .he-doc {
        position: absolute;
        width: 16px;
        height: 16px;
        background: RGBA(245, 245, 245, 1);
        border: 1px solid transparent;
        border-radius: 50%;
      }

      .he-doc-left {
        left: 0;
        transform: translateX(-50%);
      }

      .he-doc-right {
        right: 0;
        transform: translateX(50%);
      }

      .he-border-line {
        position: absolute;
        width: 690px;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
        height: 1px;
        background-size: 14px 1px;
        background-repeat: repeat-x;
      }
    }

    .he-item-bottom {
      height: 57px;
      background: #ffffff;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      border-bottom: 1px solid transparent;
      padding: 0 24px 12px 23px;

      .he-bottom-content {
        height: 44px;
      }

      .he-item-text {
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
      }

      .iconbtn_arrow {
        font-size: 18px;
        margin-left: 8px;
        color: #bebebe;
      }
    }
  }

  .he-item-expired {
    .he-item-top {
      border-color: #cccccc;

      .he-item-price {
        color: #999999;
      }

      .he-item-condition {
        color: #999999;
      }
    }

    .he-item-center {
      .he-doc {
        border-color: #cccccc;
      }
    }

    .he-item-bottom {
      border-color: #cccccc;
    }
  }

  .he-item-available {
    .he-item-top {
      @include border_color('border_color');

      .he-item-price {
        @include font_color('font_color');
      }

      .he-item-condition {
        @include font_color('font_color');
      }
    }

    .he-item-center {
      .he-doc {
        @include border_color('border_color');
      }
    }

    .he-item-bottom {
      @include border_color('border_color');
    }
  }
}
</style>
