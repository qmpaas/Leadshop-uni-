<template>
  <view>
    <movable-area :style="[areaStyle]" id="area" @click="isOpen = false" v-if="showModal && move">
      <view :style="[dingg]" v-if="isOpen && list.length >= 4" class="box flex flex-wrap" @click.stop>
        <template v-for="(item, index) in list">
          <!-- #ifdef H5 -->
          <he-open-launch-weapp :key="index" v-if="item.index === 11" :username="item.link.param.wechat.appId"
                                :path="item.link.param.wechat.path">
            <view class="item flex flex-direction align-center" :key="index">
              <image :src="item.img"></image>
              <view class="name">{{ item.name }}</view>
            </view>
          </he-open-launch-weapp>
          <view @click.stop="handleCheck(item.link)" v-else-if="item.link.value === 'tell'"
                class="item flex flex-direction align-center" :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <view @click.stop="handleCheck(item.link)" v-else class="item flex flex-direction align-center"
                :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <view v-if="item.link.value === 'tell'" class="item flex flex-direction align-center" :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
            <button open-type="contact" class="cu-btn button"></button>
          </view>
          <view v-else @click.stop="handleCheck(item.link)" class="item flex flex-direction align-center"
                :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <!-- #endif -->
        </template>
      </view>
      <view :style="[ding]" v-if="list.length < 4" id="row-link">
        <view @click.stop="handleCheck(item.link)" class="row-link" v-for="(item, index) in list" :key="index">
          <image :src="item.img"></image>
        </view>
      </view>
      <movable-view
        @touchend="touchend"
        class="open-close"
        v-if="!isOpen && list.length >=4"
        @click.stop="onClick"
         @change="onChange" direction="all" style="width: 88rpx;height: 88rpx;" :y="y" :x="x">
        <image :src="isOpen ? floatWindow.stowedState : floatWindow.expandedState"/>
      </movable-view>
      <movable-view
        @touchend="touchend"
        class="open-close"
        :disabled="isOpen"
        v-if="list.length < 4"
        :damping="80"
        :friction="10"
        @click.stop="onClick"
         @change="onChange" direction="all" style="width: 88rpx;height: 88rpx;" :y="y" :x="x">
        <image :src="isOpen ? floatWindow.stowedState : floatWindow.expandedState"/>
      </movable-view>
    </movable-area>
    <view v-if="showModal && !move" :style="[bottomStyle]" class="he-float flex flex-direction align-end"
          @click.stop.prevent="() => {}">
      <view v-if="isOpen && list.length >= 4" class="box flex flex-wrap">
        <template v-for="(item, index) in list">
          <!-- #ifdef H5 -->
          <he-open-launch-weapp :key="index" v-if="item.index === 11" :username="item.link.param.wechat.appId"
                                :path="item.link.param.wechat.path">
            <view class="item flex flex-direction align-center" :key="index">
              <image :src="item.img"></image>
              <view class="name">{{ item.name }}</view>
            </view>
          </he-open-launch-weapp>
          <view @click.stop="handleCheck(item.link)" v-else-if="item.link.value === 'tell'"
                class="item flex flex-direction align-center" :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <view @click.stop="handleCheck(item.link)" v-else class="item flex flex-direction align-center" :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <view v-if="item.link.value === 'tell'" class="item flex flex-direction align-center" :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
            <button open-type="contact" class="cu-btn button"></button>
          </view>
          <view v-else @click.stop="handleCheck(item.link)" class="item flex flex-direction align-center" :key="index">
            <image :src="item.img"></image>
            <view class="name">{{ item.name }}</view>
          </view>
          <!-- #endif -->
        </template>
      </view>
      <template v-if="isOpen && list.length < 4">
        <view @click.stop="handleCheck(item.link)" class="row-link" v-for="(item, index) in list" :key="index">
          <image :src="item.img"></image>
        </view>
      </template>
      <view class="open-close">
        <image @click="setOpen()" :src="isOpen ? floatWindow.stowedState : floatWindow.expandedState"/>
      </view>
    </view>
  </view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
