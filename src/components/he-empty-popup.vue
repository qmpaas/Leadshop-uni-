<template>
  <he-popup mode="center" :border-radius="16" v-model="showModal" :zoom="false">
    <view class="he-empty-popup flex flex-direction" :data-theme="theme">
      <view class="he-top" :style="[style]">{{ title }}</view>
      <view class="he-bottom flex justify-between align-end">
        <button class="cu-btn" @click="cancel">{{ cancelText }}</button>
        <view class="he-line"></view>
        <button class="cu-btn" @click="confirm">{{ confirmText }}</button>
      </view>
    </view>
  </he-popup>
</template>

<script>
import hePopup from './he-popup.vue';

export default {
  name: 'he-empty-popup',
  props: {
    value: Boolean,
    item: Object,
    title: String,
    emptyStyle: Object,
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  components: {
    hePopup
  },
  computed: {
    showModal: {
      get: function ({ value }) {
        return value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    },
    style: function ({ emptyStyle }) {
      return emptyStyle;
    }
  },
  methods: {
    confirm: function () {
      console.log(this.item);
      this.showModal = false;
      this.$emit('confirm', this.item);
    },
    cancel: function () {
      console.log(this.item);
      this.showModal = false;
      this.$emit('cancel', this.item);
    }
  }
};
</script>

<style scoped lang="scss">
.he-empty-popup {
  width: 510px;
  background: #ffffff;
  overflow: hidden;
}

.he-top {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
}

.he-bottom {
  height: 90px;
  position: relative;
}

.he-line {
  width: 1px;
  height: 88px;
  border: 1px solid #e5e5e5;
  position: absolute;
  top: 0;
  left: 50%;
}

.cu-btn {
  width: 254.5px;
  height: 87px;
  background: transparent;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  border-radius: 0;
}

.cu-btn:first-child {
  color: #666666;
}

.cu-btn:last-child {
  @include font_color('font_color');
}
</style>
