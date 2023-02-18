<template>
  <view class="he-products-featured" id="products-featured">
    <view class="he-top flex justify-center align-center">
      <text class="iconfont iconproductrecommendation_line"></text>
      <view class="he-text" v-if="is_task">积分商品 </view>
      <view class="he-text" v-else>为你推荐</view>
      <text class="iconfont iconproductrecommendation_line he-icon-right"></text>
    </view>
    <template v-if="is_task">
      <list-b :is_task="is_task" :list="taskList" v-if="taskList.length" @navigateTo="navigateTo"></list-b>
    </template>
    <template v-if="!is_task">
      <list-b :list="list" v-if="list.length" @navigateTo="navigateTo"></list-b>
    </template>
  </view>
</template>

<script>
import listB from './goods-list/list-B.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'he-products-featured',
  components: {
    listB
  },
  props: {
    is_task: {
      type: [Boolean, Number],
      default: 0
    }
  },
  data() {
    return {
      taskList: []
    };
  },
  computed: {
    ...mapGetters({
      list: 'goods/shareGoods'
    })
  },
  methods: {
    ...mapActions({
      shareGoods: 'goods/shareGoods'
    }),
    navigateTo: function (item) {
      uni.navigateTo({ url: '/pages/goods/detail?id=' + item.id + '&is_task=' + this.is_task });
    }
  },
  mounted() {
    if (this.is_task) {
      this.$heshop
        .goods('get', {
          behavior: 'recommend',
          is_task: this.is_task
        })
        .then(res => {
          this.taskList = res;
        })
        .catch(() => {});
    } else {
      this.shareGoods();
    }
  }
};
</script>

<style scoped>
.he-products-featured {
  width: 750px;
  overflow: hidden;
}

.he-top {
  margin-top: 43px;
  border-radius: 16px 16px 0 0;
}

.iconproductrecommendation_line {
  font-size: 68px;
  color: #a2a2a2;
}

.he-icon-right {
  transform: rotate(180deg);
  transform-origin: 50% 50%;
}

.he-text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin: 0 21px;
}
</style>
