<template>
  <view class="he-page-content">
    <text>{{ content }}</text>
  </view>
</template>

<script>
import { agreement } from '../api';

export default {
  name: 'protocol',
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    agreement().then(response => {
      uni.setNavigationBarTitle({
        title: response.agreement_title
      });
      this.content = response.agreement_content;
    });
  }
};
</script>
