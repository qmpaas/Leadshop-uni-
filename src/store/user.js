const user = {
  namespaced: true,
  state: {
    userInfo: null,
    orderTotal: {
      noevaluate: 0,
      orderafter: 0,
      unpaid: 0,
      unreceived: 0,
      unsent: 0
    },
    shippingAddress: [],
    couponTotal: 0,
    showBecomeDistributor: false
  },
  mutations: {
    userInfo(state, data) {
      uni.setStorageSync('userInfo', data);
      state.userInfo = data;
    },
    orderTotal(state, data) {
      state.orderTotal = data;
    },
    shippingAddress(state, data) {
      state.shippingAddress = data;
    },
    couponTotal(state, data) {
      state.couponTotal = data;
    }
  },
  getters: {
    userInfo: function (state) {
      return state.userInfo;
    },
    orderTotal: function (state) {
      return state.orderTotal;
    },
    getAddress: function (state) {
      return state.shippingAddress;
    },
    couponTotal: function (state) {
      return state.couponTotal;
    }
  },
  actions: {
    decryptUserInfo: function ({ dispatch, commit }) {
      let $heshop = this._vm.$heshop;
      let $pageURL = this._vm.$pageURL;
      let _this = this._vm;
      return new Promise((resolve, reject) => {
        // #ifndef H5
        uni.login({
          provider: 'weixin',
          success: function (loginRes) {
            uni.getUserInfo({
              success: function (res) {
                $heshop
                  .login('post', 'weapp', {
                    code: loginRes.code,
                    iv: res.iv,
                    encryptedData: res.encryptedData
                  })
                  .then(function (res) {
                    dispatch('visit');
                    commit('apply/login', res, {
                      root: true
                    });
                    resolve();
                  });
              }
            });
          }
        });
        // #endif
        // #ifdef H5
        let page = getCurrentPages()[getCurrentPages().length - 2];
        let route = '/pages/user/index';
        if (page) {
          route = '/' + page.route;
          let query = '?';
          for (let key in page.options) {
            query += `${key}=${page.options[key]}&`;
          }
          query = query.slice(0, query.length - 1);
          route = route + query;
        }
        let url = $pageURL + '&_skip=' + route;
        $heshop
          .login('post', {
            type: 'wechat',
            include: 'login_url',
            url: url,
            scope: 'snsapi_userinfo'
          })
          .then(function (res) {
            document.location.replace(res.url);
          })
          .catch(function (error) {
            _this.$toError(error);
          });
        // #endif
      });
    },
    getUserProfile: function ({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        let $heshop = this._vm.$heshop;
        // #ifdef H5
        uni.login({
          provider: 'weixin',
          success: function () { }
        });
        uni.getUserProfile({
          lang: 'zh_CN',
          desc: '授权',
          success: function (res) {
            uni.login({
              provider: 'weixin',
              success: function (loginRes) {
                $heshop
                  .login('post', 'weapp', {
                    code: loginRes.code,
                    iv: res.iv,
                    encryptedData: res.encryptedData
                  })
                  .then(function (res) {
                    dispatch('visit');
                    commit('apply/login', res, {
                      root: true
                    });
                    resolve();
                  })
                  .catch(function () {
                    reject();
                  });
              }
            });
          }
        });
        // #endif
        // #ifndef H5
        uni.login({
          provider: 'weixin',
          success: function (loginRes) {
            $heshop
              .login('post', 'weapp', {
                code: loginRes.code,
              })
              .then(function (res) {
                dispatch('visit');
                commit('apply/login', res, {
                  root: true
                });
                resolve();
              })
              .catch(function () {
                reject();
              });
          }
        });
        // #endif
      });
    },
    visit: function ({ state }) {
      if (uni.getStorageSync('token')) {
        let $heshop = this._vm.$heshop;
        $heshop
          .users('get', {
            behavior: 'visit'
          })
          .then(function (response) {
            if (typeof response !== 'boolean') {
              state.showBecomeDistributor = true;
            }
          })
          .catch(function (err) { });
      }
    },
    getOrderTotal: function ({ commit }) {
      let $heshop = this._vm.$heshop;
      $heshop
        .order('get', {
          behavior: 'tabcount'
        })
        .then(function (res) {
          commit('orderTotal', res);
        });
    },
    // #ifdef H5
    weChatLogin: function ({ commit, dispatch }, options) {
      if (!options.code) return;
      let $heshop = this._vm.$heshop;
      return new Promise(function (resolve, reject) {
        $heshop
          .login(
            'post',
            {
              type: 'wechat',
              include: 'login'
            },
            {
              code: options.code
            }
          )
          .then(function (res) {
            commit('apply/login', res, {
              root: true
            });
            dispatch('visit');
            resolve();
          })
          .catch(function () {
            reject();
          });
      });
    },
    // #endif
    getAddress: function ({ commit, state }) {
      let $heshop = this._vm.$heshop;
      let $h = this._vm.$h;
      if ($h.test.isEmpty(state.shippingAddress)) {
        $heshop.address('get').then(function (res) {
          let data = res;
          data.forEach(function (item) {
            item.is_select = false;
          });
          commit('shippingAddress', data);
        });
      }
    },
    // #ifndef H5
    authLogin: function () {
      uni.checkSession({
        success: function () { },
        fail: function () {
          uni.login({
            provider: 'weixin',
            scopes: 'auth_base',
            success: function () { },
            fail: function () { }
          });
        },
        complete: function () { }
      });
    },
    // #endif
    getCouponTotal: function ({ commit }) {
      let $heshop = this._vm.$heshop;
      $heshop
        .coupon('get', {
          behavior: 'tabcount'
        })
        .then(function (res) {
          commit('couponTotal', res.can_use_coupon_num);
        });
    },
    bindPhone: function ({ }) { },
    getUserInfo({ rootState, commit }) {
      if (!uni.getStorageSync('token')) return;
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .users('get', {
            behavior: 'info'
          })
          .then(response => {
            let userInfo = JSON.parse(JSON.stringify(rootState.apply.userInfo));
            userInfo = Object.assign(userInfo, response);
            commit('apply/setInfo', userInfo, {
              root: true
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    }
  }
};

export default user;
