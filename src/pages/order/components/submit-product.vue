<template>
    <view class="submit-product" :data-theme="theme">
        <view class="he-header">商品信息</view>
        <view class="he-product-list">
            <view class="he-item flex" v-for="(item, index) in goodsData" :key="index">
                <view class="he-item__image__box">
                    <he-image :width="160" :height="160" :src="item.goods_image"></he-image>
                    <!-- <image class="he-item__image" :src="item.goods_image"></image> -->
                    <view class="he-item__fail" v-if="item.failure_reason && !display">
                        <view class="he-item__text">失效</view>
                    </view>
                    {{toDisplay(item.failure_reason)}}
                </view>
                <view class="he-item__content">
                    <view class="he-item__name he-line-1">{{item.goods_name}}</view>
                    <view class="he-item__attr">{{item.show_goods_param}}</view>
                    <view class="he-item__numberPrice">
                        <text class="he-item__number">x{{item.goods_number}}</text>
                        <text class="he-item__price" v-if="is_task">{{item.goods_score}}积分 + ¥{{item.goods_price}} </text>
                        <text class="he-item__price" v-else>¥{{item.goods_price}}</text>
                    </view>
                    <view class="he-item__fail-text">{{item.failure_reason | getFail(item.failure_number,is_task)}}</view>
                </view>
            </view>
        </view>
        <view class="task-popup" v-if="display">
            <view class="task-popup-mask"></view>
            <view class="task-popup-body">
                <view class="title">积分余额不足</view>
                <view class="msg">{{msg}}</view>
                <view class="button" @click="toUrl('/plugins/task/index')" :style="{backgroundColor: themeColor}">去赚积分</view>
                <view class="link" @click="toUrl('/plugins/task/mall')" :style="{color: themeColor}">看看其他积分商品 <text class="iconfont iconbtn_arrow"></text></view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: "submit-product",
    props: {
        goodsData: {
            type: Array,
            default: []
        },
        is_task: {
            type: [Number],
            default: 1
        }
    },
    data() {
        return {
            display: false,
            msg: ""
        }
    },
    filters: {
        getFail: function(reason, number, is_task) {
            //处理数据可能为null
            if (!number || number < 0 || number == null) {
                number = 0;
            }
            switch (reason) {
                case "limit":
                    if (is_task) {
                        return '购买数量超过兑换限制数' + number + '件';
                    } else {
                        return "商品限购" + number + "件";
                    }

            }
        }
    },
    methods: {
        toUrl(url) {
            uni.redirectTo({ url: url });
        },
        toDisplay(reason) {
            if (reason.length > 15) {
                var jsonObj = JSON.parse(reason);
                this.display = true;
                this.msg = jsonObj.msg;
            }
        }
    }
}
</script>
<style scoped lang="scss">
.task-popup {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;

    .task-popup-mask {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 100;
    }

    .task-popup-body {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 590px;
        height: 416px;
        margin-left: -295px;
        margin-top: -208px;
        background: #FFFFFF;
        border-radius: 16px;
        z-index: 101;

        .title {
            width: 190px;
            height: 31px;
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #222222;
            position: absolute;
            width: 100%;
            margin-top: 46px;
            text-align: center;
        }

        .msg {
            width: 100%;
            height: 25px;
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #666666;
            margin-top: 124px;
            text-align: center;
        }

        .button {
            position: absolute;
            width: 242px;
            height: 72px;
            background: #E60B30;
            border-radius: 36px;
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            left: 174px;
            top: 208px;
            text-align: center;
            line-height: 72px;
        }

        .link {
            position: absolute;
            width: 100%;
            text-align: center;
            height: 23px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #E60B30;
            top: 313px;

            .iconfont {
                font-size: 24px;
                width: 24px;
                height: 24px;
                line-height: 24px;
            }
        }
    }
}

.submit-product {
    width: 710px;
    background: #FFFFFF;
    border-radius: 16px;
    padding: 32px 24px;
    margin: 16px 20px 0 20px;
}

.he-header {
    font-family: PingFang SC;
    font-size: 26px;
    font-weight: 500;
    color: #222222;
}

.he-product-list {
    margin-top: 32px;
}

.he-item:not(:last-child) {
    margin-bottom: 32px;
}

.he-item__image {
    width: 160px;
    height: 160px;
    display: block;
}

.he-item__image__box {
    width: 160px;
    height: 160px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.he-item__fail {
    width: 160px;
    height: 160px;
    opacity: 0.6;
    position: absolute;
    top: 0;
    background-color: #FFFFFF;
}

.he-item__fail .he-item__text {
    width: 88px;
    height: 88px;
    background: #000000;
    opacity: 0.5;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 88px;
    text-align: center;
}

.he-item__fail-text {
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #E60B30;
}

.he-item__content {
    margin-left: 24px;
    width: 478px;
}

.he-item__name {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #222222;
    line-height: 1.3;
    margin-top: 8px;
}

.he-item__attr {
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
    margin-top: 10px;
}

.he-item__numberPrice {
    margin-top: 10px;
    font-weight: 500;
    font-family: PingFang SC;
}

.he-item__number {
    font-size: 22px;
    color: #999999;
    margin-right: 22px;
}

.he-item__price {
    font-size: 24px;
    color: #222222;
}
</style>