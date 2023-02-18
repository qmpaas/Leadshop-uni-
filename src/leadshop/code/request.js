import Vue from 'vue';
import axios from './axios.js';
import cache from './cache.js';

export default function server(options, instance) {
  //设置初始化URL
  axios.defaults.baseURL = options.AppURL;
  //开启Session存储
  axios.defaults.withCredentials = true;
  // 此时超时配置的默认值是 `0`
  let cloud = axios.create();
  // 覆写库的超时默认值
  // 现在，在超时前，所有请求都会等待 2.5 秒
  cloud.defaults.timeout = 10000;
  // 防止重复
  cloud.defaults.retry = 1;
  /**
   * 添加请求拦截器
   * @param  {[type]} config)
   * @param  {[type]} function (error)
   * @return {[type]}          [description]
   */
  cloud.interceptors.request.use(
    config => {
      let token = cache.get('token') || '';
      //设置请求头
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
        config.headers['token'] = 'Bearer ' + token;
      }
      config.headers['QM-APP-TYPE'] = options.AppType;
      config.headers['QM-APP-ID'] = options.AppID;
      config.headers['QM-APP-SECRET'] = options.AppSecret;
      //返回配置信息
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  /**
   * 添加响应拦截器
   * @param  {[type]} response)
   * @param  {[type]} function  (error)
   * @return {[type]}           [description]
   */
  cloud.interceptors.response.use(
    response => {
      if (response.status >= 200 && response.status < 300) {
        if (
          response.headers?.hasOwnProperty('x-pagination-total-count') ||
          response.headers?.hasOwnProperty('X-Pagination-Total-Count')
        ) {
          return response;
        }
        return response.data;
      }
      //处理提示错误
      else {
        return Promise.reject(res);
      }
    },
    error => {
      let response = error.response;
      if (response.status == 419 || response.status == 401) {
        //判断Token存在的情况下
        if (cache.get('token')) {
          //用于清除Token
          cache.remove('token');
          cache.remove('userInfo');
          //重新加载当前页面
          options.redLoadFun();
        } else {
          return Promise.reject(error.response);
        }
      } else if (response.status == 420) {
        if (cloud.defaults.retry) {
          //保存原始数据
          let config = error.config;
          let original = JSON.stringify(config);
          //执行重置请求
          let response = error.response;
          let loginReset = options.AppConfig.loginReset || '';
          config.url = loginReset;
          config.data = {
            token: cache.get('token') || ''
          };
          cache.set('token', '');
          config.headers.Authorization ? delete config.headers.Authorization : '';
          config.headers.Token ? delete config.headers.Token : '';
          config.method = 'post';
          //执行处理
          cloud.defaults.retry = 0;
          cloud(config)
            .then(data => {
              cloud.defaults.retry = 1;
              if (data && data.token) {
                cache.set('token', data.token);
                //重新加载当前页面
                options.redLoadFun();
              }
            })
            .catch(error => {
              //判断Token存在的情况下
              if (cache.get('token')) {
                //用于清除Token
                cache.remove('token');
                cache.remove('userInfo');
                //重新加载当前页面
                options.redLoadFun();
              } else {
                return Promise.reject(error.response);
              }
            });
        }
      } else if (response.status == 416) {
        return Promise.reject(error.response);
      } else {
        //网络错误
        //网络开小差了，请刷新重试哦~
        //复制错误 刷新页面
        if (options.ErrorFun && typeof options.ErrorFun === 'function') {
          options.ErrorFun(error);
        }
        return Promise.reject(error.response);
      }
    }
  );

  return cloud;
}
