<template>
  <view>
    <button @click="open('wx5a5615e70f3abebf')">跳转论坛</button>
    <button @click="open('wx2297ae4b6a8f7c78')">tart</button>
    <button @click="open('wx5b982c2bacf47ba')">1tart</button>
    <button @click="open('wx275d76f095c93c92')">2tart</button>
    <button @click="open('wxe6aa8ccc48a8fd07')">2tart</button>
    <button @click="open('wxce0ef116dfa41142')">跳转体验</button>
  </view>
</template>

<script>
export default {
  name: 'demo',
  methods: {
    open(appId) {
      uni.navigateToMiniProgram({
        appId: appId,
        success(e) {},
        fail(e) {}
      });
    }
  }
};
</script>

<style scoped></style>
