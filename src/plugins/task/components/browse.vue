<template>
  <div class="task">
    <view class="task-cbrowse" v-if="taskGoods.status && display">
      <image class="task-cbrowse-img" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/icon/task-cbrows-icon.png" />
      <div class="task-cbrowse-box">
        <div class="task-cbrowse-line">
          <div class="task-cbrowse-mark"></div>
        </div>
        <div class="task-cbrowse-txt">10s</div>
        <div class="task-cbrowse-tips" v-if="isComplete">任务完成</div>
        <div class="task-cbrowse-tips" v-else>
          {{ cbrowseTips }}
          <!-- 浏览商品{{taskGoods.log>taskGoods.total?taskGoods.total-1:taskGoods.log}}/{{taskGoods.total}} -->
        </div>
      </div>
    </view>
    <taskpopups
      v-model="item.display"
      :title="item.remark"
      :index="index"
      v-for="(item, index) in popupsList"
      :key="index"
    ></taskpopups>
  </div>
</template>
<script>
import taskpopups from '@/plugins/task/components/popups.vue';
export default {
  components: {
    taskpopups
  },
  props: {
    display: {
      type: [String, Number, Boolean],
      default: 0
    },
    score: {
      type: [String, Number],
      default: '10'
    },
    title: {
      type: [String, Number],
      default: '领取成功'
    },
    goods_id: {
      type: [Number],
      default: 0
    }
  },
  data() {
    return {
      popupsList: [],
      isComplete: 0,
      taskGoods: {
        status: 0
      },
      timeoutID: null
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    cbrowseTips() {
      let { taskGoods } = this;
      let num = 0;
      if (taskGoods.log >= taskGoods.total && this.isComplete == false) {
        num = taskGoods.total - 1;
      } else {
        num = taskGoods.log;
      }
      return '浏览商品' + num + '/' + taskGoods.total;
    }
  },
  mounted() {
    this.statusTaskGoods();
  },
  methods: {
    /**
     * 处理数字显示问题
     * @return {[type]} [description]
     */
    getBrowseInfo() {
      let { taskGoods } = this;
      if (taskGoods.log > taskGoods.total) {
        return taskGoods.total - 1;
      } else {
        return taskGoods.log;
      }
    },
    /**
     * 执行关闭
     * @return {[type]} [description]
     */
    toclose() {
      this.$parent.display = false;
    },
    /**
     *查询状态
     * @return {[type]} [description]
     */
    statusTaskGoods() {
      this.$heshop.plugin('get', { include: 'task', model: 'score', type: 'single', keyword: 'browse' }).then(res => {
        if (res == null) {
          this.getTaskGoods();
        } else if (res.status === 0) {
        } else if (res.status === 1) {
        } else {
          this.taskGoods = {};
        }
      });
    },
    /**
     * 获取任务信息
     * @return {[type]} [description]
     */
    getTaskGoods() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'task', keyword: 'browse' })
        .then(res => {
          if (res.status) {
            this.taskGoods = res;
            this.timeoutID = setTimeout(res => {
              this.onTaskBrowse();
              this.taskGoods.log++;
              if (this.taskGoods.log == this.taskGoods.total) {
                this.isComplete = true;
              }
              setTimeout(res => {
                if (this.taskGoods.log >= this.taskGoods.total) {
                  this.taskGoods.status = 0;
                }
              }, 1000);
            }, 12000);
          }
        })
        .catch(err => {});
    },
    onTaskBrowse() {
      //添加插件信息提交
      //用于延时测试数据
      let task_status = this.$manifest('task', 'status');
      let that = this;

      let goods_id = this.goods_id;

      if (task_status) {
        this.$heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: goods_id,
              keyword: 'browse'
            }
          )
          .then(res => {
            if (Object.prototype.toString.call(res) === '[object Object]') {
              that.$nextTick(() => {
                that.popupsList.push({
                  display: true,
                  remark: res.msg
                });
              });
            }
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.task-cbrowse {
  position: fixed;
  width: 176px;
  height: 128px;
  left: 0;
  bottom: 15vh;
  padding: 0;
  margin: 0;
}

.task-cbrowse-img {
  width: 176px;
  height: 72px;
  padding: 0;
  margin: 0;
}

.task-cbrowse-box {
  position: absolute;
  top: 72px;
  left: 18px;
  width: 140px;
  height: 56px;
  background: linear-gradient(0deg, #e9621f 0%, #ffb541 100%);
  border-radius: 8px;
  padding: 0;
  margin: 0;
}

.task-cbrowse-tips {
  position: absolute;
  left: 0;
  bottom: -2px;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 36px;
  width: 100%;
  text-align: center;
}

.task-cbrowse-line {
  position: absolute;
  left: 11px;
  top: 12px;
  overflow: hidden;
  width: 80px;
  height: 8px;
  background: #c6551d;
  border-radius: 4px;
}

.task-cbrowse-mark {
  position: absolute;
  left: 0;
  top: 0;
  width: 40%;
  height: 8px;
  background: #ffdd83;
  border-radius: 4px;

  animation-duration: 10s;
  animation-name: mark;
  animation-fill-mode: forwards;
}

.task-cbrowse-txt {
  position: absolute;
  top: 0px;
  right: 12px;
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 36px;
}

@keyframes mark {
  0% {
    opacity: 1;
    width: 0;
  }

  100% {
    opacity: 1;
    width: 100%;
  }
}
</style>
