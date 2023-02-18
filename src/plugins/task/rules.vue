<template>
  <view class="task-rules" style="white-space: pre-wrap">
    {{ instruction }}
  </view>
</template>
<script type="text/javascript">
export default {
  data() {
    return {};
  },
  methods: {},
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    instruction() {
      return this.$manifest('task', 'config.integral_rules');
    }
  },
  onLoad() {}
};
</script>

<style>
.task-rules {
  padding: 40px;
}
</style>
