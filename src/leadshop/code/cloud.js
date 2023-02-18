import utils from './utils.js';
import request from './request';
import listToTree from './listToTree.js';
import md5 from './md5.js';

class cloud {
  //构造函数
  constructor(config, self) {
    this.self = self;
    this.utils = utils;
    this.AppID = config.AppID;
    this.AppName = config.AppName;
    this.AppType = config.AppType;
    this.AppURL = config.AppURL;
    this.ErrorFun = config.ErrorFun || false;
    this.redLoadFun = config.redLoadFun || false;
    this.AppConfig = this.extend(
      {
        whiteList: null,
        pagination: 'header',
        autoToken: null,
        defaultRoute: null,
        loginReset: null,
        loginURL: '/app/' + config.AppName + '/login'
      },
      config.AppConfig
    );
    this.AppSecret = config.AppSecret;
    this.AuthSign = config.AuthSign || false;
    this.authorization = true;
    this.server = request(this, self.instance);
  }

  /**
   * 树结构处理
   * @param  {[type]} optiens [description]
   * @return {[type]}         [description]
   */
  toTree(optiens) {
    return new listToTree(optiens);
  }

  /**
   * 执行数据搜索
   * @param  {[type]} key   搜索的字段
   * @param  {[type]} value 搜索的数值
   * @return {[type]}       [description]
   */
  arraySearch(rawDat, key, value, is_full = true) {
    const greaterThanTen = rawData.filter(element => {
      if (is_full) {
        return element[key] == value;
      } else {
        let str = ['', ...value, ''].join('.*'); //转化成正则格式的字符串
        let reg = new RegExp(str); //正则
        return reg.test(element[key]); //去匹配待查询的字符串
      }
    });
    if (is_full && greaterThanTen.length) {
      return greaterThanTen[0];
    } else {
      return greaterThanTen;
    }
  }

  /**
   * MD5
   * @param {[type]} optiens [description]
   */
  MD5(optiens) {
    let s = '';
    if (Object.prototype.toString.call(optiens) == '[object Object]') {
      s = JSON.stringify(optiens);
    } else {
      s = String(optiens);
    }
    return md5(s);
  }

  /**
   * 对象覆盖合并
   * @param  {[type]} obj1 [description]
   * @param  {[type]} obj2 [description]
   * @return {[type]}      [description]
   */
  extend(obj1, obj2) {
    for (let obj in obj2) {
      obj1[obj] = obj2[obj];
    }
    return obj1;
  }
}

export default cloud;
