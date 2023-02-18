<template>
    <he-popup mode="bottom" v-model="showModal" :border-radius="16">
        <view class="detail-shipping-address flex flex-direction" :data-theme="theme">
            <view class="he-header">
                <text class="he-header__title">优惠券</text>
                <text class="iconfont iconpopup_close fr" @click="showModal = false"></text>
            </view>
            <view class="he-body flex-sub">
                <he-no-content-yet :image="ipAddress + '/coupon-no-empty.png'" text="暂无可用优惠券" v-if="$h.test.isEmpty(coupon)"></he-no-content-yet>
                <scroll-view class="he-body__scroll" scroll-y v-else>
                    <view class="he-coupon-item" :class="
              item.radio
                ? 'he-coupon-item-radio'
                : !item.isAvailable
                ? 'he-coupon-item-unavailable'
                : ''
            " v-for="(item, index) in coupon" :key="index" @click="apply(item)">
                        <view class="he-coupon-top flex">
                            <view class="he-coupon-recommended-sign flex align-center" v-if="item.isAvailable && index === 0">
                                <text class="iconfont icontuijian"></text>
                                <text>推荐</text>
                            </view>
                            <view class="he-item-number">
                                <view class="he-item-price">{{
                                    item.coupon.sub_price | setNumber
                                    }}</view>
                                <view class="he-item-condition">
                                    <template v-if="Number(item.coupon.min_price) > 0">
                                        满{{ item.coupon.min_price | setNumber }}可用
                                    </template>
                                    <template v-else> 无门槛使用 </template>
                                </view>
                            </view>
                            <view class="he-item-content flex-sub flex">
                                <view class="he-item-text flex-twice">
                                    <view class="he-item-name">{{ item.coupon.name }}</view>
                                    <view class="he-item-applicable">{{
                                        item.coupon.appoint_type === 1
                                        ? "全部商品可用"
                                        : "部分商品可用"
                                        }}</view>
                                </view>
                                <view class="he-item-radio flex align-center justify-center">
                                    <he-radio :value="true" v-if="item.radio"></he-radio>
                                </view>
                            </view>
                        </view>
                        <view class="he-coupon-center">
                            <view class="he-coupon-doc"></view>
                            <view class="he-coupon-doc"></view>
                            <view class="he-border-line" :style="[lineColor(item)]"></view>
                        </view>
                        <view class="he-coupon-bottom">
                            <view class="he-coupon-time">
                                {{ item.begin_time | timeFormat("yyyy-mm-dd hh:MM:ss") }} -
                                {{ item.end_time | timeFormat("yyyy-mm-dd hh:MM:ss") }}
                            </view>
                        </view>
                        <view v-if="!item.isAvailable" class="he-coupon-footer">未达商品使用门槛金额</view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </he-popup>
</template>
<script>
import hePopup from "@/components/he-popup.vue";
import heRadio from "@/components/he-radio.vue";
import heNoContentYet from "@/components/he-no-content-yet.vue";

export default {
    name: "detail-shipping-address",
    components: {
        hePopup,
        heRadio,
        heNoContentYet,
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
        userCouponId: {
            type: Number,
        },
    },
    computed: {
        showModal: {
            get: function() {
                return this.value;
            },
            set: function(val) {
                this.$emit("input", val);
            },
        },
        lineColor: function() {
            return (item) => {
                let color = this.themeColor;
                if (!item.isAvailable) {
                    color = "#cccccc";
                }
                return {
                    backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} 50%, transparent 0%)`,
                };
            };
        },
    },
    filters: {
        setNumber: function(num) {
            return Number(num);
        },
    },
    methods: {
        apply: function(item) {
            // 可使用优惠券
            if (item.isAvailable) {
                this.coupon.forEach(function(item) {
                    item.radio = false;
                });
                if (this.userCouponId !== item.id) {
                    item.radio = true;
                    this.$emit("apply", item.id);
                } else {
                    this.$emit("apply", null);
                }
                this.showModal = false;
            }
        },
    },
};
</script>
<style scoped lang="scss">
.detail-shipping-address {
    height: 63vh;
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
    overflow: hidden;
    padding-bottom: 10px;
}

.he-coupon-item {
    margin-bottom: 16px;
    border-radius: 16px;

    .he-coupon-bottom,
    .he-coupon-top {
        border-left: 1px solid transparent;
        border-right: 1px solid transparent;
        @include border_color("border_color");
    }

    .he-coupon-top {
        height: 152px;
        border-top: 1px solid transparent;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        padding-left: 16px;
        position: relative;

        .he-coupon-recommended-sign {
            position: absolute;
            top: 0;
            right: 0;
            width: 102px;
            height: 40px;
            @include background_color("background_color");
            border-radius: 0px 16px 0px 16px;
            font-size: 22px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #fffefe;
            padding-left: 14px;
        }

        .icontuijian {
            font-size: 24px;
            margin-right: 8px;
        }

        .he-item-number {
            width: 200px;
            padding: 36px 0 28px 0;
            text-align: center;
        }

        .he-item-condition,
        .he-item-price {
            @include font_color("font_color");
        }

        .he-item-price {
            font-size: 50px;
            font-family: DIN;
            font-weight: bold;
            line-height: 52px;
        }

        .he-item-price::before {
            content: "¥";
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
        }

        .he-item-condition {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 36px;
        }

        .he-item-content {
            padding-left: 16px;

            .he-item-text {
                text-align: left;
                font-family: PingFang SC;
                font-weight: 500;
                padding: 42px 0 34px 0;
            }

            .he-item-name {
                font-size: 30px;
                color: #222222;
                line-height: 40px;
            }

            .he-item-applicable {
                font-size: 22px;
                color: #999999;
                line-height: 28px;
                margin-top: 8px;
            }

            .he-item-radio {
                width: 130px;
            }
        }
    }

    .he-coupon-center {
        height: 16px;
        position: relative;
        overflow: hidden;

        .he-coupon-doc {
            width: 16px;
            height: 16px;
            position: absolute;
            border: 1px solid transparent;
            border-radius: 50%;
            background: #fff;
            @include border_color("border_color");
        }

        .he-coupon-doc:first-child {
            left: 0;
            transform: translateX(-50%);
        }

        .he-coupon-doc:nth-child(2) {
            right: 0;
            transform: translateX(50%);
        }

        .he-border-line {
            position: absolute;
            height: 1px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 96%;
            background-size: 14px 1px;
            background-repeat: repeat-x;
        }
    }

    .he-coupon-bottom {
        height: 56px;
        border-bottom: 1px solid transparent;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;

        .he-coupon-time {
            font-size: 22px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
            line-height: 44px;
            padding-left: 23px;
        }
    }
}

.he-coupon-item-radio {
    @include background_color("opacify_background_0");
}

.he-coupon-item.he-coupon-item-unavailable {
    background: #f5f5f5;

    .he-coupon-top,
    .he-coupon-bottom {
        border-color: #cccccc !important;
        background: #fff;
    }

    .he-coupon-top {

        .he-item-price,
        .he-item-condition {
            color: #999999 !important;
        }
    }

    .he-coupon-center {
        background: #fff;

        .he-coupon-doc {
            border-color: #cccccc !important;
        }
    }

    .he-coupon-footer {
        height: 64px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        line-height: 64px;
        padding-left: 24px;
    }
}
</style>