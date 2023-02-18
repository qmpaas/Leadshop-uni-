<template>
  <view class="le-coupon-item" :class="[couponItem]" :style="[itemStyle(item)]">
    <view class="le-item-Jagged" v-if="content.style === 2"></view>
    <view class="le-coupon-item-content flex">
      <view class="le-coupon-item-left" :style="[borderStyle(item), leftStyle(item)]">
        <view class="le-coupon-item-price" :style="[textStyle(item), priceStyle]"
          >{{ item.sub_price | setNumber }}
        </view>
        <view class="le-coupon-iem-appoint" v-if="facade.list_style !== 1" :style="[textStyle(item), appointStyle]"
          >{{ item.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
        </view>
        <view class="le-coupon-item-min" :style="[textStyle(item), minStyle]">
          <template v-if="Number(item.min_price) !== 0"> 满{{ item.min_price | setNumber }}可用 </template>
          <template v-else> 无门槛 </template>
        </view>
      </view>
      <view class="le-coupon-item-center">
        <template v-if="content.style === 1">
          <view class="le-item-doc le-item-doc-a"></view>
          <view class="le-item-doc le-item-doc-b"></view>
          <view class="le-item-center">
            <view class="sawtooth"></view>
            <view class="le-item-center-doc le-item-center-doc-a" :style="[borderStyle(item)]"></view>
            <view class="le-item-center-doc le-item-center-doc-b" :style="[borderStyle(item)]"></view>
          </view>
        </template>
        <view v-else-if="content.style === 2" :style="[lineColor]" class="le-coupon-item-center-line"> </view>
      </view>
      <view class="le-coupon-item-right" :class="[rightClass]" :style="[borderStyle(item), rightStyle(item)]">
        <view v-if="facade.list_style === 1" class="flex flex-sub flex-direction justify-between le-coupon-item-text">
          <view :style="[textStyle(item)]" class="le-coupon-item-name">{{ item.name }}</view>
          <view class="le-coupon-iem-appoint" :style="[textStyle(item), appointStyle]">
            {{ item.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
          </view>
        </view>
        <view class="le-coupon-btn" :style="[textStyle(item), couponBtn]">
          {{ item.can_obtain ? '领取' : '已领取' }}
        </view>
      </view>
    </view>
    <view class="le-item-Jagged" v-if="content.style === 2"></view>
  </view>
</template>
<script type="text/javascript">
export default {
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    },
    item: {
      type: Object
    }
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    newData: function () {
      if (this.content.data.length === 0) {
        let item = {
          expire_type: 2,
          appoint_type: 1,
          name: '优惠券名称',
          sub_price: 88,
          can_obtain: true
        };
        let _array = [item, item, item];
        if (this.facade.list_style === 2) {
          _array.push(item);
        }
        return _array;
      } else {
        return this.content.data;
      }
    },
    couponItem: function () {
      let str = '';
      if (this.content.style === 3) {
        str += ' fillet ';
      }
      return str;
    },
    rightClass: function () {
      if (this.facade.list_style === 1) {
        return 'flex ';
      } else if (this.facade.list_style === 2) {
        return '';
      } else if (this.facade.list_style === 3) {
        return '';
      }
    },
    itemStyle: function () {
      return item => {
        let style = {
          backgroundColor: this.facade.background_color
        };
        if (!item.can_obtain) {
          style.backgroundColor = '#F5F5F5';
        }
        if (this.facade.list_style === 1) {
          style.width = 710 + 'rpx';
        } else if (this.facade.list_style === 2) {
          style.width = 349 + 'rpx';
        } else if (this.facade.list_style === 3) {
          style.width = 280 + 'rpx';
        }
        return style;
      };
    },
    textStyle: function () {
      return item => {
        let style = {
          color: this.facade.title_color
        };
        if (!item.can_obtain) {
          style.color = '#666666';
        }
        return style;
      };
    },
    borderStyle: function () {
      return item => {
        let style = {
          borderColor: this.facade.title_color
        };
        if (!item.can_obtain) {
          style.borderColor = '#666666';
        }
        return style;
      };
    },
    leftStyle: function () {
      return item => {
        let border = '1px solid ' + this.facade.title_color;
        let style = {};
        if (this.content.style === 1) {
          if (!item.can_obtain) {
            border = '1px solid  #666666';
          }
          style = {
            borderTop: border,
            borderBottom: border,
            borderLeft: border
          };
        }
        if (this.facade.list_style === 1) {
          style.width = 200 + 'rpx';
        } else if (this.facade.list_style === 2) {
          style.width = 238 + 'rpx';
        } else if (this.facade.list_style === 3) {
          style.width = 170 + 'rpx';
        }
        return style;
      };
    },
    rightStyle: function () {
      return item => {
        let border = '1px solid ' + this.facade.title_color;
        let style = {};
        if (this.content.style === 1) {
          if (!item.can_obtain) {
            border = '1px solid  #666666';
          }
          style = {
            borderTop: border,
            borderBottom: border,
            borderRight: border
          };
        }
        if (this.facade.list_style === 1) {
          style.width = 460 + 'rpx';
        } else if (this.facade.list_style === 2) {
          style.width = 64 + 'rpx';
        } else if (this.facade.list_style === 3) {
          style.width = 64 + 'rpx';
        }
        return style;
      };
    },
    priceStyle: function () {
      let style = {};
      if (this.facade.list_style === 1) {
        style.lineHeight = 52 + 'rpx';
        style.marginTop = 25 + 'rpx';
        style.fontSize = 50 + 'rpx';
      } else if (this.facade.list_style === 2) {
        style.lineHeight = 44 + 'rpx';
        style.marginTop = 16 + 'rpx';
        style.fontSize = 44 + 'rpx';
      } else if (this.facade.list_style === 3) {
        style.lineHeight = 44 + 'rpx';
        style.marginTop = 16 + 'rpx';
        style.fontSize = 44 + 'rpx';
      }
      return style;
    },
    minStyle: function () {
      let style = {};
      if (this.facade.list_style === 1) {
        style.lineHeight = 16 + 'rpx';
        style.fontSize = 24 + 'rpx';
      } else if (this.facade.list_style === 2) {
        style.lineHeight = 28 + 'rpx';
        style.fontSize = 20 + 'rpx';
      } else if (this.facade.list_style === 3) {
        style.lineHeight = 28 + 'rpx';
        style.fontSize = 20 + 'rpx';
      }
      return style;
    },
    couponBtn: function () {
      let style = {};
      if (this.facade.list_style === 1) {
        style.width = 126 + 'rpx';
        style.height = 126 + 'rpx';
        style.lineHeight = 126 + 'rpx';
      } else if (this.facade.list_style === 2) {
        style.writingMode = 'vertical-rl';
        style.height = 126 + 'rpx';
        style.lineHeight = 60 + 'rpx';
        style.width = 60 + 'rpx';
      } else if (this.facade.list_style === 3) {
        style.writingMode = 'vertical-rl';
        style.height = 126 + 'rpx';
        style.lineHeight = 60 + 'rpx';
        style.width = 60 + 'rpx';
      }
      return style;
    },
    appointStyle: function () {
      let style = {};
      if (this.facade.list_style === 1) {
      } else if (this.facade.list_style === 2) {
        style.textAlign = 'center';
      } else if (this.facade.list_style === 3) {
        style.textAlign = 'center';
      }
      return style;
    },
    lineColor: function () {
      return {
        backgroundImage: `repeating-linear-gradient(180deg, ${this.facade.title_color}, ${this.facade.title_color} 4rpx, transparent 0, transparent 8rpx)`
      };
    }
  },
  filters: {
    setNumber: function (num) {
      return Number(num);
    }
  }
};
</script>
<style lang="less" scoped>
@import './element.less';
</style>
