<template>
  <he-popup v-model="showModal" :border-radius="16" mode="bottom">
    <view class="he-cart" :data-theme="theme">
      <view class="he-cart__header">
        <view class="he-close flex justify-center align-center" @click="showModal = false">
          <text class="iconfont iconpopup_close"></text>
        </view>
        <view class="he-type-0" v-if="imageStatus">
          <view class="task-number" v-if="is_task">{{ task_number }}积分+</view>
          <view class="he-price">{{ price }}</view>
          <view class="he-stock" v-if="is_task">剩余 {{ stocks }} {{ goods.unit }}兑换量</view>
          <view class="he-stock" v-else>剩余 {{ stocks }} {{ goods.unit }}</view>
        </view>
        <view class="he-type-1 flex" v-else>
          <he-image :width="160" :height="160" :src="pic"></he-image>
          <view class="he-content">
            <view class="task-number" v-if="is_task">{{ task_number }}积分+</view>
            <view class="he-price">{{ price }}</view>
            <view class="he-stock" v-if="is_task">剩余 {{ stocks }} {{ goods.unit }}兑换量</view>
            <view class="he-stock" v-else>剩余 {{ stocks }} {{ goods.unit }}</view>
          </view>
        </view>
      </view>
      <scroll-view scroll-y class="he-cart__body">
        <view class="he-attr">
          <view class="he-item" v-for="(item, index) in showParam" :key="index">
            <view class="he-item__header">
              {{ item.name }}
            </view>
            <view class="he-item__body flex flex-wrap" v-if="!item.image_status">
              <view
                v-for="(value, valueIndex) in item.value"
                class="he-attr__item"
                @click="setSelect(index, value, valueIndex)"
                :class="[
                  value.is_number ? 'he-attr__num-0' : 'he-attr__num-1',
                  value.is_select ? 'he-attr__select' : ''
                ]"
                :key="valueIndex"
                >{{ value.value }}
              </view>
            </view>
            <scroll-view v-else scroll-x class="he-item__scroll">
              <view
                class="flex"
                v-for="(rowValue, rowIndex) in imageList"
                :key="rowIndex"
                :class="rowIndex === 0 ? 'he-attr__bottom' : ''"
              >
                <template v-for="(colValue, valueIndex) in rowValue">
                  <view
                    class="he-attr__item"
                    @click="setSelect(index, colValue, colValue.index)"
                    :class="[
                      colValue.is_number ? 'he-attr__num-0' : 'he-attr__num-1',
                      colValue.is_select ? 'he-attr__select' : ''
                    ]"
                    :key="valueIndex"
                  >
                    <view
                      class="he-item__close flex justify-center align-center"
                      @click.stop="navigateTo(imageList, rowIndex, valueIndex)"
                    >
                      <text class="iconfont iconproductdetails_popup_enlargethepicture"></text>
                    </view>
                    <he-image
                      :height="195"
                      :width="192"
                      :image-style="{ borderRadius: '16rpx' }"
                      class="he-attr__img"
                      :src="colValue.image"
                    ></he-image>
                    <view class="he-attr__name flex justify-center align-center">
                      <text class="he-text he-line-2">{{ colValue.value }}</text>
                    </view>
                  </view>
                </template>
              </view>
            </scroll-view>
          </view>
        </view>
        <view class="he-number flex justify-between align-center">
          <view class="he-text" v-if="is_task"
            >数量
            <span class="he-min-number" v-if="limitTaskNum">（限兑{{ limitTaskNum }}{{ goods.unit }}）</span>
          </view>
          <view class="he-text" v-else
            >数量
            <span class="he-min-number">（{{ minNumber }}{{ goods.unit }}起购）</span>
          </view>
          <he-number-box
            :disabled-input="true"
            :min="minNumber"
            :max="limitTaskNum"
            v-model="number"
            v-if="is_task && limitTaskNum"
          ></he-number-box>
          <he-number-box
            :disabled-input="true"
            :min="minNumber"
            :max="limitBuyValue"
            v-model="number"
            v-else
          ></he-number-box>
        </view>
      </scroll-view>
      <view class="he-cart__footer">
        <view class="he-footer__btn" :class="$h.test.isEmpty(shoppingType) ? 'flex justify-between' : ''">
          <template v-if="stocks > 0">
            <template v-if="$h.test.isEmpty(shoppingType)">
              <!-- 处理判断积分任务情况下 -->
              <template v-if="is_task">
                <button class="cu-btn he-btn he-sure-btn" @click="buy">立即兑换</button>
              </template>
              <template v-else>
                <button class="cu-btn he-btn he-btn__left" @click="cart">加入购物车</button>
                <button class="cu-btn he-btn he-btn__right" @click="buy">立即购买</button>
              </template>
            </template>
            <button v-else class="cu-btn he-btn he-sure-btn" @click="shopping">确定</button>
          </template>
          <button v-if="stocks === 0" class="cu-btn he-btn he-sure-btn" disabled>商品已售罄</button>
        </view>
      </view>
    </view>
  </he-popup>
