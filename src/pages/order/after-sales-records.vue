<template>
  <view class="he-page-content" :data-theme="theme">
    <view
      class="he-item"
      v-for="(item, index) in list"
      :key="index"
      @click="navigateTo('/pages/order/after-sales-details?id=' + item.id)"
    >
      <view class="he-item__top flex justify-between align-center">
        <view class="he-status__sign">
          <view
            class="iconfont he-sign"
            :class="
              item.type === 0
                ? 'iconaftersalesdetails-refund'
                : item.type === 1
                ? 'iconaftersalesdetails-returngoods'
                : item.type === 2
                ? 'iconaftersalesdetails-exchangegoods'
                : null
            "
          ></view>
          <view class="he-text">{{ item.type | getType }}</view>
        </view>
        <text class="he-status">{{ item.status | getStatus }}</text>
      </view>
      <view class="he-item__body">
        <view class="he-good flex" v-for="(good, key) in item.goods" :key="key">
          <he-image
            :src="good.goods_image"
            class="he-item__image"
            :image-style="{ borderRadius: '8rpx' }"
            :width="160"
            :height="160"
          />
          <view class="he-item__content">
            <view class="he-item__name he-line-1">{{ good.goods_name }}</view>
            <view class="he-item__attr">{{ good.show_goods_param }}</view>
            <view class="he-item__number-price">
              <text class="he-item__number">x{{ good.goods_number }}</text>
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="
          (item.type !== 2 &&
            (item.status === 200 || item.status === 111 || item.status === 100 || item.status === 102)) ||
          item.status >= 200 ||
          item.status === 121 ||
          item.status === 131
        "
        class="he-item__footer flex align-center"
        :class="
          item.type !== 2 &&
          (item.status === 200 ||
            item.status === 111 ||
            item.status === 100 ||
            item.status === 102 ||
            item.status === 101 ||
            item.status === 201)
            ? 'justify-between'
            : 'justify-end'
        "
      >
        <view
          v-if="
            item.type !== 2 &&
            (item.status === 200 ||
              item.status === 111 ||
              item.status === 100 ||
              item.status === 102 ||
              item.status === 101 ||
              item.status === 201)
          "
        >
          <!-- 退款价格 -->
          <template v-if="item.status === 200">
            <text class="he-item__text"> 成功退款： </text>
            <text class="he-item__price">
              <template v-if="item.return_score_type">{{ item.actual_score }} 积分+</template>¥{{ item.actual_refund }}
            </text>
          </template>
          <!-- 申请退款价格 -->
          <template v-else>
            <text class="he-item__text"> 申请退款： </text>
            <text class="he-item__price">
              <template v-if="item.return_score_type">{{ item.return_score }} 积分+</template>¥{{ item.return_amount }}
            </text>
          </template>
        </view>
        <view>
          <button class="cu-btn he-btn-over" v-if="item.status >= 200" @click.stop="setClose(item)">删除记录</button>
          <button
            class="cu-btn he-btn-fill"
            @click.stop="
              navigateTo('/pages/order/fill-return-information?id=' + item.id + '&mobile=' + item.return_address.mobile)
            "
            v-if="item.status === 121 || item.status === 131"
          >
            填写退货信息
          </button>
        </view>
      </view>
    </view>
    <he-no-content-yet
      v-if="isNothing"
      text="暂无相关记录"
      :image="ipAddress + '/order-background-empty.png'"
    ></he-no-content-yet>
    <he-empty-popup
      :empty-style="{ height: '146rpx', lineHeight: '146rpx' }"
      title="确认要删除这条售后记录？"
      v-model="isDel"
      :item="setItem"
      @confirm="deleteConfirm"
    ></he-empty-popup>
    <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
    <he-float-window pages-url="after-order"></he-float-window>
    <view class="safe-area-inset-bottom"></view>
  </view>
</template>

