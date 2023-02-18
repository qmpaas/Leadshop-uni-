import Vue from 'vue';

const env = process.env.VUE_APP_PLATFORM;

import UniRouteGuards from './lib';

//加载vuex
import store from '../store';

Vue.use(UniRouteGuards);

const initRouter = (routerMap = {}, isCustom = false) => {
  const router = new UniRouteGuards();
  let whiteList = routerMap.whiteList || [];
  let loginPage = routerMap.loginPage || '';

  // 路由全局拦截器 在这里处理登录、授权等相关操作
  router.beforeEach((to, from, next) => {
    try {
      // 开启$store
      const $store = store();
      // 开启$Cloud
      const $heshop = router.app.$heshop;
      // 执行Token处理
      $store.commit('apply/getToken');
      // return;
      // 自定义模式不加载默认
      if (whiteList.length === 0) {
        if (isCustom) {
          // 设置白名单
          whiteList = $heshop.AppConfig.whiteList || [];
        } else {
          // 设置白名单
          whiteList = DefaultWhite.concat($heshop.AppConfig.whiteList || []);
        }
      }
      if (loginPage) {
        //判断用户是否登陆
        if ($store.getters.token) {
          if (to.path == loginPage) {
            next('/');
          } else {
            next();
          }
        } else {
          //处理白名单配置
          if (whiteList.includes(to.path)) {
            // 在免登录白名单，直接进入
            next();
          } else {
            let toPath = '/';
            if (to.path !== loginPage) {
              toPath = to.fullPath;
              $store.state.apply.showLoginModel = true;
              // next({
              //   path: loginPage,
              //   query: {
              //     redirect: toPath
              //   },
              //   method: 'switchTab'
              // });
            } else {
              next();
            }
          }
        }
      } else {
        next();
      }
    } catch (error) {}
  });

  // 路由后置拦截器
  router.afterEach(() => {});

  // 路由跳转出错处理
  router.onError(function (e) {});
};

export default initRouter;
