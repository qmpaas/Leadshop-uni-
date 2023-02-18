import Vuex from 'vuex';
import apply from './apply';
import getters from './getters.js';

const initStore = (StoreMap = {}, getterMap = {}) => {
  StoreMap['apply'] = apply;
  for (let i in getters) {
    getterMap[i] = getters[i];
  }
  // 执行Vuex
  let Store = new Vuex.Store({
    modules: StoreMap,
    state: {},
    mutations: {},
    actions: {},
    getters: getterMap
  });
  return Store;
};

export default initStore;
