/**
 * hack uniapp的路由函数b
 * @param {Function} callback
 * @return {never}
 */

import utils from '../../code/utils';

export const hackUniRoute = function (callback) {
  // 路由跳转的函数key值
  const UNI_ROUTE_ACTIONS = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

  // 函数缓存容器
  const cacheFunc = {};

  // 保存原函数引用
  UNI_ROUTE_ACTIONS.forEach(key => {
    cacheFunc[key] = uni[key];
  });

  const toPath = function (key, opts) {
    let url = opts.url;
    let params = {};
    let arr = opts.url ? opts.url.split('?') : [];
    if (arr[1]) {
      url = arr[0];
      arr = opts.url.split('?')[1].split('&');
      let theRequest = new Object();
      for (let i = 0; i < arr.length; i++) {
        let kye = arr[i].split('=')[0];
        let value = arr[i].split('=')[1];
        // 给对象赋值
        theRequest[kye] = value;
      }
      params = theRequest;
    }

    return {
      path: url,
      params: params,
      method: key
    };
  };

  // 重写方法
  UNI_ROUTE_ACTIONS.forEach(key => {
    uni[key] = (opts, routeGuardsOpts) => {
      // 取消拦截并直接运行
      if (routeGuardsOpts === false) {
        cacheFunc[key](opts);
      } else {
        // 处理所有钩子
        const newOpts = toPath(key, opts);
        const actionFunc = function (customOpts) {
          const lastOpts = Object.assign(newOpts, customOpts);
          const param = utils.pushTo(lastOpts);
          param.success = function (data) {
            opts.success ? opts.success(data) : '';
          };
          param.fail = function (error) {
            opts.fail ? opts.fail(error, opts) : console.log(error);
          };
          cacheFunc[param.method](param);
        };
        callback.call(this, newOpts, actionFunc);
      }
    };
  });
};
