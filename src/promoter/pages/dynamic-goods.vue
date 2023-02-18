<template>
  <view class="he-page-content">
    <view class="he-search he-card" :class="[{ flex: showInput }]">
      <input type="text" class="he-input" :style="[inputStyle]" v-model="search" :focus="showInput" @blur="blurInput" />
      <button class="cu-btn he-button flex align-center justify-start" @click="openInput" v-if="!showInput">
        <text class="iconfont iconsearchbar_search"></text>
        <text>输入商品名称搜索</text>
      </button>
      <text class="iconfont iconcha" @tap="clearInput" v-if="showInput && search"></text>
      <button class="cu-btn search-btn" :style="[searchBtnStyle]" @click="searchList">搜索</button>
    </view>
    <view class="he-body">
      <view class="he-card no-added flex justify-between" @click="selectItem()">
        <text>不添加商品</text>
        <text class="iconfont iconbtn_select" v-if="select === -1"></text>
      </view>
      <view class="he-card item flex" v-for="item in list" :key="item.id" @click="selectItem(item)">
        <he-image
          :image-style="{
            borderRadius: '8rpx'
          }"
          :width="100"
          :height="100"
          :src="item.slideshow[0]"
        ></he-image>
        <view class="item-content flex flex-direction justify-center">
          <view class="item-name he-line-1">{{ item.name }}</view>
          <view class="item-price">￥{{ item.price }}</view>
        </view>
        <view class="flex-sub item-select flex justify-center align-center">
          <text class="iconfont iconbtn_select" v-if="item.isSelect"></text>
        </view>
      </view>
      <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
      <he-no-content-yet v-if="isNothing" text="暂未找到相关商品"></he-no-content-yet>
    </view>
    <view class="safe-area-inset-bottom"></view>
  </view>
</template>

<script>
import { goods } from '../api';
import heNoContentYet from './../../components/he-no-content-yet.vue';
import heLoadMore from './../../components/he-load-more.vue';

export default {
  name: 'dynamic-goods',
  components: {
    heNoContentYet,
    heLoadMore
  },
  data() {
    return {
      search: '',
      showInput: false,
      list: [],
      isNothing: false,
      loadStatus: 'loadmore',
      page: {
        current: 1,
        pageCount: 1
      },
      select: null
    };
  },
  computed: {
    inputStyle({ showInput }) {
      let style = {
        'transition-duration': '0.3s'
      };
      if (showInput) {
        style.width = '609rpx';
      }
      return style;
    },
    searchBtnStyle({ showInput }) {
      let style = {
        'transition-duration': '0.3s'
      };
      if (showInput) {
        style.transform = `translate(-${20}px, -50%)`;
      }
      return style;
    }
  },
  methods: {
    blurInput() {
      if (this.$h.test.isEmpty(this.search)) {
        this.showInput = false;
      }
      this.searchList();
    },
    openInput() {
      this.showInput = true;
    },
    async searchList() {
      this.list = [];
      await this.getList();
      this.isNothing = this.$h.test.isEmpty(this.list);
    },
    async getList() {
      const response = await goods(this.page.current, { search: this.search });
      const { data, pagination } = response;
      data.forEach(item => {
        item.isSelect = false;
      });
      this.list = this.list.concat(data);
      this.page = pagination;
      const { pageCount, current } = this.page;
      if (current === pageCount) {
        this.loadStatus = 'nomore';
      }
    },
    selectItem(item) {
      this.list.forEach(item => {
        item.isSelect = false;
      });
      if (item) {
        item.isSelect = true;
        this.select = item;
      } else {
        this.select = null;
      }
      uni.setStorageSync(this.$storageKey.dynamic_goods, {
        extend: true,
        index: 2,
        name: '单一商品',
        param: this.select,
        path: '/pages/goods/detail'
      });
      uni.navigateBack({
        delta: 1
      });
    },
    clearInput() {
      this.search = '';
      this.showInput = false;
      this.page.current = 1;
      this.getList();
      if (this.$h.test.isEmpty(this.list)) {
        this.isNothing = true;
      }
    }
  },
  async onLoad() {
    await this.getList();
    if (this.$h.test.isEmpty(this.list)) {
      this.isNothing = true;
    }
  },
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
  }
};
</script>

<style scoped lang="scss">
@import './../main.less';

.he-search {
  border-radius: 0;
  margin: 0;
  padding: 24px 32px;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow: hidden;

  .he-input {
    width: 100%;
    height: 64px;
    background: #f7f7f7;
    border-radius: 32px;
    padding-left: 32px;
  }

  .he-button {
    position: absolute;
    top: 50%;
    width: 654px;
    background: transparent;
    left: 64px;
    transform: translateY(-50%);
    z-index: 10;
    font-size: 28px;
    padding: 0;
    @extend .font-family-sc;
    font-weight: 500;
    color: #999999;

    .iconsearchbar_search {
      font-size: 28px;
      margin-right: 16px;
    }
  }

  .iconcha {
    font-size: 36px;
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 590px;
    color: #c6c6c6;
    transform: translateY(-50%);
  }

  .search-btn {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    padding: 0;
    margin-left: 20px;
    background-color: transparent;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(200%, -50%);
  }
}

.he-body {
  padding: 16px 20px;
}

.no-added {
  padding: 35px 32px 35px 24px;
  font-size: 26px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #222222;
}

.item {
  padding: 24px 6px 24px 24px;
}

.item-content {
  width: 472px;
  height: 100px;
  margin-left: 24px;
}

.item-name {
  font-size: 26px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #222222;
  line-height: 48px;
}

.item-price {
  font-size: 22px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #999999;
  line-height: 40px;
}

.item-select {
}

.iconbtn_select {
  font-size: 32px;
  color: #e60b30;
}
</style>
