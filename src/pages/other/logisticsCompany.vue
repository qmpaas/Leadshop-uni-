<template>
  <view>
    <u-index-list :scroll-top="scrollTop" :sticky="false">
      <view v-for="(item, index) in indexList" :key="index">
        <he-index-anchor :index="item"></he-index-anchor>
        <view class="he-index-row">
          <view
            class="he-list-cell"
            @click="back(row)"
            v-for="(row, key) in list[item]"
            :key="key"
          >
            {{ row.name }}
          </view>
        </view>
      </view>
    </u-index-list>
  </view>
</template>

<script>
import uIndexList from "../../components/u-index-list.vue";
import heIndexAnchor from "./components/he-index-anchor.vue";
export default {
  name: "logisticsCompany",
  data() {
    return {
      indexList: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      active: false,
      scrollTop: 0,
      list: {},
      id: null,
    };
  },
  onLoad(options) {
    let _this = this;
    this.id = options.id;
    this.$heshop
      .search(
        "post",
        {
          include: "setting",
        },
        {
          keyword: "expressjson",
        }
      )
      .then(function (response) {
        let list = response;
        list.sort((a, b) => a.name.localeCompare(b.name, "zh"));
        let data = _this.sortFriend(list);
        _this.list = data;
      });
  },
  methods: {
    chineseToEnglish: function (c) {
      let idx = -1;
      let MAP = "ABCDEFGHJKLMNOPQRSTWXYZ";
      let boundaryChar = "驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳";
      if (!String.prototype.localeCompare) {
        throw Error("String.prototype.localeCompare not supported.");
      }
      if (/[^\u4e00-\u9fa5]/.test(c)) {
        return c;
      }
      for (let i = 0; i < boundaryChar.length; i++) {
        if (boundaryChar[i].localeCompare(c, "zh-CN-u-co-pinyin") >= 0) {
          idx = i;
          break;
        }
      }
      return MAP[idx];
    },
    //获取第一个字母
    getFirstUpperChar: function (str) {
      let string = String(str);
      let c = string.substr(0, 1);
      if (/[^\u4e00-\u9fa5]/.test(c)) {
        return c.toUpperCase();
      } else {
        return this.chineseToEnglish(c);
      }
    },
    sortFriend(list) {
      let map = {};
      let _this = this;
      let c = "A".charCodeAt();
      for (; c <= "Z".charCodeAt(); c++) {
        map[String.fromCharCode(c)] = [];
      }
      map["#"] = [];
      let firstCharUpper;
      list.forEach(function (item) {
        firstCharUpper = _this.getFirstUpperChar(item.pinyin);
        if (map.hasOwnProperty(firstCharUpper)) {
          map[firstCharUpper].push(item);
        } else {
          map["#"].push(item);
        }
      });
      let obj = {};
      for (let key in map) {
        if (map[key].length) obj[key] = map[key];
      }
      return obj;
    },
    back: function (row) {
      uni.redirectTo({
        url:
          "/pages/order/fill-return-information?name=" +
          row.name +
          "&code=" +
          row.code +
          "&id=" +
          this.id,
      });
    },
  },
  components: {
    uIndexList,
    heIndexAnchor,
  },
  onPageScroll(e) {
    this.scrollTop = parseInt(e.scrollTop);
  },
};
</script>

<style scoped>
.he-index-row {
  padding-left: 24px;
}
.he-index-row > .he-list-cell:last-child {
  border-bottom: none;
}
.he-list-cell {
  font-size: 28px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #222222;
  height: 88px;
  line-height: 88px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}
</style>