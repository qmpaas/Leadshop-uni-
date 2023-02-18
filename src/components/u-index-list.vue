<template>
  <view :data-theme="theme">
    <view class="u-index-bar">
      <slot />
      <view
        v-if="showSidebar"
        class="u-index-bar__sidebar"
        @touchstart.stop.prevent="onTouchMove"
        @touchmove.stop.prevent="onTouchMove"
        @touchend.stop.prevent="onTouchStop"
        @touchcancel.stop.prevent="onTouchStop"
      >
        <view
          v-for="(item, index) in indexList"
          :key="index"
          class="u-index-bar__index"
          :class="activeAnchorIndex === index ? 'u-active' : ''"
          :style="{ zIndex: zIndex + 1 }"
          :data-index="index"
        >
          {{ item }}
        </view>
      </view>
      <view
        class="u-indexed-list-alert"
        v-if="touchmove && indexList[touchmoveIndex]"
        :style="{
          zIndex: alertZIndex
        }"
      >
        <text>{{ indexList[touchmoveIndex] }}</text>
      </view>
    </view>
  </view>
</template>

<script>
let indexList = function () {
  let indexList = [];
  let charCodeOfA = 'A'.charCodeAt(0);
  for (let i = 0; i < 26; i++) {
    indexList.push(String.fromCharCode(charCodeOfA + i));
  }
  return indexList;
};
let systemInfo = uni.getSystemInfoSync();
export default {
  name: 'u-index-list',
  props: {
    sticky: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: [Number, String],
      default: ''
    },
    scrollTop: {
      type: [Number, String],
      default: 0
    },
    offsetTop: {
      type: [Number, String],
      default: 0
    },
    indexList: {
      type: Array,
      default() {
        return indexList();
      }
    },
    activeColor: {
      type: String,
      default: '#2979ff'
    }
  },
  created() {
    // #ifdef H5
    this.stickyOffsetTop = this.offsetTop ? uni.upx2px(this.offsetTop) : 0;
    // #endif
    // #ifndef H5
    this.stickyOffsetTop = this.offsetTop ? uni.upx2px(this.offsetTop) : 0;
    // #endif
    // 只能在created生命周期定义children，如果在data定义，会因为循环引用而报错
    this.children = [];
  },
  data() {
    return {
      activeAnchorIndex: 0,
      showSidebar: true,
      touchmove: false,
      touchmoveIndex: 0,
      statusBarHeight: systemInfo.statusBarHeight
    };
  },
  watch: {
    scrollTop: {
      handler() {
        this.updateData();
      }
      // immediate: true
    }
  },
  computed: {
    // 弹出toast的z-index值
    alertZIndex() {
      return 10090;
    }
  },
  methods: {
    updateData() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showSidebar = !!this.children.length;
        this.setRect().then(() => {
          this.onScroll();
        });
      }, 0);
    },
    setRect() {
      return Promise.all([this.setAnchorsRect(), this.setListRect(), this.setSiderbarRect()]);
    },
    setAnchorsRect() {
      return Promise.all(
        this.children.map((anchor, index) =>
          anchor.$hGetRect('.u-index-anchor-wrapper').then(rect => {
            // #ifdef H5
            Object.assign(anchor, {
              height: rect.height,
              top: rect.top + 44
            });
            // #endif
            // #ifndef H5
            Object.assign(anchor, {
              height: rect.height,
              top: rect.top
            });
            // #endif
          })
        )
      );
    },
    setListRect() {
      return this.$hGetRect('.u-index-bar').then(rect => {
        Object.assign(this, {
          height: rect.height,
          top: rect.top + this.scrollTop
        });
      });
    },
    setSiderbarRect() {
      return this.$hGetRect('.u-index-bar__sidebar').then(rect => {
        this.sidebar = {
          height: rect.height,
          top: rect.top
        };
      });
    },
    getActiveAnchorIndex() {
      const { children } = this;
      const { sticky } = this;
      for (let i = this.children.length - 1; i >= 0; i--) {
        const preAnchorHeight = i > 0 ? children[i - 1].height : 0;
        const reachTop = sticky ? preAnchorHeight : 0;
        if (reachTop >= children[i].top) {
          return i;
        }
      }
      return -1;
    },
    onScroll() {
      const { children = [] } = this;
      if (!children.length) {
        return;
      }
      const { sticky, stickyOffsetTop, zIndex, scrollTop, activeColor } = this;
      const active = this.getActiveAnchorIndex();
      this.activeAnchorIndex = active;
      if (sticky) {
        let isActiveAnchorSticky = false;
        if (active !== -1) {
          isActiveAnchorSticky = children[active].top <= 0;
        }
        children.forEach((item, index) => {
          if (index === active) {
            let wrapperStyle = '';
            let anchorStyle = {};
            if (isActiveAnchorSticky) {
              wrapperStyle = {
                height: `${children[index].height}px`
              };
              anchorStyle = {
                position: 'fixed',
                top: `${stickyOffsetTop}px`,
                zIndex: `${zIndex ? zIndex : 965}`
              };
            }
            item.active = active;
            item.wrapperStyle = wrapperStyle;
            item.anchorStyle = anchorStyle;
          } else if (index === active - 1) {
            const currentAnchor = children[index];
            const currentOffsetTop = currentAnchor.top;
            const targetOffsetTop = index === children.length - 1 ? this.top : children[index + 1].top;
            const parentOffsetHeight = targetOffsetTop - currentOffsetTop;
            const translateY = parentOffsetHeight - currentAnchor.height;
            const anchorStyle = {
              position: 'relative',
              transform: `translate3d(0, ${translateY}px, 0)`,
              zIndex: `${zIndex ? zIndex : 965}`
            };
            item.active = active;
            item.anchorStyle = anchorStyle;
          } else {
            item.active = false;
            item.anchorStyle = '';
            item.wrapperStyle = '';
          }
        });
      }
    },
    onTouchMove(event) {
      this.touchmove = true;
      const sidebarLength = this.children.length;
      const touch = event.touches[0];
      const itemHeight = this.sidebar.height / sidebarLength;
      let clientY = 0;
      clientY = touch.clientY;
      let index = Math.floor((clientY - this.sidebar.top) / itemHeight);
      if (index < 0) {
        index = 0;
      } else if (index > sidebarLength - 1) {
        index = sidebarLength - 1;
      }
      this.touchmoveIndex = index;
      this.scrollToAnchor(index);
    },
    onTouchStop() {
      this.touchmove = false;
      this.scrollToAnchorIndex = null;
    },
    scrollToAnchor(index) {
      if (this.scrollToAnchorIndex === index) {
        return;
      }
      this.scrollToAnchorIndex = index;
      const anchor = this.children.find(item => item.index === this.indexList[index]);
      if (anchor) {
        this.$emit('select', anchor.index);
        uni.pageScrollTo({
          duration: 0,
          scrollTop: anchor.top + this.scrollTop
        });
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.setRect();
    });
  }
};
</script>

<style lang="scss" scoped>
.u-index-bar {
  position: relative;
}

.u-index-bar__sidebar {
  position: fixed;
  top: 50%;
  right: 0;
  display: flex;
  flex-direction: column;
  text-align: center;
  transform: translateY(-50%);
  user-select: none;
  z-index: 99;
}

.u-index-bar__index {
  font-weight: 500;
  margin-bottom: 12px;
  margin-right: 12px;
  width: 24px;
  border-radius: 50%;
  height: 24px;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #222222;
}
.u-active {
  @include background_color('background_color');
  color: #fff;
}
.u-indexed-list-alert {
  position: fixed;
  width: 120px;
  height: 120px;
  right: 90px;
  top: 50%;
  margin-top: -60px;
  border-radius: 24px;
  font-size: 50px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 9999999;
}

.u-indexed-list-alert text {
  line-height: 50px;
}
</style>
