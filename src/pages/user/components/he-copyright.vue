<template>
  <view class="he-copyright flex flex-direction align-center">
    <template v-if="($h.test.isEmpty(getCopyright) || !auth) && isAuth">
      <image class="he-copyright__image" :src="ipAddress + '/copy-logo.png'" />
      <text class="he-copyright__text">Powered By Leadshop © 2021</text>
    </template>
    <template v-else-if="!$h.test.isEmpty(getCopyright) && auth">
      <image class="he-copyright__image" :src="getCopyright.mobile_copyright_icon" />
      <text class="he-copyright__text">{{ getCopyright.mobile_copyright_content }}</text>
    </template>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'he-copyright',
  computed: {
    ...mapGetters('setting', {
      getCopyright: 'getCopyright'
    }),
    auth({ $store }) {
      return $store.state.setting.auth;
    },
    isAuth({ $store }) {
      return $store.state.setting.isAuth;
    }
  }
};
</script>

<style scoped>
.he-copyright {
  width: 100%;
  padding: 40px 0 27px 0;
  background-color: #f7f7f7;
}

.he-copyright__image {
  width: 240px;
  height: 48px;
}

.he-copyright__text {
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #bfbfc3;
  line-height: 48px;
}
</style>
