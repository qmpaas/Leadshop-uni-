<!--
 * @Description:
 * @Author: fjt
 * @Date: 2021-06-04 16:32:18
 * @LastEditTime: 2021-06-15 14:17:22
 * @LastEditors: fjt
-->
<template>
    <he-popup mode="center" v-model="showModal" background-color="transparent" :zoom="false" width="100%" height="100%" class="">
        <view @touchmove.stop.prevent="() => {}" class="le-popup">
            <view class="he-box flex flex-direction align-center" :data-theme="theme">
                <view class="he-box__close flex align-center justify-center" @click="showModal = false">
                    <text class="iconfont iconpopup_close"></text>
                </view>
                <image class="he-box-img" @click="previewImage" :src="storeSetting.contact.friend.pic_url" />
                <view class="he-box-des">{{ storeSetting.contact.friend.des }}</view>
                <button class="he-box__save cu-btn">
                    点击图片，长按识别
                </button>
            </view>
        </view>
    </he-popup>
</template>
<script>
import HePopup from "@/components/he-popup";
import saveImageToPhotosAlbum from "@/libs/mixin/saveImageToPhotosAlbum.js";

export default {
    name: "user-qrcode",
    props: {
        value: Boolean,
    },
    mixins: [saveImageToPhotosAlbum],
    components: { HePopup },
    computed: {
        showModal: {
            get: function() {
                return this.value;
            },
            set: function(val) {
                this.$emit("input", val);
            },
        },
    },
    methods: {
        previewImage: function() {
            uni.previewImage({
                current: this.storeSetting.contact.friend.pic_url,
                urls: [this.storeSetting.contact.friend.pic_url],
            });
        },
    },
    mounted() {},
};
</script>
<style lang="scss" scoped>
.le-popup {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.he-box {
    width: 488px;
    height: 536px;
    background: #ffffff;
    border-radius: 16px;
    margin: 30vh auto 0 auto;
    position: relative;
}

.he-box-img {
    width: 360px;
    height: 360px;
    margin-top: 64px;
}

.he-box-des {
    margin-top: 35px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
}

.he-box__close {
    width: 52px;
    height: 52px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: -84px;
}

.iconpopup_close {
    font-size: 20px;
    color: #ffffff;
}

.he-box__save {
    position: absolute;
    bottom: -120px;
    width: 380px;
    height: 80px;
    @include background_color("background_color");
    border-radius: 40px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
}
</style>
