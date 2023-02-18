import { hackUniRoute } from './hackRoute';
import { handleGlobalHooksQueue } from './handleHooks';
import utils from '../../code/utils';

const env = process.env.VUE_APP_PLATFORM;

export default class uniRouteGuards {
  constructor() {
    // 初始化数据
    this.beforeHooks = [];
    this.afterHooks = [];
    this.errorCbs = [];
    uniRouteGuards.$root = this;
    hackUniRoute.call(this, handleGlobalHooksQueue);
  }

  /**
   * 注册 全局前置守卫
   * @param {Function} callback 回调函数
   */
  beforeEach(callback) {
    return utils.registerHook(this.beforeHooks, callback);
  }

  /**
   * 注册 全局后置守卫
   * @param {Function} callback 回调函数
   */
  afterEach(callback) {
    return utils.registerHook(this.afterHooks, callback);
  }

  /**
   * 注册 错误回调
   * @param {Function} errCb 错误回调函数
   */
  onError(errCb) {
    return utils.registerHook(this.errorCbs, errCb);
  }

  /**
   * 返回APP数据
   * @return {[type]} [description]
   */
  setAdhibition(self) {
    this.app = self;
  }

  // 获取当前路由信息
  getCurrentRoute() {
    return this.route;
  }
}
// 路由对象属性定义
uniRouteGuards.$root = null;
// 定义VM应用
uniRouteGuards.app = null;

// 添加 Vue.use 功能
uniRouteGuards.install = function (Vue, opts = {}) {
  let that = this;
  Vue.mixin({
    onLoad: function (props) {
      let self = uniRouteGuards.$root;
      //传入VM应用数据
      self.setAdhibition(this);
      if (!self.getCurrentRoute()) {
        const newOpts = {
          method: 'navigateTo',
          path: '/' + getCurrentPages()[0].route
        };
        //执行跳转处理-方式初始化状态下，两次跳转
        const actionFunc = function (customOpts) {
          if (customOpts) {
            const lastOpts = Object.assign(newOpts, customOpts);
            const param = utils.pushTo(lastOpts);
            uni[param.method](param, false);
          }
        };
        //初始化执行路由信息
        handleGlobalHooksQueue.call(self, newOpts, actionFunc);
        //存储当前路由信息
        self.route = newOpts;
      }
    }
  });
};
