<template>
  <view class="he-page-content" :class="loading ? 'flex justify-center align-center' : ''">
    <he-loading size="50" mode="flower" v-if="loading"></he-loading>
    <scroll-view v-else :scroll-y="true" class="scroll-view">
      <image :src="ipAddress + '/promoter/grade-background.png'" class="grade-background"></image>
      <view class="avatar-box">
        <image :src="ipAddress + '/promoter/grade-avatar-wheat.png'" class="avatar-wheat"></image>
        <he-image
          class="avatar-image"
          :image-style="{
            borderRadius: '50%'
          }"
          :height="120"
          :width="120"
          :src="userInfo.avatar"
        ></he-image>
      </view>
      <view class="grade-name">{{ promoter.level_name }}</view>
      <view class="grade-banner">
        <swiper @change="change" previous-margin="56rpx" :style="{ height: '100%' }" next-margin="56rpx">
          <swiper-item
            :class="hCurrent == index ? 'swiper-item' : 'swiper-item-side'"
            class="he-swiper-item"
            v-for="(item, index) in level"
            :key="item.id"
          >
            <view
              class="he-list-wrap"
              :class="hCurrent == index ? 'item-img' : 'item-img-side'"
              :style="[
                {
                  margin: hCurrent !== index ? '0 24rpx' : 0
                },
                dontFirstAnimation ? 'animation: none;' : ''
              ]"
            >
              <view class="wrap--head">
                <text class="iconfont iconfenxiaozhuangshi"></text>
                <text class="head-title">{{ item.name }}</text>
                <text class="iconfont iconfenxiaozhuangshi"></text>
              </view>
              <view :class="hCurrent === index ? 'canvas' : 'canvas-side'">
                <levelCanvas :index="index" :info="item"></levelCanvas>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
      <view class="he-card" v-if="detail.is_auto === 1">
        <view class="card-head">
          <text class="head-title">{{ detail.name }}</text>
          <text class="head-condition">
            {{ detail.update_type === 1 ? '满足任意条件升级' : detail.update_type === 2 ? '满足全部条件升级' : '' }}
          </text>
        </view>
        <view class="card-item" v-if="detail.condition.all_children.checked">
          <view class="item-title">{{ promoterPage.grade_center.all_children }}</view>
          <view class="progress-bar">
            <view :style="[ratioStyle(detail, 'all_children_percent')]" class="progress-ratio"></view>
          </view>
          <view class="flex justify-between item-footer">
            <text>已达{{ detail.all_children }}人</text>
            <text>{{ detail.condition.all_children.num }}人</text>
          </view>
        </view>
        <view class="card-item" v-if="detail.condition.total_money.checked">
          <view class="item-title">{{ promoterPage.grade_center.sales_amount }}</view>
          <view class="progress-bar">
            <view :style="[ratioStyle(detail, 'total_money_percent')]" class="progress-ratio"></view>
          </view>
          <view class="flex justify-between item-footer">
            <text>已达￥{{ detail.total_money }}</text>
            <text>￥{{ detail.condition.total_money.num }}</text>
          </view>
        </view>
        <view class="card-item" v-if="detail.condition.total_bonus.checked">
          <view class="item-title">{{ promoterPage.grade_center.all_commission_amount }}</view>
          <view class="progress-bar">
            <view :style="[ratioStyle(detail, 'total_bonus_percent')]" class="progress-ratio"></view>
          </view>
          <view class="flex justify-between item-footer">
            <text>已达￥{{ detail.total_bonus }}</text>
            <text>￥{{ detail.condition.total_bonus.num }}</text>
          </view>
        </view>
      </view>
      <he-float-window pages-url="promoter"></he-float-window>
    </scroll-view>
  </view>
</template>

