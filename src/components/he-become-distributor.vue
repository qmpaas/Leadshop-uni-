<template>
  <he-popup mode="center" :border-radius="16" v-model="showModal" :zoom="false" background-color="transparent">
    <view class="flex flex-direction align-center">
      <view class="box flex align-center flex-direction">
        <image class="image" :src="ipAddress + '/become-distributor.png'"></image>
        <text class="text"> 恭喜，您已成为本商城的分销商! 一起推广赚钱吧!</text>
        <button class="cu-btn" @click="routerPromoter">分销商中心</button>
      </view>
      <view class="iconfont iconpopup_close2" @click="showModal = false"></view>
    </view>
  </he-popup>
</template>

<script>
import hePopup from './he-popup.vue';

export default {
  name: 'he-become-distributor',
  components: {
    hePopup
  },
  props: {
    value: Boolean
  },
  data() {
    return {};
  },
  computed: {
    showModal: {
      get({ $store }) {
        return $store.state.user.showBecomeDistributor;
      },
      set(value) {
        this.$store.state.user.showBecomeDistributor = value;
      }
    }
  },
  methods: {
    routerPromoter() {
      this.showModal = false;
      this.$store.dispatch('user/getUserInfo').then(() => {
        uni.navigateTo({
          url: '/promoter/pages/index'
        });
      });
    }
  }
};
</script>

<style scoped>
.box {
  width: 590px;
  height: 576px;
  background-color: #ffffff;
  margin-bottom: 48px;
  border-radius: 16px;
}

.image {
  width: 317px;
  height: 320px;
}

.text {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  line-height: 40px;
  width: 410px;
  text-align: center;
}

.cu-btn {
  width: 242px;
  height: 72px;
  background: #e60b30;
  border-radius: 36px;
  margin-top: 48px;
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
}

.iconpopup_close2 {
  font-size: 52px;
  color: #ffffff;
}
</style>