</template>

<script>
import HePopup from '@/components/he-popup.vue';
import heNumberBox from './he-number-box.vue';

export default {
  name: 'he-cart',
  components: {
    HePopup,
    heNumberBox
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    /**
     * 判断是否积分商品
     * @type {Object}
     */
    is_task: {
      type: [Boolean, Number, String],
      default: false
    },
    select: {
      type: [Object],
      default: function () {
        return {};
      }
    },
    score: {
      type: [String, Number],
      default: 0
    },
    type: {
      type: [String, Number],
      default: 1
    },
    goods: {
      type: Object,
      default: function () {
        return {
          param: {}
        };
      }
    },
    shoppingType: {
      type: String,
      default: function () {
        return '';
      }
    }
  },
  data() {
    return {
      task_status: 0,
      showParam: [],
      number: 1,
      imageList: [],
      showSelect: {}
    };
  },
  computed: {
    showModal: {
      get: function () {
        this.task_status = this.goods.task_status;
        return this.show;
      },
      set: function (newVal) {
        this.$emit('update:show', newVal);
      }
    },
    /**
     * 库存处理
     * @return {[type]} [description]
     */
    stocks: function () {
      if (!this.$h.test.isEmpty(this.showSelect)) {
        //判断是否为积分商品
        if (this.is_task && this.goods.task) {
          return this.showSelect.task_stock;
        } else {
          return this.showSelect.stocks;
        }
      } else {
        if (this.is_task && this.goods.task) {
          return this.goods.task.task_stock;
        } else {
          return this.goods.stocks;
        }
      }
    },
    /**
     * 积分值计算
     * @return {[type]} [description]
     */
    task_number: function () {
      if (!this.$h.test.isEmpty(this.showSelect)) {
        //判断是否为积分商品
        if (this.is_task && this.goods.task) {
          return this.showSelect.task_number;
        } else {
          return 0;
        }
      } else {
        if (this.is_task && this.goods.task) {
          return this.goods.task.task_number;
        } else {
          return 0;
        }
      }
    },
    /**
     * 价格计算
     * @return {[type]} [description]
     */
    price: function () {
      if (!this.$h.test.isEmpty(this.showSelect)) {
        //判断是否为积分商品
        if (this.is_task && this.goods.task) {
          return this.showSelect.task_price;
        } else {
          return this.showSelect.price;
        }
      } else {
        if (this.is_task && this.goods.task) {
          return this.goods.task.task_price;
        } else {
          return this.goods.price;
        }
      }
    },
    imageStatus: function () {
      return this.goods.param && this.goods.param.image_status;
    },
    pic: function () {
      return this.goods.slideshow && this.goods.slideshow[0];
    },
    minNumber: function () {
      return this.goods.min_number;
    },
    limitNumber: function () {
      return this.goods.min_number;
    },
    /**
     * 限制兑换
     * @return {[type]} [description]
     */
    limitTaskNum() {
      if (!this.$h.test.isEmpty(this.showSelect)) {
        if (this.is_task && this.goods.task) {
          return this.showSelect.task_limit;
        }
      } else {
        if (this.is_task && this.goods.task) {
          return this.goods.task.task_limit;
        }
      }
      return '';
    },
    goodsData: function () {
      return this.goods.param && this.goods.param.goods_data;
    },
    limitBuyValue: function ({ goods, stocks }) {
      if (this.goods.limit_buy_status === 1) {
        return this.goods.limit_buy_value;
      } else {
        return this.stocks;
      }
    },
    isLogin: function () {
      return this.$store.state.apply.is_login;
    }
  },
  methods: {
    setSelect: function (index, value, valueIndex) {
      let that = this;

      if (value.is_number) return;
      let showParam = this.showParam;
      let goodsData = this.goodsData;
      let list = showParam[index].value;

      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].is_select && valueIndex !== i) {
          list[i].is_select = false;
        }
      }
      value.is_select ? (value.is_select = false) : (value['is_select'] = true);
      let array = [];
      for (let i = 0; i < showParam.length; i++) {
        let list = showParam[i].value;
        let item = list.find(function (item) {
          return item.is_select === true;
        });
        array[i] = item ? item.value : null;
      }
      let arrayIndex = 0;
      let nullNum = 0;
      array.forEach(function (item, index) {
        if (item === null) {
          nullNum++;
          arrayIndex = index;
        }
      });
      let attrNum_0 = [];
      goodsData.forEach(function (f) {
        //此处用于判断库存
        if (that.is_task && f.task_stock) {
          if (f.task_stock === 0) {
            Array.prototype.push.apply(attrNum_0, [f.param_value]);
          }
        } else {
          if (f.stocks === 0) {
            Array.prototype.push.apply(attrNum_0, [f.param_value]);
          }
        }
      });

      let newArray = JSON.parse(JSON.stringify(array));
      showParam.forEach(function (col, rowIndex) {
        showParam[rowIndex].value.forEach(function (item) {
          item.is_number = false;
        });
      });

      if (nullNum === 1) {
        showParam.forEach(function (col) {
          col.value.forEach(function (item) {
            newArray[arrayIndex] = item.value;
            attrNum_0.forEach(function (f) {
              if (newArray.toString() === f.split('_').toString()) {
                item.is_number = true;
              }
            });
          });
        });
      } else if (nullNum === 0) {
        showParam.forEach(function (col, index) {
          col.value.forEach(function (item) {
            newArray[index] = item.value;
            attrNum_0.forEach(function (f) {
              if (newArray.toString() === f.split('_').toString() && !item.is_select) {
                item.is_number = true;
              }
            });
          });
        });
      }

      if (array.length === showParam.length) {
        let str = '';
        array.forEach(function (item) {
          str += item + '_';
        });
        str = str.substring(0, str.length - 1);
        this.showSelect = goodsData.find(function (item) {
          return item.param_value === str;
        });
        if (this.showSelect) {
          this.showSelect.goods_number = this.number;
          this.showSelect.goods_param = this.showSelect.param_value;
          this.$emit('setSelect', this.showSelect);
        }
      } else {
        this.showSelect = null;
      }
    },
    identifier: function (showParam, newArray, attrNum_0) {
      showParam.forEach(function (col, index) {
        col.value.forEach(function (item) {
          newArray[index] = item.value;
          attrNum_0.forEach(function (f) {
            if (newArray.toString() === f.split('_').toString() && !item.is_select) {
              item.is_number = true;
            }
          });
        });
      });
    },
    navigateTo: function (row, rowIndex, valueIndex) {
      let index = 0;
      if (rowIndex === 0) {
        index = valueIndex;
      } else {
        index = row[rowIndex].length + valueIndex + 1;
      }
      let _this = this;
      wx.navigateTo({
        url: '/pages/other/preview?pic=' + encodeURIComponent(JSON.stringify(row)) + '&index=' + index,
        events: {
          setEvent: function (data) {
            _this.imageList.forEach(row => {
              row.forEach(item => {
                item.is_select = false;
              });
            });
            let one = _this.showParam[0].value.find(item => {
              return data.col.value === item.value;
            });

            _this.setSelect(rowIndex, one, data.col.index);
          }
        }
      });
    },
    setRow: function (row) {
      row.forEach(function (item, index) {
        item.index = index;
      });
      if (row.length <= 3) {
        return [row];
      } else if (row.length > 3 && row.length <= 6) {
        return [row.slice(0, 3), row.slice(3, 6)];
      } else {
        if (row.length % 2 === 1) {
          let len = (row.length - 1) / 2;
          return [row.slice(0, len + 1), row.slice(len + 1, row.length)];
        } else {
          return [row.slice(0, row.length / 2), row.slice(row.length / 2, row.length)];
        }
      }
    },
    shopping: function () {
      // #ifdef H5
      if (!this.isLogin) {
        this.$store.commit('apply/setLoginModel', true)
        return;
      }
      // #endif
      if (this.shoppingType === 'cart') {
        this.cart();
      } else if (this.shoppingType === 'buy') {
        this.buy();
      } else {
        if (this.isEmpty()) return;
        this.showSelect.goods_number = this.number;
        this.showSelect.cart_id = this.goods.cart_id;
        this.showModal = false;
        this.$emit('put', this.showSelect);
      }
    },

    cart: function () {
      if (this.isEmpty()) return;
      this.showModal = false;
      let _this = this;
      this.showSelect.goods_number = this.number;
      this.$heshop
        .cart('post', {
          goods_id: this.showSelect.goods_id,
          goods_number: this.number,
          goods_param: this.showSelect.param_value,
          goods_name: this.goods.name,
          goods_image: this.pic
        })
        .then(function () {
          _this.$store.commit('cart/setCartAdd', true);
          _this.$store.commit('cart/cartNum', true);
          _this.$h.toast('加入购物车成功');
          let index = _this.$store.getters['setting/getCartIndex'];
          _this.$store.dispatch('cart/getCartNumber').then(response => {
            if (response !== 0) {
              uni.setTabBarBadge({
                index: index,
                text: response + ''
              });
            } else {
              uni.removeTabBarBadge({
                index: index
              });
            }
          });
        })
        .catch(function (err) {
          if (err.status === 401) {
            // #ifdef H5
            _this.$store.commit('apply/setLoginModel', true);
            // #endif
          }
          // _this.$h.toast(err.data.message);
        });
    },
    buy: function () {
      if (this.isEmpty()) return;
      this.showModal = false;
      let _this = this;
      this.showSelect.goods_number = this.number;
      uni.navigateTo({
        url: '/pages/order/submit?is_task=' + this.is_task,
        success: function (res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            data: [_this.showSelect]
          });
        }
      });
    },
    isEmpty: function () {
      if (this.$h.test.isEmpty(this.showSelect)) {
        this.$h.toast('请选择规格');
        return true;
      }
    }
  },
  watch: {
    'goods.param.param_data': {
      handler(data) {
        if (!data) return;
        // 初始
        this.showSelect = {};
        this.number = this.goods.min_number;
        let newData = JSON.parse(JSON.stringify(data));

        for (let i = 0, iLen = newData.length; i < iLen; i++) {
          let value = newData[i].value;
          for (let j = 0, jLen = value.length; j < jLen; j++) {
            value[j].is_number = this.stocks === 0;
            value[j].is_select = false;
          }
        }
        if (!this.$h.test.isEmpty(this.select)) {
          let array = this.select.param_value.split('_');
          for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < newData[i].value.length; j++) {
              let item = newData[i].value[j];
              let value = item.value;
              item.is_select = value === array[i];
            }
          }
        }
        if (this.imageStatus) {
          this.imageList = this.setRow(newData[0].value);
        }
        if (this.goods.param_type === 1) {
          for (let i = 0, iLen = newData.length; i < iLen; i++) {
            let value = newData[i].value;
            for (let j = 0, jLen = value.length; j < jLen; j++) {
              if (this.stocks !== 0) {
                value[j].is_select = true;
              }
            }
          }
          this.showSelect = this.goodsData[0];
          this.showSelect.goods_number = this.number;
          this.showSelect.goods_param = this.showSelect.param_value;
          this.$emit('setSelect', this.showSelect);
        }
        if (newData.length > 1) {
          newData[1].image_status = false;
        } else if (newData.length > 2) {
          newData[2].image_status = false;
        }
        this.showParam = newData;
      },
      immediate: true
    },
    select: {
      handler(newVal) {
        if (this.$h.test.isEmpty(newVal)) return;
        for (let i = 0; i < this.goodsData.length; i++) {
          if (this.goodsData[i].param_value === newVal.param_value) {
            this.showSelect = this.goodsData[i];
          }
        }
        this.number = newVal.goods_number;
      },
      immediate: true
    },
    minNumber: {
      handler(val) {
        this.number = val ? val : 1;
      },
      immediate: true
    }
  }
};
</script>
<style scoped lang="scss">
.he-cart {
  padding-top: 32px;
  position: relative;
}

