<template>
  <he-popup
    v-model="showModal"
    mode="center"
    :width="590"
    :height="288"
    :border-radius="16"
    negative-top="30vh"
    :zoom="false"
  >
    <view class="flex flex-direction align-center" :data-theme="theme">
      <view class="he-invaild-text">{{ title }}</view>
      <button class="cu-btn he-invaild-btn" @click="redirectTo">去逛逛</button>
    </view>
  </he-popup>
</template>
<script>
import hePopup from '@/components/he-popup.vue';
export default {
  name: 'detail-invaild',
  components: {
    hePopup
  },
  props: {
    value: {
      type: Boolean
    },
    title: {
      type: String
    }
  },
  computed: {
    showModal: {
      get: function () {
        return this.value;
      },
      set: function (bool) {
        this.$emit('input', bool);
      }
    }
  },
  methods: {
    redirectTo: function () {
      uni.redirectTo({
        url: '/pages/goods/search-list'
      });
    }
  }
};
</script>
<style scoped lang="scss">
.he-invaild-text {
  font-size: 32px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-top: 64px;
  margin-bottom: 63px;
}

.he-invaild-btn {
  width: 242px;
  height: 72px;
  border-radius: 36px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  @include background_color('background_color');
}
</style>
