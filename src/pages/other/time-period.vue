<template>
  <view class="select_date" :data-theme="theme" :class="{ move: isShow && option.isModal, init: !option.isModal }">
    <view class="week">
      <view v-for="(item, index) in weekData" :key="index">{{ item }}</view>
    </view>
    <scroll-view
      :scroll-into-view="scrollIntoView"
      scroll-y
      class="main"
      :class="{ init: !option.isModal, show_submit: option.isShowSubmit }"
    >
      <view class="list" v-for="(item, index) in totalDate" :key="index">
        <view class="title">{{ titleDateFormat(item.info[0].date) }}</view>
        <view class="date">
          <view
            @click="clickDay(index, y)"
            :class="{
              range_space: x.isRangeStyle,
              choosed: (x.isChoosed || x.isRangeStart || x.isRangeEnd) && !x.isSpace,
              disabled: x.isDisadled
            }"
            v-for="(x, y) in item.info"
            :key="y"
          >
            <view>{{ x.day }}</view>
          </view>
        </view>
      </view>
      <view id="bottom"></view>
    </scroll-view>
    <view v-if="(option.isModal || option.isShowSubmit) && isShow" @click="clickSubmit" class="footer">
      <button :class="{ disabled: isDisabledBtn }" hover-class="hover">确定</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      weekData: ['日', '一', '二', '三', '四', '五', '六'],
      totalDate: [],
      chooseOneDate: this.$h.timeFormat(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-mm-dd'), //单选模式当前点击的日期
      currentRangeStartDate: this.$h.timeFormat(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-mm-dd'), //区域选择模式当前点击的开始日期
      currentRangeEndDate: this.$h.timeFormat(new Date(), 'yyyy-mm-dd'), //区域选择模式当前点击的结束日期
      outIndex: 0, //当前点击外索引
      innerIndex: 0, //当前点击内索引
      isShow: false,
      option: {
        chooseOneDate: this.$h.timeFormat(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-mm-dd'), //根据实际业务需求设置的默认单选日期，可为空,默认今天
        initStartDate: '2021-04-14', //可选起始时间，可为空,默认今天
        initEndDate: this.$h.timeFormat(new Date(), 'yyyy-mm-dd'), //可选结束时间，可为空,默认4个月后
        isRange: true, //是否开启范围选择，默认false
        isModal: false, //是否弹窗模式，默认false
        isShowSubmit: true //页面模式中是否显示页面模式底部的确定按钮，默认false
      },
      scrollIntoView: ''
    };
  },
  mounted() {
    this.totalDateInit();
    if (!this.option.isModal) {
      setTimeout(() => {
        this.open();
      }, 0);
    }
  },
  watch: {
    isShow(n) {
      if (n) {
        this.dateFirstInit();
        this.scrollIntoView = 'bottom';
      }
    }
  },
  computed: {
    isDisabledBtn() {
      if (this.option.isRange) {
        return !(this.currentRangeStartDate && this.currentRangeEndDate);
      } else {
        return !this.chooseOneDate;
      }
    }
  },
  methods: {
    titleDateFormat(date) {
      //2021年4月格式化
      const _arr = date.split('-');
      return `${_arr[0]}年${_arr[1] - 0}月`;
    },
    getNextMonth(AddDayCount = 6, date = new Date()) {
      //获取x个月后的日期
      if (typeof date !== 'object') {
        date = date.replace(/-/g, '/');
      }
      let dd = new Date(date);
      dd.setMonth(dd.getMonth() + AddDayCount);
      let y = dd.getFullYear();
      let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
      return y + '-' + m + '-' + d;
    },
    getNextDate(day = 1, date = new Date()) {
      var dd = new Date(date);
      dd.setDate(dd.getDate() + day);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
      var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
      return y + '-' + m + '-' + d;
    },
    noModalSubmit() {
      if (!this.option.isModal && !this.option.isShowSubmit) {
        setTimeout(() => {
          this.clickSubmit();
        }, 500);
      }
    },
    clickSubmit() {
      if (!this.isDisabledBtn) {
        //点击确定逻辑
        if (!this.option.isRange) {
          //单选
          this.$emit('change', {
            currentDate: this.chooseOneDate
          });
        } else {
          // 区域选择
          uni.setStorageSync(this.$storageKey.time_period, {
            startDate: this.currentRangeStartDate,
            endDate: this.currentRangeEndDate
          });
        }
        uni.navigateBack({
          delta: 1
        });
      }
    },
    dateFirstInit() {
      //首次数据初始化
      if (!this.option.isRange) {
        //单选
        this.chooseOneDate = this.option.chooseOneDate ? this.option.chooseOneDate : this.getNextDate(0);
        this.oneChooseFirstInit();
      } else {
        //区间选择
        this.currentRangeStartDate = this.option.currentRangeStartDate
          ? this.option.currentRangeStartDate
          : this.getNextDate(0);
        this.currentRangeEndDate = this.option.currentRangeEndDate
          ? this.option.currentRangeEndDate
          : this.getNextDate(1);
        this.rangeChooseFirstInit();
        this.spaceStyleRander();
      }
    },
    oneChooseFirstInit() {
      //首次引用单选初始化
      this.clearOneChoose();
      this.totalDate.forEach(x => {
        x.info.forEach(a => {
          if (a.date == this.chooseOneDate) {
            a.isChoosed = true;
          }
        });
      });
    },
    rangeChooseFirstInit() {
      //首次引用复选初始化
      this.clearRangeChoose();
      this.totalDate.forEach(x => {
        x.info.forEach(a => {
          if (a.date == this.currentRangeStartDate) {
            a.currentRangeStartDate = a.date;
            a.isRangeStart = true;
          }
          if (a.date == this.currentRangeEndDate) {
            a.currentRangeEndDate = a.date;
            a.isRangeEnd = true;
          }
        });
      });
    },

    close() {
      this.isShow = false;
    },
    open() {
      this.isShow = true;
    },
    clickDay(outIndex, innerIndex) {
      this.outIndex = outIndex;
      this.innerIndex = innerIndex;
      if (this.option.isRange) {
        this.chooseRangeInit();
      } else {
        this.chooseOneInit();
      }
    },
    chooseRangeInit() {
      //区域选择点击逻辑
      const _item = this.totalDate[this.outIndex].info[this.innerIndex];
      if (!_item.isDisadled && !_item.isSpace) {
        if (!this.currentRangeStartDate && !this.currentRangeEndDate) {
          //选择清空状态
          _item.currentRangeStartDate = _item.date;
          _item.currentRangeEndDate = '';
          _item.isRangeStart = true;
          this.currentRangeStartDate = _item.currentRangeStartDate;
          this.currentRangeEndDate = '';
          return;
        }
        if (this.currentRangeStartDate && !this.currentRangeEndDate) {
          //选择中
          if (new Date(_item.date) > new Date(this.currentRangeStartDate)) {
            _item.currentRangeEndDate = _item.date;
            _item.isRangeEnd = true;
            this.currentRangeEndDate = _item.currentRangeEndDate;
            this.spaceStyleRander();
            this.noModalSubmit();
            return;
          } else {
            this.clearRangeChoose();
            _item.currentRangeStartDate = _item.date;
            _item.currentRangeEndDate = '';
            _item.isRangeStart = true;
            this.currentRangeStartDate = _item.currentRangeStartDate;
            this.currentRangeEndDate = '';
            return;
          }
        }
        if (this.currentRangeStartDate && this.currentRangeEndDate) {
          //选择好了
          this.clearRangeChoose();
          _item.currentRangeStartDate = _item.date;
          _item.currentRangeEndDate = '';
          _item.isRangeStart = true;
          this.currentRangeStartDate = _item.currentRangeStartDate;
          this.currentRangeEndDate = '';
          this.spaceStyleRander();
          return;
        }
      }
    },
    spaceStyleRander() {
      //区间样式渲染
      this.totalDate.forEach(x => {
        x.info.forEach(a => {
          if (
            !a.isSpace &&
            new Date(a.date) > new Date(this.currentRangeStartDate) &&
            new Date(a.date) < new Date(this.currentRangeEndDate)
          ) {
            a.isRangeStyle = true;
          } else {
            a.isRangeStyle = false;
          }
        });
      });
    },
    chooseOneInit() {
      //单选点击逻辑
      const _item = this.totalDate[this.outIndex].info[this.innerIndex];
      if (!_item.isDisadled && !_item.isSpace) {
        this.clearOneChoose();
        this.chooseOneDate = _item.date;
        _item.isChoosed = true;
        this.noModalSubmit();
      }
    },
    clearRangeChoose() {
      //清楚区间选择状态
      this.totalDate.forEach(x => {
        x.info.forEach(a => {
          a.currentRangeStartDate = '';
          a.currentRangeEndDate = '';
          a.isRangeStart = false;
          a.isRangeEnd = false;
          a.isRangeStyle = false;
        });
      });
    },
    clearOneChoose() {
      //清楚单选选择状态
      this.totalDate.forEach(x => {
        x.info.forEach(a => {
          if (a.isChoosed) {
            a.isChoosed = false;
          }
          a.currentRangeStartDate = '';
          a.currentRangeEndDate = '';
        });
      });
    },
    getMaxDate(date) {
      //获取某一月份的最大日期数，参数传递类似2019-12-15，返回31
      let _arr = date.split('-');
      return new Date(_arr[0], _arr[1], 0).getDate();
    },
    getMonthBetween(date1, date2) {
      var _date1 = date1.split('-');
      _date1 = parseInt(_date1[0]) * 12 + parseInt(_date1[1]);
      var _date2 = date2.split('-');
      _date2 = parseInt(_date2[0]) * 12 + parseInt(_date2[1]);
      return Math.abs(_date1 - _date2) + 1;
    },
    weekInit(date) {
      //根据日期获得星期几
      var dateArray = date.split('-');
      var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
      var week = '0123456'.charAt(date.getDay());
      return week;
    },
    totalDateInit() {
      let _dateArr = [];
      let _initStartDate = this.option.initStartDate ? this.option.initStartDate : this.getNextDate(0);
      let _initEndDate = this.option.initEndDate ? this.option.initEndDate : this.getNextMonth(4);
      const _dateNum = this.getMonthBetween(_initStartDate, _initEndDate);
      const _arrStart = _initStartDate.split('-');
      const _arrEnd = _initEndDate.split('-');
      let _year = _arrStart[0] - 0;
      let _month = _arrStart[1] - 0;
      let _day = _arrStart[2] - 0;
      let _dayEnd = _arrEnd[2] - 0;
      this.totalDate = [];
      this.totalDate[0] = {};
      this.totalDate[0]['info'] = [];
      let _objMonth = '';
      _dateArr[0] = `${_year}-${_month < 10 ? '0' + _month : _month}-${_day < 10 ? '0' + _day : _day}`;
      let _num = 0;
      let _objYear = _year;
      for (var i = 1; i < _dateNum; i++) {
        let _obj = {};
        let _objDay = _day;
        if (i == _dateNum - 1) {
          _objDay = _dayEnd;
        }
        if (_month < 12 && i < _dateNum) {
          _month++;
          _objMonth = _month;
          _dateArr.push(
            `${_objYear}-${_objMonth < 10 ? '0' + _objMonth : _objMonth}-${_objDay < 10 ? '0' + _objDay : _objDay}`
          );
        } else if (_month == 12 && i < _dateNum) {
          _month = 1;
          _objYear++;
          _dateArr.push(`${_objYear}-01-${_objDay < 10 ? '0' + _objDay : _objDay}`);
        }
        _obj['info'] = [];
        this.totalDate.push(_obj);
      }
      this.totalDate.forEach((x, y) => {
        let _totalDate = this.getMaxDate(_dateArr[y]) - 0;
        for (var i = 1; i <= _totalDate; i++) {
          let _currentDate = `${_dateArr[y].split('-')[0]}-${_dateArr[y].split('-')[1]}-${i < 10 ? '0' + i : i}`;
          let _obj = {
            date: _currentDate,
            day: i,
            isDisadled: false,
            isChoosed: false,
            isRangeStart: false,
            isRangeEnd: false,
            currentRangeStartDate: '',
            currentRangeEndDate: '',
            isRangeStyle: false
          };

          if (this.totalDate.length <= 1) {
            if (y == 0 && (i < _day || i > _dayEnd)) {
              _obj.isDisadled = true;
            }
          } else {
            if ((y == 0 && i < _day) || (y == this.totalDate.length - 1 && i > _dayEnd)) {
              _obj.isDisadled = true;
            }
          }

          x['info'].push(_obj);
        }
        // 处理星期
        let weekDate = `${_dateArr[y].split('-')[0]}-${_dateArr[y].split('-')[1]}-01`;
        for (var i = 0; i < this.weekInit(weekDate); i++) {
          x['info'].unshift({ date: '', date: _dateArr[y], isSpace: true });
        }
      });
    },
    dateSpace(sDate1, sDate2) {
      //sDate1和sDate2是2006-12-18格式 得出量日期之间的天数
      var dateSpan, tempDate, iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays;
    }
  }
};
</script>

