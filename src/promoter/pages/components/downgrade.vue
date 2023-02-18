<template>
  <he-popup mode="center" v-model="showModel" background-color="transparent">
    <view class="he-down-grade" :data-theme="theme">
      <image
        :src="
          isUpDown === 1
            ? ipAddress + '/promoter-rise-grade.png'
            : isUpDown === -1
            ? ipAddress + '/promoter-demote-grade.png'
            : ''
        "
        class="he-image"
      />
      <view class="he-box flex flex-direction align-center">
        <template v-if="isUpDown < 0">
          <text class="he-instruction"> 由于您当前的分销业绩不足</text>
          <text class="he-instruction">分销等级已降级至</text>
        </template>
        <text v-else-if="isUpDown > 0" class="he-instruction"> 恭喜！您的分销等级已升级至</text>
        <text class="he-level">{{ levelName }}</text>
        <button class="cu-btn he-btn" @click="showModel = false">我知道了</button>
      </view>
    </view>
  </he-popup>
</template>

<script>
import HePopup from '../../../components/he-popup.vue';

export default {
  name: 'downgrade',
  components: {
    HePopup
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    isUpDown: {
      type: Number,
      default: 0
    },
    levelName: {
      type: String,
      default: ''
    }
  },
  computed: {
    showModel: {
      get: function ({ value }) {
        return value;
      },
      set: function (value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../main.less';

.he-down-grade {
  width: 590px;
  position: relative;
  overflow: hidden;
}

.he-image {
  width: 540px;
  height: 280px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

.he-box {
  width: 590px;
  background: #fff;
  border-radius: 16px;
  margin-top: 140px;
  padding-top: 162px;
}

.he-btn {
  width: 242px;
  height: 72px;
  border-radius: 36px;
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #ffffff;
  margin: 54px 0 56px 0;
  @include background_color('background_color');
}

.he-instruction {
  font-size: 28px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #222222;
  line-height: 36px;
  text-align: center;
  margin-bottom: 15px;
}

.he-level {
  font-size: 36px;
  @extend .font-family-sc;
  font-weight: 500;
  color: #222222;
  line-height: 48px;
}
</style>
