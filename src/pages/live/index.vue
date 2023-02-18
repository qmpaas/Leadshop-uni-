<template>
  <div class="wechatLive" :style="[backgroundColor]">
    <div class="le-body" :style="[bodyStyle]" :class="listStyle === 2 ? 'flex flex-wrap' : ''">
      <div
        class="le-item flex"
        :class="[
          listStyle === 1
            ? 'flex-direction le-item-one'
            : listStyle === 2
            ? 'flex-direction le-item-two'
            : 'le-item-three'
        ]"
        :key="index"
        :style="[itemStyle]"
        v-for="(item, index) in list"
        @click="routerLive(item)"
      >
        <view class="le-image-box">
          <image class="le-live--picture" mode="aspectFill" :src="item.cover_img" />
          <view class="le-tag-box flex">
            <view class="le-status-tag" :class="[filterStatusBackground(item.live_status)]">
              <image
                v-if="item.live_status === 101"
                src="./../../static/mp-weixin/img/live.gif"
                class="le-live--icon"
              />
              <span>{{ item.live_status | filterStatusText }}</span>
            </view>
            <view class="le-notice--text" v-if="item.live_status === 102">
              {{ item.text_time }}
            </view>
          </view>
          <view class="le-user" v-if="listStyle !== 3">
            <view class="le-user-box flex align-center">
              <image :src="item.anchor_img" class="le-user-avatar" />
              <span class="le-user-name">{{ item.anchor_name }}</span>
            </view>
          </view>
        </view>
        <view class="le-content" :class="listStyle === 3 ? 'flex-sub' : ''">
          <view class="le-live-name">{{ item.name }}</view>
          <view class="le-user flex align-center" v-if="listStyle === 3">
            <image :src="item.anchor_img" class="le-user-avatar" />
            <span class="le-user-name">{{ item.anchor_name }}</span>
          </view>
          <view class="le-goods flex" v-if="showGoods && item.goods[0]">
            <image class="le-img" :src="item.goods[0].cover_img" />
            <view class="le-goods--content">
              <view class="le-name he-line-1">{{ item.goods[0].name }}</view>
              <view class="le-price">{{ item.goods[0] | priceText }}</view>
            </view>
          </view>
        </view>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    content: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      list: [],
      page: {
        count: 1
      }
    };
  },
  computed: {
    backgroundColor() {
      return {
        backgroundColor: '#F5F5F5'
      };
    },
    listStyle() {
      return 2;
    },
    itemStyle() {
      return {
        marginBottom: 20 + 'rpx'
      };
    },
    showGoods() {
      return true;
    },
    bodyStyle() {
      return {
        paddingLeft: 20 + 'rpx',
        paddingRight: 20 + 'rpx'
      };
    },
    filterStatusBackground() {
      return function (status) {
        if (status === 101) {
          return 'le-tag--live';
        }
        if (status === 102) {
          return 'le-tag-notice';
        }
        return 'le-tag--end';
      };
    }
  },
  methods: {
    routerMoreLive() {
      uni.navigateTo({
        url: '/pages/live/index'
      });
    },
    getLiveList() {
      this.$heshop
        .live('get')
        .page(this.page.count, 10)
        .then(response => {
          this.list = response.list;
        })
        .catch(error => {});
    },
    routerLive(item) {
      const roomId = [item.roomid];
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
      });
    }
  },
  mounted() {
    this.getLiveList();
  },
  filters: {
    filterStatusText(status) {
      if (status === 101) {
        return '直播中';
      }
      if (status === 102) {
        return '预告';
      }
      return '已结束';
    },
    priceText(item) {
      if (item.price_type === 1) {
        return `￥${item.price}`;
      }
      if (item.price_type === 2) {
        return `￥${item.price}`;
      }
      if (item.price_type === 3) {
        return `￥${item.price2}`;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wechatLive {
  overflow: hidden;
  min-height: 100vh;

  .le-head {
    height: 84px;
    padding: 0 20px;
    line-height: 84px;

    .le-title {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #222222;
    }

    .le-more-text {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      margin-right: 4px;
    }

    .iconbtn_arrow {
      font-size: 20px;
      width: auto;
      height: auto;
    }
  }

  .le-body {
    .le-item {
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;

      .le-image-box {
        position: relative;

        .le-live--picture {
          width: 100%;
          height: 100%;
        }

        .le-user {
          width: 100%;
          height: 120px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
          bottom: 0;
          left: 0;

          .le-user-box {
            position: absolute;
            bottom: 16px;
            left: 16px;
          }
        }
      }

      .le-tag-box {
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 16px 24px 24px 0;

        .le-notice--text {
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 46px;
          padding: 0 15px;
        }
      }

      .le-status-tag {
        border-radius: 16px 24px 24px 0;
        color: #fff;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 46px;

        .le-live--icon {
          margin-right: 18px;
          width: 24px;
          height: 24px;
        }
      }

      .le-user {
        .le-user-name {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
          margin-left: 16px;
        }

        .el-icon-user-solid {
          font-size: 18px;
        }

        .le-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }

        ::v-deep .el-icon-user-solid {
          font-size: 18px;
          width: 36px;
          height: 36px;
        }
      }

      .le-content {
        .le-live-name {
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
        }

        .le-goods {
          margin-top: 20px;
          border-radius: 8px;

          .le-img {
            margin-right: 16px;
            border-radius: 8px;
            width: 80px;
            height: 80px;
          }

          .le-name {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #666666;
            line-height: 40px;
          }

          .le-price {
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #e60b30;
            line-height: 40px;
          }
        }
      }
    }

    .le-item-one {
      .le-image-box {
        width: 100%;
        height: 346px;
      }

      .le-content {
        width: 100%;
        padding: 16px 16px 24px 16px;
        border-radius: 0 0 16px 16px;
      }

      .le-user {
        position: absolute;
        bottom: 16px;
        left: 16px;
      }
    }

    .le-item-two:nth-child(odd) {
      margin-right: 18px;
    }

    .le-item-two {
      width: calc((100% - 18px) / 2);

      .le-image-box {
        width: 100%;
        height: 346px;
      }

      .le-content {
        width: 100%;
        padding: 16px 16px 24px 16px;
        border-radius: 0 0 16px 16px;

        .le-live-name {
          height: 80px;
        }
        .le-goods {
          .le-goods--content {
            width: calc(100% - 96px);
          }
        }
      }

      .le-user {
        position: absolute;
        bottom: 16px;
        left: 16px;
      }
    }

    .le-item-three {
      width: 100%;
      height: 288px;

      .le-content {
        padding: 24px;

        .le-goods {
          margin-top: 68px;
        }
      }

      .le-image-box {
        width: 288px;
        height: 100%;
      }

      .le-user {
        margin-top: 16px;

        .le-user-name {
          color: #999999;
        }
      }
    }
  }

  .le-tag--end {
    background: linear-gradient(90deg, #b8bbce 0%, #97a8bd 100%);
    padding: 0 24px 0 24px;
  }

  .le-tag-notice {
    background: linear-gradient(90deg, #5cb1ff 0%, #3f8df2 100%);
    padding: 0 24px 0 24px;
  }

  .le-tag--live {
    background: linear-gradient(90deg, #fe4a6f 0%, #fe2c4f 100%);
    padding: 0 24px 0 12px;
  }
}
</style>
