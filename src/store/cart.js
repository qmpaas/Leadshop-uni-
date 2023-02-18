/*
 * @Description:
 * @Author: fjt
 * @Date: 2021-04-26 12:37:36
 * @LastEditTime: 2021-06-18 10:27:41
 * @LastEditors: fjt
 */
const cart = {
  namespaced: true,
  state: {
    cart_add: false,
    cart_num: false
  },
  mutations: {
    setCartAdd(state, data) {
      state.cart_add = data;
    },
    cartNum(state, data) {
      state.cart_num = data;
    }
  },
  getters: {
    getCartAdd: function (state) {
      return state.cart_add;
    }
  },
  actions: {
    getCartNumber: function ({}) {
      return new Promise((resolve, reject) => {
        let $heshop = this._vm.$heshop;
        $heshop
          .cart('get', {
            behavior: 'number'
          })
          .then(function (response) {
            resolve(response);
          })
          .catch(function () {
            reject();
          });
      });
    },
    setCartNumber: function ({ rootGetters, dispatch }) {
      let index = rootGetters['setting/getCartIndex'];
      if (index === -1) {
        return;
      }
      dispatch('getCartNumber').then(res => {
        if (res !== 0) {
          uni.setTabBarBadge({
            index: index,
            text: res + ''
          });
        } else {
          uni.removeTabBarBadge({
            index: index
          });
        }
      });
    }
  }
};

export default cart;
