<template>
  <he-cart :show.sync="isShopping" :goods="goods" :is_task="is_task"></he-cart>
</template>
<script>
import heCart from './he-cart.vue';

export default {
  name: 'he-index-cart',
  data() {
    return {
      isShopping: false,
      goods: {}
    };
  },
  props: {
    goodsId: [Number],
    is_task: {
      type: Number,
      default: 0
    }
  },
  components: {
    heCart
  },
  watch: {
    goodsId: {
      handler(val) {
        val && this.shopping(val);
      }
    },
    isShopping: function (val) {
      if (!val) this.$emit('update:goodsId', null);
    }
  },
  methods: {
    /**
     * 处理积分商品信息兼容
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    shopping: function (id) {
      let _this = this;
      this.$heshop
        .goods('get', id, { is_task: this.is_task })
        .then(function (res) {
          if (!res.hasOwnProperty('empty_status')) {
            _this.goods = res;
            _this.isShopping = true;
          }
        })
        .catch(function (err) {
          _this.$toError(err);
        });
    }
  }
};
</script>
