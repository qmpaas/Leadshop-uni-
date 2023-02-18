<template>
  <view class="le-notice">
    <item
      v-if="content.title"
      :speed="facade.speed || 80"
      :icon-url="content.icon"
      :text="content.title"
      showIcon
      :scrollable="content.title.length > 15 ? true : false"
      :background-color="facade.background_color"
      :color="facade.title_color"
    ></item>
  </view>
</template>
<script type="text/javascript">
import item from './item.vue';
export default {
  components: {
    item
  },
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  name: 'notice'
};
</script>
<style lang="scss" scoped="true">
.le-notice {
  width: 100%;
}
</style>
