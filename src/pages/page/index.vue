<template>
  <scroll-view class="pages">
    <view v-for="(item, index) in page" :key="index">
      <component
        v-if="item.name == 'title'"
        is="titles"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'navigation'"
        is="navigation"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'video'"
        is="videos"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'banner'"
        is="banner"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'search'"
        is="search"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'goods'"
        is="goods"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'blank'"
        is="blank"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'tabs'"
        is="tabs"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-else-if="item.name === 'rubik'"
        is="rubik"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'advertising'"
        is="advertising"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'notice'"
        is="notice"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'separate'"
        is="separate"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'coupon'"
        is="coupon"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <component
        v-if="item.name == 'task'"
        is="task"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <!-- #ifndef H5 -->
      <component
        v-else-if="item.name === 'wechatLive'"
        :id="item.name + '_' + index"
        is="wechatLive"
        :facade="item.facade"
        :content="item.content"
        :data-index="index"
      ></component>
      <!--#endif-->
    </view>
    <HeLoginModel/>
    <he-float-window pages-url="page"></he-float-window>
  </scroll-view>
</template>

<script type="text/javascript">
//????????????
import titles from '../fitment/title/title.vue';
import navigation from '../fitment/navigation/navigation.vue';
import videos from '../fitment/video/video.vue';
import separate from '../fitment/separate/separate.vue';
import blank from '../fitment/blank/blank.vue';
import banner from '../fitment/banner/banner.vue';
import search from '../fitment/search/search.vue';
import goods from '../fitment/goods/goods.vue';
import advertising from '../fitment/advertising/advertising.vue';
import tabs from '../fitment/tabs/tabs.vue';
import rubik from '../fitment/rubik/rubik.vue';
import notice from '../fitment/notice/notice.vue';
import coupon from '../fitment/coupon/coupon.vue';
import task from '../fitment/task/task.vue';
import HeLoginModel from '../../components/he-login-layout.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';
import {mapGetters} from 'vuex';
// #ifndef H5
import wechatLive from "../fitment/wechatLive/wechatLive";
// #endif

export default {
  components: {
    videos,
    separate,
    blank,
    banner,
    search,
    goods,
    advertising,
    navigation,
    tabs,
    titles,
    rubik,
    notice,
    coupon,
    task,
    HeLoginModel,
    heFloatWindow,
    // #ifndef H5
    wechatLive,
    // #endif
  },
  data() {
    return {
      page: []
    };
  },
  /**
   * ???????????????
   * @return {[type]} [description]
   */
  onShow() {
    if (this.$scope && this.$scope.options.id) {
      let id = this.$scope.options.id;
      this.handlePageLoading(id);
    }
    if (this.options && this.options.id) {
      let id = this.options.id;
      this.handlePageLoading(id);
    }
  },
  methods: {
    /**
     * ????????????????????????
     * @return {[type]} [description]
     */
    handlePageLoading(id) {
      let key = 'micropage' + id;
      try {
        const value = this.getStorageSync(key);
        //??????????????????
        if (value) {
          uni.setNavigationBarTitle({
            title: value.name
          });
          //#ifdef H5
          document.title = value.name;
          //#endif
          this.page = JSON.parse(value.content);
          this.handleLoadData(value, id, key);
        } else {
          this.handleLoadData(null, id, key);
        }
      } catch (error) {
        this.handleLoadData(null, id, key);
      }
    },
    /**
     * ??????????????????
     * @return {[type]} [description]
     */
    handleLoadData(value, id, key) {
      this.$heshop
        .pages('GET', parseInt(id))
        .then(data => {
          //??????????????????
          uni.setNavigationBarTitle({
            title: data.name
          });
          //#ifdef H5
          document.title = data.name;
          //#endif
          if (value && this.$heshop.MD5(value) == this.$heshop.MD5(data)) {
            return;
          } else {
            this.page = JSON.parse(data.content);
            uni.setStorageSync(key, data);
          }
        });
    },
    /**
     * ????????????????????????
     * @return {[type]} [description]
     */
    handlePageUpdate() {
    }
  },
  onLoad(options) {
    if (options.scene) {
      let {id} = JSON.parse(decodeURIComponent(options.scene));
      this.handlePageLoading(parseInt(id));
    }
  }
};
</script>
<style>
.pages {
  width: 100%;
  overflow-x: hidden;
}
</style>
