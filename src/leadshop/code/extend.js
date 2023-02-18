import utils from './utils.js';
import cache from './cache.js';

const env = process.env.VUE_APP_PLATFORM;

/**
 * 默认
 * @type {Object}
 */
export const defaulter = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      method,
      headers,
      argument,
      data,
      keys,
      page,
      parameter = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    method = argument[0].toLowerCase();
    //判断是否存在分页
    if (page) {
      if (page.page && page.size) {
        page = page;
      } else {
        page = {
          page: page[0],
          size: page[1]
        };
      }
      //删除最后一个元素，防止被拼接到地址栏
      keys.pop();
    }
    //处理URL信息
    url = '/app/' + config.AppName + '/' + keys.join('/');

    //判断你输出类型
    switch (method) {
      case 'post':
        //如果有三个参数
        if (Object.keys(argument).length == 2) {
          //默认数据情况
          data = argument[1];

          //处理分页信息
          if (page) {
            if (config.AppConfig.pagination == 'header') {
              headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
              parameter = { page: page.page };
            } else {
              parameter = { 'page[number]': page.page, 'page[size]': page.size };
            }
            url += is_router + utils.formateObjToParamStr(parameter);
          }
        }
        //如果有三个参数
        if (Object.keys(argument).length == 3) {
          //处理分页信息
          if (page) {
            if (config.AppConfig.pagination == 'header') {
              headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
            }
          }
          //第一个参数为
          if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
            if (page) {
              if (config.AppConfig.pagination == 'header') {
                argument[1] = Object.assign(argument[1], { page: page.page });
              } else {
                argument[1] = Object.assign(argument[1], { 'page[number]': page.page, 'page[size]': page.size });
              }
            }
            url += is_router + utils.formateObjToParamStr(argument[1]);
          }
          //第二个作为提交数据
          if (Object.prototype.toString.call(argument[2]) == '[object Object]') {
            data = argument[2];
          }
        }
        break;
      case 'delete':
        if (Object.keys(argument).length >= 2) {
          //如果作为数组，则是批量删除
          if (Object.prototype.toString.call(argument[1]) == '[object Array]') {
            url += '/' + argument[1].toString();
          }
          //如果作为数字单个删除
          if (Object.prototype.toString.call(argument[1]) == '[object Number]') {
            url += '/' + argument[1];
          }
        }
        //如果作为参数，则作为条件
        if (Object.keys(argument).length == 3) {
          if (Object.prototype.toString.call(argument[2]) == '[object Object]') {
            url += is_router + utils.formateObjToParamStr(argument[2]);
          }
        }
        break;
      case 'get':
        // //处理分页信息
        // if (page) {
        //     if (config.AppConfig.pagination == 'header') {
        //         headers = { "Content-Type": "application/json", 'X-Pagination-Per-Page': page.size };
        //     } else {
        //         argument[1] = { 'page[number]': page.page, 'page[size]': page.size }
        //     }
        if (Object.keys(argument).length == 1) {
          //处理分页信息
          if (page) {
            if (config.AppConfig.pagination == 'header') {
              headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
              parameter = { page: page.page };
            } else {
              parameter = { 'page[number]': page.page, 'page[size]': page.size };
            }
            url += is_router + utils.formateObjToParamStr(parameter);
          }
        }
        if (Object.keys(argument).length >= 2) {
          //如果参数为数字，则获取单个
          if (Object.prototype.toString.call(argument[1]) == '[object Number]') {
            url += '/' + argument[1];
            if (page) {
              argument[2] = argument[2] || {};
              if (config.AppConfig.pagination == 'header') {
                headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
                argument[2] = Object.assign(argument[2], { page: page.page });
              } else {
                argument[2] = Object.assign(argument[2], { 'page[number]': page.page, 'page[size]': page.size });
              }
            }
          }
          //如果作为对象，则表示分页获取
          if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
            if (page) {
              if (config.AppConfig.pagination == 'header') {
                headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
                argument[1] = Object.assign(argument[1], { page: page.page });
              } else {
                argument[1] = Object.assign(argument[1], { 'page[number]': page.page, 'page[size]': page.size });
              }
            }
            url += is_router + utils.formateObjToParamStr(argument[1]);
          }
        }
        //如果有第三个参数，则作为获取条件
        if (Object.keys(argument).length == 3) {
          if (Object.prototype.toString.call(argument[2]) == '[object Object]') {
            url += is_router + utils.formateObjToParamStr(argument[2]);
          }
        }
        break;
      case 'put':
        if (Object.keys(argument).length >= 2) {
          //当为对象时就做为条件输出
          if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
            if (argument[1].id) {
              if (Object.prototype.toString.call(argument[1].id) == '[object Array]') {
                url += '/' + argument[1].id.toString();
              } else {
                url += '/' + argument[1].id;
              }
              delete argument[1].id;
            }
            url += is_router + utils.formateObjToParamStr(argument[1]);
          }
          //当为数组时就作为更新内容
          if (Object.prototype.toString.call(argument[1]) == '[object Array]') {
            if (Object.prototype.toString.call(argument[1][0]) == '[object Number]') {
              url += '/' + argument[1].toString();
            } else {
              data = argument[1];
            }
          }
          //当为数字时就作为单条更新
          if (Object.prototype.toString.call(argument[1]) == '[object Number]') {
            url += '/' + argument[1];
          }
        }
        if (Object.keys(argument).length == 3) {
          data = argument[2];
        }
        break;
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
    //处理数据
  },
  afterEach(data, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(data);
  }
};

/**
 * 用户登录
 * @type {Object}
 */
