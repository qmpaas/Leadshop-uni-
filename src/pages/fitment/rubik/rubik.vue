<template>
  <view class="rubik">
    <view class="advertising" v-if="size < 7">
      <template v-if="size == 1">
        <!-- #ifdef H5 -->
        <template v-if="adverArray[0].link.index === 11">
          <he-open-launch-weapp
            style="height: 100%"
            :username="adverArray[0].link.param.wechat.appId"
            :path="adverArray[0].link.param.wechat.path"
          >
            <image
              lazy-load
              class="advertising-item-1"
              style="width: 100%"
              :src="adverArray[0].url"
              mode="widthFix"
              v-if="adverArray[0].url"
            ></image>
          </he-open-launch-weapp>
        </template>
        <template v-else>
          <image
            lazy-load
            class="advertising-item-1"
            style="width: 100%"
            :src="adverArray[0].url"
            mode="widthFix"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[0].link)"
          ></image>
        </template>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <image
          lazy-load
          class="advertising-item-1"
          style="width: 100%"
          :src="adverArray[0].url"
          mode="widthFix"
          v-if="adverArray[0].url"
          @click="navigateToDetail(adverArray[0].link)"
        ></image>
        <!-- #endif -->
      </template>

      <!-- 第二种布局 -->
      <view class="advertising-item-2" v-if="size == 2">
        <view class="advertising-item-image" style="width: 50%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[0].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[0].link.param.wechat.appId"
              :path="adverArray[0].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[0].url"
                mode="widthFix"
                v-if="adverArray[0].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[0].url"
              mode="widthFix"
              v-if="adverArray[0].url"
              @click="navigateToDetail(adverArray[0].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[0].url"
            mode="widthFix"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[0].link)"
          ></image>
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" style="width: 50%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[1].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[1].link.param.wechat.appId"
              :path="adverArray[1].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[1].url"
                mode="widthFix"
                v-if="adverArray[0].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[1].url"
              mode="widthFix"
              v-if="adverArray[0].url"
              @click="navigateToDetail(adverArray[1].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[1].url"
            mode="widthFix"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[1].link)"
          ></image>
          <!-- #endif -->
        </view>
      </view>

      <!-- 第三种布局 -->
      <view class="advertising-item-3" v-if="size == 3">
        <view class="advertising-item-image" style="width: 33.333%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[0].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[0].link.param.wechat.appId"
              :path="adverArray[0].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[0].url"
                mode="widthFix"
                v-if="adverArray[0].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[0].url"
              mode="widthFix"
              v-if="adverArray[0].url"
              @click="navigateToDetail(adverArray[0].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[0].url"
            mode="widthFix"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[0].link)"
          ></image>
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" style="width: 33.333%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[1].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[1].link.param.wechat.appId"
              :path="adverArray[1].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[1].url"
                mode="widthFix"
                v-if="adverArray[1].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[1].url"
              mode="widthFix"
              v-if="adverArray[1].url"
              @click="navigateToDetail(adverArray[1].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[1].url"
            mode="widthFix"
            v-if="adverArray[1].url"
            @click="navigateToDetail(adverArray[1].link)"
          ></image>
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" style="width: 33.333%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[2].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[2].link.param.wechat.appId"
              :path="adverArray[2].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[2].url"
                mode="widthFix"
                v-if="adverArray[2].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[2].url"
              mode="widthFix"
              v-if="adverArray[2].url"
              @click="navigateToDetail(adverArray[2].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[2].url"
            mode="widthFix"
            v-if="adverArray[2].url"
            @click="navigateToDetail(adverArray[2].link)"
          ></image>
          <!-- #endif -->
        </view>
      </view>

      <!-- 第四种布局 -->
      <view class="advertising-item-4" v-if="size == 4">
        <view class="advertising-item-image" :style="{ width: '50%', height: '375rpx', top: 0, left: 0 }">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[0].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[0].link.param.wechat.appId"
              :path="adverArray[0].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[0].url"
                mode="aspectFill"
                v-if="adverArray[0].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[0].url"
              mode="aspectFill"
              v-if="adverArray[0].url"
              @click="navigateToDetail(adverArray[0].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[0].url"
            mode="aspectFill"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[0].link)"
          ></image>
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" :style="{ width: '50%', height: '188rpx', top: 0, left: '375rpx' }">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[1].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[1].link.param.wechat.appId"
              :path="adverArray[1].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[1].url"
                mode="aspectFill"
                v-if="adverArray[1].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[1].url"
              mode="aspectFill"
              v-if="adverArray[1].url"
              @click="navigateToDetail(adverArray[1].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[1].url"
            mode="aspectFill"
            v-if="adverArray[1].url"
            @click="navigateToDetail(adverArray[1].link)"
          ></image>
          <!-- #endif -->
        </view>
        <view
          class="advertising-item-image"
          :style="{
            width: '50%',
            height: '188rpx',
            top: '188rpx',
            left: '375rpx'
          }"
        >
          <!-- #ifdef H5 -->
          <template v-if="adverArray[2].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[2].link.param.wechat.appId"
              :path="adverArray[2].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[2].url"
                mode="aspectFill"
                v-if="adverArray[2].url"
              ></image>
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[2].url"
              mode="aspectFill"
              v-if="adverArray[2].url"
              @click="navigateToDetail(adverArray[2].link)"
            ></image>
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[2].url"
            mode="aspectFill"
            v-if="adverArray[2].url"
            @click="navigateToDetail(adverArray[2].link)"
          ></image>
          <!-- #endif -->
        </view>
      </view>

      <!-- 第五种布局 -->
      <view class="advertising-item-5" v-if="size == 5">
        <view class="advertising-item-image" style="width: 25%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[0].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[0].link.param.wechat.appId"
              :path="adverArray[0].link.param.wechat.path"
            >
              <image
                style="width: 100%; height: 100%"
                :src="adverArray[0].url"
                mode="widthFix"
                v-if="adverArray[0].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              style="width: 100%; height: 100%"
              :src="adverArray[0].url"
              mode="widthFix"
              v-if="adverArray[0].url"
              @click="navigateToDetail(adverArray[0].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            style="width: 100%; height: 100%"
            :src="adverArray[0].url"
            mode="widthFix"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[0].link)"
          />
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" style="width: 25%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[1].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[1].link.param.wechat.appId"
              :path="adverArray[1].link.param.wechat.path"
            >
              <image
                style="width: 100%; height: 100%"
                :src="adverArray[1].url"
                mode="widthFix"
                v-if="adverArray[1].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              style="width: 100%; height: 100%"
              :src="adverArray[1].url"
              mode="widthFix"
              v-if="adverArray[1].url"
              @click="navigateToDetail(adverArray[1].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            style="width: 100%; height: 100%"
            :src="adverArray[1].url"
            mode="widthFix"
            v-if="adverArray[1].url"
            @click="navigateToDetail(adverArray[1].link)"
          />
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" style="width: 25%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[2].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[2].link.param.wechat.appId"
              :path="adverArray[2].link.param.wechat.path"
            >
              <image
                style="width: 100%; height: 100%"
                :src="adverArray[2].url"
                mode="widthFix"
                v-if="adverArray[2].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              style="width: 100%; height: 100%"
              :src="adverArray[2].url"
              mode="widthFix"
              v-if="adverArray[2].url"
              @click="navigateToDetail(adverArray[2].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            style="width: 100%; height: 100%"
            :src="adverArray[2].url"
            mode="widthFix"
            v-if="adverArray[2].url"
            @click="navigateToDetail(adverArray[2].link)"
          />
          <!-- #endif -->
        </view>
        <view class="advertising-item-image" style="width: 25%">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[3].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[3].link.param.wechat.appId"
              :path="adverArray[3].link.param.wechat.path"
            >
              <image
                style="width: 100%; height: 100%"
                :src="adverArray[3].url"
                mode="widthFix"
                v-if="adverArray[3].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              style="width: 100%; height: 100%"
              :src="adverArray[3].url"
              mode="widthFix"
              v-if="adverArray[3].url"
              @click="navigateToDetail(adverArray[3].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            style="width: 100%; height: 100%"
            :src="adverArray[3].url"
            mode="widthFix"
            v-if="adverArray[3].url"
            @click="navigateToDetail(adverArray[3].link)"
          />
          <!-- #endif -->
        </view>
      </view>

      <!-- 第六种布局 -->
      <view class="advertising-item-6" v-if="size == 6">
        <view class="advertising-item-image" :style="{ width: '50%', height: '188rpx', top: 0, left: 0 }">
          <!-- #ifdef H5 -->
          <template v-if="adverArray[0].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[0].link.param.wechat.appId"
              :path="adverArray[0].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[0].url"
                mode="aspectFill"
                v-if="adverArray[0].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[0].url"
              mode="aspectFill"
              v-if="adverArray[0].url"
              @click="navigateToDetail(adverArray[0].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[0].url"
            mode="aspectFill"
            v-if="adverArray[0].url"
            @click="navigateToDetail(adverArray[0].link)"
          />
          <!-- #endif -->
        </view>
        <view
          class="advertising-item-image"
          :style="{
            width: '50%',
            height: '188rpx',
            top: '188rpx',
            left: 0
          }"
        >
          <!-- #ifdef H5 -->
          <template v-if="adverArray[1].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[1].link.param.wechat.appId"
              :path="adverArray[1].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[1].url"
                mode="aspectFill"
                v-if="adverArray[1].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[1].url"
              mode="aspectFill"
              v-if="adverArray[1].url"
              @click="navigateToDetail(adverArray[1].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[1].url"
            mode="aspectFill"
            v-if="adverArray[1].url"
            @click="navigateToDetail(adverArray[1].link)"
          />
          <!-- #endif -->
        </view>
        <view
          class="advertising-item-image"
          :style="{
            width: '50%',
            height: '188rpx',
            top: 0,
            left: '50%'
          }"
        >
          <!-- #ifdef H5 -->
          <template v-if="adverArray[2].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[2].link.param.wechat.appId"
              :path="adverArray[2].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[2].url"
                mode="aspectFill"
                v-if="adverArray[2].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[2].url"
              mode="aspectFill"
              v-if="adverArray[2].url"
              @click="navigateToDetail(adverArray[2].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[2].url"
            mode="aspectFill"
            v-if="adverArray[2].url"
            @click="navigateToDetail(adverArray[2].link)"
          />
          <!-- #endif -->
        </view>
        <view
          class="advertising-item-image"
          :style="{
            width: '50%',
            height: '188rpx',
            top: '188rpx',
            left: '50%'
          }"
        >
          <!-- #ifdef H5 -->
          <template v-if="adverArray[3].link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="adverArray[3].link.param.wechat.appId"
              :path="adverArray[3].link.param.wechat.path"
            >
              <image
                lazy-load
                style="width: 100%; height: 100%"
                :src="adverArray[3].url"
                mode="aspectFill"
                v-if="adverArray[3].url"
              />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="adverArray[3].url"
              mode="aspectFill"
              v-if="adverArray[3].url"
              @click="navigateToDetail(adverArray[3].link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="adverArray[3].url"
            mode="aspectFill"
            v-if="adverArray[3].url"
            @click="navigateToDetail(adverArray[3].link)"
          />
          <!-- #endif -->
        </view>
      </view>
    </view>

    <!-- 第七种布局 -->
    <view v-if="size == 7" class="rubik-cube">
      <template v-for="(item, index) in adverArray">
        <view
          class="rubik-cube__item"
          :key="index"
          :style="{
            width: getWidth(item) + 'px',
            height: getHeight(item) + 'px',
            top: getTop(item) + 'px',
            left: getLeft(item) + 'px'
          }"
        >
          <!-- #ifdef H5 -->
          <template v-if="item.link.index === 11">
            <he-open-launch-weapp
              style="height: 100%"
              :username="item.link.param.wechat.appId"
              :path="item.link.param.wechat.path"
            >
              <image lazy-load style="width: 100%; height: 100%" :src="item.url" mode="aspectFill" v-if="item.url" />
            </he-open-launch-weapp>
          </template>
          <template v-else>
            <image
              lazy-load
              style="width: 100%; height: 100%"
              :src="item.url"
              mode="aspectFill"
              v-if="item.url"
              @click="navigateToDetail(item.link)"
            />
          </template>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <image
            lazy-load
            style="width: 100%; height: 100%"
            :src="item.url"
            mode="aspectFill"
            v-if="item.url"
            @click="navigateToDetail(item.link)"
          />
          <!-- #endif -->
        </view>
      </template>
    </view>
  </view>
