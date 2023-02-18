const postfix = 'heshopCacheQinuoyun'; // 缓存前缀

export default class cache {
  /**
   * 设置缓存
   * @param  {[type]} key  [description]
   * @param  {[type]} data [description]
   * @param  {[type]} time [description]
   * @return {[type]}      [description]
   */
  static set(key, data, time = 2592000) {
    uni.setStorageSync(key, data);
    // var seconds = parseInt(time);
    // if (seconds > 0) {
    //   var timestamp = Date.parse(new Date());
    //   timestamp = timestamp / 1000 + seconds;
    //   uni.setStorageSync(key + postfix, timestamp + '');
    // } else {
    //   uni.removeStorageSync(key + postfix);
    // }
  }

  /**
   * 获取缓存
   * @param  {[type]} key [description]
   * @param  {[type]} def [description]
   * @return {[type]}     [description]
   */
  static get(key, def) {
    // var deadtime = parseInt(uni.getStorageSync(key + postfix));
    // if (deadtime) {
    //   if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
    //     if (def) {
    //       return def;
    //     } else {
    //       uni.removeStorageSync(key + postfix);
    //       return false;
    //     }
    //   }
    // }
    var res = uni.getStorageSync(key);
    if (res) {
      return res;
    } else {
      // if (def == undefined || def == '') {
      //   def = false;
      //   uni.removeStorageSync(key);
      // }
      // return def;
    }
  }

  /**
   * 移除缓存
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  static remove(key) {
    uni.removeStorageSync(key);
    uni.removeStorageSync(key + postfix);
  }

  /**
   * 清理缓存
   * @return {[type]} [description]
   */
  static clear() {
    uni.clearStorageSync();
  }
}
