<template>
  <view class="navigation" :style="{ 'background-color': facade.background_color }">
    <!-- 文字导航 单行展示 -->
    <view
      class="navigation-text"
      :class="{ one: facade.nav_style == 1 }"
      v-if="content.style == 2 && facade.nav_style == 1"
    >
      <!-- #ifdef H5 -->
      <template v-for="(item, index) in navigation">
        <template v-if="item.link.index === 11">
          <view class="navigation-text-item" :key="index" :style="{ width: width }">
            <he-open-launch-weapp :username="item.link.param.wechat.appId" :path="item.link.param.wechat.path">
              <text class="navigation-text-item__title" :style="{ color: facade.text_color }">
                {{ item.title }}
              </text>
            </he-open-launch-weapp>
          </view>
        </template>
        <template v-else>
          <view class="navigation-text-item" :key="index" :style="{ width: width }">
            <text
              class="navigation-text-item__title"
              @click="navigateToDetail(item.link)"
              :style="{ color: facade.text_color }"
            >
              {{ item.title }}
            </text>
          </view>
        </template>
      </template>
      <!-- #endif -->

      <!-- #ifndef H5 -->
      <view class="navigation-text-item" v-for="(item, index) in navigation" :key="index" :style="{ width: width }">
        <text
          class="navigation-text-item__title"
          @click="navigateToDetail(item.link)"
          :style="{ color: facade.text_color }"
        >
          {{ item.title }}
        </text>
      </view>
      <!-- #endif -->
    </view>

    <!-- 文字导航 多行展示 -->
    <swiper v-if="content.style == 2 && facade.nav_style == 2" @change="onCurrent" :style="{ height: swiperHeight }">
      <swiper-item
        class="navigation-text"
        :class="{ one: facade.nav_style == 1, two: facade.nav_style == 2 }"
        v-for="(i, n) in number"
        :key="i"
      >
        <!-- #ifdef H5 -->
        <template v-for="(item, index) in getNavigateList(n)">
          <template v-if="item.link.index === 11">
            <view class="navigation-text-item" :key="index" :style="{ width: width }">
              <he-open-launch-weapp :username="item.link.param.wechat.appId" :path="item.link.param.wechat.path">
                <text class="navigation-text-item__title" :style="{ color: facade.text_color }">
                  {{ item.title }}
                </text>
              </he-open-launch-weapp>
            </view>
          </template>
          <template v-else>
            <view class="navigation-text-item" :key="index" :style="{ width: width }">
              <text
                class="navigation-text-item__title"
                @click="getNavigateToDetail(n, index)"
                :style="{ color: facade.text_color }"
              >
                {{ item.title }}
              </text>
            </view>
          </template>
        </template>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <view
          class="navigation-text-item"
          v-for="(item, index) in getNavigateList(n)"
          :key="index"
          :style="{ width: width }"
        >
          <text
            class="navigation-text-item__title"
            @click="getNavigateToDetail(n, index)"
            :style="{ color: facade.text_color }"
          >
            {{ item.title }}
          </text>
        </view>
        <!-- #endif -->
      </swiper-item>
    </swiper>

    <!-- 图文导航 单行展示 -->
    <view
      class="navigation-image"
      :class="{ one: facade.nav_style == 1 }"
      v-if="content.style == 1 && facade.nav_style == 1"
    >
      <!-- #ifdef H5 -->
      <template v-for="(item, index) in navigation">
        <template v-if="item.link.index === 11">
          <view class="navigation-image-item" :key="index" :style="{ width: width }">
            <he-open-launch-weapp :username="item.link.param.wechat.appId" :path="item.link.param.wechat.path">
              <view
                class="navigation-image-item__cover"
                :style="{ 'background-image': 'url(' + getCover(item.url) + ')' }"
              />
              <view class="navigation-image-item__title" :style="{ color: facade.text_color }">
                {{ item.title }}
              </view>
            </he-open-launch-weapp>
          </view>
        </template>
        <template v-else>
          <view
            class="navigation-image-item"
            :key="index"
            :style="{ width: width }"
            @click="navigateToDetail(item.link)"
          >
            <view
              class="navigation-image-item__cover"
              :style="{ 'background-image': 'url(' + getCover(item.url) + ')' }"
            />
            <view class="navigation-image-item__title" :style="{ color: facade.text_color }">
              {{ item.title }}
            </view>
          </view>
        </template>
      </template>
      <!-- #endif -->

      <!-- #ifndef H5 -->
      <view
        class="navigation-image-item"
        v-for="(item, index) in navigation"
        :key="index"
        :style="{ width: width }"
        @click="navigateToDetail(item.link, item)"
      >
        <view
          class="navigation-image-item__cover"
          :style="{
            'background-image': 'url(' + getCover(item.url) + ')'
          }"
        >
        </view>
        <view
          class="navigation-image-item__title"
          :style="{
            color: facade.text_color
          }"
        >
          {{ item.title }}
        </view>
      </view>
      <!-- #endif -->
    </view>

    <!-- 图文导航 多行展示 -->
    <swiper
      v-if="content.style == 1 && facade.nav_style == 2"
      style="height: 220px"
      @change="onCurrent"
      :style="{ height: swiperHeight }"
    >
      <swiper-item class="navigation-image two" v-for="(i, n) in number" :key="i">
        <!-- #ifdef H5 -->
        <template v-for="(item, index) in getNavigateList(n)">
          <template v-if="item.link.index === 11">
            <view class="navigation-image-item" :key="index" :style="{ width: width }">
              <he-open-launch-weapp :username="item.link.param.wechat.appId" :path="item.link.param.wechat.path">
                <view
                  class="navigation-image-item__cover"
                  :style="{ 'background-image': 'url(' + getCover(item.url) + ')' }"
                ></view>
                <view class="navigation-image-item__title" :style="{ color: facade.text_color }">
                  {{ item.title }}
                </view>
              </he-open-launch-weapp>
            </view>
          </template>
          <template v-else>
            <view
              class="navigation-image-item"
              :key="index"
              :style="{ width: width }"
              @click="getNavigateToDetail(n, index)"
            >
              <view
                class="navigation-image-item__cover"
                :style="{ 'background-image': 'url(' + getCover(item.url) + ')' }"
              ></view>
              <view class="navigation-image-item__title" :style="{ color: facade.text_color }">
                {{ item.title }}
              </view>
            </view>
          </template>
        </template>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <view
          class="navigation-image-item"
          v-for="(item, index) in getNavigateList(n)"
          :key="index"
          :style="{ width: width }"
          @click="getNavigateToDetail(n, index)"
        >
          <view class="navigation-image-item__cover" :style="{ 'background-image': 'url(' + getCover(item.url) + ')' }">
          </view>
          <view class="navigation-image-item__title" :style="{ color: facade.text_color }">
            {{ item.title }}
          </view>
        </view>
        <!-- #endif -->
      </swiper-item>
    </swiper>

    <view class="navigation-indicator" v-if="facade.nav_style == 2">
      <pointer
        :current="current"
        :number="number"
        :margin="margin"
        :color="facade.active_color"
        type="facade.indicator_style"
        align="center"
        v-if="number > 1"
      />
    </view>
  </view>
