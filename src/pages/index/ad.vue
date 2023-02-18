<template>
  <view class="ad" v-if="display" :class="{ ad_element: current > 0 }">
    <view class="ad-item-photo" :style="{ width: '100%', height: '100vh' }" v-if="contentData.length">
      <swiper
        class="ad-item-image"
        :circular="circular"
        :autoplay="autoplay"
        @change="handleChange"
        easing-function="easeOutCubic"
      >
        <swiper-item
          class="ad-item-cover"
          v-for="(item, index) in contentData"
          :key="index"
          style="background-color: #ffffff"
        >
          <image
            lazy-load
            :src="item.url"
            mode="aspectFill"
            style="width: 100%; height: 100%"
            @touchstart="touchStart"
            @touchend="touchEnd"
          ></image>
        </swiper-item>
        <swiper-item>
          <view style="width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0)"></view>
        </swiper-item>
      </swiper>
      <view class="is_skip" v-if="facade.chamfer_skip" @click="toSkip" :style="{ top: header }">
        <view class="is_skip_bg"></view>
        <view class="is_skip_txt">跳过</view>
      </view>
      <view
        class="ad-pointer"
        :class="{
          circle: facade.indicator_style == 1,
          strip: facade.indicator_style == 2,
          number: facade.indicator_style == 3,
          left: facade.indicator_align === 'left',
          center: facade.indicator_align === 'center',
          right: facade.indicator_align === 'right'
        }"
      >
        <view
          class="ad-pointer_item"
          v-for="(item, index) in contentData"
          :key="index"
          v-if="facade.indicator_style != 3"
        >
          <button
            :class="{ is_active: index === current }"
            :style="{
              backgroundColor: index === current ? facade.indicator_color : 'none'
            }"
          ></button>
        </view>
        <view class="ad-pointer_number" v-if="facade.indicator_style == 3">
          {{ current + 1 + '/' + contentData.length }}
        </view>
      </view>
    </view>
  </view>
