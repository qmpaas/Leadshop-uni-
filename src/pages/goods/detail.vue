<template>
  <view class="he-page-content" :class="isLoading ? 'flex justify-center align-center' : ''" :data-theme="theme">
    <view class="he-touch" v-if="isTouch" @touchmove.stop.prevent="() => {}"></view>
    <template v-if="!isLoading">
      <he-navbar :is-back="true" :background="barBackground">
        <view class="flex he-tabs justify-center" v-if="isBar && !emptyStatus">
          <view class="he-tab" @click="pageScrollTo('banner', 1, top.banner)"
            >商品
            <view class="he-tab-line" v-if="tab === 1"></view>
          </view>
          <view class="he-tab" @click="pageScrollTo('evaluation', 2, top.evaluation)"
            >评价
            <view class="he-tab-line" v-if="tab === 2"></view>
          </view>
          <view class="he-tab" @click="pageScrollTo('rich', 3, top.rich)"
            >详情
            <view class="he-tab-line" v-if="tab === 3"></view>
          </view>
          <view class="he-tab" @click="pageScrollTo('featured', 4, top.featured)" v-if="isProductsFeatured"
            >推荐
            <view class="he-tab-line" v-if="tab === 4"></view>
          </view>
        </view>
      </he-navbar>
    </template>
    <detail-skeleton v-if="isLoading"></detail-skeleton>
    <template v-else-if="!isLoading && !emptyStatus">
      <view id="banner"></view>
      <detail-banner
        id="detail-banner"
        :video="detail.video"
        :is-video="detail.is_video"
        :video-cover="detail.video_cover"
        :list="detail.slideshow"
        :goods-id="detail.id"
      ></detail-banner>
      <detail-basic-information
        :task="detail.task"
        :is_task="is_task"
        :name="detail.name"
        :price="detail.price"
        :unit="detail.unit"
        :sales="detail.sales"
        :goods="detail"
        :goods-id="detail.id"
        :virtual_sales="detail.virtual_sales"
        :line-price="detail.line_price"
        :goods-introduce="detail.body.goods_introduce"
        :is-promoter="detail.is_promoter"
        :commission="detail.commission"
      ></detail-basic-information>
      <detail-parameter
        :unit="detail.unit"
        :package="detail.package"
        @shopping="shopping"
        :select="select"
        :goods-id="detail.id"
        :services="detail.services"
        :goods-args="detail.body.goods_args"
      >
      </detail-parameter>
      <detailTask v-if="$manifest('task', 'status')"></detailTask>
      <view class="el-float" :style="[floatStyle]" id="evaluation"></view>
      <detail-evaluation id="detail-evaluation" :goods-id="detail.id"></detail-evaluation>
      <view class="el-float" :style="[floatStyle]" id="rich"></view>
      <detail-rich id="detail-rich" :content="detail.body.content"></detail-rich>
      <view class="el-float" :style="[floatStyle]" id="featured"></view>
      <he-products-featured id="products-featured" v-if="isProductsFeatured"></he-products-featured>
      <detail-bottom-button
        :task="detail.task"
        :is_task="is_task"
        :slide-show="detail.slideshow"
        :name="detail.name"
        :stocks="detail.stocks"
        :shopping-type.sync="shoppingType"
        :goods-id="detail.id"
        v-model="isShopping"
      ></detail-bottom-button>
      <he-cart
        v-if="is_task"
        :is_task="is_task"
        :show.sync="isShopping"
        shopping-type="buy"
        @setSelect="setSelect"
        :goods="detail"
      ></he-cart>
      <he-cart
        v-else
        :show.sync="isShopping"
        :shopping-type="shoppingType"
        @setSelect="setSelect"
        :goods="detail"
      ></he-cart>
      <view class="safe-area-inset-bottom">
        <view class="he-bottom-height"></view>
      </view>
    </template>
    <template v-else-if="emptyStatus">
      <he-no-content-yet :text="emptyText" :image="ipAddress + '/goods-background-empty.png'"></he-no-content-yet>
      <he-products-featured></he-products-featured>
    </template>
    <!-- 优化展现形式 -->
    <taskpopups
      v-model="item.display"
      :title="item.remark"
      :index="index"
      v-for="(item, index) in popupsList"
      :key="index"
    ></taskpopups>
    <template v-if="task_browse && copy_task_browse">
      <taskbrowse :display="is_browse" :goods_id="goods_id" ref="taskbrowse"></taskbrowse>
    </template>
    <HeLoginModel />
    <he-float-window :bottom="95" pages-url="goods-detail"></he-float-window>
  </view>
</template>