</template>

<script type="text/javascript">
// #ifdef H5
import heOpenLaunchWeapp from './../../../components/he-open-launch-weapp.vue';
// #endif
export default {
  // #ifdef H5
  components: {
    heOpenLaunchWeapp
  },
  // #endif
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    adverArray() {
      return this.content.data;
    },
    size() {
      return this.content.style;
    },
    windowWidth() {
      let _s = uni.getSystemInfoSync();
      return _s.windowWidth;
    }
  },
  methods: {
    /**
     * 导航详情
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    navigateToDetail(item) {
      this.$h.MPageNavigate(item);
    },
    getHeight(item) {
      const width = this.windowWidth / this.content.density;
      return (item.rowEnd - item.rowStart + 1) * width;
    },
    getWidth(item) {
      const width = this.windowWidth / this.content.density;
      return (item.columnEnd - item.columnStart + 1) * width;
    },
    getLeft(item) {
      const width = this.windowWidth / this.content.density;
      return (item.columnStart - 1) * width;
    },
    getTop(item) {
      const width = this.windowWidth / this.content.density;
      return (item.rowStart - 1) * width;
    },
    getCover(cover = '') {
      let url = '';
      if (cover) {
        if (Object.prototype.toString.call(cover) === '[object Array]' && cover[0]) {
          return cover[0].url;
        }
      }
      return url;
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
