<template>
  <he-toast v-model="loading">
    <view class="he-loading flex flex-direction align-center">
      <image :src="ipAddress + '/upload-loading.gif'" class="he-loading__image"></image>
      <text>{{ title }}</text>
    </view>
  </he-toast>
</template>

<script>
import heToast from './he-toast.vue';

export default {
  name: 'he-save-loading',
  components: {
    heToast
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '图片上传中...'
    }
  },
  computed: {
    loading: {
      get: function ({ value }) {
        return value;
      },
      set: function (value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.he-loading {
  width: 100%;
  height: 100%;
  font-size: 28px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
}
.he-loading__image {
  width: 96px;
  height: 96px;
  margin-top: 52px;
  margin-bottom: 40px;
}
</style>
