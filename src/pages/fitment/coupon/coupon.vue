<template>
  <scroll-view class="coupon" scroll-x>
    <view class="le-coupon-box" :class="[couponBox]">
      <!-- #ifdef MP-WEIXIN -->
      <view
        v-for="(item, index) in list"
        :key="index"
        @click="receive(item)"
        :style="[itemStyle(item)]"
        :class="[couponItem]"
      >
        <item :facade="facade" :content="content" :item="item"></item>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view :class="[couponItem]" v-for="(item, index) in list" :key="index" :style="[itemStyle(item)]">
        <item v-if="!item.can_obtain" :facade="facade" :content="content" :item="item"></item>
        <he-open-subscribe
          @open-subscribe-success="receive"
          :template-id="subTemplateId"
          :digital="item"
          :key="index"
          v-else
        >
          <item :facade="facade" :content="content" :item="item"></item>
        </he-open-subscribe>
      </view>
      <!-- #endif -->
    </view>
  </scroll-view>
</template>

<script type="text/javascript">
// #ifdef H5
import heOpenSubscribe from '@/components/he-open-subscribe.vue';
// #endif
import item from './item.vue';
export default {
  components: {
    // #ifdef H5
    heOpenSubscribe,
    // #endif
    item
  },
  computed: {
    couponBox: function () {
      if (this.facade.list_style === 1) {
        return '';
      } else if (this.facade.list_style === 2) {
        return 'flex flex-wrap';
      } else if (this.facade.list_style === 3) {
        return 'flex';
      }
    },
    subTemplateId: function () {
      return [this.$store.getters['setting/subscribe'].coupon_expire];
    },
    couponItem: function () {
      let str = '';
      if (this.content.style === 3) {
        str += ' fillet ';
      }
      if (this.facade.list_style === 1) {
        str += '';
      } else if (this.facade.list_style === 2) {
        str += 'le-item-marginRight-odd ';
      } else if (this.facade.list_style === 3) {
        str += 'le-item-marginRight ';
      }
      return str;
    },
    itemStyle: function () {
      return () => {
        let style = {};
        if (this.facade.list_style === 1) {
          style.width = 710 + 'rpx';
          style.marginBottom = 10 + 'rpx';
        } else if (this.facade.list_style === 2) {
          style.width = 349 + 'rpx';
          style.marginBottom = 10 + 'rpx';
        } else if (this.facade.list_style === 3) {
          style.width = 280 + 'rpx';
        }
        return style;
      };
    }
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
      list: []
    };
  },
  methods: {
    getList: function () {
      let _this = this;
      let { data, autoplay, number } = this.content;
      if (autoplay === 0) {
        // 手动添加
        if (data.length !== 0) {
          let _array = [];
          _array = data.map(function (item) {
            return item.id;
          });
          this.$heshop
            .coupon('get', {
              behavior: 'coupon',
              coupon_id: _array
            })
            .then(function (response) {
              _this.list = response.data;
            })
            .catch(function (error) {
              _this.$toError(error);
            });
        }
      } else if (autoplay === 1) {
        // 自动添加
        this.$heshop
          .coupon('get', {
            behavior: 'coupon'
          })
          .page(1, number)
          .then(function (response) {
            _this.list = response.data;
          })
          .catch(function (error) {
            _this.$toError(error);
          });
      }
    },
    receive: function (item) {
      let _this = this;
      if (item.can_obtain) {
        if (this.isLogin) {
          // #ifdef MP-WEIXIN
          wx.requestSubscribeMessage({
            tmplIds: _this.subTemplateId,
            success: function () {},
            fail: function () {},
            complete: function () {
              _this.$heshop
                .coupon('post', {
                  id: item.id
                })
                .then(function () {
                  item.can_obtain = false;
                })
                .catch(function (error) {
                  // item.can_obtain = false;
                  _this.$toError(error);
                });
            }
          });
          // #endif
          // #ifdef H5
          _this.$heshop
            .coupon('post', {
              id: item.id
            })
            .then(function () {
              item.can_obtain = false;
            })
            .catch(function (error) {
              // item.can_obtain = false;
              _this.$toError(error);
            });
          // #endif
        } else {
          // #ifdef H5
          this.$store.commit('apply/setLoginModel', true);
          // #endif
        }
      }
    }
  },
  watch: {
    'content.data': {
      handler() {
        this.getList();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped lang="scss">
@import './element.less';
.coupon {
  overflow: hidden;
  background-color: #fff;
}
.le-coupon-box {
  width: 750px;
  background: #ffffff;
  padding: 20px 20px 15px 20px;
}
.he-open-subscribe {
  display: inline-block;
}
</style>
