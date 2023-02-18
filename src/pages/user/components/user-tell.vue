<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-06-05 10:04:32
 * @LastEditTime: 2021-06-08 10:37:23
 * @LastEditors: fjt
-->
<template>
  <he-popup v-model="showModal" mode="bottom" :border-radius="16">
    <view class="user-bind-phone flex flex-direction">
      <button class="cu-btn he-bind__item" @click="tellPhone">电话联系</button>
      <button
        class="cu-btn he-bind__item"
        @click="tellWechat"
        v-if="storeSetting.contact_img"
      >
        加好友联系
      </button>
      <button class="cu-btn he-bind__item" @click="showModal = false">
        取消
      </button>
    </view>
  </he-popup>
</template>

<script>
import HePopup from "@/components/he-popup";

export default {
  name: "user-tell",
  props: {
    value: Boolean,
  },
  components: {
    HePopup,
  },
  computed: {
    showModal: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    tellPhone: function () {
      this.$emit("update:is-he-tell", true);
      this.showModal = false;
    },
    tellWechat: function () {
      this.$emit("update:is-qr-code", true);
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.user-bind-phone {
  background-color: RGBA(245, 245, 245, 1);
}
.he-bind__item {
  height: 104px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  background-color: #ffffff;
}
.he-bind__item:first-child {
  border-bottom: 1px solid #e5e5e5;
  padding-top: 16px;
  height: 120px;
}
.he-bind__item:last-child {
  margin-top: 16px;
}
</style>