//#ifdef H5
import heOpenLaunchWeapp from './../he-open-launch-weapp.vue';
//#endif
import {mapGetters} from 'vuex';

export default {
  props: {
    pagesUrl: {
      type: String,
      default: ''
    },
    bottom: {
      type: Number,
      default: 0
    }
  },
  //#ifdef H5
  components: {
    heOpenLaunchWeapp
  },
  //#endif
  data() {
    return {
      showModal: false,
      list: [],
      isOpen: false,
      x: 353,
      y: 500,
      old: {
        x: 353,
        y: 500
      },
      isShow: false,
      move: false,
      height: 0,
      page: 0,
      disabledOpen: false
    };
  },
  computed: {
    ...mapGetters('setting', {
      floatWindow: 'getFloatWindow'
    }),
    bottomStyle() {
      let style = {
        bottom: this.bottom + 148 + 'rpx'
      };
      return style;
    },
    ding({isOpen}) {
      let style = {
        position: 'absolute',
        top: (this.y - this.height) + 'px',
        left: this.x + 'px',
      }

      if (!isOpen) {
        style.top = -1000 + 'px';
        style.left = -1000 + 'px'
      }
      if (this.y - this.height < 0) {
        style.top = (this.y + uni.upx2px(88)) + 'px'
      }
      return style;
    },
    dingg({y, page}) {
      let one = page / 3;
      let two = page / 3 * 2;
      let style = {
        position: 'absolute',
        top: 0,
      }
      if (y < one) {
        style.top = one - uni.upx2px(363) / 2 + 'px'
      }
      if (y < two && one < y) {
        style.top = two - uni.upx2px(363) / 2 + 'px'
      }
      if (y > two) {
        style.top = two + uni.upx2px(363) / 2 + 'px'
      }
      return style;
    },
    areaStyle() {
      let style = {
        height: '94vh',
        marginTop: '3vh',
      }
      const pages = getCurrentPages();
      const page = (pages[pages.length - 1]).route;
      if (this.pagesUrl === 'index' || this.pagesUrl === 'goods-detail' || page === 'promoter/pages/dynamic') {
        style.height = `calc(100vh - ${this.navbarHeight}px - 6vh)`;
        style.marginTop = `calc(${this.navbarHeight}px + 3vh)`
      }
      if (this.isOpen) {
        style.pointerEvents = 'auto';
      } else {
        style.pointerEvents = 'none';
      }
      return style;
    },
    // 转换字符数值为真正的数值
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return systemInfo.statusBarHeight + 44;
      // #endif
      // #ifdef MP
      return systemInfo.platform === 'ios' ? systemInfo.statusBarHeight + 44 : systemInfo.statusBarHeight + 48;
      // #endif
    }
  },
  mounted() {
    const index = this.floatWindow.pages.findIndex(item => {
      return item === this.pagesUrl;
    });
    this.move = this.floatWindow.move;
    let platform = '';
    // #ifdef H5
    platform = 'wechat';
    // #endif
    // #ifdef MP-WEIXIN
    platform = 'applet';
    // #endif
    const platformIndex = this.floatWindow.channel.findIndex(item => item === platform);
    this.showModal = index > -1 && this.floatWindow.status !== 0 && platformIndex > -1;
    if (this.floatWindow.status === 1) {
      this.floatWindow.button.forEach(item => {
        if (item === 'index' && this.pagesUrl !== 'index') {
          this.list.push({
            img: this.floatWindow.buttonIcon.index,
            link: {
              extend: false,
              index: 0,
              path: '/pages/index/index'
            },
            name: '首页'
          });
        } else if (item === 'cart') {
          this.list.push({
            img: this.floatWindow.buttonIcon.cart,
            link: {
              extend: false,
              index: 4,
              path: '/pages/cart/index'
            },
            name: '购物车'
          });
        } else if (item === 'tell') {
          this.list.push({
            img: this.floatWindow.buttonIcon.tell,
            link: {
              value: 'tell'
            },
            name: '联系客服'
          });
        } else if (item === 'personalCenter') {
          this.list.push({
            img: this.floatWindow.buttonIcon.personalCenter,
            link: {
              extend: false,
              index: 5,
              path: '/pages/user/index'
            },
            name: '个人中心'
          });
        } else if (item === 'toTop') {
          this.list.push({
            img: this.floatWindow.buttonIcon.toTop,
            link: {
              value: 'toTop'
            },
            name: '返回顶部'
          });
        } else if (item === 'backPage' && this.pagesUrl !== 'index') {
          this.list.push({
            img: this.floatWindow.buttonIcon.backPage,
            link: {
              value: 'backPage'
            },
            name: '返回上页'
          });
        }
      });
    } else if (this.floatWindow.status === 2) {
      this.list = this.floatWindow.customize;
    }
    if (this.list.length < 3 && !this.move) {
      this.isOpen = true;
    }
    const query = uni.createSelectorQuery().in(this);
    setTimeout(() => {
      query.select('#row-link').boundingClientRect(data => {
        if (data) {
          this.height = data.height;
        }
      }).exec();
      query.select('#area').boundingClientRect(data => {
        if (data) {
          this.page = data.height;
        }
      }).exec();
    });
  },
  methods: {
    handleCheck(item) {
      if (item.value === 'backPage') {
        if (getCurrentPages().length > 1) {
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 500
          });
          uni.navigateBack({
            delta: 1,
          });
        }
      } else if (item.value === 'toTop') {
        wx.pageScrollTo({
          scrollTop: 0
        });
      } else if (item.value === 'tell') {
        uni.makePhoneCall({
          phoneNumber: this.storeSetting.contact.phone.value
        });
      } else {
        this.$h.MPageNavigate(item);
      }
    },
    setOpen() {
      this.isOpen = !this.isOpen;
    },
    onChange(e) {
      this.old.x = e.detail.x
      this.old.y = e.detail.y
    },
    onClick() {
      this.isOpen = !this.isOpen;
    },
    touchend() {
      this.x = this.old.x
      this.y = this.old.y
      const width = wx.getSystemInfoSync().windowWidth;
      this.$nextTick(() => {
        if (this.x < width / 2) {
          this.x = uni.upx2px(24);
        } else if (this.x > width / 2) {
          this.x = width - uni.upx2px(88) - uni.upx2px(24);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
movable-area {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 1000;
  pointer-events: none;

  .box {
    width: 424px;
    height: 362px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    image {
      width: 88px;
      height: 88px;
      display: block;
    }
  }
}

movable-view {
  pointer-events: auto;
}

.open-close {
  width: 88px;
  height: 88px;

  image {
    width: 88px;
    height: 88px;
    display: block;
  }
}

image {
  width: 88px;
  height: 88px;
  display: block;
}

.he-float {
  position: fixed;
  z-index: 998;
  right: 24px;

  image {
    width: 88px;
    height: 88px;
    display: block;
  }


  .row-link {
    margin-bottom: 16px;
  }
}

//.big-box {
//  width: 424px;
//  height: 529px;
//  position: absolute;
//  top: 50%;
//  left: 50%;
//  transform: translate(-50%, -50%);
//}
.box {
  width: 424px;
  height: 362px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 40px;
  margin-bottom: 17px;
  padding: 32px 37px;
  pointer-events: auto;

  .item {
    width: 96px;
    position: relative;

    .name {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      margin-top: 15px;
    }

    &:not(:nth-child(3n)) {
      margin-right: 32px;
    }
  }
}

.button {
  background: transparent;
  padding: 0;
  margin-left: 0;
  border: none;
  outline: none;
  line-height: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}

</style>

