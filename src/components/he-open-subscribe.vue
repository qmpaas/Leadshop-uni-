<template>
  <view class="he-open-subscribe" @click.stop="subscribe">
    <slot></slot>
    <template v-if="isShow">
      <wx-open-subscribe
        style="position: absolute; width: 100%; height: 100%; top: 0; left: 0"
        :template="templateId"
        :id="subscribeId"
      >
        <script type="text/wxtag-template">
          <style>
            .btn {
              width: 100%;
              height: 500px;
            }
          </style>
          <div class="btn"></div>
        </script>
      </wx-open-subscribe>
    </template>
  </view>
</template>

<script>
export default {
  name: 'he-open-subscribe',
  props: {
    templateId: {
      type: Array,
      default: function () {
        return [];
      }
    },
    digital: {
      type: [Array, Object, Number],
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      subscribeId: this.$h.guid() + '_subscribe',
      isShow: true
    };
  },
  methods: {
    subscribe: function () {
      if (!this.isShow) {
        this.$emit('open-subscribe-success', this.digital);
      } else {
        return;
      }
    }
  },
  mounted() {
    let _this = this;
    let btn = document.getElementById(_this.subscribeId);
    btn.addEventListener('success', function () {
      _this.$emit('open-subscribe-success', _this.digital);
    });
    btn.addEventListener('error', function (error) {
      const { errCode } = error.detail;
      _this.isShow = false;
      // _this.$emit('open-subscribe-success', _this.digital);
    });
  }
};
</script>

<style scoped>
.he-open-subscribe {
  position: relative;
  overflow: hidden;
}
</style>