export const login = {
  beforeEach(value, resolve, config) {
    //设置唯一Key
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    let url = config.AppConfig.loginURL;
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
      url += is_router + utils.formateObjToParamStr(argument[1]);
    } else {
      url += is_router + 'type=' + argument[1];
    }
    resolve({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: argument[2]
    });
  },
  afterEach(value, resolve) {
    cache.set('token', value.token || '');
    cache.set('userInfo', value || '');
    resolve(value);
  }
};

/**
 * 用户退出
 * @type {Object}
 */
export const logout = {
  beforeEach(value, resolve) {
    cache.remove('token');
    cache.remove('userInfo');
    resolve(false);
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * POST
 * @type {Object}
 */
export const POST = {
  beforeEach(value, resolve) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    method = 'POST';
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = argument[0];
    //默认数据情况
    data = argument[1];
    //如果有三个参数
    if (Object.keys(argument).length == 3) {
      //第一个参数为
      if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
      //第二个作为提交数据
      if (Object.prototype.toString.call(argument[2]) == '[object Object]') {
        data = argument[2];
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * GET
 * @type {Object}
 */
export const GET = {
  beforeEach(value, resolve) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    method = 'GET';
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //判断是否存在分页
    if (page) {
      if (page.page && page.size) {
        page = page;
      } else {
        page = {
          page: page[0],
          size: page[1]
        };
      }
      //删除最后一个元素，防止被拼接到地址栏
      keys.pop();
    }
    //处理URL信息
    url = argument[0];
    //处理分页信息
    if (page) {
      headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
      argument[1] = { page: page.page };
    }
    if (Object.keys(argument).length >= 2) {
      //如果参数为数字，则获取单个
      if (Object.prototype.toString.call(argument[1]) == '[object Number]') {
        url += '/' + argument[1];
      }
      //如果作为对象，则表示分页获取
      if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
    }
    //如果有第三个参数，则作为获取条件
    if (Object.keys(argument).length == 3) {
      if (Object.prototype.toString.call(argument[2]) == '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[2]);
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 用户退出
 * @type {Object}
 */
export const PUT = {
  beforeEach(value, resolve) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    method = 'POST';
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = argument[0];
    if (Object.keys(argument).length >= 2) {
      //当为对象时就做为条件输出
      if (Object.prototype.toString.call(argument[1]) == '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
      //当为数组时就作为更新内容
      if (Object.prototype.toString.call(argument[1]) == '[object Array]') {
        data = argument[1];
      }
      //当为数字时就作为单条更新
      if (Object.prototype.toString.call(argument[1]) == '[object Number]') {
        url += '/' + argument[1];
      }
    }
    if (Object.keys(argument).length == 3) {
      data = argument[2];
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 用户退出
 * @type {Object}
 */
export const DELETE = {
  beforeEach(value, resolve) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    method = 'POST';
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = argument[0];
    if (Object.keys(argument).length >= 2) {
      //如果作为数组，则是批量删除
      if (Object.prototype.toString.call(argument[1]) == '[object Array]') {
        url += '/' + JSON.stringify(argument[1]);
      }
      //如果作为数字单个删除
      if (Object.prototype.toString.call(argument[1]) == '[object Number]') {
        url += '/' + argument[1];
      }
    }
    //如果作为参数，则作为条件
    if (Object.keys(argument).length == 3) {
      if (Object.prototype.toString.call(argument[2]) == '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[2]);
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 用户注册
 * @type {Object}
 */
export const register = {
  beforeEach(value, resolve) {
    //throw new Error("测试API件或无module.exports输出");
    resolve(value);
  },
  afterEach(value, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(value);
  }
};

/**
 * 重置Token
 * @type {Object}
 */
export const reset = {
  beforeEach(data, resolve) {
    //throw new Error("测试API件或无module.exports输出");
    resolve(data);
  },
  afterEach(data, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(data);
  }
};

/**
 * 文件上传
 * @type {Object}
 */
export const upload = {
  beforeEach(value, resolve, config) {
    //处理URL信息
    let url = '/app/' + config.AppName + '/upload';
    //设置唯一Key
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    let content = argument[0] || '';
    let type = argument[1] || 1;
    resolve({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        type: type,
        content: content
      }
    });
  },
  afterEach(value, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(value);
  }
};

/**
 * 文件上传
 * @type {Object}
 */
export const uploadVideo = {
  beforeEach(value, resolve, config) {
    //处理URL信息
    let url = '/app/' + config.AppName + '/upload';
    //设置唯一Key
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    let content = argument[0] || '';
    resolve({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: {
        type: 2,
        content: content
      }
    });
  },
  afterEach(value, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(value);
  }
};
/**
 * 支付
 * @type {Object}
 */
export const pay = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    method = 'GET';
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = '/app/' + config.AppName + '/pay';
    if (Object.keys(argument).length == 1) {
      //如果参数为数字，则获取单个
      if (Object.prototype.toString.call(argument[0]) == '[object Number]') {
        url += '/' + argument[0];
      }
      //如果作为对象，则表示分页获取
      if (Object.prototype.toString.call(argument[0]) == '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[0]);
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve, reject) {
    if (value & !value.timeStamp) {
      resolve(value);
    }
    if (env == 'h5') {
      resolve(value);
    } else {
      console.log(value)
      if (typeof value.orderInfo !== 'undefined') {
        console.log('requestPayment')
        wx.requestOrderPayment({
          ...value,
          success: function (res) {
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          }
        });
      } else {
        console.log('requestOrderPayment')
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: value.timeStamp,
          nonceStr: value.nonceStr,
          package: value.package,
          signType: value.signType,
          paySign: value.paySign,
          success: function (res) {
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          }
        });
      }
    }
  }
};