<script>
import { promoterlevel } from '../api';
import heLoading from '../../components/he-loading.vue';
import levelCanvas from './components/level-canvas.vue';
import heFloatWindow from '../../components/layout/he-float-window.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'grade',
  components: {
    heLoading,
    levelCanvas,
    heFloatWindow
  },
  data() {
    return {
      hCurrent: 0,
      loading: true,
      level: [],
      promoter: {},
      dontFirstAnimation: false
    };
  },
  computed: {
    // 进度条
    ratioStyle() {
      return (detail, key) => {
        return {
          width: detail[key] + '%'
        };
      };
    },
    detail({ level, hCurrent }) {
      return level[hCurrent];
    },
    userInfo({ $store }) {
      return $store.state.apply.userInfo;
    },
    ...mapGetters({
      promoterPage: 'setting/getPromoterPage',
      promoterSetting: 'setting/getPromoter'
    })
  },
  methods: {
    change(e) {
      this.hCurrent = e.detail.current;
      this.dontFirstAnimation = false;
    }
  },
  async onLoad() {
    console.log(this.promoterSetting.level_number)
    const { level, promoter } = await promoterlevel();
    await this.$store.dispatch('setting/getSetting');
    this.level = level;
    this.promoter = promoter;
    this.loading = false;
  }
};
</script>

<style scoped lang="scss">
@import '../main.less';

.scroll-view {
  min-height: 100vh;
}

.grade-background {
  width: 750px;
  height: 480px;
  position: absolute;
  top: 0;
  z-index: 0;
}

.avatar-box {
  width: 160px;
  height: 160px;
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);

  .avatar-wheat {
    width: 100%;
    height: 100%;
  }

  .avatar-image {
    width: 120px;
    height: 120px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.grade-name {
  font-size: 32px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #ffffff;
  position: relative;
  z-index: 10;
  text-align: center;
  line-height: 40px;
  margin-top: 208px;
}

.grade-banner {
  height: 350px;
  margin-top: 40px;
  position: relative;
  z-index: 10;

  .he-swiper-item {
  }

  .he-list-wrap {
    transition: all 0.2s;
    background: #f9efe6;
    border-radius: 16px;
    padding: 40px 56px 0 56px;

    .wrap--head {
      color: #a06640;
      text-align: center;

      .iconfenxiaozhuangshi:last-child {
        transform: rotateY(180deg);
        display: inline-block;
      }
    }

    .head-title {
      font-size: 28px;
      @extend .font-family-sc;
      font-weight: 500;
      margin: 0 15px;
    }
  }

  .iconfenxiaozhuangshi {
    font-size: 28px;
  }
}

.he-card {
  margin: 47px 20px 0 20px;
  padding: 40px 40px 8px 40px;

  .card-head {
    height: 48px;
    line-height: 48px;
    @extend .font-family-sc;
    font-weight: 500;
    margin-bottom: 32px;

    .head-title {
      color: #222222;
      font-size: 32px;
    }

    .head-condition {
      font-size: 24px;
      color: #999999;
      margin-left: 15px;
    }
  }

  .card-item {
    margin-bottom: 40px;

    .item-title {
      font-size: 28px;
      @extend .font-family-sc;
      font-weight: 500;
      color: #666666;
      line-height: 48px;
    }

    .item-footer {
      font-size: 24px;
      @extend .font-family-sc;
      font-weight: 500;
      color: #666666;
      line-height: 40px;
    }
  }

  .progress-bar {
    width: 630px;
    height: 16px;
    background: #f3e0d2;
    border-radius: 8px;
    margin: 16px 0;

    .progress-ratio {
      width: 0;
      height: 16px;
      background: #c9875e;
      border-radius: 8px;
      transition-duration: 0.5s;
    }
  }
}

.item-img-side {
  height: 260px;
  width: 100%;
  animation: to-mini 0.3s;
}

.item-img {
  height: 350px;
  width: 100%;
  animation: to-big 0.3s;
}

@keyframes to-big {
  from {
    height: 260px;
    //opacity: 0;
  }
  to {
    height: 350px;
    //opacity: 1;
  }
}

@keyframes to-mini {
  from {
    height: 350px;
    //opacity: 1;
  }
  to {
    height: 260px;
    //opacity: 0;
  }
}

.canvas {
  opacity: 1;
}

.canvas-side {
  opacity: 0;
}

.swiper-item {
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-item-side {
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