.task-number {
  display: inline-block;
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: bold;
  @include font_color('font_color');
}

.he-price {
  display: inline-block;
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: bold;
  @include font_color('font_color');
}

.he-cart__body {
  max-height: 60vh;
}

.he-cart__footer {
  height: 141px;
  margin: 0 32px;
  overflow: hidden;

  .he-footer__btn .cu-btn[disabled] {
    background-color: #cccccc !important;
    opacity: 1;
    color: #ffffff;
  }
}

.he-close {
  width: 84px;
  height: 84px;
  position: absolute;
  right: 0;
  top: 0;
}

.iconpopup_close {
  font-size: 20px;
  color: #999999;
}

.he-price:before {
  content: '￥';
}

.he-stock {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-type-0 {
  //   height: 84px;
  text-align: center;

  .he-price {
    margin-bottom: 10px;
  }

  .he-stock {
    margin-bottom: 10px;
  }
}

.he-type-1 {
  height: 160px;
  padding-left: 32px;
  margin-bottom: 48px;

  .he-goods__pic {
    width: 160px;
    height: 160px;
    border-radius: 16px;
    display: block;
  }

  .he-content {
    padding-left: 32px;
    padding-top: 60px;
  }

  .he-price {
    margin-bottom: 10px;
  }
}

.he-attr {
  .he-item {
    margin-bottom: 32px;
  }

  .he-item__header {
    height: 48px;
    line-height: 48px;
    padding-left: 32px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }

  .he-item__body {
    padding-left: 32px;

    .he-attr__item {
      height: 56px;
      line-height: 52px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 28px;
      border-width: 2px;
      border-color: #d9d9d9;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #222222;
      padding: 0 32px;
      margin: 12px 24px 12px 0;
    }

    .he-attr__select {
      @include font_color('font_color');
      @include border_color('border_color');
    }

    .he-attr__num-0 {
      color: #999999;
      border-style: dashed;
    }

    .he-attr__num-1 {
      border-style: solid;
    }
  }

  .he-item__scroll {
    width: 750px;

    .he-item__close {
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 2;
    }

    .iconproductdetails_popup_enlargethepicture {
      color: #ffffff;
      font-size: 20px;
    }

    .he-attr__item {
      width: 196px;
      height: 260px;
      background: #ffffff;
      margin-left: 20px;
      border-radius: 16px;
      border: 2px solid #d9d9d9;
      position: relative;
    }

    .he-attr__img {
      width: 192px;
      height: 195px;
      display: block;
      border-radius: 16px;
    }

    .he-attr__bottom {
      margin-bottom: 26px;
    }

    .he-attr__num-0 {
      border-style: dashed;

      .he-attr__img {
        opacity: 0.6;
      }

      .he-attr__name {
        color: #999999;
      }
    }

    .he-attr__select {
      @include border_color('border_color');

      .he-attr__name text {
        @include font_color('font_color');
      }
    }

    .he-attr__name {
      height: 64px;
      text-align: center;
      padding: 10px;

      .he-text {
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
      }
    }
  }
}

.he-number {
  height: 64px;
  margin: 0 32px 52px 32px;
  padding-top: 32px;
  border-top: 1px solid #e5e5e5;

  .he-text {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }

  .he-min-number {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
  }
}

.he-footer__btn {
  height: 120px;
  padding: 20px 0;
  margin-top: 21px;

  .he-btn {
    width: 338px;
    height: 80px;
    border-radius: 40px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
  }

  .he-btn__left {
    border-width: 1px;
    border-style: solid;
    @include font_color('font_color');
    @include border_color('border_color');
    @include background_color('opacify_background_0');
  }

  .he-btn__right {
    @include background_color('background_color');
    color: #ffffff;
  }

  .he-sure-btn {
    width: 100%;
    @include background_color('background_color');
    color: #ffffff;
  }
}
</style>
