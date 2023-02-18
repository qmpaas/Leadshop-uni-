<template>
  <view class="he-page-content">
    <view class="pk-top flex align-center">
      <text class="pk-top-text">{{ freight.length + '个包裹已发出' }}</text>
    </view>
    <view
      class="pk-card flex flex-direction"
      v-for="(item, index) in freight"
      :key="index"
      @click="
        item.type !== 2
          ? navigateTo(
              '/pages/order/logistics?no=' +
                item.freight_sn +
                '&name=' +
                item.logistics_company +
                '&mobile=' +
                this.mobile +
                '&code=' +
                item.code
            )
          : false
      "
    >
      <view class="card__top flex-shrink-0 flex">
        <view class="card__top-left flex flex-direction justify-around">
          <view class="logis-top flex align-center">
            <text class="iconfont iconbaoguo"></text>
            <view class="logis-top-text">{{ '包裹' + (index + 1) }}</view>
            <view class="logis-top-text">{{ item.logistics_company + ' ' + item.freight_sn }}</view>
          </view>
          <view class="logis-down flex align-center">{{ item.type !== 2 ? item.message : '无需物流' }}</view>
        </view>
        <text class="card__top-right flex align-center" :class="item.type !== 2 ? 'iconfont iconbtn_arrow' : ''"></text>
      </view>
      <view class="card__mid flex-grow-1 flex flex-wrap">
        <view v-for="(pkimg, Iindex) in item.goods" :key="Iindex" style="margin: 0 0 8rpx 8rpx; position: relative">
          <he-image :image-style="{ borderRadius: '8rpx' }" :src="pkimg.goods.goods_image" :width="152" :height="152">
          </he-image>
          <view class="imgnext flex justify-center align-center" v-show="pkimg.bag_goods_number !== 1">{{
            pkimg.bag_goods_number + '件'
          }}</view>
        </view>
      </view>
      <view class="card__down flex-shrink-0 flex align-center">{{ '共' + item.bag_goods_total + '件商品' }}</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      freight: [],
      express: [],
      mobile: Number
    };
  },
  methods: {
    navigateTo: function (url) {
      uni.navigateTo({ url });
    },
    getPackages(id) {
      this.$heshop.order('get', id).then(res => {
        this.freight = res.freight;
        this.mobile = res.buyer.mobile;
        for (let i = 0; i < this.freight.length; i++) {
          if (this.freight[i].type !== 2) {
            this.$heshop
              .express('post', {
                no: this.freight[i].freight_sn,
                mobile: res.buyer.mobile,
                name: this.freight[i].logistics_company,
                code: this.freight[i].code
              })
              .then(res => {
                this.$set(this.freight[i], 'state', res.state);
                if (parseInt(res.state) !== 0) {
                  this.$set(this.freight[i], 'message', res.message);
                } else {
                  this.$set(this.freight[i], 'message', res.list[0].desc);
                }
              })
              .catch(err => {
                if (err.status === 403) {
                  this.$toError(err);
                }
              });
          }
        }
        return true;
      });
    },
    getExpress() {
      this.$heshop.express('post', {
        no: pkinfo.freight_sn,
        mobile: this.value.buyer.mobile,
        name: pkinfo.logistics_company,
        code: pkinfo.code
      });
    }
  },
  onLoad(options) {
    this.getPackages(parseInt(options.id));
  }
};
</script>

<style scoped lang="scss">
@mixin texts {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}
@mixin hiddentext {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.iconbaoguo {
  font-size: 24px;
  color: #bebebe;
}
.iconbtn_arrow {
  font-size: 28px;
  color: #bebebe;
}
.pk {
  &-top {
    height: 80px;
    background-color: #fff5e1;
    &-text {
      margin-left: 32px;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #f58e20;
      line-height: 14px;
    }
  }
  &-card {
    margin: 20px 20px 0px 20px;
    padding: 24px;
    width: 710px;
    max-height: 555px;
    min-height: 385px;
    background: #ffffff;
    border-radius: 16px;
    justify-content: space-between;
    .card__top {
      height: 128px;
      border-bottom: 1px solid #e5e5e5;
      justify-content: space-between;
      &-left {
        .logis-top {
          justify-content: flex-start;
          &-text {
            margin-left: 16px;
            @include texts;
          }
        }
        .logis-down {
          margin-left: 44px;
          //height: 64px;
          font-size: 26px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
          @include hiddentext;
          line-height: 34px;
          margin-bottom: 10px;
        }
      }
    }
    .card__mid {
      padding: 24px 0 16px 0;
      .imgnext {
        width: 152px;
        height: 40px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        z-index: 10;
        //margin-top: -40px;
        font-size: 22px;
        font-family: PingFang SC;
        color: #ffffff;
        position: absolute;
        bottom: 0;
      }
    }
    .card__down {
      height: 64px;
      @include texts;
    }
  }
}
</style>
