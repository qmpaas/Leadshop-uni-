<template>
  <view class="banner">
    <view class="banner-item-photo" :style="{ width: '100%', height: height }">
      <swiper
        class="banner-item-image"
        :circular="circular"
        :autoplay="autoplay"
        @change="handleChange"
        :class="{ corner: facade.chamfer_style == 2 }"
      >
        <swiper-item class="banner-item-cover" v-for="(item, index) in contentData" :key="index">
          <!-- #ifdef H5 -->
          <template v-if="item.link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="item.link.param.wechat.appId"
              :path="item.link.param.wechat.path"
            >
              <image lazy-load :src="item.url" mode="aspectFill" style="width: 100%; height: 100%" />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              :src="item.url"
              mode="aspectFill"
              style="width: 100%; height: 100%"
              @click="navigateToDetail(item.link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            :src="item.url"
            mode="aspectFill"
            style="width: 100%; height: 100%"
            @click="navigateToDetail(item.link)"
          />
          <!-- #endif -->
        </swiper-item>
      </swiper>
      <pointer
        :current="current"
        :number="contentData.length"
        :margin="margin"
        :color="facade.indicator_color"
        :type="facade.indicator_style"
        :align="facade.indicator_align"
      ></pointer>
    </view>
  </view>
</template>
<script type="text/javascript">
import pointer from '@/components/pointer.vue';
// #ifdef H5
import heOpenLaunchWeapp from './../../../components/he-open-launch-weapp.vue';
// #endif

export default {
  components: {
    pointer,
    // #ifdef H5
    heOpenLaunchWeapp
    // #endif
  },
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      current: 0,
      autoplay: true,
      circular: true
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    height() {
      const res = uni.getSystemInfoSync();
      let _r = 0.4;
      return res.windowWidth * _r + 'px';
    },
    contentData() {
      let _array = [];
      for (let index in this.content) {
        let item = this.content[index];
        if (item.url) {
          _array.push(item);
        }
      }
      return _array;
    },
    margin() {
      return this.facade.chamfer_style == 1 ? 10 : 20;
    }
  },
  methods: {
    /**
     * 导航详情
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    navigateToDetail(item) {
      this.$h.MPageNavigate(item);
    },
    /**
     * 修改数据变更
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    handleChange(event) {
      this.current = event.detail.current;
    },
    getCover(cover = '') {
      let url = '';
      if (cover) {
        if (Object.prototype.toString.call(cover) === '[object Array]' && cover[0]) {
          return cover[0].url;
        }
      }
      return url;
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
