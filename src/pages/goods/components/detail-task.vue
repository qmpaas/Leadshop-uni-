<template>
  <view class="detail-parameter" v-if="$manifest('task', 'status') && is_display">
    <view style="width: 100%" class="flex align-start">
      <text class="he-item__label">活动</text>
      <text class="he-item__value">
        {{ getShowTextInfo(taskList) }}
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'detail-task',
  props: {},
  data() {
    return {
      taskList: {}
    };
  },
  computed: {
    is_display({ taskList }) {
      if (Object.getOwnPropertyNames(taskList).length > 0) {
        if (taskList['goods'] && taskList['goods'].status) {
          return true;
        }
        if (taskList['order'] && taskList['order'].status) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    this.handleTaskList();
  },
  methods: {
    /**
     * 处理逗号是否显示用
     * @return {[type]} [description]
     */
    getShowTextInfo(taskList) {
      let a = taskList['goods'].status;
      let b = taskList['order'].status;
      let text = '';
      if (a) {
        text += taskList['goods'].declare;
      }
      if (a && b) {
        text += '，';
      }
      if (b) {
        text += taskList['order'].declare;
      }
      return text;
    },
    /**
     * 签到列表计算
     * @return {[type]} [description]
     */
    handleTaskList() {
      this.$heshop.plugin('get', { include: 'task', model: 'task', goods_info: 1 }).then(res => {
        this.taskList = res;
      });
    }
  }
};
</script>

<style scoped>
.detail-parameter {
  margin: 20px 20px 0 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 24px;
}

.he-item__label {
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.he-item__value {
  width: calc(100% - 91px);
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  margin-left: 21px;
}
</style>
