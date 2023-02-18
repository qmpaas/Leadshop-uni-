<!--
 * @Author: fjt
 * @Date: 2021-07-10 21:31:36
 * @LastEditors: fjt
 * @LastEditTime: 2021-07-11 14:23:02
-->
<template>
  <he-popup
    mode="bottom"
    v-model="showModal"
    :mask="false"
    @close="popupClose"
    :safeAreaInsetBottom="true"
    :popup="false"
    length="auto"
    :duration="100"
  >
    <view class="he-number--keyborad" :data-theme="theme">
      <button class="cu-btn he-head--close flex align-center justify-center" @click="showModal = false">
        <text class="iconfont iconarrow-down"></text>
      </button>
      <view class="he-body flex">
        <view>
          <view class="flex">
            <button :hover-class="hoverClass" @click="keyboardClick(1)" class="cu-btn small-button he-num">1</button>
            <button :hover-class="hoverClass" @click="keyboardClick(2)" class="cu-btn small-button he-num">2</button>
            <button :hover-class="hoverClass" @click="keyboardClick(3)" class="cu-btn small-button he-num">3</button>
          </view>
          <view class="flex">
            <button :hover-class="hoverClass" @click="keyboardClick(4)" class="cu-btn small-button he-num">4</button>
            <button :hover-class="hoverClass" @click="keyboardClick(5)" class="cu-btn small-button he-num">5</button>
            <button :hover-class="hoverClass" @click="keyboardClick(6)" class="cu-btn small-button he-num">6</button>
          </view>
          <view class="flex">
            <button :hover-class="hoverClass" @click="keyboardClick(7)" class="cu-btn small-button he-num">7</button>
            <button :hover-class="hoverClass" @click="keyboardClick(8)" class="cu-btn small-button he-num">8</button>
            <button :hover-class="hoverClass" @click="keyboardClick(9)" class="cu-btn small-button he-num">9</button>
          </view>
          <view class="flex">
            <button :hover-class="hoverClass" class="cu-btn zero-button" @click="keyboardClick(0)">0</button>
            <button :hover-class="hoverClass" class="cu-btn small-button he-num" @click="dotClick">.</button>
          </view>
        </view>
        <view>
          <button class="cu-btn small-button" :hover-class="hoverClass" @click="backspace">
            <text class="iconfont iconshuzishanchu"></text>
          </button>
          <button class="cu-btn sure-button" @click="onConfirm" :class="sureButton">确定</button>
        </view>
      </view>
    </view>
  </he-popup>
</template>

<script>
import hePopup from './../he-popup.vue';

export default {
  name: 'number-keyword',
  props: {
    zIndex: {
      type: [Number, String],
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: false
    },
    digital: {
      type: [String, Number],
      defalut: ''
    }
  },
  components: {
    hePopup: hePopup
  },
  computed: {
    hZIndex: ({ zIndex, $zIndex }) => {
      return zIndex ? zIndex : $zIndex.popup;
    },
    showModal: {
      get({ value }) {
        return value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    internalDigital: {
      get({ digital }) {
        return digital;
      },
      set(val) {
        this.$emit('update:digital', val);
      }
    },
    hoverClass() {
      return 'he-keyboard-hover';
    },
    sureButton({ internalDigital }) {
      if (!internalDigital.length) {
        return 'disabled';
      } else {
        return 'sure';
      }
    }
  },
  methods: {
    popupClose() {
      this.$emit('input', false);
    },
    keyboardClick(str) {
      const firstZero = this.internalDigital.indexOf('0') === 0 && this.internalDigital.indexOf('.') === -1;
      if (str !== 0 || !firstZero) {
        if (this.internalDigital.indexOf('.') === -1) {
          if (this.internalDigital.length <= 7) {
            this.internalDigital += str;
          }
        } else {
          if (this.internalDigital.length <= 10) {
            if (this.internalDigital.split('.')[1].length <= 1) {
              this.internalDigital += str;
            }
          }
        }
      }
      this.vibrateShort();
      this.$nextTick().then(() => {
        if (firstZero) {
          this.internalDigital = `${str}`;
        }
      });
    },
    backspace() {
      if (this.internalDigital.length) {
        this.internalDigital = this.internalDigital.substr(0, this.internalDigital.length - 1);
      }
      this.vibrateShort();
    },
    dotClick() {
      if (!this.internalDigital.length) {
        this.internalDigital = '0.';
        return;
      }
      if (this.internalDigital.indexOf('.') === -1) {
        this.internalDigital += '.';
      }
      this.vibrateShort();
    },
    vibrateShort() {
      wx.vibrateShort();
    },
    onConfirm() {
      this.showModal = false;
      this.$emit('onConfirm');
    }
  }
};
</script>

<style scoped lang="scss">
.he-number--keyborad {
  height: 494px;
}
.he-head--close {
  height: 72px;
  border-top: 2px solid #e5e5e5;
  border-radius: 0;
  background-color: #ffffff;
  .iconarrow-down {
    font-size: 32px;
    color: #cccccc;
  }
}
.he-body {
  height: 422px;
  background-color: #f5f5f5;
  padding: 14px 0 14px 14px;
  .small-button {
    width: 170px;
    height: 88px;
    background: #ffffff;
    border-radius: 8px;
    line-height: 88px;
    font-size: 44px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    text-align: center;
  }
  .he-num {
    margin: 0 14px 14px 0;
  }
  .sure-button {
    width: 170px;
    height: 292px;
    border-radius: 8px;
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    line-height: 292px;
    margin-top: 14px;
    &.disabled {
      background: #cccccc;
    }
    &.sure {
      @include background_color('background_color');
    }
  }
  .zero-button {
    width: 354px;
    height: 88px;
    background: #ffffff;
    border-radius: 8px;
    margin-right: 14px;
    text-align: center;
    line-height: 88px;
    font-size: 44px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
  }
  .he-keyboard-hover {
    background-color: #e7e6eb;
  }
  .iconshuzishanchu {
    font-size: 40px;
    color: #222222;
  }
}
</style>
