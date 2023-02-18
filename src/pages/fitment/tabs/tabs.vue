<template>
  <view class="tabs">
    <scroll-view
      class="tabs-header"
      :scroll-left="scrollWdith"
      scroll-with-animation
      scroll-x="true"
      :style="{
        top: top + 'px',
        background: facade.background_color ? facade.background_color : '#fff'
      }"
    >
      <view class="he-scroll-box flex">
        <view
          class="he-tab-item"
          :class="[{ active: index === select }, 'he-tab-item_' + index]"
          :id="'he-tab-item_' + index"
          v-for="(item, index) in content.data"
          @click="radioChange(index)"
          :key="index"
          >{{ item.title }}
          <view class="he-tab-line" v-if="select === index"></view>
        </view>
      </view>
    </scroll-view>
    <view class="tabs-content" :class="{ 'tabs-content-active': active }">
      <template v-for="(item, index) in content.data">
        <view class="tabs-content-item" v-show="select === index" :key="index">
          <Goods :facade="facade" :content="getContent(item)"></Goods>
        </view>
      </template>
    </view>
  </view>
</template>
<script type="text/javascript">
import Goods from '../goods/goods.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Goods
  },
  props: {
    facade: {
      type: [Object, Array],
      default: function () {
        return {
          background_color: '#7f7f7f'
        };
      }
    },
    content: {
      type: [Object, Array]
    },
    dataIndex: {
      type: Number
    },
    pageIndex: {
      type: Number
    }
  },
  data() {
    return {
      is_arrow: false,
      active: false,
      select: 0,
      scrollWdith: 0,
      halfWidth: null
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    goodsContent() {
      if (this.content.data.length > 0) {
        let data = this.content.data[this.select];
        return {
          ...data,
          is_title: this.content.is_title,
          is_price: this.content.is_price,
          is_button: this.content.is_button
        };
      }
      return {
        type: 1,
        goods: [],
        group: {},
        is_title: this.content.is_title,
        is_price: this.content.is_price,
        is_button: this.content.is_button
      };
    },
    ...mapGetters({
      searchHeight: 'components/getSearchHeight',
      searchIndex: 'components/getSearchIndex',
      navbarHeight: 'setting/getNavBarHeight',
      statusBarHeight: 'setting/statusBarHeight'
    }),
    top: function () {
      return this.navbarHeight + this.statusBarHeight;
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.getElRect('tabs-header').then(res => {
      this.halfWidth = res.width / 2;
    });
    for (let i = 0; i < this.content.data.length; i++) {
      this.getElRect('he-tab-item_' + i).then(res => {
        this.content.data[i].rect = res;
      });
    }
  },
  methods: {
    getContent(data) {
      return {
        ...data,
        is_title: this.content.is_title,
        is_price: this.content.is_price,
        is_button: this.content.is_button
      };
    },
    radioChange(index) {
      if (index == this.select) return;
      this.select = index;
      let { left, width } = this.content.data[index].rect;
      if (left + width / 2 <= this.halfWidth) {
        this.scrollWdith = 0;
      } else {
        this.scrollWdith = left + width / 2 - this.halfWidth;
      }
    },
    getElRect(elClass) {
      return new Promise(resolve => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('.' + elClass)
          .boundingClientRect(res => {
            if (!res) {
              setTimeout(() => {
                this.getElRect(elClass);
              }, 10);
              return;
            }
            resolve(res);
          })
          .exec();
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
