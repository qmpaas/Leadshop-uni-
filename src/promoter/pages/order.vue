<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-search">
      <view class="flex he-switch">
        <view class="flex-sub" :class="{ active: keyword.time_type === 'all' }" @click="switchTime('all')">全部</view>
        <view class="flex-sub" :class="{ active: keyword.time_type === 'today' }" @click="switchTime('today')"
          >今日
        </view>
        <view class="flex-sub" :class="{ active: keyword.time_type === 'yesterday' }" @click="switchTime('yesterday')">
          昨日
        </view>
        <view class="flex-sub" :class="{ active: keyword.time_type === 'month' }" @click="switchTime('month')"
          >本月
        </view>
      </view>
      <button
        class="cu-btn he-customize flex align-center justify-between"
        :class="{ 'select-time': timeSelect }"
        @click="routerTimePeriod"
      >
        <text v-if="!timeSelect">自定义</text>
        <text v-else>{{ keyword.time_start }} 至 {{ keyword.time_end }}</text>
        <text class="iconfont iconbtn_arrow"></text>
      </button>
    </view>
    <view class="he-body">
      <view class="he-order--total">共{{ count.all_order_number }}笔订单</view>
      <view class="flex justify-between he-total">
        <view class="he-price--total">
          <text class="he-label">待结算佣金</text>
          <text class="he-value">￥{{ count.wait_account }}</text>
        </view>
        <view class="he-price--total">
          <text class="he-label">已结算佣金</text>
          <text class="he-value">￥{{ count.commission_amount }}</text>
        </view>
      </view>
      <view class="he-order--item he-card" v-for="item in list" :key="item.id">
        <view class="flex justify-between align-start">
          <view class="flex flex-direction">
            <view class="he-user flex align-center">
              <he-image
                :image-style="{
                  borderRadius: '50%'
                }"
                width="48"
                height="48"
                :src="item.promoterOrder.user.avatar"
              ></he-image>
              <text class="he-user--name">{{ item.promoterOrder.user.nickname }}</text>
            </view>
            <text class="he-order--sn">订单号:{{ item.promoterOrder.order_sn }}</text>
          </view>
          <view class="he-sign">
            {{ item.promoterOrder.status | filterStatus }}
          </view>
        </view>
        <view class="he-item--footer flex justify-between">
          <view class="he-item--price">
            <text class="he-label">商品金额:</text>
            <text class="he-value"
              >￥{{
               item.promoterOrder.total_amount
              }}
            </text>
          </view>
          <view class="he-item--price">
            <text class="he-label">商品佣金:</text>
            <text class="he-value">￥{{ item.commission }}</text>
          </view>
        </view>
      </view>
      <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
      <view class="safe-area-inset-bottom"></view>
    </view>
    <he-no-content-yet
      v-if="isNothing"
      :image="ipAddress + '/order-background-empty.png'"
      text="暂无相关订单"
    ></he-no-content-yet>
    <he-float-window pages-url="promoter"></he-float-window>
  </view>
</template>

<script>
import heLoadMore from './../../components/he-load-more.vue';
import heNoContentYet from './../../components/he-no-content-yet.vue';
import { promoterOrderCount, promoterorderList } from '../api';
import heFloatWindow from '../../components/layout/he-float-window.vue';

