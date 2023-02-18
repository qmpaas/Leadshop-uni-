<template>
  <view
    class="goodstask"
    :data-theme="theme"
    :style="{
      backgroundColor: facade.background_color
    }"
  >
    <div class="control-task" v-if="content.task.name && is_show">
      <div class="control-task_header" :style="{ backgroundColor: facade.title_background, color: facade.title_color }">
        {{ content.task.name }}送积分
      </div>
      <div class="control-task_body" :style="{ backgroundColor: facade.content_background }">
        <img class="control-task_icon" :src="getIconUrl" />
        <div class="control-task_title" :style="{ color: facade.content_color }">{{ getRemark(content.task) }}</div>
        <div
          class="control-task_button"
          @click="navigateLink('/plugins/task/index')"
          :style="{ backgroundColor: facade.button_background, color: facade.button_color }"
        >
          {{ content.title || '去攒积分' }}
        </div>
      </div>
    </div>
    <view
      class="goods-layout"
      :style="{
        paddingLeft: facade.padding + 'px',
        paddingRight: facade.padding + 'px',
        marginLeft: -facade.margin / 2 + 'px',
        marginRight: -facade.margin / 2 + 'px'
      }"
      :class="{
        larger: facade.list_style == 1,
        small: facade.list_style == 2,
        list: facade.list_style == 3,
        swipe: facade.list_style == 4
      }"
    >
      <view
        class="goods-wrapper"
        :class="{
          white: facade.card_style == 1,
          card: facade.card_style == 2,
          stroke: facade.card_style == 3,
          lucency: facade.card_style == 4,
          chamfer: facade.chamfer_style
        }"
        v-for="(item, index) in goodsData"
        :key="index"
      >
        <view
          class="goods-item"
          :style="{
            margin: facade.margin / 2 + 'px'
          }"
          @click="navigateToDetail(item.id)"
          v-if="item.name !== '商品名称'"
        >
          <view class="goods-item-photo">
            <view class="goods-item-image">
              <view class="goods-item-cover">
                <image
                  lazy-load
                  style="width: 100%; height: 100%"
                  :src="getGoodsCover(item.slideshow)"
                  :mode="mode"
                ></image>
              </view>
            </view>
          </view>
          <view class="goods-item-detail" v-if="is_hide">
            <view class="goods-item-title" v-if="content.is_title">
              {{ item.name }}
            </view>
            <view class="goods-item-info">
              <view class="goods-item-price">
                <view v-if="content.is_price" class="goods-item-price__box">
                  <view class="goods-item-price__icon iconfont iconjifen"></view>
                  <span class="goods-item-price__num">{{ item.task.task_number }}+</span>
                  <span class="goods-item-price__tag">¥</span
                  ><span class="goods-item-price__val">{{ item.task.task_price }}</span>
                </view>
              </view>
              <view
                class="goods-item-button"
                @click.stop="cart(item)"
                v-if="content.is_button"
                :style="{ backgroundColor: themeColor }"
              >
                兑换
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="clear"></view>
    </view>
    <he-index-cart :goods-id.sync="goodsId" :is_task="1"></he-index-cart>
  </view>
</template>
<script type="text/javascript">
import heIndexCart from '../../../components/he-index-cart.vue';
/**
 * 替换
 * @return {[type]} [description]
 */
function sprintf() {
  var arg = arguments,
    str = arg[0] || '',
    i,
    n;
  for (i = 1, n = arg.length; i < n; i++) {
    str = str.replace(/%s/, arg[i]);
  }
  return str;
}
export default {
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  components: {
    heIndexCart
  },
  data() {
    return {
      is_show: true,
      goods: [],
      goodsData: [],
      goodsId: null
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    getIconUrl() {
      if (this.content.icon) {
        return this.content.icon;
      } else {
        if (this.content.task.icon) {
          return this.content.task.icon;
        }
      }
      return 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task-sign-icon.png';
    },
    mode() {
      return this.facade.list_style === 1 ? 'center' : 'aspectFill';
    },
    is_hide() {
      return this.facade.list_style !== 3
        ? !(!this.content.is_title && !this.content.is_price && !this.content.is_button)
        : true;
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
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleCheck();
    if (this.isLogin) {
      this.handleCheckTaak();
    }
  },
  methods: {
    getRemark(task) {
      if (task.remark) {
        let data = task.remark.split('，');
        if (task.keyword === 'signin') {
          return data[0] + '，' + data[1];
        }
        return data[0] + '\n' + data[1];
      }
      return '';
    },
    /**
     * 跳转界面
     * @param  {String} type [description]
     * @return {[type]}      [description]
     */
    navigateLink(href) {
      uni.navigateTo({
        url: href,
        fail() {
          uni.switchTab({
            url: href,
            fail() {}
          });
        }
      });
    },
    /**
     * 任务功能简称
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    handleCheckTaak() {
      let keyword = this.content.task.keyword;
      this.$heshop.plugin('get', { include: 'task', model: 'task', keyword: keyword }).then(res => {
        if (res) {
          this.content.task = res;
          if (!res.status) {
            this.is_show = false;
          }
        } else {
          this.is_show = false;
        }
      });
    },
    /**
     * 导航详情
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    navigateToDetail(id) {
      uni.navigateTo({
        url: '/pages/goods/detail?is_task=1&id=' + id
      });
    },
    handleCheck() {
      if (this.content.type == 1 && !this.$h.test.isEmpty(this.content.goods)) {
        this.goodsData = this.content.goods;
        this.handleGoodsList(this.content.goods);
      } else if (this.content.type == 2) {
        this.handleAutoList();
      } else {
        this.goodsData = this.goods;
      }
    },
    /**
     * 获取封面信息
     * @param  {[type]} cover [description]
     * @return {[type]}       [description]
     */
    getGoodsCover(cover) {
      if (!this.$h.test.isEmpty(cover)) {
        if (Object.prototype.toString.call(cover) === '[object Array]') {
          return cover[0];
        }
      }
      return this.ipAddress + '/le-default-goods-bg.png';
    },
    /**
     * 加载数据信息
     * @return {[type]} [description]
     */
    handleGoodsList(data) {
      let _array = [];
      let _this = this;
      data.map(item => {
        _array.push(item.id);
      });
      if (_array.length > 0) {
        this.$heshop
          .goods('GET', { behavior: 'fitment', goods_id: _array.toString(), is_task: 1 })
          .then(function (res) {
            if (res.length > 0) {
              _this.goodsData = res;
            }
          });
      }
    },
    /**
     * 加载数据信息
     * @return {[type]} [description]
     */
    handleAutoList() {
      let _this = this;
      this.$heshop.goods('GET', { behavior: 'fitment', is_task: 1, auto: this.content.auto }).then(function (res) {
        if (res.length > 0) {
          _this.goodsData = res;
        }
      });
    },
    /**
     * 加载数据信息
     * @return {[type]} [description]
     */
    handleGroupList({ id, limit }) {
      if (id) {
        let _this = this;
        this.$heshop
          .search(
            'POST',
            { include: 'goods' },
            {
              keyword: {
                group: id,
                tab_key: 'onsale'
              }
            }
          )
          .page(1, limit)
          .then(function (res) {
            _this.goodsData = res.data.length > 0 ? res.data : _this.goods;
          });
      }
    },
    cart: function (item) {
      this.goodsId = item.id;
    }
  }
};
</script>

<style lang="scss" scoped>
@import './element.less';

.goods-item-price {
  @include font_color('font_color');
}
</style>
