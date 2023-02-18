/**
 * 查找函数
 * @param  {[type]} list [description]
 * @param  {[type]} f    [description]
 * @return {[type]}      [description]
 */
function find(list, f) {
  return list.filter(f)[0];
}

/**
 *考虑到圆形结构，深度复制给定对象。
 *这个函数缓存所有嵌套的对象及其副本。
 *如果检测到循环结构，使用缓存副本避免无限循环。
 * @param  {[type]} obj   [description]
 * @param  {Array}  cache [description]
 * @return {[type]}       [description]
 */
function copyData(obj, cache = []) {
  // 如果obj是不可变值，就返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 如果obj被击中，则为圆形结构
  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  //先把副本放到缓存里
  //因为我们想在copy_data递归中引用它
  cache.push({
    original: obj,
    copy
  });

  Object.keys(obj).forEach(key => {
    copy[key] = copyData(obj[key], cache);
  });

  return copy;
}

/**
 * 特殊字符转义
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function filter(str) {
  str += ''; // 隐式转换
  str = str.replace(/%/g, '%25');
  str = str.replace(/\+/g, '%2B');
  str = str.replace(/ /g, '%20');
  str = str.replace(/\//g, '%2F');
  str = str.replace(/\?/g, '%3F');
  str = str.replace(/&/g, '%26');
  str = str.replace(/\=/g, '%3D');
  str = str.replace(/#/g, '%23');
  return str;
}

/**
 * 处理对象转URL参数
 * @param  {[type]} paramObj [description]
 * @return {[type]}          [description]
 */
function formateObjToParamStr(paramObj) {
  const sdata = [];
  for (let attr in paramObj) {
    sdata.push(`${attr}=${filter(paramObj[attr])}`);
  }
  return sdata.join('&');
}

/**
 * 控制台打印内容
 * @param {string} msg 内容
 * @param {string} action ['log'] 打印类型
 * @param {never}
 */
function print(msg, action = 'log') {}

/**
 * 判断错误对象是否是由`Error`对象实例化出来的
 * @param {Error|Object} errObj
 * @return {boolean}
 */
function isError(errObj) {
  return Object.prototype.toString.call(errObj).includes('Error');
}

/**
 * 获取并封装当前路由栈的信息
 * @return {Object}
 */
function getCurStack() {
  const stackAll = getCurrentPages();
  const stackLen = stackAll.length;

  // 跳过路由栈为空的情况(App端)
  if (stackLen === 0) {
    return false;
  }

  const curStack = stackAll[stackLen - 1];
  const from = { path: '/' + curStack.route };

  return from;
}

/**
 * 注册 钩子
 * @param {Function[]} list 钩子列表
 * @param {Function} callback 回调函数
 * @returns {Function} 用于注销当前注册钩子的闭包函数
 */
function registerHook(list, callback) {
  list.push(callback);

  return () => {
    const index = list.indexOf(callback);

    if (index !== -1) list.splice(index, 1);
  };
}

/**
 * 处理URL地址信息
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */
const pushTo = function (option) {
  if (typeof option === 'object') {
    let { method, path, params } = option;
    // 对首次进入页面执行路由守卫时如果放行，method path params都为空 此时应该直接中断流程，无需抛出异常
    if (!path && !params) {
      return option;
    }
    let urlParams = '?';
    if (!path) {
      reject(new Error('参数page未填写'));
      return;
    } else if (params && typeof params === 'object') {
      // 处理参数，转换为url字符串
      Object.keys(params).forEach(k => {
        // 深度对象转为json字符串（包含数组）
        if (typeof params[k] === 'object') {
          if (params[k]) {
            const json = JSON.stringify(params[k]);
            urlParams += `${k}=${json}&`;
          } else {
            urlParams += `${k}=&`;
          }
        } else if (typeof params[k] === 'number' || typeof params[k] === 'string' || typeof params[k] === 'boolean') {
          // 基础值直接写入
          urlParams += `${k}=${params[k]}&`;
        } else if (typeof params[k] === 'undefined') {
          urlParams += `${k}=&`;
        }
      });
    }

    // 设置路由跳转方式
    if (!method) {
      method = 'navigateTo';
    }

    // 参数组装
    if (urlParams.length === 1) {
      urlParams = '';
    } else {
      urlParams = urlParams.substr(0, urlParams.length - 1);
    }

    return {
      method: method,
      url: path + urlParams
    };
  } else {
    return {
      method: 'navigateTo',
      url: option
    };
  }
};

export default {
  copyData,
  formateObjToParamStr,
  print,
  isError,
  getCurStack,
  registerHook,
  pushTo
};