</template>

<script type="text/javascript">
import pointer from '../../../components/pointer.vue';
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
      margin: 10,
      current: 0,
      navigateList: [],
      navigation: [
        {
          id: 1,
          title: '商品名称',
          url: '',
          link: {}
        }
      ]
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    number() {
      let l = this.facade.nav_line * this.facade.nav_line_mun;
      return Math.ceil(this.content.data.length / l);
    },
    width() {
      if (this.facade.nav_style == 1) {
        if (this.content.style == 1) {
          if (this.navigation.length > 5) {
            return '24%';
          } else {
            return 100 / this.navigation.length + '%';
          }
        }
        if (this.content.style == 2) {
          if (this.navigation.length > 4) {
            return '30%';
          } else {
            return 100 / this.navigation.length + '%';
          }
        }
      } else {
        return 100 / this.facade.nav_line_mun + '%';
      }
    },
    swiperHeight() {
      let _rh = 32;
      if (this.content.style == 1) {
        _rh = 88;
      }
      let _h = this.facade.nav_line * _rh;
      if (this.number > 1) {
        return _h + 32 + 'px';
      } else {
        return _h + 5 + 'px';
      }
    }
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    content: {
      deep: true,
      handler: function () {
        this.handleCheck();
      }
    },
    facade: {
      deep: true,
      handler: function () {
        this.handleCheck();
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleCheck();
  },
  methods: {
    onCurrent(event) {
      if (event.detail) {
        this.current = event.detail.current;
      }
    },
    /**
     * 获取导航列表
     * @param  {[type]} current [description]
     * @return {[type]}         [description]
     */
    getNavigateList(current) {
      let l = this.facade.nav_line * this.facade.nav_line_mun;
      let page = current * l;
      let size = (current + 1) * l;
      let data = this.content.data.slice(page, size);
      return JSON.parse(JSON.stringify(data));
    },
    /**
     * 解决小程序端不支持直接获取数据
     * @param  {[type]} n     [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    getNavigateToDetail(n, index) {
      let data = this.getNavigateList(n);
      let item = data[index];
      this.navigateToDetail(item.link || {});
    },
    /**
     * 导航详情
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    navigateToDetail(item) {
      this.$h.MPageNavigate(item);
    },
    handleCheck() {
      if (this.content.data.length > 0) {
        this.navigation = this.content.data;
      }
      if (this.facade.nav_style == 2) {
        let data = this.content.data;
        let l = this.facade.nav_line * this.facade.nav_line_mun;
        this.navigation = data.slice(0, l);
      }
    },
    getCover(cover = '') {
      if (cover) {
        return cover;
      }
      return 'https://img.yzcdn.cn/upload_files/2018/01/22/FnlHRufXMtUI_AbAEP0tux_nDL1T.png!large.webp';
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