</template>
<script type="text/javascript">
import pointer from '@/components/pointer.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    pointer
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      display: true,
      def_content: [],
      facade: {},
      content: {},
      step: 1,
      current: 0,
      autoplay: false,
      circular: false
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    header() {
      const res = uni.getSystemInfoSync();
      return res.statusBarHeight + 55 + 'px';
    },
    height() {
      const res = uni.getSystemInfoSync();
      return res.windowHeight + 'px';
    },
    contentData() {
      let _array = [];
      for (let index in this.content) {
        let item = this.content[index];
        if (item.url) {
          _array.push(item);
        }
      }
      // if (_array.length === 0) {
      //     this.toSkip();
      // }
      return _array;
    },
    margin() {
      return this.facade.chamfer_style == 1 ? 10 : 20;
    },
    ...mapGetters('setting', {
      openingad: 'getOpeningad'
    })
  },
  mounted() {
    let open = uni.getStorageSync('openingad');
    let type = this.openingad?.type ? this.openingad.type : 1;
    let days = this.openingad?.days;
    if (type === 1) {
      if (!open) {
        this.display = true;
        this.handleLoadData();
      } else {
        this.display = false;
      }
    } else {
      let create_time = uni.getStorageSync('openingad_create_time');
      let nowTime = Date.parse(new Date());
      if (!create_time || create_time < nowTime) {
        uni.removeStorageSync('openingad');
        this.display = true;
        uni.setStorageSync('openingad_create_time', Date.parse(new Date()) + 86400 * days * 1000);
        this.handleLoadData();
      } else {
        this.display = false;
        uni.setStorageSync('openingad', '1');
      }
    }
  },
  methods: {
    handleLoadData() {
      this.$heshop
        .search(
          'POST',
          { include: 'setting' },
          {
            keyword: 'openingad'
          }
        )
        .then(res => {
          if (res && res.content) {
            this.display = true;
            this.content = res.content.content;
            this.facade = res.content.facade;
            let _array = [];
            for (let index in this.content) {
              let item = this.content[index];
              if (item.url) {
                _array.push(item);
              }
            }
            if (_array.length === 0) {
              this.toSkip();
            }
          } else {
            this.toSkip();
          }
        })
        .catch(err => {
          this.display = false;
          this.$message.error('加载配置信息失败，请检查网络');
        });
    },
    /**
     * 修改数据变更
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    handleChange(event) {
      if (event.detail.current >= this.contentData.length) {
        this.current = this.contentData.length - 1;
      } else {
        this.current = event.detail.current;
      }
      this.step++;
      if (event.detail.current === this.contentData.length) {
        setTimeout(() => {
          //设置延迟执行
          this.toSkip();
        }, 1000);
      }
    },
    getCover(cover = '') {
      let url = '';
      if (cover) {
        if (Object.prototype.toString.call(cover) === '[object Array]' && cover[0]) {
          return cover[0].url;
        }
      }
      return url;
    },
    /**
     * 跳转回首页
     * @return {[type]} [description]
     */
    toSkip() {
      uni.setStorageSync('openingad', '1');
      this.display = false;
      this.$emit('confirm', true);
    },
    touchStart(e) {},
    touchEnd(e) {
      if (this.contentData.length === 1) {
        this.toSkip();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.ad_element {
  background: rgba(0, 0, 0, 0) !important;
}

.ad {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100000;
  box-sizing: content-box;
  width: 100%;
  height: 100vh;

  .ad-pointer {
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 2;
    left: 20px;
    transform: translateX(0%);
    bottom: 20px;

    .ad-pointer_number {
      position: absolute;
      bottom: 12px;
      width: 68px;
      height: 32px;
      background: #000000;
      border-radius: 16px;
      z-index: 100;
      text-align: center;
      line-height: 32px;
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #d0b9bd;
      opacity: 0.5;
    }

    .ad-pointer_item {
      position: relative;
      list-style: none;
      margin: 0;
      padding: 0;
      z-index: 2;
      display: inline-block;
      padding: 12px 4px;
      background-color: transparent;
      cursor: pointer;
      text-align: -webkit-match-parent;

      button {
        width: 16px;
        height: 16px;
        display: block;
        background-color: #fff;
        border: 0;
        outline: 0;
        padding: 0;
        margin: 0;
        cursor: pointer;
      }
    }
  }

  .circle.ad-pointer {
    .ad-pointer_item {
      button {
        width: 16px;
        height: 16px;
        border-radius: 16px;
      }
    }
  }

  .strip.ad-pointer {
    .ad-pointer_item {
      button {
        width: 32px;
        height: 8px;
        border-radius: 0;
      }
    }
  }

  .ad-pointer.left {
    left: 20px;
    transform: translateX(0%);
  }

  .ad-pointer.center {
    left: 50%;
    transform: translateX(-50%);

    .ad-pointer_number {
      margin-left: -32px;
    }
  }

  .ad-pointer.right {
    left: auto;
    right: 12%;
    transform: translateX(0%);
  }

  .is_skip {
    width: 120px;
    height: 68px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    text-align: center;
    line-height: 40px;
    font-size: 22px;
    position: absolute;
    z-index: 100;
    line-height: 60px;
    top: 120px;
    right: 30px;

    .is_skip_bg {
      background: #000000;
      opacity: 0.5;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 34px;
      z-index: 100;
    }

    .is_skip_txt {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 68px;
      position: absolute;
      z-index: 200;
      width: 100%;
      text-align: center;
    }
  }

  .corner {
    padding: 32px;

    .ad-item-cover {
      background-color: #ffffff;
      box-sizing: content-box;
      -webkit-appearance: none;
      -webkit-border-radius: 16px;
      -ms-border-radius: 16px;
      -o-border-radius: 16px;
      -moz-border-radius: 16px;
      border-radius: 16px;
      overflow: hidden;
    }
  }

  .ad-item-image {
    width: 100%;
    height: 100%;
  }

  .ad-item-photo {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
  }
}
</style>