<style lang="scss" scoped>
.select_date {
  width: 100%;
  height: 90vh;
  position: fixed;
  top: 100%;
  left: 0;
  background-color: #fff;
  z-index: 10001;
  transition: all 0.2s;
}

.move {
  top: 10vh;
}

.init {
  top: 0;
  height: 100vh;
}

.footer {
  height: 120px;
  width: 686px;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;

  > button {
    height: 80px;
    line-height: 80px;
    margin: 20px 0 20px 0;
    text-align: center;
    @include background_color('background_color');
    border-radius: 40px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;

    &.disabled {
      background-color: #ccc;
    }
  }
}

.head {
  height: 60px;
  line-height: 60px;
  text-align: center;
  position: relative;

  > text {
    &:nth-child(1) {
    }

    &:nth-child(2) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      color: #f63;
    }
  }
}

.main {
  height: calc(90vh - 240px);

  &.init {
    height: calc(100vh - 80px);
  }

  &.show_submit {
    height: calc(100vh - 200px);
  }

  .list {
    > .date {
      padding: 0 25px;
      display: flex;
      flex-wrap: wrap;

      > view {
        width: 99px;
        height: 112px;
        text-align: center;
        margin-bottom: 8px;
        position: relative;

        > view {
          &:nth-child(1) {
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #222222;
            line-height: 112px;
          }
        }

        &.disabled {
          /* background-color: #eee; */
          > view {
            color: #cccccc;
          }
        }

        &.weekend {
          > view {
            color: #f63;
          }
        }

        &.choosed {
          background: #bbbfc8;
          border-radius: 16px;
        }

        &.range_space {
          background-color: #f5f5f5;

          > view {
            color: #333;
          }
        }
      }
    }

    > .title {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #222222;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title:nth-child(1) {
      border-top: 1px solid #e5e5e5;
    }
  }
}

.week {
  height: 80px;
  padding: 0 29px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;

  > view {
    width: 99px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #222222;
    text-align: center;
  }
}
</style>
