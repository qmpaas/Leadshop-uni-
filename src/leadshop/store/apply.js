import cache from '../code/cache.js';

const apply = {
  namespaced: true,
  state: {
    is_login: false,
    menus: [],
    userInfo: {},
    token: '',
    roles: '',
    showLoginModel: false,
    showInformationModal: false,
  },
  mutations: {
    login(state, provider) {
      if (provider) {
        state.is_login = true;
        state.token = provider.token || '';
        state.userInfo = provider;
      } else {
        state.token = '';
        state.is_login = false;
        state.userInfo = {};
      }
    },
    logout(state) {
      state.is_login = false;
      state.token = '';
      state.userInfo = {};
    },
    getToken(state) {
      let token = cache.get('token');
      let userInfo = cache.get('userInfo');
      if (token && userInfo) {
        state.is_login = true;
        state.token = token;
        state.userInfo = userInfo;
      } else {
        state.is_login = false;
        state.token = '';
        state.userInfo = {};
        cache.remove('token');
        cache.remove('userInfo');
      }
    },
    setMenu(state, provider) {
      state.menus = provider;
    },
    setLoginModel(state, data) {
      state.showLoginModel = data;
    },
    setInformationModel(state, data) {
      state.showInformationModal = data;
    },
    setInfo(state, data) {
      state.userInfo = data;
      uni.setStorageSync('userInfo', data);
    }
  },
  actions: {
    layout({ commit }) {
      commit('logout');
    }
  }
};

export default apply;
