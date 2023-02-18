<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-05-18 13:49:46
 * @LastEditTime: 2021-06-16 11:52:40
 * @LastEditors: fjt
-->
<template>
  <view class="he-page-content">
    <swiper class="he-scroll" :current="current" @change="swiperChange">
      <swiper-item v-for="(item, key) in pic" :key="key" class="le-scroll-item">
        <he-image
          :width="750"
          :height="750"
          :src="item.image"
          :image-style="{
            marginTop: '20vh',
          }"
          @click.native="navigateBack"
        ></he-image>
        <view class="he-name">
          {{ item.value }}
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      pic: [],
      current: 0,
    };
  },
  onLoad(options) {
    let array = JSON.parse(decodeURIComponent(options.pic));
    array = array.flat(1);
    this.pic = array;
    this.current = options.index;
  },
  methods: {
    navigateBack: function () {
      const eventChannel = this.getOpenerEventChannel();
   
      eventChannel.emit("setEvent", {
        current: this.current,
        col: this.pic[this.current],
      });
      uni.navigateBack({ delta: 1 });
    },
    swiperChange: function (data) {
      this.current = data.detail.current;
    },
  },
};
</script>

<style scoped lang="scss">
.he-scroll {
  width: 750px;
  height: 100%;
}
.he-page-content {
  width: 750px;
  background-color: #000000;
  overflow: hidden;
  height: 100vh;
}
.he-name {
  width: 356px;
  border: 2px solid #ffffff;
  border-radius: 47px;
  padding: 16px 40px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 36px;
  text-align: center;
  margin: 40px auto 0 auto;
}
</style>