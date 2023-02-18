<template>
  <movable-area @click="isShow = false">
    <view v-if="isShow" class="box" @click.stop>

    </view>
    <movable-view @touchend="touchend" v-else @click.stop="onClick" inertia @change="onChange" direction="all" style="width: 88rpx;height: 88rpx;background-color: red" :y="y" :x="x"></movable-view>
  </movable-area>
</template>

<script>
export default {
  name: "float",
  data() {
    return {
      x: 150,
      y: 150,
      old: {
        x: 150,
        y: 150
      },
      isShow: false,
      list: [],
    }
  },
  methods: {
    onChange(e) {
      this.old.x = e.detail.x
      this.old.y = e.detail.y
    },
    onClick() {
      this.isShow = true;
    },
    touchend() {
      this.x = this.old.x
      this.y = this.old.y
      const width = wx.getSystemInfoSync().windowWidth;
      this.$nextTick(() => {
        if (this.x < width / 2) {
          this.x = uni.upx2px(24);
        } else if (this.x > width/2) {
          this.x = width - uni.upx2px(88) - uni.upx2px(24);
        }
      });
    }
  }
}
</script>

<style scoped>
movable-area {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 100;
}

.box {
  width: 424px;
  height: 362px;
  background: #000000;
  opacity: 0.6;
  border-radius: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
