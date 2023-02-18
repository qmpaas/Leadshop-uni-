<template>
  <view class="he-page-content" :data-theme="theme" :class="loading ? 'flex justify-center align-center' : ''">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <view class="he-switch flex he-card">
        <view
          class="flex-sub"
          v-for="(item, index) in count.children"
          :key="index"
          :class="{ active: searchNum === index }"
          @click="switchTime(index)"
        >
          {{
            index === 0
              ? promoterPage.children.first
              : index === 1
              ? promoterPage.children.second
              : promoterPage.children.third
          }}（{{ item.number }}）
        </view>
      </view>
      <view class="he-list">
        <view class="he-total flex justify-between align-center">
          <view class="he-total--item">
            <text class="he-label">今日新增</text>
            <text class="he-value">{{ todayGet }}人</text>
          </view>
          <view class="he-total--item">
            <text class="he-label">今日流失</text>
            <text class="he-value">{{ todayLose }}人</text>
          </view>
        </view>
        <view class="he-card he-people--item" v-for="item in list" :key="item.id">
          <view class="he-item--user flex">
            <view class="he-avatar" :class="{ 'is-avatar': item.status === 2 }">
              <he-image
                :image-style="{
                  borderRadius: '50%'
                }"
                width="88"
                height="88"
                :src="item.avatar"
              ></he-image>
              <view class="he-avatar--sign" v-if="item.status === 2">分销商</view>
            </view>
            <view>
              <view class="he-user--name">{{ item.nickname }}</view>
              <view class="he-user--create_time">加入时间：{{ item.bind_time | timeFormat('yyyy.mm.dd') }}</view>
            </view>
          </view>
          <view class="he-item--footer flex">
            <view class="he-footer--item flex-sub">
              <view class="he-value he-price">{{ item.sales_amount }}</view>
              <view class="he-label">商品金额</view>
            </view>
            <view class="he-footer--item flex-sub">
              <view class="he-value">{{ item.promoter_order_number }}</view>
              <view class="he-label">订单数</view>
            </view>
            <view class="he-footer--item flex-sub">
              <view class="he-value he-price">{{ item.commission }}</view>
              <view class="he-label">贡献佣金金额</view>
            </view>
          </view>
        </view>
        <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
      </view>
      <he-no-content-yet
        v-if="isNothing"
        :image="ipAddress + '/order-background-empty.png'"
        text="暂无相关订单"
      ></he-no-content-yet>
      <view class="safe-area-inset-bottom"></view>
      <he-float-window pages-url="promoter"></he-float-window>
    </template>
  </view>
</template>

<script>
import heLoadMore from './../../components/he-load-more.vue';
import heNoContentYet from './../../components/he-no-content-yet.vue';
import heLoading from '../../components/he-loading.vue';
import { promoterChildCount, promoterChildList } from '../api';
import heFloatWindow from '../../components/layout/he-float-window.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'offline',
  components: {
    heLoadMore,
    heNoContentYet,
    heLoading,
    heFloatWindow
  },
  data() {
    return {
      searchNum: 0,
      loadStatus: 'loadmore',
      loading: true,
      page: {
        current: 1
      },
      list: [],
      count: {
        children: []
      },
      isNothing: false
    };
  },
  computed: {
    // 今日新增
    todayGet({ count, searchNum }) {
      if (searchNum === 0) {
        return count.first_today_get;
      } else if (searchNum === 1) {
        return count.second_today_get;
      } else if (searchNum === 2) {
        return count.third_today_get;
      }
    },
    // 今日流失
    todayLose({ count, searchNum }) {
      if (searchNum === 0) {
        return count.first_today_lose;
      } else if (searchNum === 1) {
        return count.second_today_lose;
      } else if (searchNum === 2) {
        return count.third_today_lose;
      }
    },
    ...mapGetters({
      promoterPage: 'setting/getPromoterPage'
    })
  },
  methods: {
    async switchTime(num) {
      this.searchNum = num;
      this.list = [];
      this.page.current = 1;
      const parent = this.count.children[num].parent;
      await this.getList(parent);
      if (this.$h.test.isEmpty(this.list)) {
        this.isNothing = true;
      } else {
        this.isNothing = false;
        const { current, pageCount } = this.page;
        if (current === pageCount) {
          this.loadStatus = 'nomore';
        }
      }
    },
    async getList(parent) {
      try {
        const response = await promoterChildList(this.page.current, parent);
        const { data, pagination } = response;
        this.list = this.list.concat(data);
        this.page = pagination;
      } catch (e) {
        this.loading = false;
      }
    },
    async getCount() {
      this.count = await promoterChildCount();
    }
  },
  async onLoad() {
    await this.getCount();
    const parent = this.count.children[0].parent;
    await this.getList(parent);
    this.loading = false;
    if (this.$h.test.isEmpty(this.list)) {
      this.isNothing = true;
    } else {
      const { current, pageCount } = this.page;
      if (current === pageCount) {
        this.loadStatus = 'nomore';
      }
    }
  },
  onPullDownRefresh() {
    this.page.current = 1;
    this.list = [];
    const parent = this.count.children[this.searchNum].parent;
    this.getList(parent);
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  // 上划获取
  onReachBottom() {
    if (this.page.pageCount > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      const parent = this.count.children[this.searchNum].parent;
      this.getList(parent).then(() => {
        this.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  }
};
</script>

<style scoped lang="scss">
@import '../main.less';

.he-switch {
  width: 750px;
  height: 144px;
  border-radius: 0 0 32px 32px;
  position: sticky;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.04);
  top: 0;
  z-index: 10;

  .flex-sub {
    height: 80px;
    background: #f5f5f5;
    border-radius: 8px;
    line-height: 80px;
    text-align: center;
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #262626;

    &:not(:last-child) {
      margin-right: 16px;
    }

    &.active {
      @include background_color('opacify_background_0');
      @include font_color('font_color');
    }
  }
}

.he-list {
  padding: 0 20px;
  overflow: hidden;
}

.he-total {
  height: 48px;
  padding: 0 12px;
  margin: 32px 0 24px 0;
}

.he-total--item {
  height: 48px;
  font-size: 28px;
  font-weight: 500;

  .he-label {
    @extend .font-family-sc;
    color: #999999;
  }

  .he-value {
    @extend .font-family-sc;
    color: #262626;
  }
}

.he-people--item {
  border-radius: 8px;
  padding: 28px 24px 40px 24px;
}

.he-item--user {
  .he-avatar {
    width: 92px;
    height: 92px;
    border-radius: 50%;
    position: relative;
    margin-right: 24px;

    &.is-avatar {
      border: 2px solid #623ceb;
    }
  }

  .he-avatar--sign {
    width: 80px;
    line-height: 30px;
    background: #623ceb;
    border-radius: 14px;
    font-size: 20px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #ffffff;
    position: absolute;
    bottom: -6px;
    text-align: center;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
  }

  .he-user--name {
    @extend .font-family-sc;
    font-size: 32px;
    font-weight: 500;
    color: #222222;
    line-height: 48px;
  }

  .he-user--create_time {
    font-size: 26px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;
    line-height: 40px;
  }
}

.he-item--footer {
  margin-top: 33px;
}

.he-footer--item {
  text-align: center;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  .he-value {
    @extend .font-family-sc;
    line-height: 40px;
    font-size: 28px;
    font-weight: bold;
    color: #222222;

    &.he-price:before {
      content: '￥';
    }
  }

  .he-label {
    font-size: 24px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;
    line-height: 32px;
  }
}
</style>
