<template>
  <he-popup mode="bottom" v-model="showModal" :border-radius="16">
    <view class="he-header">
      <view class="he-close flex justify-center align-center" @click="showModal = false">
        <text class="iconfont iconpopup_close"></text>
      </view>
      <view class="he-header__text">参数</view>
    </view>
    <scroll-view class="he-body" scroll-y>
      <view class="he-item flex" v-for="(item, index) in list" :key="index">
        <view class="he-name">{{ item.name }}</view>
        <view class="he-item__bottom">{{ item.value }}</view>
      </view>
    </scroll-view>
  </he-popup>
</template>

<script>
import HePopup from '@/components/he-popup.vue';

export default {
  name: 'detail-args',
  components: {
    HePopup
  },
  props: {
    value: {
      type: Boolean
    },
    list: {
      type: Array
    }
  },
  computed: {
    showModal: {
      get: function ({ value }) {
        return value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.he-header {
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
}

.he-close {
  position: absolute;
  right: 0;
  top: 0;
  width: 84px;
  height: 84px;
}

.he-header__text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  text-align: center;
  margin-top: 32px;
}

.iconpopup_close {
  font-size: 20px;
  color: #999999;
}

.he-body {
  padding: 0 32px;
  max-height: calc(50vh - 80px);
}

.he-item {
  padding: 32px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e5e5e5;
  }
}

.he-name {
  width: 100px;
  // 固定宽度
  flex-shrink: 0;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  line-height: 30px;
}

.he-item__bottom {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  line-height: 30px;
  margin-left: 45px;
}
</style>
