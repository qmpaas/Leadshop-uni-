<template>
    <view class="cart-empty flex flex-direction align-center" :data-theme="theme">
        <image class="he-image" :src="ipAddress + '/cart-background-empty.png'"></image>
        <view class="he-text">购物车空空如也~</view>
        <button class="cu-btn he-go__buy" @click="navigateTo">去逛逛</button>
    </view>
</template>

<script>

export default {
    name: "cart-empty",
    methods: {
        navigateTo: function () {
            uni.switchTab({url: '/pages/index/index'});
        }
    }
}
</script>

<style scoped lang="scss">
.he-image {
    width: 320px;
    height: 320px;
    margin-top: 40px;
}

.he-go__buy {
    width: 142px;
    height: 56px;
    @include background_color('background_color');
    border-radius: 28px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    margin-top: 40px;
}

.he-text {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
    line-height: 1.3;
}
</style>