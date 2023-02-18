<template>
    <view class="" :data-theme="theme">
        <he-popup v-model="showModal" :maskCloseAble="false" mode="center" :border-radius="16" :zoom="false"
                  width="590rpx" height="760rpx">
            <view class="he-information-box flex flex-direction align-center">
                <view class="title">登录后可体验更多功能</view>
                <view class="avatar-box">
                    <button open-type="chooseAvatar" @chooseavatar="onChooseAvatar"
                            class="avatar-button flex justify-center align-center">
                        <image :src="form.avatar" v-if="!avatar" class="avatar" mode="aspectFill"></image>
                        <image :src="avatar" v-else class="avatar" mode="aspectFill"></image>
                    </button>
                    <view class="icon flex justify-center align-center">
                        <text class="iconfont icondynamic_release"></text>
                    </view>
                </view>
                <view class="input-content">
                    <input type="nickname" :maxlength="15" @change="getNickname" v-model="nickname" class="nickname"
                           placeholder="请输入昵称" />
                </view>
                <view class="tips">99%的用户使用选择微信头像和微信昵称便于订单发货和售后沟通</view>
                <view class="login-button" @click="submit">立即登录</view>
                <view class="not-login" @click="notLogIn">暂不登录</view>
            </view>
        </he-popup>
    </view>
</template>

<script>
import hePopup from './he-popup.vue';

export default {
    name: 'he-login-model',
    components: {
        hePopup,
    },
    data() {
        return {
            form: {
                avatar: '',
                nickname: ''
            },
            avatar: '',
            nickname: ''
        };
    },
    computed: {
        showModal: {
            get({ $store }) {
                return $store.state.apply.showInformationModal;
            },
            set(value) {
                this.$store.commit('apply/setInformationModel', value);
            }
        },
        userInfo: function () {
            return this.$store.state.apply.userInfo;
        }
    },
    methods: {
        onChooseAvatar(e) {
            // this.avatar = e.detail.avatarUrl;
            this.uploadImg(e.detail.avatarUrl)
        },
        notLogIn() {
            this.showModal = false;
        },
        submit() {
            if (!this.avatar) {
                uni.showToast({
                    title: '请上传头像',
                    icon: 'none'
                })
                return;
            } else if (!this.nickname) {
                uni.showToast({
                    title: '请填写昵称',
                    icon: 'none'
                })
                return;
            }
            if (this.nickname && this.avatar) {
                this.$heshop.users('put', { behavior: 'setting' }, {
                    ...this.form,
                    avatar: this.avatar,
                    nickname: this.nickname,
                }).then(() => {
                    this.$store.dispatch('user/getUserProfile');
                    this.showModal = false;
                });
            }
        },
        getNickname(e) {
            this.nickname = e.detail.value;
        },
        uploadImg(filePath) {
            let _this = this;
            this.$h.srcToBase64(filePath).then(function (res) {
                _this.$heshop
                    .upload(res)
                    .then(function (data) {
                        _this.avatar = data;
                    });
            });
        }
    },
    watch: {
        showModal: {
            handler(value) {
                if (value) {
                    this.$heshop.users('get', { behavior: 'info' }).then(res => {
                        this.form = res;
                    });
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
.he-information-box {
    padding: 72px 0 0 0;

    .title {
        font-size: 40px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
    }

    .avatar-box {
        position: relative;
        margin-top: 48px;
    }

    .icon {
        width: 48px;
        height: 48px;
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
        border-radius: 50%;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .icondynamic_release {
        font-size: 26px;
    }

    .avatar-button {
        width: 168px;
        height: 168px;
        background: #FFFFFF;
        border: 4px solid #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
        border-radius: 50%;
        padding: 0;

        .avatar {
            width: 148px;
            height: 148px;
            border-radius: 50%;
        }

    }

    .input-content {
        margin-top: 56px;
        width: 438px;
        border-bottom: 1px solid #E5E5E5;
        line-height: 56px;
    }

    .nickname {
        text-align: center;
    }

    .tips {
        width: 398px;
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 30px;
        margin-top: 24px;
        text-align: center;
    }

    .login-button {
        width: 420px;
        height: 80px;
        border-radius: 40px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        text-align: center;
        line-height: 80px;
        @include background_color('background_color');
        margin-top: 36px;
    }

    .not-login {
        width: 420px;
        height: 80px;
        text-align: center;
        line-height: 80px;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        margin-top: 16px;
    }
}
</style>
