/*
 * @Author: qinuoyun
 * @Date:   2021-06-09 14:55:57
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-06-09 15:05:41
 */

const store = {
  namespaced: true,
  /**
   * 异步数据方法
   * @type {Object}
   */
  actions: {
    /**
     * 设置任务记录
     */
    setTaskLog({ commit, state }, products) {
      let $heshop = this._vm.$heshop;
      /**
       * 执行数据提交
       * @param  {[type]} res [description]
       * @return {[type]}     [description]
       */
      $heshop
        .plugin('post', { include: 'task', model: 'user' }, products)
        .then(res => {})
        .catch(err => {
          this.$message.error('添加失败，请检查网络');
        });
    }
  }
};

export default store;
