<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-search">
      <view class="he-search--tabs flex" id="he-tab">
        <view class="flex-sub align-center flex justify-center" @tap="clickTab(0, -1)">
          <text id="he-tab-item-0" :style="[tabItemStyle(0)]">全部</text>
        </view>
        <view class="flex-sub align-center flex justify-center" @tap="clickTab(1, 0)">
          <text id="he-tab-item-1" :style="[tabItemStyle(1)]">待审核</text>
        </view>
        <view class="flex-sub align-center flex justify-center" @tap="clickTab(2, 1)">
          <text id="he-tab-item-2" :style="[tabItemStyle(2)]">待打款</text>
        </view>
        <view class="flex-sub align-center flex justify-center" @tap="clickTab(3, 2)">
          <text id="he-tab-item-3" :style="[tabItemStyle(3)]">已打款</text>
        </view>
        <view class="flex-sub align-center flex justify-center" @tap="clickTab(4, 3)">
          <text id="he-tab-item-4" :style="[tabItemStyle(4)]">已拒绝</text>
        </view>
        <view class="he-tab--bar" :style="[tabBarStyle]"></view>
      </view>
    </view>
    <view class="he-time flex align-center justify-center" @click="setTime">
      <text>{{ time.year }}年{{ time.month }}月</text>
      <text class="iconfont iconarrow-down" :style="[arrowStyle]"></text>
    </view>
    <view v-for="(item, index) in list" :key="index" class="le-order--item">
      <view class="flex justify-between le-item--body">
        <view class="le-item--left flex flex-direction justify-between">
          <view class="le-title">{{ item.type | payMethodsFilter }}</view>
          <view class="le-assist">
            <template v-if="item.type !== 'wechatDib'">
              <view v-if="item.type === 'wechat'">微信号：{{ item.extra.wechat }}</view>
              <view v-else-if="item.type === 'alipay'">支付宝账号：{{ item.extra.alipay }}</view>
              <view v-else-if="item.type === 'bankCard'">银行卡账号：{{ item.extra.bank_no }}</view>
            </template>
            <view>{{ item.time.created_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
          </view>
        </view>
        <view class="le-item--right flex flex-direction align-end">
          <view class="le-sign">{{ item.status | statusFilter }}</view>
          <view class="le-price">￥{{ item.cash.actual_price }}</view>
          <view class="le-handling-free">手续费￥{{ item.cash.service_charge }}</view>
        </view>
      </view>
      <view class="le-item--footer" v-if="item.status === 3 && item.content.reject_content">
        拒绝理由：{{ item.content.reject_content }}
      </view>
    </view>
    <he-no-content-yet
      v-if="isNothing"
      :image="ipAddress + '/order-background-empty.png'"
      text="暂无相关记录"
    ></he-no-content-yet>
    <selection-period ref="period" v-model="isShowTime" @confirm="confirmTime"></selection-period>
  </view>
</template>

<script>
import heNoContentYet from './../../components/he-no-content-yet.vue';
import selectionPeriod from './components/selection-period.vue';
import { financeList } from '../api';

export default {
  name: 'withdraw-list',
  components: {
    heNoContentYet,
    selectionPeriod
  },
  data() {
    return {
      scrollBarLeft: 0,
      tabQueryInfo: null,
      currentIndex: 0,
      tabWidth: 0,
      parentLeft: 0,
      barFirstTimeMove: true,
      isShowTime: false,
      page: {
        current: 1
      },
      time: {
        year: 2021,
        month: 4
      },
      list: [],
      status: -1,
      first_day: null,
      isNothing: false,
      showDateModal: false
    };
  },
  computed: {
    tabBarStyle({ tabWidth, barFirstTimeMove, scrollBarLeft }) {
      return {
        width: `${tabWidth}px`,
        transform: `translate(${scrollBarLeft}px, -100%)`,
        'transition-duration': `${barFirstTimeMove ? 0 : '0.5s'}`
      };
    },
    tabItemStyle({ themeColor, currentIndex }) {
      return index => {
        let style = {
          'transition-duration': '0.5s'
        };
        if (index === currentIndex) {
          style.color = themeColor;
        }
        return style;
      };
    },
    arrowStyle({ isShowTime }) {
      let style = {};
      if (isShowTime) {
        style.transform = 'rotate(180deg)';
      }
      return style;
    }
  },
  methods: {
    async init() {
      this.parentLeft = uni.upx2px(20);
      setTimeout(() => {
        this.getTabRect();
      }, 1000);
      await this.getList();
    },
    clickTab(index, status) {
      this.currentIndex = index;
      this.status = status;
      this.scrollByIndex();
      this.getList();
    },
    // 查询tab的布局信息
    getTabRect() {
      let query = uni.createSelectorQuery();
      for (let i = 0; i < 5; i++) {
        query.select(`#he-tab-item-${i}`).fields({
          size: true,
          rect: true
        });
      }
      query.exec(
        function (res) {
          this.tabQueryInfo = res;
          this.scrollByIndex();
        }.bind(this)
      );
    },
    scrollByIndex() {
      let tabInfo = this.tabQueryInfo[this.currentIndex];
      if (!tabInfo) return;
      this.tabWidth = tabInfo.width;
      let left = tabInfo.left + tabInfo.width / 2 - this.parentLeft;
      this.scrollBarLeft = left - this.tabWidth / 2;
      if (this.barFirstTimeMove === true) {
        setTimeout(() => {
          this.barFirstTimeMove = false;
        }, 100);
      }
    },
    async getList() {
      const response = await financeList(this.page.current, {
        status: this.status,
        first_day: this.first_day
      });
      let date = response.date ? new Date(response.date) : new Date();
      this.time = {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      };
      this.list = response.list;
      this.isNothing = response.list.length === 0;
      this.$refs.period.data2 = this.time.month - 1;
    },
    setTime() {
      this.isShowTime = true;
    },
    confirmTime(date) {
      this.first_day = date.getTime() / 1000;
      this.time = {
        year: date.getFullYear(),
        month: date.getMonth() + 1
      };
      this.getList();
    }
  },
  onLoad() {
    this.init();
  },
  filters: {
    payMethodsFilter(type) {
      let str = '';
      switch (type) {
        case 'wechatDib':
          str = '自动到账微信零钱';
          break;
        case 'wechat':
          str = '提现到微信';
          break;
        case 'alipay':
          str = '提现到支付宝';
          break;
        case 'bankCard':
          str = '提现到银行卡';
          break;
      }
      return str;
    },
    // 状态
    statusFilter(status) {
      let str = '';
      switch (status) {
        case 0:
          str = '待审核';
          break;
        case 1:
          str = '待打款';
          break;
        case 2:
          str = '已打款';
          break;
        case 3:
          str = '已拒绝';
          break;
      }
      return str;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../main.less';

.he-page-content {
  padding: 0 20px;
}

.he-search {
  background-color: #f5f5f5;
  width: 750px;
  padding: 20px 0 0 0;
  position: sticky;
  top: 0;
}

.he-search--tabs {
  width: 710px;
  height: 96px;
  background: #ffffff;
  border-radius: 16px;
  position: relative;
}

.he-tab--bar {
  position: absolute;
  bottom: 0;
  height: 4px;
  @include background_color('background_color');
}

.he-time {
  margin: 24px 0;
  width: 710px;
  height: 56px;
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;

  .iconarrow-down {
    font-size: 20px;
    margin-left: 8px;
    transition-duration: 0.2s;
  }
}

.le-order--item {
  padding: 24px;
  border-radius: 8px;
  background: #ffffff;
  margin-bottom: 16px;
}

.le-item--body {
  .le-title {
    font-size: 32px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 56px;
  }

  .le-assist {
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;

    > view {
      line-height: 32px;
    }
  }
}

.le-item--right {
  .le-sign {
    //width: 94px;
    border: 1px solid transparent;
    @include border_color('border_color');
    border-radius: 16px;
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    @include font_color('font_color');
    line-height: 32px;
    padding: 0 10px;
  }

  .le-price {
    font-size: 36px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 48px;
  }

  .le-handling-free {
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;
    line-height: 32px;
  }
}

.le-item--footer {
  border-top: 1px solid #e5e5e5;
  font-size: 24px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
  line-height: 32px;
  padding-top: 15px;
  margin-top: 15px;
}
</style>
