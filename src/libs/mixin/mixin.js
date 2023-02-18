import { mapGetters } from 'vuex';
import getSceneVariable from '../function/getSceneVariable';

module.exports = {
  data() {
    return {
      ipAddress: 'https://qmxq.oss-cn-hangzhou.aliyuncs.com',
      shareOpen: false
    };
  },
  computed: {
    // 店铺信息
    ...mapGetters('setting', {
      storeSetting: 'storeSetting',
      getBasicSetting: 'getBasicSetting',
      goodsSetting: 'goodsSetting',
      theme: 'getTheme',
      getTabBar: 'getTabBar',
      shareSetting: 'shareSetting',
      getSys: 'getSys'
    }),
    isLogin: function () {
      return this.$store.state.apply.is_login;
    },
    themeColor: function () {
      let theme = {
        red_theme: '#E60B30',
        purple_theme: '#8F2DF3',
        blue_theme: '#33A7FF',
        green_theme: '#1FC551',
        orange_theme: '#FF7F00',
        golden_theme: '#CAA45A'
      };
      return theme[this.theme];
    },
    isBarGoods: function () {
      if (!this.getTabBar) return;
      for (let i = 0; i < this.getTabBar.length; i++) {
        if (this.getTabBar[i].link.path === '/pages/goods/list') {
          return true;
        }
      }
      return false;
    },
    $shareData({ shareSetting, storeSetting }) {
      return {
        title: shareSetting?.describe ? shareSetting?.describe : `欢迎光临${storeSetting?.name} 挑选好物`,
        path: '/pages/index/index',
        imageUrl: shareSetting.cover_img ? shareSetting?.cover_img : storeSetting?.logo
      };
    }
  },
  onLoad(options) {
    // getRect挂载到$h上，因为这方法需要使用in(this)，所以无法把它独立成一个单独的文件导出
    this.$h.getRect = this.$hGetRect;
    const { id } = this.$store.state.apply.userInfo;
    // 分销商绑定上下级关系
    if (this.isLogin) {
      if (options.scene || options.spu) {
        let promoterUid;
        if (options.spu) {
          promoterUid = options.spu;
        } else if (options.scene) {
          const scene = decodeURIComponent(options.scene);
          promoterUid = this.$h.getSceneVariable(scene, 'spu');
        }
        if (id != promoterUid) {
          this.$store.dispatch('plugins/bindPromoterSuperior', { parent_id: promoterUid });
        } else {
        }
      }
    } else {
      if (options.scene || options.spu) {
        let promoterUid;
        if (options.spu) {
          promoterUid = options.spu;
        } else if (options.scene) {
          const scene = decodeURIComponent(options.scene);
          promoterUid = this.$h.getSceneVariable(scene, 'spu');
        }
        if (id != promoterUid) {
          uni.setStorageSync('promoterUid', promoterUid);
        }
      }
    }

    //判断是否有用户要求记录
    if (options && options.task_uid) {
      if (this.isLogin && id != options.task_uid) {
        this.$store.dispatch('plugins/onInvite', { UID: options.task_uid });
      }
    }
  },
  methods: {
    // 查询节点信息
    // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug
    // 解决办法为在组件根部再套一个没有任何作用的view元素
    $hGetRect(selector, all) {
      return new Promise(resolve => {
        uni
          .createSelectorQuery()
          .in(this)
          [all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },
    // 报错跳转页面
    $toError: function (err) {
      let { data, status } = err;
      if (status === 422) {
        this.$h.toast(data[0].message);
      } else if (status === 403) {
        this.$h.toast(data.message);
      }
    },
    $shareAppMessage: function (args) {
      let newArgs = args || this.$shareData;
      newArgs = JSON.parse(JSON.stringify(newArgs));
      if (this.isLogin && newArgs && newArgs.path) {
        const { id, promoter_status } = this.$store.state.apply.userInfo;
        this.toTaskonShare();
        //处理统一传参问题
        if (newArgs.path.indexOf('?') === -1) {
          newArgs.path = newArgs.path + '?task_uid=' + id;
        } else {
          newArgs.path = newArgs.path + '&task_uid=' + id;
        }
        // 是分销商
        if (promoter_status === 2) {
          newArgs.path = newArgs.path + '&spu=' + id;
        }
      }
      return newArgs;
    },
    uniCopy: function ({ content, success, error }) {
      if (!content) return error('the content can not be blank');
      content = typeof content === 'string' ? content : content.toString();
      // #ifndef H5
      uni.setClipboardData({
        data: content,
        success: function () {
          success && success('Copy successfully');
          if (!success) {
            uni.showToast({
              title: '内容已复制',
              icon: 'none'
            });
          }
        },
        fail: function () {
          error && error('Copy failed');
        }
      });
      // #endif

      // #ifdef H5
      if (!document.queryCommandSupported('copy')) {
        error && error('Browser does not support');
      }
      let textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.readOnly = 'readOnly';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, content.length);
      let result = document.execCommand('copy');
      if (result) {
        uni.showToast({
          title: '内容已复制',
          icon: 'none'
        });
        success && success('Copy successfully');
      } else {
        error && error('Copy failed');
      }
      textarea.remove();
      // #endif
    },
    // 设置缓存
    setStorageSync: function (key, data) {
      try {
        uni.setStorageSync(key, data);
      } catch (e) {
        //  Don't do
      }
    },
    // 获取缓存
    getStorageSync: function (key) {
      try {
        return uni.getStorageSync(key);
      } catch (e) {
        //  Don't do
      }
    },
    previewImage: function () {},
    toTaskonShare() {
      //用于延时测试数据
      setTimeout(res => {
        let task_status = this.$manifest('task', 'status');
        let that = this;
        if (task_status) {
          this.$store.dispatch('plugins/onShare');
        }
      }, 1000);
    }
  },
  // #ifdef MP-WEIXIN
  onShareAppMessage() {
    if (!this.shareOpen) {
      return this.$shareAppMessage();
    }
  },
  onShareTimeline() {
    if (!this.shareOpen) {
      return this.$shareAppMessage();
    }
  },
  onAddToFavorites() {
    return {
      title: this.storeSetting.name,
      path: '/pages/index/index',
      imageUrl: this.storeSetting.logo
    };
  }
  // #endif
};
