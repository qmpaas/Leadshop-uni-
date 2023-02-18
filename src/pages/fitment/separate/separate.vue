<template>
  <view
    class="separate"
    :style="{
      paddingTop: facade.margin + 'px',
      paddingBottom: facade.margin + 'px'
    }"
  >
    <view
      :style="{
        borderTopWidth: '1px',
        borderTopStyle: content.style,
        borderTopColor: facade.fill_color
      }"
    >
    </view>
  </view>
</template>

<script type="text/javascript">
export default {
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    margin() {
      return this.facade.chamfer_style == 1 ? 0 : 10;
    }
  }
};
</script>
