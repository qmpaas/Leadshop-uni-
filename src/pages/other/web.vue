<template>
  <web-view :src="url"></web-view>
</template>

<script>
export default {
  name: 'web',
  data() {
    return {
      url: ''
    };
  },
  onLoad(options) {
    this.url = options.url;
  }
};
</script>
