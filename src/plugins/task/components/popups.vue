<template>
  <div
    class="task-popups"
    v-if="display"
    :class="{ 'task-popups-active': display }"
    :style="[topStyle]"
    @click.stop="tolink"
  >
    <div class="task-popups__bg"></div>
    <div class="task-popups__icon">
      <text class="iconfont iconbtn_select"></text>
    </div>
    <div class="task-popups__title">
      {{ title }}
    </div>
    <div class="task-popups__close" @click.stop="toclose">
      <text class="iconfont iconpopup_close"></text>
    </div>
    <div class="task-popups__link" @click.stop="tolink">去领取 <text class="iconfont iconbtn_arrow"></text></div>
  </div>
</template>

<script type="text/javascript">
export default {
  components: {
    // empty
  },
  props: {
    title: {
      type: [String],
      default: '已完善个人信息，获得10积分'
    },
    value: {
      type: [String, Boolean],
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      time: 10000
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    width() {
      if (this.title.length > 18) {
        return '75%';
      } else if (this.title.length > 17) {
        return '70%';
      } else if (this.title.length > 16) {
        return '65%';
      } else if (this.title.length > 15) {
        return '60%';
      } else if (this.title.length > 14) {
        return '65%';
      } else if (this.title.length > 13) {
        return '55%';
      } else {
        return '50%';
      }
    },
    display: {
      get() {
        if (this.value) {
          setTimeout(() => {
            this.display = false;
          }, this.time);
        }
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    topStyle() {
      let _h = (this.index + 1) * 108;
      let { top } = this;
      if (top) {
        return {
          top: `${_h + top}rpx`
        };
      } else {
        return {
          bottom: `${_h + 120}rpx`
        };
      }
    }
  },
  /**
   * 页面渲染前
   * @return {[type]} [description]
   */
  created() {},
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    display(value) {
      if (value) {
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {},
  methods: {
    /**
     * 执行关闭
     * @return {[type]} [description]
     */
    toclose() {
      this.display = false;
    },
    /**
     * 执行链接
     * @return {[type]} [description]
     */
    tolink() {
      uni.navigateTo({
        url: '/plugins/task/index'
      });
    }
  }
};
</script>

<style lang="scss" scoped="true">
.task-popups {
  position: fixed;
  z-index: 1000;
  height: 104px;
  min-width: 300px;
  border-radius: 0 52px 52px 0;
  left: 0;
  overflow: hidden;

  .task-popups__bg {
    position: absolute;
    background: #000000;
    opacity: 0.5;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
}

.task-popups__link {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 36px;
  position: absolute;
  z-index: 10002;
  bottom: 12px;
  left: 91px;

  .iconfont {
    font-size: 22px;
  }
}

.task-popups__title {
  position: relative;
  z-index: 10002;
  min-width: 50%;
  max-width: 80%;
  margin-right: 84px;
  margin-top: 22px;
  margin-left: 91px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 36px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.task-popups__icon {
  width: 48px;
  height: 48px;
  background: #53c41a;
  border-radius: 50%;
  position: absolute;
  z-index: 10002;
  text-align: center;
  line-height: 48px;
  left: 28px;
  top: 28px;

  .iconbtn_select {
    font-size: 32px;
    color: #ffffff;
    line-height: 48px;
  }
}

.task-popups__close {
  width: 24px;
  height: 24px;
  position: absolute;
  z-index: 10002;
  text-align: center;
  line-height: 24px;
  right: 40px;
  top: 40px;

  .iconfont {
    font-size: 24px;
    color: #ffffff;
    line-height: 24px;
  }
}

.task-popups-active {
  animation: bounceInLeft 2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate forwards;
  -webkit-animation: bounceInLeft 2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s 1 alternate forwards;
}

@keyframes bounceInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}
</style>
