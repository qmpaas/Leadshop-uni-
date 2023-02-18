<template>
  <view class="commission-rate flex justify-around">
    <view class="item flex flex-direction align-center justify-between">
      <canvas v-if="!firstImage" :canvas-id="`firstCanvas-${index}`" :id="`firstCanvas-${index}`"></canvas>
      <image v-else :src="firstImage"></image>
      <view class="percentage" v-if="show">
        <view class="content">
          {{ Number(info.first) }}
        </view>
        <view class="per">%</view>
      </view>
      <text>{{ promoterPage.grade_center.first }}</text>
    </view>
    <view class="item flex flex-direction align-center justify-between" v-if="promoterSetting.level_number >= 2">
      <canvas v-if="!secondImage" :canvas-id="`secondCanvas-${index}`" :id="`secondCanvas-${index}`"></canvas>
      <image v-else :src="secondImage"></image>
      <view class="percentage" v-if="show">
        <view class="content">
          {{ Number(info.second) }}
        </view>
        <view class="per">%</view>
      </view>
      <text>{{ promoterPage.grade_center.second }}</text>
    </view>
    <view class="item flex flex-direction align-center justify-between" v-if="promoterSetting.level_number === 3">
      <canvas v-if="!thirdImage" :canvas-id="`thirdCanvas-${index}`" :id="`thirdCanvas-${index}`"></canvas>
      <image v-else :src="thirdImage"></image>
      <view class="percentage" v-if="show">
        <view class="content">
          {{ Number(info.third) }}
        </view>
        <view class="per">%</view>
      </view>
      <text>{{ promoterPage.grade_center.third }}</text>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'level-canvas',
  data() {
    return {
      show: false,
      firstImage: null,
      secondImage: null,
      thirdImage: null
    };
  },
  props: {
    index: {
      type: Number
    },
    info: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      promoterPage: 'setting/getPromoterPage',
      promoterSetting: 'setting/getPromoter'
    })
  },
  methods: {
    initCanvasFirst() {
      this.initCanvas(`firstCanvas-${this.index}`, this.info.first, 'firstImage');
      const _this = this;
      uni.canvasToTempFilePath(
        {
          canvasId: `firstCanvas-${_this.index}`,
          x: 0,
          y: 0,
          width: uni.upx2px(116),
          height: uni.upx2px(116),
          success: function (res) {
            _this['firstImage'] = res.tempFilePath;
          },
          fail(e) {},
          complete() {
            return true;
          }
        },
        this
      );
    },
    initCanvasSecond() {
      this.initCanvas(`secondCanvas-${this.index}`, this.info.second, 'secondImage');
      const _this = this;
      uni.canvasToTempFilePath(
        {
          canvasId: `secondCanvas-${_this.index}`,
          x: 0,
          y: 0,
          width: uni.upx2px(116),
          height: uni.upx2px(116),
          success: function (res) {
            _this['secondImage'] = res.tempFilePath;
          },
          fail(e) {},
          complete() {
            return true;
          }
        },
        this
      );
    },
    initCanvasThird() {
      this.initCanvas(`thirdCanvas-${this.index}`, this.info.third, 'thirdImage');
      const _this = this;
      uni.canvasToTempFilePath(
        {
          canvasId: `thirdCanvas-${_this.index}`,
          x: 0,
          y: 0,
          width: uni.upx2px(116),
          height: uni.upx2px(116),
          success: function (res) {
            _this['thirdImage'] = res.tempFilePath;
          },
          fail(e) {},
          complete() {
            return true;
          }
        },
        this
      );
    },
    initCanvas(id, percentage, image) {
      percentage = Number(percentage);
      let context = uni.createCanvasContext(id, this);
      context.beginPath();
      context.arc(uni.upx2px(58), uni.upx2px(58), uni.upx2px(58), 0, 2 * Math.PI);
      context.setFillStyle('#F9EFE6');
      context.fill();
      context.closePath();
      context.beginPath();
      context.arc(uni.upx2px(58), uni.upx2px(58), uni.upx2px(53), 0, 2 * Math.PI, false);
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = '#F3E0D2';
      context.stroke();
      context.closePath();
      context.beginPath();
      context.arc(
        uni.upx2px(58),
        uni.upx2px(58),
        uni.upx2px(53),
        -Math.PI / 2,
        ((percentage * 3.6 - 90) * Math.PI) / 180,
        false
      );
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = '#C9875E';
      context.stroke();
      context.closePath();
      context.draw();
    }
  },
  mounted() {
    setTimeout(() => {
      this.initCanvasFirst();
      if (this.promoterSetting.level_number >= 2) {
        this.initCanvasSecond();
      }
      if (this.promoterSetting.level_number === 3) {
        this.initCanvasThird();
      }

      this.show = true;
    }, 500);
  }
};
</script>

<style scoped lang="scss">
@import './../../main.less';

.commission-rate {
  height: 164px;
  margin-top: 40px;

  .item {
    width: 140px;
    font-size: 20px;
    @extend .font-family-sc;
    font-weight: 400;
    color: #a06640;
    position: relative;

    .percentage {
      position: absolute;
      top: 40px;
      left: 0;
      width: 140px;
      text-align: center;

      .content {
        font-size: 28px;
        @extend .font-family-sc;
        font-weight: bold;
        color: #a06640;
        display: inline-block;
      }

      .per {
        display: inline-block;
        font-size: 20px;
        @extend .font-family-sc;
        font-weight: 500;
        line-height: 28px;
      }
    }

    canvas {
      width: 116px;
      height: 116px;
    }
    image {
      width: 116px;
      height: 116px;
    }
  }
}
</style>
