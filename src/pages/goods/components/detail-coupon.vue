<template>
    <he-popup mode="bottom" v-model="showModal" :border-radius="16">
        <view class="detail-shipping-address flex flex-direction" :data-theme="theme">
            <view class="he-header">
                <text class="he-header__title">优惠券</text>
                <text class="iconfont iconpopup_close fr" @click="showModal = false"></text>
            </view>
            <view class="he-body flex-sub">
                <scroll-view class="he-body__scroll" scroll-y>
                    <view class="flex he-coupon-item" v-for="(item, index) in coupon" :key="index">
                        <view class="he-coupon-left">
                            <view class="he-item-price">{{
                                item.sub_price | setNumber
                                }}</view>
                            <view class="he-item-condition">
                                <template v-if="Number(item.min_price) > 0">
                                    满{{ item.min_price | setNumber }}可用
                                </template>
                                <template v-else> 无门槛 </template>
                            </view>
                        </view>
                        <view class="he-coupon-center">
                            <view class="he-coupon-doc"></view>
                            <view class="he-coupon-doc"></view>
                            <view class="he-border-line" :style="[lineColor]"></view>
                        </view>
                        <view class="he-coupon-right flex">
                            <view class="he-right-left">
                                <view class="he-item-name">{{ item.name }}</view>
                                <view class="he-item-prompt">{{
                                    item.appoint_type === 1 ? "全部商品可用" : "部分商品可用"
                                    }}</view>
                            </view>
                            <view class="he-right-right flex align-center justify-center">
                                <template v-if="item.can_obtain">
                                    <!-- #ifdef MP-WEIXIN -->
                                    <button class="cu-btn he-cu-btn he-left-right_btn" @click="receive(item)">
                                        立即领取
                                    </button>
                                    <!-- #endif -->
                                    <!-- #ifdef H5 -->
                                    <he-open-subscribe @open-subscribe-success="receive" :template-id="subTemplateId" :digital="item">
                                        <button class="cu-btn he-cu-btn he-left-right_btn">
                                            立即领取
                                        </button>
                                    </he-open-subscribe>
                                    <!-- #endif -->
                                </template>
                                <button v-else class="cu-btn he-cu-btn he-right-right_btn" @click="
                    navigateTo('/pages/goods/search-list?coupon_id=' + item.id)
                  ">
                                    立即使用
                                </button>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </he-popup>
</template>
<script>
import hePopup from "@/components/he-popup.vue";
// #ifdef H5
import heOpenSubscribe from "@/components/he-open-subscribe.vue";
// #endif

export default {
    name: "detail-shipping-address",
    components: {
        hePopup,
        // #ifdef H5
        heOpenSubscribe,
        // #endif
    },
    props: {
        value: {
            type: Boolean,
        },
        coupon: {
            type: Array,
            default: function() {
                return [];
            },
        },
    },
    computed: {
        showModal: {
            get: function() {
                return this.value;
            },
            set: function(bool) {
                this.$emit("input", bool);
            },
        },
        lineColor: function() {
            return {
                backgroundImage: `linear-gradient(to bottom, ${this.themeColor} 0%, ${this.themeColor} 50%, transparent 0%)`,
            };
        },
        subTemplateId: function() {
            return [this.$store.getters["setting/subscribe"].coupon_expire];
        },
    },
    filters: {
        setNumber: function(num) {
            return Number(num);
        },
    },
    methods: {
        navigateTo: function(url) {
            let _this = this;
            uni.navigateTo({
                url,
                success: function() {
                    _this.showModal = false;
                },
            });
        },
        receive: function(item) {
            let _this = this;
            if (_this.isLogin) {
                function couponRequire() {
                    _this.$heshop
                        .coupon("post", {
                            id: item.id,
                        })
                        .then(function() {
                            item.can_obtain = false;
                        })
                        .catch(function(error) {
                            item.can_obtain = false;
                            _this.$toError(error);
                        });
                }
                // #ifdef MP-WEIXIN
                wx.requestSubscribeMessage({
                    tmplIds: this.subTemplateId,
                    success: function() {},
                    fail: function() {},
                    complete: function() {
                        couponRequire();
                    },
                });
                // #endif
                // #ifdef H5
                couponRequire();
                // #endif
            } else {
                uni.navigateTo({
                    url: "/pages/user/login",
                });
            }
        },
    },
};
</script>
<style scoped lang="scss">
.detail-shipping-address {
    height: 53vh;
}

.he-header {
    height: 56px;
    line-height: 56px;
    text-align: center;
    margin-top: 16px;
    padding: 0 32px;
}

.iconpopup_close {
    font-size: 28px;
    width: 28px;
    height: 28px;
    line-height: 1;
    color: #9d9d9d;
    margin-top: 18px;
}

.he-header__title {
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
}

.he-body {
    margin-top: 32px;
    overflow: hidden;
}

.he-body__scroll {
    height: 100%;
    padding: 0 20px;
    // height: calc(53vh - 136px);
}

.he-coupon-item {
    height: 160px;
    margin-bottom: 16px;

    .he-coupon-left {
        width: 217px;
        border-top: 2px solid transparent;
        border-left: 2px solid transparent;
        border-bottom: 2px solid transparent;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        @include border_color("border_color");
        padding: 37px 0 35px 16px;
        text-align: center;

        .he-item-price {
            line-height: 52px;
            font-size: 50px;
            font-family: DIN-Bold;
            font-weight: Bold;
            @include font_color("font_color");
        }

        .he-item-price:before {
            content: "￥";
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            @include font_color("font_color");
            line-height: 14px;
        }

        .he-item-condition {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            @include font_color("font_color");
            line-height: 36px;
        }
    }

    .he-coupon-center {
        width: 16px;
        position: relative;
        overflow: hidden;

        .he-coupon-doc {
            width: 16px;
            height: 16px;
            position: absolute;
            border: 2px solid transparent;
            border-radius: 50%;
            @include border_color("border_color");
        }

        .he-coupon-doc:first-child {
            top: 0;
            transform: translateY(-50%);
        }

        .he-coupon-doc:nth-child(2) {
            bottom: 0;
            transform: translateY(50%);
        }

        .he-border-line {
            position: absolute;
            height: 132px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 2px;
            background-size: 1px 14px;
            background-repeat: repeat-y;
        }
    }

    .he-coupon-right {
        width: 478px;
        border-top: 2px solid transparent;
        border-right: 2px solid transparent;
        border-bottom: 2px solid transparent;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        @include border_color("border_color");

        .he-right-left {
            width: 303px;
            padding: 43px 11px 41px 32px;

            .he-item-name {
                font-size: 30px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #222222;
                line-height: 40px;
                margin-bottom: 4px;
            }

            .he-item-prompt {
                font-size: 22px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #999999;
                line-height: 28px;
                margin-top: 4px;
            }
        }

        .he-right-right {
            width: 174px;

            .he-cu-btn {
                width: 126px;
                height: 48px;
                border-radius: 24px;
                font-size: 22px;
                font-family: PingFang SC;
                font-weight: 500;
                padding: 0;
            }

            .he-left-right_btn {
                color: #ffffff;
                @include background_color("background_color");
            }

            .he-right-right_btn {
                border: 1px solid transparent;
                @include font_color("font_color");
                @include border_color("border_color");
                background-color: #ffffff;
            }
        }
    }
}
</style>