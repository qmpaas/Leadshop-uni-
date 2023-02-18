<template>
  <view class="he-open-launch-weapp">
    <slot></slot>
    <wx-open-launch-weapp
      style="position: absolute; width: 100%; height: 100%; top: 0; left: 0"
      :username="appid"
      :path="url"
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
    </wx-open-launch-weapp>
  </view>
</template>
<script>
export default {
  name: 'he-open-launch-weapp',
  props: {
    digital: {
      type: [Array, Object, Number],
      default: function () {
        return {};
      }
    },
    username: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  computed: {
    appid({ username }) {
      return username;
    },
    url({ path }) {
      return path;
    }
  },
  data() {
    return {
      subscribeId: this.$h.guid() + '_subscribe'
    };
  },
  mounted() {
    let _this = this;
    let btn = document.getElementById(_this.subscribeId);
    btn.addEventListener('ready', function () {
      _this.$emit('open-subscribe-success', _this.digital);
    });
    btn.addEventListener('launch', function () {
      _this.$emit('open-subscribe-success', _this.digital);
    });
    btn.addEventListener('error', function () {
      _this.$emit('open-subscribe-success', _this.digital);
    });
  }
};
</script>

<style scoped>
.he-open-launch-weapp {
  position: relative;
  overflow: hidden;
}
</style>