<script>
import heNoContentYet from '@/components/he-no-content-yet.vue';
import heEmptyPopup from '@/components/he-empty-popup.vue';
import heLoadMore from '@/components/he-load-more.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'after-sales-records',
  components: {
    heNoContentYet,
    heEmptyPopup,
    heLoadMore,
    heFloatWindow
  },
  data() {
    return {
      list: [],
      page: {
        current: 1,
        count: 1,
        size: 10
      },
      isNothing: false,
      setItem: null,
      isDel: false,
      loadStatus: 'loadmore'
    };
  },
  filters: {
    getStatus: function (status) {
      switch (status) {
        case 100:
        case 102:
          return '待卖家审核';
        case 121:
        case 131:
          return '待买家退货';
        case 122:
          return '待卖家收货退款';
        case 133:
          return '待买家收货';
        case 101:
          return '卖家拒绝';
        case 111:
          return '待卖家退款';
        case 132:
          return '待卖家收货且发货';
        case 200:
          return '已完成';
        case 201:
          return '已完成(已拒绝)';
      }
    },
    getType: function (type) {
      if (type === 0) {
        return '仅退款';
      } else if (type === 1) {
        return '退货退款';
      } else if (type === 2) {
        return '换货';
      }
    }
  },
  methods: {
    navigateTo: function (url) {
      uni.navigateTo({ url: url });
    },
    getList: function () {
      let _this = this;
      return new Promise(function (resolve) {
        _this.$heshop
          .orderafter('get')
          .page(_this.page.current, _this.page.size)
          .then(function (res) {
            let { data, headers } = res;
            resolve(data);
            // #ifdef MP-WEIXIN
            _this.page = {
              current: +headers['X-Pagination-Current-Page'],
              count: +headers['X-Pagination-Page-Count'],
              size: +headers['X-Pagination-Per-Page']
            };
            // #endif
            // #ifdef H5
            _this.page = {
              current: +headers['x-pagination-current-page'],
              count: +headers['x-pagination-page-count'],
              size: +headers['x-pagination-per-page']
            };
            // #endif
          })
          .catch(function (err) {
            _this.$toError(err);
          });
      });
    },
    setClose: function (item) {
      this.isDel = true;
      this.setItem = item;
    },
    deleteConfirm: function (data) {
      let _this = this;
      this.$heshop
        .orderafter('delete', data.id)
        .then(function () {
          //撤回售后相当于删除,撤回后返回列表
          _this.list.forEach(function (item, index) {
            if (item.id === data.id) {
              _this.$delete(_this.list, index);
            }
          });
          _this.$h.toast('删除订单成功');
        })
        .catch(function (err) {
          _this.$toError(err);
        });
    }
  },
  onLoad() {
    let _this = this;
    this.getList().then(function (res) {
      _this.list = res;
      _this.isNothing = _this.list.length === 0;
      _this.loadStatus = _this.list.length < _this.page.size ? 'nomore' : 'loadmore';
    });
  },
  onReachBottom() {
    let _this = this;
    if (this.page.count > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      this.getList().then(function (res) {
        _this.list.push(...res);
        _this.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  },
  watch: {
    '$store.state.after.cancel_after': {
      handler(val) {
        let _this = this;
        if (val.bool) {
          for (let i = 0; i < _this.list.length; i++) {
            if (_this.list[i].id === val.order_id) {
              _this.$delete(_this.list, i);
              _this.$store.commit('after/cancelAfter', {
                bool: false,
                order_id: null
              });
              break;
            }
          }
        }
      }
    }
  },
  onPullDownRefresh() {
    this.page.current = 1;
    this.getList().then(response => {
      this.list = response;
      this.isNothing = this.list.length === 0;
      this.loadStatus = this.list.length < this.page.size ? 'nomore' : 'loadmore';
    });
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>
<style scoped lang="scss">
.he-page-content {
  padding: 20px 20px 4px 20px;
}

.he-item {
  width: 710px;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.he-item__top {
  height: 48px;
}

.he-item__top .he-status {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  @include font_color('font_color');
}

.he-status__sign {
  position: relative;
  height: 48px;
}

.he-item__top .he-sign {
  display: inline-block;
  font-size: 26px;
  height: 26px;
  width: 26px;
  line-height: 48px;
  margin-right: 8px;
  @include font_color('font_color');
}

.he-item__top .he-text {
  display: inline-block;
  font-size: 26px;
  line-height: 48px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  width: 200px;
}

.he-item__body {
  padding: 19px 0;
  .he-good:not(:last-child) {
    margin-bottom: 24px;
  }
}

.he-item__image {
  margin-right: 24px;
}

.he-item__content {
  width: 478px;
}

.he-item__name {
  margin: 9px 0 12px 0;
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  line-height: 1.3;
}

.he-item__attr {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  margin-bottom: 11px;
}

.he-item__number-price {
  font-family: PingFang SC;
  font-weight: 500;
}

.he-item__number {
  font-size: 22px;
  color: #999999;
  margin-right: 23px;
}

.he-item__number-price .he-item__price {
  font-size: 24px;
  color: #222222;
}

.he-item__footer {
  height: 56px;
  padding: 0 12px;
}

.cu-btn {
  height: 56px;
  background: #ffffff;
  border-radius: 28px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
}

.he-btn-over {
  border: 1px solid #cccccc;
  border-radius: 28px;
  color: #222222;
}

.he-btn-fill {
  margin-left: 16px;
  @include font_color('font_color');
  border-style: solid;
  border-width: 1px;
  @include border_color('border_color');
}

.he-item__text {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
}

.he-item__footer .he-item__price {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: bold;
  @include font_color('font_color');
  margin-left: 16px;
}
</style>
