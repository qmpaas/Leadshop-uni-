<template>
  <view class="task" :data-theme="theme" :style="[topHeight]">
    <skeleton v-if="loading"></skeleton>
    <template v-else>
      <view class="task-background">
        <view class="task-background1"></view>
        <view class="task-background2"></view>
        <image
          class="task-background3"
          src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/tack-backgroud-top.png"
        ></image>
        <view class="task-background__text" @click="navigateTo('rules')">积分规则</view>
        <view class="task-background__current">当前积分</view>
        <image class="task-background__icon" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
        <view class="task-background__info">
          <text class="_number">
            {{ userInfo.number }}
          </text>
          <text class="_detail" @click="navigateTo('lists')"> 明细 </text>
          <text class="iconfont iconbtn_arrow"></text>
        </view>
        <view class="task-background__btn" @click="navigateTo('mall')">兑换商品</view>
      </view>
      <view class="task-main">
        <view class="task-panel" v-if="is_sign">
          <view class="task-panel__title" v-if="signin.remark">
            {{ sprintf(signin.remark, signin.acquire) }}
            <text v-if="sustain && sustain.status">
              , {{ sprintf(sustain.remark, sustain.total, sustain.acquire) }}
            </text>
          </view>
          <view class="task-panel__title2" v-if="signin.remark">
            <text v-if="sustain && sustain.status">已连续签到{{ continuous }}天</text>
          </view>
          <view class="task-panel__lists">
            <view class="task-panel__item" v-for="(item, index) in signList" :key="index">
              <view class="__bg" :class="{ active: item.status == 1 }">
                <image
                  src="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/task_integral_w.png"
                  v-if="item.status == -1"
                />
                <image
                  src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral_s.png"
                  v-if="item.status == 1"
                />
                <image src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" v-if="item.status === 0" />
                <text class="__tips" v-if="item.status == 1">已签</text>
                <text class="__tips" v-if="item.status == -1">漏签</text>
                <text class="__tips" v-if="item.status == 0">{{ signin.acquire }}</text>
              </view>
              <view class="__date">{{ item.date }}</view>
            </view>
          </view>
          <view class="task-panel__button_w" v-if="alreadySigned"> 已签到 </view>
          <template v-if="!alreadySigned">
            <!-- #ifdef H5 -->
            <div class="task-panel__button_b">
              <he-open-subscribe @open-subscribe-success="handleSign" :template-id="tmplIds">
                <view class="task-panel__button_h5" :style="{ backgroundColor: themeColor }"> 签到领积分 </view>
              </he-open-subscribe>
            </div>
            <!-- #endif -->
            <!--  #ifdef MP-WEIXIN -->
            <view class="task-panel__button" @click="handleSign" :style="{ backgroundColor: themeColor }">
              签到领积分
            </view>
            <!-- #endif -->
          </template>
        </view>
        <view class="task-body" v-if="noTask">
          <view class="task-card" v-for="(item, index) in taskList" :key="index" v-if="item.display">
            <view class="task-card__header">{{ item.title }}</view>
            <view class="task-card__lists">
              <view class="__item" v-for="(i, k) in item.data" :key="k" v-if="i.status">
                <image class="__icon" :src="i.icon" />
                <view class="__info">
                  <view class="__title">{{ i.name }}</view>
                  <view class="__tips" v-if="['perfect', 'binding'].indexOf(i.keyword) != -1">{{
                    sprintf(i.remark, i.acquire)
                  }}</view>
                  <view class="__tips" v-else>{{ sprintf(i.remark, i.total, i.acquire) }}</view>
                  <view
                    class="__notice"
                    :style="{ color: themeColor }"
                    v-if="scoreArray[i.keyword] && !fulfilArray[i.keyword]"
                    >{{ scoreArray[i.keyword] }}积分待领取</view
                  >
                  <template v-else>
                    <view class="__notice" :style="{ color: themeColor }" v-if="showTipsInfo(i)">
                      <template v-if="i.prompt && i.log && !fulfilArray[i.keyword]">
                        {{ showTipsInfo(i) }}
                      </template>
                    </view>
                  </template>
                  <view
                    class="__btn active"
                    style="background: #cccccc; border-color: #cccccc"
                    v-if="fulfilArray[i.keyword]"
                    >已领取</view
                  >
                  <template v-else>
                    <template v-if="scoreArray[i.keyword]">
                      <!-- #ifdef H5 -->
                      <div
                        class="__btn active"
                        style="border: 0"
                        :style="{ backgroundColor: themeColor, borderColor: themeColor }"
                      >
                        <he-open-subscribe
                          @open-subscribe-success="handleTaskReceive(i.id, i.keyword)"
                          :template-id="tmplIds"
                        >
                          <text>领取</text>
                        </he-open-subscribe>
                      </div>
                      <!-- #endif -->
                      <!--  #ifdef MP-WEIXIN -->
                      <view
                        class="__btn active"
                        @click="handleTaskReceive(i.id, i.keyword)"
                        :style="{ backgroundColor: themeColor, borderColor: themeColor }"
                        >领取</view
                      >
                      <!-- #endif -->
                    </template>
                    <view
                      class="__btn"
                      v-else
                      @click="navigateLink(i.url)"
                      :style="{ borderColor: themeColor, color: themeColor }"
                      >去完成</view
                    >
                  </template>
                </view>
              </view>
            </view>
          </view>
        </view>
        <he-no-content-yet
          v-if="!noTask"
          text="暂无相关积分任务"
          image="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task-score-empty.png"
          type="card"
        ></he-no-content-yet>
        <heProductsFeatured :is_task="true"></heProductsFeatured>
        <view class="he-top flex justify-center align-center">
          <view
            class="task-viewmore"
            @click="navigateTo('mall')"
            :style="{ borderColor: themeColor, color: themeColor }"
          >
            逛更多积分商品
          </view>
        </view>
      </view>
      <view class="task-cartoon" v-if="display">
        <cartoon :score="cartoonData.score" :title="cartoonData.title" v-model="display"></cartoon>
      </view>
      <!-- #ifdef H5 -->
      <!--         <he-open-subscribe @open-subscribe-success="submit" :template-id="tmplIds">
            <button class="cu-btn he-submit-btn" :disabled="isSubmit">提交</button>
        </he-open-subscribe> -->
      <!-- #endif -->
    </template>
  </view>