export default {
  name: 'order',
  components: {
    heLoadMore,
    heNoContentYet,
    heFloatWindow
  },
  data() {
    return {
      loadStatus: 'loadmore',
      list: [],
      count: {
        all_order_number: 0, // 订单数
        commission_amount: '0.00', // 已结算佣金
        wait_account: '0.00' // 待结算佣金
      },
      isNothing: false,
      page: {
        current: 1
      },
      keyword: {
        time_type: 'all', // all全部  today今天  yesterday昨天  month本月  free自定义
        time_start: '',
        time_end: ''
      }
    };
  },
  computed: {
    timeSelect({ keyword }) {
      return keyword.time_start && keyword.time_end;
    }
  },
  methods: {
    switchTime(type) {
      this.keyword.time_start = '';
      this.keyword.time_end = '';
      this.keyword.time_type = type;
      this.page.current = 1;
      this.list = [];
      // 获取统计
      this.getCount();
      this.getList().then(() => {
        if (this.$h.test.isEmpty(this.list)) {
          // 无订单
          this.isNothing = true;
        } else {
          this.isNothing = false;
          // 暂无更多
          const { current, pageCount } = this.page;
          if (current === pageCount) {
            this.loadStatus = 'nomore';
          }
        }
      });
    },
    // 跳转到时间选择
    routerTimePeriod() {
      uni.navigateTo({
        url: '/pages/other/time-period'
      });
    },
    // 获取订单列表
    async getList() {
      try {
        const keyword = JSON.parse(JSON.stringify(this.keyword));
        if (keyword.time_start && keyword.time_end) {
          keyword.time_start = new Date(keyword.time_start.replace(/\./g, '/')).getTime() / 1000;
          keyword.time_end = new Date(keyword.time_end.replace(/\./g, '/')).getTime() / 1000;
        }
        const response = await promoterorderList(this.page.current, keyword);
        const { data, pagination } = response;
        this.list = this.list.concat(data);
        this.page = pagination;
      } catch (e) {
        //  Don't do
      }
    },
    // 获取统计
    getCount() {
      const keyword = JSON.parse(JSON.stringify(this.keyword));
      if (keyword.time_start && keyword.time_end) {
        keyword.time_start = new Date(keyword.time_start.replace(/\./g, '/')).getTime() / 1000;
        keyword.time_end = new Date(keyword.time_end.replace(/\./g, '/')).getTime() / 1000;
      }
      promoterOrderCount(keyword).then(response => {
        this.count = response;
      });
    }
  },
  onLoad() {
    // 获取统计
    this.getCount();
    // 获取订单列表
    this.getList().then(() => {
      if (this.$h.test.isEmpty(this.list)) {
        this.isNothing = true;
      } else {
        const { current, pageCount } = this.page;
        if (current === pageCount) {
          this.loadStatus = 'nomore';
        }
      }
    });
  },
  onShow() {
    const timePeriod = uni.getStorageSync(this.$storageKey.time_period);
    if (timePeriod) {
      this.keyword.time_start = this.$h.timeFormat(
        new Date(timePeriod.startDate.replace(/\./g, '/')).getTime(),
        'yyyy.mm.dd'
      );
      this.keyword.time_end = this.$h.timeFormat(
        new Date(timePeriod.endDate.replace(/\./g, '/')).getTime(),
        'yyyy.mm.dd'
      );
      this.keyword.time_type = 'free';
      this.page.current = 1;
      this.list = [];
      // 获取统计
      this.getCount();
      this.getList().then(() => {
        if (this.$h.test.isEmpty(this.list)) {
          // 无订单
          this.isNothing = true;
        } else {
          this.isNothing = false;
          // 暂无更多
          const { current, pageCount } = this.page;
          if (current === pageCount) {
            this.loadStatus = 'nomore';
          }
        }
      });
      uni.removeStorageSync(this.$storageKey.time_period);
    }
  },
  onPullDownRefresh() {
    this.page.current = 1;
    this.list = [];
    this.getCount();
    this.getList();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  // 上划获取
  onReachBottom() {
    if (this.page.pageCount > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      this.getList().then(() => {
        this.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  },
  filters: {
    // 判断状态
    filterStatus(status) {
      if (status === 0) {
        return '待结算';
      } else if (status === 1) {
        return '已结算';
      } else if (status === -1) {
        return '已失效';
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../main.less';

.he-search {
  width: 750px;
  height: 244px;
  background: #ffffff;
  border-radius: 0 0 32px 32px;
  position: sticky;
  padding: 32px;
  top: 0;
  z-index: 10;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.04);

  .he-switch {
    height: 80px;

    .flex-sub {
      border-radius: 8px;
      background: #f5f5f5;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      @extend .font-family-sc;
      color: #262626;
      font-weight: 500;

      &:not(:last-child) {
        margin-right: 18px;
      }

      &.active {
        @include background_color('opacify_background_0');
        @include font_color('font_color');
      }
    }
  }

  .he-customize {
    height: 80px;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 26px 24px 26px 28px;
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #262626;
    margin-top: 20px;

    .iconbtn_arrow {
      font-size: 20px;
      color: #bebebe;
    }

    &.select-time {
      border-style: solid;
      border-width: 1px;
      @include background_color('opacify_background_0');
      @include border_color('border_color');
      @include font_color('font_color');

      .iconbtn_arrow {
        @include font_color('font_color');
      }
    }
  }
}

.he-body {
  padding: 0 20px;
  overflow: hidden;
}

.he-order--total {
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
  line-height: 48px;
  margin: 32px 12px 0 12px;
}

.he-total {
  padding: 0 12px;
  margin-bottom: 24px;

  .he-price--total:last-child {
    margin-right: 15px;
  }
}

.he-price--total {
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  line-height: 48px;

  .he-label {
    color: #999999;
  }

  .he-value {
    color: #262626;
  }
}

.he-order--item {
  width: 710px;
  border-radius: 8px;
  padding: 24px;

  .he-sign {
    font-size: 24px;
    font-weight: 500;
    @extend .font-family-sc;
    line-height: 32px;
    @include border_color('border_color');
    @include font_color('font_color');
    border: 1px solid transparent;
    padding: 0 10px;
    border-radius: 16px;
  }
}

.he-user {
  height: 56px;
}

.he-user--name {
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #222222;
  margin-left: 16px;
}

.he-order--sn {
  font-size: 24px;
  font-weight: 500;
  @extend .font-family-sc;
  color: #999999;
  line-height: 48px;
}

.he-item--footer {
  border-top: 1px solid #e5e5e5;
  padding-top: 16px;
  margin-top: 16px;

  .he-item--price {
    font-size: 24px;
    font-weight: 500;
    @extend .font-family-sc;
    line-height: 32px;

    &:last-child {
      .he-value {
        @include font_color('font_color');
      }
    }
  }

  .he-label {
    color: #999999;
  }

  .he-value {
    color: #222222;
  }
}
</style>
