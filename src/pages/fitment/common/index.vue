<template>
  <div class="fm-mobile-body" id="fm-mobile-body" ref="mobile" @dragover="allowDrop($event)">
    <vuedraggable class="wrapper" v-model="page">
      <transition-group>
        <div v-for="(item, index) in page" :key="index + 1">
          <covermask v-if="dragActive(index, 'top')" />
          <component
            v-if="item.name === 'title'"
            is="titles"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'navigation'"
            is="navigation"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'video'"
            is="videos"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'banner'"
            is="banner"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'search'"
            is="search"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'goods'"
            is="goods"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'advertising'"
            is="advertising"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'blank'"
            is="blank"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'tabs'"
            is="tabs"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <component
            v-if="item.name === 'wechat'"
            is="wechat"
            :facade="item.facade"
            :content="item.content"
            :data-index="index"
          ></component>
          <covermask v-if="dragActive(index, 'down')" />
        </div>
      </transition-group>
    </vuedraggable>
    <div class="fm-mobile-empty" v-if="page.length === 0" :data-index="-2">
      <covermask v-if="dragActive(-2, 'top')" :data-index="-2"></covermask>
    </div>
  </div>
</template>

<script type="text/javascript">
//????????????
import titles from '../title/title.vue';
import navigation from '../navigation/navigation.vue';
import videos from '../video/video.vue';
import blank from '../blank/blank.vue';
import banner from '../banner/banner.vue';
import search from '../search/search.vue';
import goods from '../goods/goods.vue';
import advertising from '../advertising/advertising.vue';
import tabs from '../tabs/tabs.vue';
import wechat from '../wechat/wechat.vue';
import vuedraggable from './vuedraggable.js';
import covermask from './covermask.vue';

export default {
  components: {
    videos,
    blank,
    banner,
    search,
    goods,
    advertising,
    navigation,
    titles,
    tabs,
    wechat,
    vuedraggable,
    covermask
  },
  /**
   * ????????????
   * @type {Object}
   */
  computed: {
    page: {
      get() {
        return this.$store.state.pages.page;
      },
      set(value) {
        this.$store.commit('pages/setPageData', value);
      }
    },
    coms() {
      return this.$store.state.pages.coms;
    },
    dragIndex: {
      get() {
        return this.$store.state.pages.dragIndex;
      },
      set(value) {
        this.$store.commit('pages/setDragIndex', value);
      }
    },
    position: {
      get() {
        return this.$store.state.pages.position;
      },
      set(value) {
        this.$store.commit('pages/setDragPosition', value);
      }
    }
  },
  methods: {
    /**
     * ????????????
     * @param  {[type]} index    [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    dragActive(index, position) {
      return this.dragIndex === index && this.position == position && this.coms;
    },
    /**
     * ??????????????????
     * @return {[type]} [description]
     */
    allowDrop($event) {
      $event = window.event;
      let index = parseInt($event.target.dataset.index);
      if (index || index === 0) {
        this.dragIndex = index;
        //???????????????????????????
        if ($event.type === 'dragover' && $event.target.dataset) {
          //???????????????????????????
          if ($event.target.dataset.type === 'widget') {
            //??????Y????????????
            let y = parseFloat($event.offsetY);
            //????????????50%?????????????????????
            let h = parseFloat($event.target.clientHeight / 4);
            if (y < h) {
              this.position = 'top';
            } else {
              this.position = 'down';
            }
          }
        }
      }
      $event.preventDefault();
    }
  }
};
</script>

<style>
.wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #f2f5f7;
}

.fm-mobile-body {
  padding: 4px 187.5px;
  min-height: 100px;
}

.fm-mobile-empty {
  min-height: 800px;
  width: 100%;
}
</style>