</template>
<script type="text/javascript">
/**
 * 时间戳转日期
 * @param  {[type]} nS [description]
 * @return {[type]}    [description]
 */
Date.prototype.Formattask = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, this.getFullYear() + '');
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
};
/**
 * 获得时间差
 * @param  {[type]} sDate1 [description]
 * @param  {[type]} sDate2 [description]
 * @return {[type]}        [description]
 */
function datedifference(sDate1, sDate2) {
  //sDate1和sDate2是2006-12-18格式
  var dateSpan, tempDate, iDays;
  sDate1 = new Date(Number(sDate1) * 1000).Formattask('yy-MM-dd');
  sDate2 = new Date(Number(sDate2) * 1000).Formattask('yy-MM-dd');
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays;
}

/**
 * 获取几天前
 * @param  {[type]} day [description]
 * @return {[type]}     [description]
 */
function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + '-' + tMonth + '-' + tDate;
}

/**
 * 获取月
 * @param  {[type]} month [description]
 * @return {[type]}       [description]
 */
function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = '0' + month;
  }
  return m;
}
import cartoon from './components/cartoon.vue';
import heProductsFeatured from '@/components/he-products-featured.vue';
import heOpenSubscribe from '@/components/he-open-subscribe.vue';
import heNoContentYet from '@/components/he-no-content-yet.vue';
import skeleton from './components/skeleton.vue';
export default {
  components: {
    cartoon,
    heProductsFeatured,
    heOpenSubscribe,
    heNoContentYet,
    skeleton
  },
  data() {
    return {
      loading: false,
      noTask: true,
      //判断连续签到
      continuous: 0,
      cartoonData: {
        score: 0,
        title: '领取成功'
      },
      display: 0,
      //积分记录
      scoreArray: {},
      //完成记录
      fulfilArray: {},
      //用于判断是否签到
      alreadySigned: 0,
      taskInfo: {
        number: 15
      },
      //每日签到
      signin: {
        acquire: 0
      },
      //连续签到
      sustain: {},
      taskList: {},
      is_sign: true,
      signList: [],
      userInfo: {
        number: 0
      }
    };
  },
  computed: {
    tmplIds: function () {
      let tmplIds = [this.$store.getters['setting/subscribe'].task_refund_tpl];
      return tmplIds;
    },
    topHeight: function () {
      return {
        height: `${uni.upx2px(320) + this.$store.statusBarHeight + this.navbarHeight}px`
      };
    }
  },
  onShow() {
    this.init();
  },
  /**
   * 页面加载时执行
   * @return {[type]} [description]
   */
  onReady() {
    this.loading = true;
  },
  methods: {
    init() {
      this.handleSignData();
      this.handleLoadData();
      this.handleTaskList();
      this.getTaskSignin();
    },
    /**
     * 显示提示信息
     * @return {[type]} [description]
     */
    showTipsInfo(i) {
      if (i.log && i.prompt) {
        let num = Number(i.total) - Number(i.log);
        if (num <= 0) {
          num = 1;
        }
        let data = '';
        if (i.keyword == 'order') {
          data = this.sprintf(i.extra, num);
        } else {
          data = this.sprintf(i.prompt, num);
        }
        return data;
      } else {
        return '';
      }
    },
    /**
     * 签到列表计算
     * sustain
     * @return {[type]} [description]
     */
    getTaskSignin() {
      this.$heshop.plugin('get', { include: 'task', model: 'task', keyword: 'signin' }).then(res => {
        this.is_sign = res.status;
      });
    },
    /**
     * 处理订阅消息
     * @return {[type]} [description]
     */
    handleTaskMsg() {
      return new Promise((resolve, reject) => {
        let _this = this;
        if (_this.tmplIds.length) {
          //#ifdef MP_WEIXIN
          uni.requestSubscribeMessage({
            tmplIds: _this.tmplIds,
            success: function () {},
            fail: function (e) {
              resolve();
            },
            complete: function (e) {
              resolve();
            }
          });
          //#endif
          //#ifdef H5
          resolve();
          //#endif
        } else {
          resolve();
        }
      });
    },
    /**
     * 执行用户数据加载
     * @return {[type]} [description]
     */
    handleLoadData() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'user' })
        .then(res => {
          this.userInfo = res;
        })
        .catch(err => {});
    },
    /**
     * 执行签到接口
     * @return {[type]} [description]
     */
    handleSign() {
      //执行消息入口
      this.handleTaskMsg().then(res => {
        this.$heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: 1,
              keyword: 'signin'
            }
          )
          .then(res => {
            if (res.code === 0) {
              this.cartoonData.score = res.data;
              this.cartoonData.title = res.msg;
              this.display = true;
              this.alreadySigned = 1;
              this.handleSignData();
            }
          })
          .catch(err => {});
      });
    },
    /**
     * 执行签到接口
     * @return {[type]} [description]
     */
    handleSignData() {
      let array = [];
      this.continuous = 0;
      this.$heshop
        .plugin('get', { include: 'task', model: 'sign' })
        .then(res => {
          try {
            let _l = res.length;
            //判断如果长度>1的情况就要做时间比对
            let day = 0;
            let _list = [];
            if (_l >= 1) {
              //存储已经签到的日期
              for (let index in res) {
                let _d = new Date(res[index]['start_time'] * 1000).Formattask('yy-MM-dd');
                _list.push(_d);
              }
              //判断开头和结尾相差多少天
              let start = res[0];
              let end = res[_l - 1];

              //存储相差天数

              day = datedifference(start['start_time'], end['start_time']);
              if (day < 3) {
                var time = Date.parse(new Date()).toString();
                time = time.substr(0, 10);
                day = datedifference(start['start_time'], time);
              }
            }
            //循环读取天数
            for (var i = -day; i < 7 - day; i++) {
              let on_day = getDay(i);
              //如果存在则是已签到
              if (_list.indexOf(on_day) != -1) {
                array.push({
                  date: new Date(on_day).Formattask('MM.dd'),
                  status: 1
                });
                if (i === 0) {
                  //判断是否为已经签到
                  this.alreadySigned = 1;
                }
                this.continuous++;
              }
              //如果不存在则判断是否小于0
              else {
                //标识漏签
                if (i < 0) {
                  array.push({
                    date: new Date(on_day).Formattask('MM.dd'),
                    status: -1
                  });
                  this.continuous = 0;
                } else {
                  array.push({
                    date: new Date(on_day).Formattask('MM.dd'),
                    status: 0
                  });
                }
              }
            }
            this.signList = array;
            setTimeout(() => {
              this.loading = false;
            }, 100);
            this.handleLoadData();
          } catch (error) {}
        })
        .catch(() => {});
    },
    /**
     * 签到列表计算
     * @return {[type]} [description]
     */
    handleTaskList() {
      this.$heshop.plugin('get', { include: 'task', model: 'task' }).then(res => {
        this.signin = res['signin'];
        this.sustain = res['sustain'];
        //执行日志获取
        this.handleTaskLog();
        this.handleTaskFulfil();
        let array = {
          buy: {
            title: '购买任务',
            display: res['goods'].status || res['order'].status,
            data: [res['goods'], res['order']]
          },
          active: {
            title: '活跃任务',
            display: res['share'].status || res['browse'].status || res['invite'].status,
            data: [res['share'], res['browse'], res['invite']]
          },
          base: {
            title: '基础任务',
            display: res['perfect'].status || res['binding'].status,
            data: [res['perfect'], res['binding']]
          }
        };
        this.noTask = array['buy'].display || array['active'].display || array['base'].display || this.signin.status;
        this.taskList = array;
      });
    },
    /**
     * 获取日志
     * @return {[type]} [description]
     */
    handleTaskLog() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'score' })
        .then(res => {
          let array = {};
          for (let index in res) {
            let item = res[index];
            if (array[item.task.keyword]) {
              array[item.task.keyword] += item.number;
            } else {
              array[item.task.keyword] = item.number;
            }
          }
          this.scoreArray = array;
        })
        .catch(err => {});
    },
    /**
     * 获取日志
     * @return {[type]} [description]
     */
    handleTaskFulfil() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'score', type: 'fulfil' })
        .then(res => {
          let array = {};
          for (let index in res) {
            let item = res[index];
            array[item.task.keyword] = 1;
          }

          this.fulfilArray = array;
        })
        .catch(err => {});
    },
    /**
     * 处理积分领取
     * @param  {[type]} task_id [description]
     * @return {[type]}         [description]
     */
    handleTaskReceive(task_id, keyword) {
      this.handleTaskMsg().then(res => {
        this.$heshop
          .plugin(
            'put',
            { include: 'task', model: 'task' },
            {
              task_id: task_id
            }
          )
          .then(res => {
            if (res) {
              this.cartoonData.score = this.scoreArray[keyword];
              this.cartoonData.title = '领取成功';
              this.display = true;
              this.handleTaskList();
              this.handleLoadData();
            }
          })
          .catch(err => {});
      });
    },
    /**
     * 跳转界面
     * @param  {String} type [description]
     * @return {[type]}      [description]
     */
    navigateTo(type = 'mall') {
      uni.navigateTo({ url: '/plugins/task/' + type });
    },
    /**
     * 跳转界面
     * @param  {String} type [description]
     * @return {[type]}      [description]
     */
    navigateLink(href) {
      uni.navigateTo({
        url: href,
        fail() {
          uni.switchTab({
            url: href,
            fail() {}
          });
        }
      });
    },
    /**
     * 查找统换
     * @return {[type]} [description]
     */
    sprintf() {
      var arg = arguments,
        str = arg[0] || '',
        i,
        n;
      for (i = 1, n = arg.length; i < n; i++) {
        str = str.replace(/%s/, arg[i]);
      }
      return str;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
