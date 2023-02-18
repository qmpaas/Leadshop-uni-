<template>
  <view class="he-page-content" :data-theme="theme" :class="loading ? 'flex justify-center align-center' : ''">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <template v-else>
      <template v-if="status === 1">
        <view @click="routerApply">
          <he-rich v-if="content" :content="content" :preview-img="false" :lazy-load="true"></he-rich>
        </view>
      </template>
      <view v-else-if="status === 0" class="he-result--box flex flex-direction align-center">
        <image class="he-image" :src="ipAddress + '/promoter/stop-appley.png'"></image>
        <text class="he-text">来晚了，商家已暂停招募</text>
        <button class="cu-btn he-go-btn" @click="routerIndex">去逛逛</button>
      </view>
      <template v-else-if="status === 2">
        <he-no-content-yet
          :image="ipAddress + '/already-distributor.png'"
          text="您已是分销商，正在为您跳转分销商中心..."
        ></he-no-content-yet>
      </template>
      <template v-else-if="status === 3">
        <he-no-content-yet
          :image="ipAddress + '/query-result.png'"
          text="您已提交申请，正在为您查看审核结果..."
        ></he-no-content-yet>
      </template>
      <HeLoginModel />
    </template>
  </view>
</template>

<script>
import { applyPromoter, receiveRecruitToken, recruit } from '../api';
import heRich from './../../components/he-html/he-html.vue';
import heLoading from '../../components/he-loading.vue';
import heNoContentYet from '../../components/he-no-content-yet.vue';
import HeLoginModel from '../../components/he-login-layout.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'recruit',
  components: {
    heRich,
    heLoading,
    heNoContentYet,
    HeLoginModel
  },
  data() {
    return {
      content: '',
      // #ifndef H5
      finishRead: false,
      // #endif
      // #ifdef H5
      finishRead: true,
      // #endif
      status: 0,
      loading: true,
      shareOpen: true
    };
  },
  computed: {
    ...mapGetters('setting', {
      // 获取分销设置
      promoterSetting: 'getPromoter'
    }),
    shareData({ ipAddress, $store }) {
      let imageUrl = '';
      // #ifndef H5
      imageUrl = `${ipAddress}/share-join-promoter.png`;
      // #endif
      // #ifdef H5
      imageUrl = `${ipAddress}/share-join-promoter-icon.png`;
      // #endif
      let id = 0;
      if ($store.state.apply.userInfo.promoter_status === 2) {
        id = $store.state.apply.userInfo.id;
      }
      return {
        title: `推广商品，赚佣金！`,
        path: `/promoter/pages/recruit?invite_id=${id}`,
        imageUrl: imageUrl,
        // #ifdef H5
        desc: '欢迎加入我们的分销团队，一起赚佣金'
        // #endif
      };
    }
  },
  async onLoad(option) {
    // #ifdef H5
    this.$wechat.updateShareData(this.shareData);
    // #endif
    const response = await recruit();
    uni.setNavigationBarTitle({
      title: response.title
    });
    this.content = response.content;
    const { status, center_show } = this.promoterSetting;
    this.status = status;
    if (this.status === 0) {
      this.loading = false;
      return;
    }
    const { is_login, userInfo } = this.$store.state.apply;
    const { promoter_status } = userInfo;
    // 不是2 或者没有登入
    if (promoter_status === 2) {
      this.status = 2;
      this.loading = false;
      setTimeout(() => {
        uni.redirectTo({
          url: '/promoter/pages/index'
        });
      }, 2000);
    } else {
      if (is_login) {
        await this.$store.dispatch('user/getUserInfo');
        // 海报进入 分享进入 向所有人开放
        if (option.scene || option.invite_id || center_show === 2) {
          // 普通用户 和 清退用户 通过海报可以再次获取招募令
          if (promoter_status === 4 || promoter_status === 0 || promoter_status === -1 || promoter_status === -2) {
            let invite_id = undefined;
            if (option.invite_id) {
              invite_id = option.invite_id;
            } else if (option.scene) {
              const scene = decodeURIComponent(option.scene);
              invite_id = this.$h.getSceneVariable(scene, 'invite_id');
            }
            // 接招募令
            await receiveRecruitToken(invite_id ? invite_id : 0);
            let status = promoter_status;
            if (promoter_status === 4) {
              status = -2;
            } else {
              status = -1;
            }
            this.$store.state.apply.userInfo.promoter_status = status;
            let userInfo = uni.getStorageSync('userInfo');
            userInfo.promoter_status = status;
            uni.setStorageSync('userInfo', userInfo);
          }
          // 待审核 已拒绝 用户去结果页面
          if (promoter_status === 1 || promoter_status === 3) {
            this.status = 3;
            this.loading = false;
            setTimeout(() => {
              uni.redirectTo({
                url: '/promoter/pages/apply'
              });
            }, 2000);
            return;
          }
        }
      } else {
        // #ifdef H5
        this.$store.commit('apply/setLoginModel', true);
        // #endif
      }
      this.loading = false;
    }
  },
  // 页面滚动到底部 可以跳转
  onReachBottom() {
    this.finishRead = true;
  },
  methods: {
    routerApply() {
      if (this.finishRead) {
        const { conditions, need_apply } = this.promoterSetting;
        // need_apply 申请信息  0无需填写  1需填写
        // conditions.type 满足条件 1无条件  2累计消费金额  3累计消费次数  4购买任意商品   5购买指定商品
        // 无需填写 没有条件 但是需要审核
        if (conditions.type === 1 && !need_apply) {
          // 申请分销商
          applyPromoter().then(response => {
            let userInfo = uni.getStorageSync('userInfo');
            const { status } = response;
            // status 1 待审核
            userInfo.promoter_status = status;
            this.$store.state.apply.userInfo.promoter_status = status;
            uni.setStorageSync('userInfo', userInfo);
            // 跳转分销申请结果页面
            uni.redirectTo({
              url: '/promoter/pages/apply'
            });
          });
        } else {
          uni.navigateTo({
            url: '/promoter/pages/apply'
          });
        }
      }
    },
    // 跳转到首页
    routerIndex() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  },
  // #ifndef H5
  onShareAppMessage() {
    return this.$shareAppMessage(this.shareData);
  },
  onShareTimeline() {
    return this.$shareAppMessage(this.shareData);
  }
  // #endif
};
</script>

<style scoped lang="scss">
@import './../main.less';

.he-page-content {
  overflow: hidden;

  /deep/ .he-no-content-yet {
    color: #222222;
  }
}

.he-result--box {
  padding-top: 160px;

  .he-image {
    width: 317px;
    height: 320px;
  }

  .he-text {
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #222222;
    line-height: 34px;
  }

  .he-go-btn {
    height: 80px;
    @include background_color('background_color');
    border-radius: 40px;
    padding: 26px 80px;
    font-size: 28px;
    @extend .font-family-sc;
    font-weight: 500;
    color: #ffffff;
    margin-top: 45px;
  }
}
</style>
