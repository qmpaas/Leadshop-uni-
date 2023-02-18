<template>
  <view class="he-page-content" :data-theme="theme">
    <view class="task-mall__hrader">
      <image class="task-mall__hrader-icon" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
      <view class="task-mall__hrader-num">
        {{ userInfo.number }}
        <text>积分可用</text>
      </view>
      <view class="task-mall__hrader-search" @tap="navigateTo">
        <text class="iconfont iconsearchbar_search"></text>
        <text>搜索</text>
      </view>
    </view>
    <list-sort @sort="setSort"></list-sort>
    <list-b :list="list" v-if="style != -1" :is_task="true" @navigateTo="toDetail"></list-b>
    <he-load-more v-if="list.length > 0" :status="loadStatus"></he-load-more>
    <view class="safe-area-inset-bottom"></view>
    <he-no-content-yet v-if="isNothing" text="暂未找到相关商品"></he-no-content-yet>
  </view>
</template>
<script>
import listSort from './sort.vue';
import listB from '@/components/goods-list/list-B.vue';
import heNoContentYet from '@/components/he-no-content-yet.vue';
import heLoadMore from '@/components/he-load-more.vue';

export default {
  name: 'list',
  data() {
    return {
      userInfo: {
        number: 0
      },
      style: 0,
      list: [],
      page: {
        count: 1,
        size: 10,
        current: 1
      },
      keyword: {
        group: null,
        search: '',
        sort: {
          sort: 'DESC'
        }
      },
      isNothing: false,
      loadStatus: 'loadmore'
    };
  },
  components: {
    listSort,

    listB,

    heNoContentYet,
    heLoadMore
  },
  methods: {
    navigateTo: function () {
      let url = '/plugins/task/search?keyword=' + this.keyword.search + '&from=/plugins/task/mall';
      uni.redirectTo({
        url: url,
        fail: function (res) {
          uni.switchTab({
            url: url
          });
        }
      });
    },

    /**
     * 执行用户数据加载
     * @return {[type]} [description]
     */
    handleLoadData() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'user' })
        .then(res => {
          this.userInfo = res;
        })
        .catch(err => {});
    },
    getList: function () {
      let _this = this;
      //强制拼接排序参数
      if (_this.keyword['sort'] && _this.keyword['sort']['t.task_number']) {
        _this.keyword['sort']['t.task_price'] = _this.keyword['sort']['t.task_number'];
      }
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .search(
            'post',
            {
              include: 'goods',
              is_task: 1
            },
            {
              keyword: _this.keyword
            }
          )
          .page(_this.page.current, _this.page.size)
          .then(function (res) {
            let { data, headers } = res;
            resolve(data);
            // #ifdef MP-WEIXIN
            _this.page = {
              current: +headers['X-Pagination-Current-Page'],
              count: +headers['X-Pagination-Page-Count'],
              size: +headers['X-Pagination-Per-Page']
            };
            // #endif
            // #ifdef H5
            _this.page = {
              current: +headers['x-pagination-current-page'],
              count: +headers['x-pagination-page-count'],
              size: +headers['x-pagination-per-page']
            };
            // #endif
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    setSort: function (e) {
      let style = this.style;
      let _this = this;
      this.list = [];
      this.keyword.sort = {
        [e.key]: e.value
      };
      this.page.current = 1;
      this.loadStatus = 'loadmore';
      this.getList().then(function (res) {
        _this.style = -1;
        _this.list = res;
        setTimeout(function () {
          _this.style = style;
        });
        _this.loadStatus = _this.list.length < _this.page.size ? 'nomore' : 'loadmore';
      });
    },
    toDetail: function (item) {
      uni.navigateTo({ url: '/pages/goods/detail?is_task=1&id=' + item.id });
    }
  },
  onLoad(options) {
    this.keyword.group = options.group ? options.group : null;
    this.style = options.goods_show ? options.goods_show : 1;
    this.handleLoadData();
  },
  onShow() {
    let _this = this;
    let search_key = this.getStorageSync('search_key');
    if (search_key) {
      this.keyword.search = search_key;
      uni.removeStorageSync('search_key');
    }
    this.page.current = 1;
    this.getList().then(function (res) {
      _this.list = res;
      _this.isNothing = _this.list.length === 0;
      _this.loadStatus = _this.list.length < _this.page.size ? 'nomore' : 'loadmore';
    });
  },
  onReachBottom() {
    let _this = this;
    if (this.page.count > this.page.current) {
      this.page.current++;
      this.loadStatus = 'loading';
      this.getList().then(function (res) {
        _this.list.push(...res);
        _this.loadStatus = 'loadmore';
      });
    } else {
      this.loadStatus = 'nomore';
    }
  }
};
</script>

<style scoped lang="scss">
.he-search {
  width: 100%;
  padding: 24px 30px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #ffffff;
}

.he-input {
  background: #f7f7f7;
  border-radius: 32px;
  height: 64px;
  line-height: 64px;
}

.he-placeholder {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 32px;
}

.he-page-content {
  padding-bottom: 40px;
}

.he-input__text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  overflow: hidden;
  height: 64px;
}

.task-mall__hrader {
  width: 750px;
  height: 112px;
  background: #ffffff;
  position: relative;
}

.task-mall__hrader-icon {
  width: 44px;
  height: 44px;
  position: absolute;
  left: 34px;
  top: 34px;
}

.task-mall__hrader-num {
  position: absolute;
  left: 92px;
  top: 38px;
  font-size: 40px;
  line-height: 40px;
  font-family: DIN;
  font-weight: 500;
  color: #222222;

  text {
    padding-left: 12px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
  }
}

.task-mall__hrader-search {
  position: absolute;
  right: 24px;
  top: 32px;
  width: 170px;
  height: 64px;
  background: #f7f7f7;
  border-radius: 32px;
  text-align: center;

  text {
    line-height: 64px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    padding: 0 6px;
  }
}
</style>
