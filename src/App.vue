<script>
export default {
  globalData: {},
  onLaunch: function () {
    return new Promise(() => {
      let _this = this;
      // #ifdef H5
      _this.$h.setTabBarItem();
      _this.$wechat.init();
      // #endif
      // 获取设备设置
      this.$store.dispatch('setting/getSys');
      this.$store.dispatch('setting/subscribe');
      this.$store.dispatch('setting/getTabBar').then(function () {
        let index = _this.$store.getters['setting/getCartIndex'];
        let is_login = uni.getStorageSync('token');
        if (is_login) {
          _this.$store.dispatch('cart/getCartNumber').then(response => {
            if (response !== 0) {
              uni.setTabBarBadge({
                index: index,
                text: response + ''
              });
            } else {
              uni.removeTabBarBadge({
                index: index
              });
            }
          });
        }
      });
    });
  },
  onShow: function () {
    //获取插件设置
    this.$store.dispatch('plugins/getPlugins');
    //用户相关配置
    // #ifndef H5
    this.$store.dispatch('user/getUserProfile');
    // #endif
    this.$store.dispatch('user/visit');
    // 获取商城设置
    this.$store.dispatch('setting/getSetting');
    this.$store.dispatch('setting/getAuth');
    // 获取主题色
    this.$store.dispatch('setting/getTheme');
    // #ifndef H5
    this.$store.dispatch('user/authLogin');
    // #endif
    this.$store.dispatch('user/getUserInfo');
    //用于延时测试数据
    setTimeout(() => {
      this.$manifest('task', 'status');
    }, 2000);
  },
  onHide: function () {}
};
</script>
<style lang="scss">
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import 'static/css/index.css';
@import 'static/css/icon.css';

// #ifdef H5
uni-page-head {
  display: none;
}

uni-toast {
  z-index: 10078 !important;
}

uni-modal {
  z-index: 10078 !important;
}

// #endif
</style>
