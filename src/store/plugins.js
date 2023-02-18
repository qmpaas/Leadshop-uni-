const plugins = {
  namespaced: true,
  state: {
    /**
     * 插接列表信息
     * @type {Boolean}
     */
    pluginsList: {}
  },
  mutations: {
    /**
     * 设置插件列表数据
     * @param {[type]} state [description]
     * @param {[type]} data  [description]
     */
    setPlugins(state, data) {
      state.pluginsList = data;
    }
  },
  getters: {
    /**
     * 判断是否安装
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    is_install: state => name => {
      return state.todos.find(todo => todo.name === name);
    },
    /**
     * 获取插件配置信息
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    manifest:
      state =>
      (name, keys = '') => {
        if (state.pluginsList[name]) {
          if (keys) {
            return state.pluginsList[name][keys];
          } else {
            return state.pluginsList[name];
          }
        } else {
          return false;
        }
      }
  },
  actions: {
    /**
     * 读取异步配置信息
     * 处理插件信息异步获取，需要存缓存的
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    getPlugins: function ({ commit }) {
      let $heshop = this._vm.$heshop;
      let $storageKey = this._vm.$storageKey;

      $heshop
        .plugin('get', { include: 'empty', model: 'empty' })
        .then(function (res) {
          commit('setPlugins', res);
          // uni.setStorageSync($storageKey.plugins, res);
        })
        .catch(function () {});
      // if (uni.getStorageSync($storageKey.plugins)) {
      //   commit('setPlugins', uni.getStorageSync($storageKey.plugins));
      // } else {
      //   $heshop.plugin('get', { include: 'empty', model: 'empty' }).then(function(res) {
      //     commit('setPlugins', res);
      //     uni.setStorageSync($storageKey.plugins, res);
      //   }).catch(function(err) {
      //   });
      // }
    },
    /**
     * 分享转发
     * @return {[type]} [description]
     */
    onShare: function ({ state, commit }) {
      let config = state.pluginsList['task']['share'];
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: 1,
              keyword: 'share'
            }
          )
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * 邀请执行
     * @param  {[type]} options.state  [description]
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    onInvite: function ({ state, commit }, { UID }) {
      let config = state.pluginsList['task']['share'];
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: UID,
              keyword: 'invite'
            }
          )
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * 商品浏览信息
     * @return {[type]} [description]
     */
    onBrowse: function ({ state, commit }) {
      let config = state.pluginsList['task']['share'];
      let $heshop = this._vm.$heshop;
      /**
       * 处理异步获取方法
       * @param  {[type]} (resolve, reject        [description]
       * @return {[type]}           [description]
       */
      return new Promise((resolve, reject) => {
        $heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: 1,
              keyword: 'browse'
            }
          )
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 分销商绑定上级
    bindPromoterSuperior({}, { parent_id }) {
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .promoter('get', {
            behavior: 'bind',
            parent_id: parent_id
          })
          .then(() => {
            resolve();
          })
          .catch(reject);
      });
    }
  }
};

export default plugins;
