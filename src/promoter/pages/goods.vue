<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="he-sticky">
      <view class="he-search he-card">
        <input type="text" class="he-input" v-model="search" :focus="showInput" @blur="blurInput" />
        <button class="cu-btn he-button flex align-center justify-start" @click="openInput" v-if="!showInput">
          <text class="iconfont iconsearchbar_search"></text>
          <text>输入商品名称搜索</text>
        </button>
      </view>
      <list-sort class="he-sort" first="佣金" @sort="setSort"></list-sort>
    </view>
    <view class="he-list">
      <view class="he-item flex" v-for="item in list" :key="item.id" @tap="navigateTo(item)">
        <he-image :width="240" :height="240" :src="item.slideshow[0]"></he-image>
        <view class="he-item__body flex flex-direction flex-sub">
          <view class="he-item__name he-line-2">{{ item.name }}</view>
          <view class="flex-sub"></view>
          <view class="he-item__footer flex justify-between align-center">
            <text class="he-item__price">¥{{ item.price }}</text>
            <button class="cu-btn he-commission" @click.stop="shareItem(item)">
              <text class="iconfont iconproductdetails_share"></text>
              <text>预计赚¥{{ item.commission }}</text>
            </button>
          </view>
        </view>
      </view>
      <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
      <he-no-content-yet v-if="isNothing" text="暂未找到相关商品"></he-no-content-yet>
      <view class="safe-area-inset-bottom"></view>
    </view>
    <he-share
      @confirmPromoter="setPromoterMaterial"
      v-model="isShare"
      :post-data="{ goods_id: goodsId }"
      :is-promoter="true"
    ></he-share>
    <promotion-material :info="promotionMaterialInfo" v-model="showPromotionMaterial"></promotion-material>
    <he-float-window pages-url="promoter"></he-float-window>
  </view>
</template>

<script>
import listSort from './../../components/list-sort.vue';
import heNoContentYet from './../../components/he-no-content-yet.vue';
import heLoadMore from './../../components/he-load-more.vue';
import heShare from './../../components/he-share.vue';
import promotionMaterial from './../../components/promotion-material.vue';
import { goods } from '../api';
import heFloatWindow from '../../components/layout/he-float-window.vue';

export default {
  name: 'goods',
  components: {
    listSort,
    heNoContentYet,
    heLoadMore,
    heShare,
    promotionMaterial,
    heFloatWindow
  },
  data() {
    return {
      showInput: false,
      search: '',
      list: [],
      loadStatus: 'loadmore',
      isNothing: false,
      isShare: false,
      goodsId: null,
      is_task: null,
      showPromotionMaterial: false,
      promotionMaterialInfo: null,
      page: {
        current: 1,
        pageCount: 1
      },
      sort: {
        key: 'commission',
        value: 'DESC'
      },
      shareOpen: true
    };
  },
  computed: {
    shareData({ promotionMaterialInfo }) {
      return {
        title: promotionMaterialInfo?.name,
        path: '/pages/goods/detail?id=' + promotionMaterialInfo?.id,
        imageUrl: promotionMaterialInfo?.slideshow[0]
      };
    }
  },
  mounted() {
    this.getList().then(() => {
      if (this.$h.test.isEmpty(this.list)) {
        this.isNothing = true;
      }
    });
  },
  methods: {
    blurInput() {
      this.list = [];
      if (this.$h.test.isEmpty(this.search)) {
        this.showInput = false;
      }
      this.page.current = 1;
      this.getList().then(() => {
        this.isNothing = this.$h.test.isEmpty(this.list);
      });
    },
    openInput() {
      this.showInput = !this.showInput;
      this.list = [];
      this.isNothing = false;
    },
    setSort({ key, value }) {
      key === 'sort' ? (key = 'commission') : key;
      this.sort.key = key;
      this.sort.value = value;
      this.page.current = 1;
      this.list = [];
      this.getList();
    },
    navigateTo(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`
      });
    },
    async getList() {
      // 排序  佣金commission  销量sales  价格price  最新created_time
      const response = await goods(this.page.current, {
        sort_value: this.sort.value,
        sort_key: this.sort.key,
        search: this.search
      });
      const { data, pagination } = response;
      this.list = this.list.concat(data);
      this.page.pageCount = pagination.pageCount;
      const { pageCount, current } = this.page;
      if (current === pageCount) {
        this.loadStatus = 'nomore';
      }
    },
    shareItem(item) {
      this.isShare = true;
      this.promotionMaterialInfo = item;
      // #ifdef H5
      this.$wechat.updateShareData(this.shareData);
      // #endif
      this.goodsId = item.id;
    },
    setPromoterMaterial() {
      this.showPromotionMaterial = true;
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
  },
  // #ifdef H5
  beforeDestroy() {
    this.$wechat.updateShareData(this.$shareAppMessage());
  },
  // #endif
  // #ifndef H5
  onShareAppMessage(event) {
    if (event.from === 'button') {
      return this.$shareAppMessage(this.shareData);
    } else {
      return this.$shareAppMessage(this.$shareData);
    }
  },
  onShareTimeline(event) {
    if (event.from === 'button') {
      return this.$shareAppMessage(this.shareData);
    } else {
      return this.$shareAppMessage(this.$shareData);
    }
  }
  // #endif
};
</script>

<style scoped lang="scss">
@import './../main.less';

.he-sticky {
  position: sticky;
  top: 0;
  margin-bottom: 16px;
  z-index: 10;
}

.he-search {
  border-radius: 0;
  margin: 0;
  padding: 24px 32px;
  position: relative;

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
    width: 686px;
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
}

.he-list {
  padding: 0 20px 0 20px;
  overflow: hidden;

  .he-item {
    width: 710px;
    background: #ffffff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    border-radius: 16px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .he-item__body {
    padding-bottom: 32px;
    height: 240px;
  }

  .he-item__name {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 400;
    color: #353535;
    line-height: 1.3;
    margin: 31px 25px 0 25px;
  }

  .he-item__footer {
    padding: 0 24px 0 25px;
  }

  .he-item__price {
    font-size: 32px;
    @extend .font-family-sc;
    font-weight: 400;
    @include font_color('font_color');
    line-height: 1.6;
  }

  .he-commission {
    background-color: transparent;
    border: 1px solid transparent;
    @include border_color('border_color');
    border-radius: 24px;
    font-size: 24px;
    font-weight: 500;
    @extend .font-family-sc;
    @include font_color('font_color');
    height: 48px;
    line-height: 46px;
    padding: 0 25px;
  }

  .iconproductdetails_share {
    font-size: 22px;
    margin-right: 8px;
  }
}
</style>
