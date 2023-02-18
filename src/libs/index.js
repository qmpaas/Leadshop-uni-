import mixin from './mixin/mixin.js';

import timeFormat from './function/timeFormat.js';
import test from './function/test.js';
import debounce from './function/debounce.js';
import floatPrice from './function/floatPrice';
import addUnit from './function/addUnit.js';
import guid from './function/guid.js';
import toast from './function/toast.js';
import srcToBase64 from './function/srcToBase64';
import MPageNavigate from './function/MPageNavigate';
// #ifdef H5
import setTabBarItem from './function/setTabBarItem';
import getQueryVariable from './function/getQueryVariable';
// #endif
import $parent from './function/$parent.js';
import getSceneVariable from './function/getSceneVariable';
const $h = {
  timeFormat: timeFormat,
  floatPrice,
  test,
  debounce,
  addUnit,
  guid,
  toast,
  srcToBase64,
  MPageNavigate,
  $parent,
  // #ifdef H5
  setTabBarItem,
  getQueryVariable,
  // #endif
  getSceneVariable
};

uni.$h = $h;

const install = Vue => {
  Vue.mixin(mixin);
  Vue.filter('timeFormat', (timestamp, format) => {
    return timeFormat(timestamp, format);
  });
  Vue.filter('floatPrice', num => {
    return floatPrice(num);
  });
  Vue.prototype.$h = $h;
  Vue.prototype.theme = '';
};

export default {
  install
};
