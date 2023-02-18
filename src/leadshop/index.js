import utils from './code/utils.js';
import cloud from './code/cloud.js';
import api from './code/api.js';
import storeMap from './store';
import routeMap from './router';

export default class heshop {
  /**
   * 错误处理
   * @return {[type]} [description]
   */
  static error(data) {
    if (data) {
    }
  }

  /**
   * 处理路由
   * @param  {Array}  routes [description]
   * @return {[type]}        [description]
   */
  static router(routes = []) {
    // 执行路由函数
    return routeMap.apply(this, [routes, this]);
  }

  /**
   * 处理Vuex
   * @param  {[type]} route [description]
   * @return {[type]}       [description]
   */
  static store(StoreMap = {}, getterMap = {}) {
    return storeMap(StoreMap, getterMap);
  }

  /**
   * 数据库初始化，并取得数据库类实例
   * @access public
   * @param  mixed       config 连接配置
   * @param  bool|string name   连接标识 true 强制重新连接
   * @return Connection
   * @throws Error
   */
  static connect(config = {}) {
    try {
      if (config.AppID == '') {
        throw new Error('AppID不能为空');
      }
      if (config.AppSecret == '') {
        throw new Error('AppSecret不能为空');
      }
      if (config.AppName == '') {
        throw new Error('AppSecret不能为空');
      }
      if (config.AppType == '') {
        throw new Error('AppType不能为空');
      }
      if (config.AuthSign == '') {
        config.AuthSign = false;
      }
      if (config.AppURL == '') {
        throw new Error('AppURL不能为空');
      }
      if (!config.AppConfig) {
        config.AppConfig = {
          whiteList: null,
          autoToken: null,
          defaultRoute: null
        };
      }
      if (!this.instance) {
        this.instance = [];
      }
      if (this.instance.indexOf(config.AppID) === -1) {
        this.instance[config.AppID] = this.get_proxy(config);
      }
      this.config = config;
      return this.instance[config.AppID];
    } catch (error) {}
  }

  /**
   * 异步获取对应应用
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  static get_proxy(config) {
    let _Proxy = new Proxy(new cloud(config, this), {
      _upload: false,
      _validator: {},
      //此处不能使用()=> 否者会导致get方法内的this指向为basics从而this._validator获取失败
      get: function (target, property, receiver) {
        if (property in target) {
          return target[property];
        } else {
          if (property == 'then') {
            //获取所有参数值
            let data = utils.copyData(this._validator);
            //清空
            this._validator = {};
            //执行最终操作
            return argument => {
              // receiver等于当前new cloud()实例
              // 执行操作
              let returned = new Promise((reslove, reject) => {
                new api(data, receiver)
                  .then(data => {
                    reslove(data);
                  })
                  .catch(error => {
                    reject(error);
                  });
              });
              //处理前置数据
              return returned.then(reverse => {
                return argument(reverse);
              });
            };
          } else if (property) {
            let self = this;
            if (property == 'upload') {
              self._upload = true;
            }
            //此处匿名函数不能使用()=>,会导致内部arguments指向的是上一层
            return function () {
              self._validator[property] = arguments || '';
              return _Proxy;
            };
          } else {
          }
        }
      }
    });
    return _Proxy;
  }
}