<script>
import detailBanner from './components/detail-banner.vue';
import detailBasicInformation from './components/detail-basic-information.vue';
import detailParameter from './components/detail-parameter.vue';
import detailTask from './components/detail-task.vue';
import detailEvaluation from './components/detail-evaluation.vue';
import detailRich from './components/detail-rich.vue';
import detailBottomButton from './components/detail-bottom-button.vue';
import detailSkeleton from './components/detail-skeleton.vue';
import detailBar from './components/detail-bar.vue';
import heProductsFeatured from '../../components/he-products-featured.vue';
import heCart from '../../components/he-cart.vue';
import heNoContentYet from '../../components/he-no-content-yet.vue';
import heNavbar from '../../components/he-navbar.vue';
import { mapGetters } from 'vuex';
import taskpopups from '@/plugins/task/components/popups.vue';
import taskbrowse from '@/plugins/task/components/browse.vue';
import HeLoginModel from '../../components/he-login-layout.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';

export default {
  name: 'detail',
  components: {
    detailBanner,
    detailBasicInformation,
    detailParameter,
    detailEvaluation,
    detailTask,
    detailRich,
    detailBottomButton,
    detailSkeleton,
    heProductsFeatured,
    heCart,
    heNoContentYet,
    detailBar,
    heNavbar,
    taskpopups,
    taskbrowse,
    HeLoginModel,
    heFloatWindow
  },
  computed: {
    ...mapGetters('setting', {
      goodsSetting: 'goodsSetting',
      navbarHeight: 'getNavBarHeight',
      statusBarHeight: 'statusBarHeight'
    }),
    isProductsFeatured: function () {
      return this.goodsSetting.recommend_showpage.goodsinfo.value;
    },
    emptyText: function () {
      if (this.emptyStatus === 1) {
        return '商品不存在';
      } else if (this.emptyStatus === 2) {
        return '商品已下架';
      }
    },
    shareData: function () {
      return {
        title: this.detail.name,
        path: '/pages/goods/detail?id=' + this.detail.id,
        imageUrl: this.detail.slideshow[0]
      };
    },
    floatStyle: function () {
      return {
        transform: `translateY(-${this.navbarHeight + this.statusBarHeight - uni.upx2px(24)}px)`
      };
    },
    barBackground: function () {
      if (this.isBar) {
        return {
          background: '#ffffff'
        };
      } else {
        return {
          background: 'transparent'
        };
      }
    }
  },
  onShow() {
    if (this.$store.state.apply.is_login) {
      this.handleTaskBrowseLog();
    }
  },
  data() {
    return {
      isLoading: true,
      isShopping: false,
      select: null,
      shoppingType: 'cart',
      emptyStatus: null,
      isBar: false,
      tab: 1,
      isScroll: false,
      top: {
        banner: 0,
        evaluation: 0,
        rich: 0,
        featured: 0
      },
      isTouch: false,
      detail: {
        slideshow: [],
        goods_args: [],
        is_promoter: 0
      },
      /**
       * 判断是否从积分任务过来
       * @type {Number}
       */
      task_browse: 0,
      goods_id: 0,
      //判断是否为积分商品
      is_task: 0,
      is_browse: 0,
      popupsList: [],
      copy_task_browse: 0,
      shareOpen: true
    };
  },
  onHide() {
    if (this.$refs['taskbrowse'] && this.$refs['taskbrowse'].timeoutID) {
      clearTimeout(this.$refs['taskbrowse'].timeoutID);
      this.copy_task_browse = 0;
    }
  },
  onUnload() {
    if (this.$refs['taskbrowse'] && this.$refs['taskbrowse'].timeoutID) {
      clearTimeout(this.$refs['taskbrowse'].timeoutID);
      this.copy_task_browse = 0;
    }
  },
  methods: {
    /**
     * 签到列表计算
     * @return {[type]} [description]
     */
    handleTaskBrowseLog() {
      /**
       * 处理数据
       * @param  {[type]} res [description]
       * @return {[type]}     [description]
       */
      this.$heshop
        .plugin('get', { include: 'task', model: 'log', keyword: 'browse', number: this.goods_id, status: 0 })
        .then(res => {
          if (res.length) {
            this.is_browse = false;
          } else {
            this.is_browse = true;
          }
          this.copy_task_browse = this.is_browse;
        })
        .catch(() => {
          // Don't do
        });
    },
    getDetail: function getDetail(id, callback) {
      let _this = this;
      _this.$heshop
        .goods('get', id, { is_task: this.is_task })
        .then(function (res) {
          if (!res.hasOwnProperty('empty_status')) {
            if (!res.body.goods_args) {
              res.body.goods_args = [];
            }
            _this.detail = res;
          } else {
            _this.emptyStatus = res.empty_status;
            uni.setNavigationBarTitle({
              title: _this.emptyText
            });
            _this.isTouch = false;
          }
          callback();
        })
        .catch(function (err) {
          _this.$toError(err);
          _this.isLoading = false;
        });
    },
    shopping: function () {
      this.isShopping = true;
      this.shoppingType = '';
    },
    setSelect: function (select) {
      this.select = select;
    },
    selectEval: function (id) {
      let _this = this;
      return new Promise(function (resolve) {
        uni
          .createSelectorQuery()
          .select(id)
          .boundingClientRect(function (rect) {
            if (rect) {
              resolve(rect.top - _this.navbarHeight - _this.statusBarHeight);
            } else {
              reject();
            }
          })
          .exec();
      });
    },
    catchtouchmove: function () {},
    // #ifdef H5
    async pageScrollTo(str, num, top) {
      let _this = this;
      _this.isScroll = true;
      await uni.pageScrollTo({
        scrollTop: top + 10,
        duration: 200
      });
    },
    // #endif
    // #ifndef H5
    pageScrollTo: function (str, num, top) {
      let _this = this;
      _this.isScroll = true;
      uni.pageScrollTo({
        selector: '#' + str,
        duration: 200,
        success: function () {
          _this.isScroll = false;
        }
      });
    }
    // #endif
  },
  onLoad(options) {
    this.task_browse = options.task_browse ? options.task_browse : null;
    this.copy_task_browse = this.task_browse;
    this.popupsList = [];
    //判断是否积分商品
    if (options && options.is_task) {
      this.is_task = JSON.parse(options.is_task);
    }
    this.isTouch = true;
    // #ifdef H5
    uni.setNavigationBarTitle({
      title: '商品详情'
    });
    // #endif
    // #ifdef MP-WEIXIN
    uni.showShareMenu({
      withShareTicket: true
    });
    // #endif
    let id = 0;
    if (options.scene) {
      id = parseInt(decodeURIComponent(options.scene).split('=')[1]);
    } else {
      id = parseInt(options.id);
    }
    this.goods_id = id;
    let _this = this;
    this.getDetail(id, function () {
      _this.isLoading = false;
      // #ifdef H5
      _this.$wechat.updateShareData(_this.shareData);
      setTimeout(() => {
        let array = [_this.selectEval('#detail-evaluation'), _this.selectEval('#detail-rich')];
        if (_this.isProductsFeatured) {
          array.push(_this.selectEval('#products-featured'));
        }
        Promise.all(array)
          .then(function (res) {
            _this.top.evaluation = res[0];
            _this.top.rich = res[1];
            if (_this.isProductsFeatured) {
              _this.top.featured = res[2];
            }
            _this.isTouch = false;
          })
          .catch(() => {
            _this.isTouch = false;
          });
      }, 800);
      // #endif
      // #ifndef H5
      _this.isTouch = false;
      // #endif
    });
  },
  onPageScroll(e) {
    if (this.emptyStatus) return;
    let _this = this;
    _this.isBar = e.scrollTop > 150;
    let array = [_this.selectEval('#detail-evaluation'), _this.selectEval('#detail-rich')];
    if (_this.isProductsFeatured) {
      array.push(_this.selectEval('#products-featured'));
    }
    Promise.all(array).then(function (res) {
      if (res[0] < 0) {
        _this.tab = 2;
      } else {
        _this.tab = 1;
      }
      if (res[1] < 0) {
        _this.tab = 3;
      }
      if (_this.isProductsFeatured && res[2] < 0) {
        _this.tab = 4;
      }
    });
  },
  // #ifdef H5
  beforeDestroy() {
    this.$wechat.updateShareData(this.$shareAppMessage());
  },
  // #endif
  // #ifndef H5
  onShareAppMessage() {
    return this.$shareAppMessage(this.shareData);
  },
  onShareTimeline() {
    return this.$shareAppMessage(this.shareData);
  }
  // #endif
};
</script>

<style scoped lang="scss">
.he-bottom-height {
  height: 115px;
}

.he-page-content {
  overflow: hidden;
}

.el-float {
  position: absolute;
  z-index: -10;
  width: 100%;
}

.he-tabs {
  width: 100%;
  background-color: #ffffff;

  .he-tab {
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
    padding: 18px 24px;
    position: relative;
  }

  .he-tab-line {
    width: 24px;
    height: 4px;
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    @include background_color('background_color');
    border-radius: 2px;
  }
}

.he-touch {
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 1000;
}
</style>
