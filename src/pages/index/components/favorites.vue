<template>
  <view
    class="he-favorites"
    v-if="visibleSync"
    :data-theme="theme"
    :style="[
      {
        zIndex: hZindex - 1
      }
    ]"
  >
    <he-mask
      :duration="250"
      :maskClickAble="true"
      :z-index="hZindex - 2"
      :show="showDrawer"
      @click="maskClick"
    ></he-mask>
    <view
      @touchmove.stop.prevent="() => {}"
      class="he-drawer-content flex flex-direction align-center"
      :style="[boxStyle]"
    >
      <image class="he-box-image" :src="ipAddress + '/favorites-index-background.png'" />
      <button class="cu-btn he-box-btn" @click="btnClick">不再提示</button>
    </view>
  </view>
</template>

<script>
import heMask from '@/components/he-mask.vue';
let menuButtonInfo = {};
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
//组件列表
export default {
  components: {
    heMask
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    popup: {
      type: Boolean,
      default: true
    }
  },
  name: 'favorites',
  data() {
    return {
      visibleSync: false,
      showDrawer: false,
      timer: null,
      hZindex: 1000,
      menuButtonInfo: menuButtonInfo
    };
  },
  mounted() {
    this.value && this.open();
  },
  computed: {
    boxStyle: function () {
      let { top, height } = this.menuButtonInfo;
      return {
        top: top + height + uni.upx2px(12) + 'px'
      };
    }
  },
  methods: {
    open: function () {
      this.change('visibleSync', 'showDrawer', true);
    },
    change(param1, param2, status) {
      if (this.popup == true) {
        this.$emit('input', status);
      }
      this[param1] = status;
      if (status) {
        // #ifdef H5
        this.timer = setTimeout(() => {
          this[param2] = status;
          this.$emit(status ? 'open' : 'close');
        }, 50);
        // #endif
        // #ifndef H5
        this.$nextTick(() => {
          this[param2] = status;
          this.$emit(status ? 'open' : 'close');
        });
        // #endif
      } else {
        this.timer = setTimeout(() => {
          this[param2] = status;
          this.$emit(status ? 'open' : 'close');
        }, 250);
      }
    },
    maskClick: function () {
      this.close();
    },
    btnClick: function () {
      uni.setStorageSync('isfavorites', true);
      this.close();
    },
    close: function () {
      this.$emit('input', true);
      this.change('visibleSync', 'showDrawer', false);
    }
  }
};
</script>

<style scoped lang="scss">
.he-favorites {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.he-drawer-content {
  position: absolute;
  right: 50px;
  z-index: 999;
}
.he-box-image {
  width: 410px;
  height: 660px;
  margin-bottom: 48px;
}
.he-box-btn {
  width: 200px;
  height: 56px;
  border: 1px solid #ffffff;
  border-radius: 28px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  background: transparent;
}
</style>
