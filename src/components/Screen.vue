<template>
    <div class="screen">
    <div class="header">
      <div class="side">
        <div class="logo"><img
            src="../assets/jianhang.png"
            alt=""
          ></div>
        <div class="line"></div>
        <div class="text">今日会议安排</div>
      </div>
      <div class="side">
        <div class="text">{{ floor }}F</div>
        <div class="line"></div>
        <div class="text">{{ timeNow }}</div>
      </div>
    </div>
    <div class="list">
      <div class="thead">
        <ul>
          <li class="first">序号</li>
          <li class="fifth">使用单位</li>
          <li class="second">会议主题</li>
          <li class="third">会议地点</li>
          <li class="third">会议时间</li>
          <li class="fifth">会议状态</li>
        </ul>
        <!-- 11 34 21 21 13 13
        1
        3
        2
        2
        1
        1
        113/100 = 11/x
        113x = 1100
        x = 1100/113 -->
        <!-- 0.8849557522123894 -->
      </div>
      <div class="tbody" v-if="meetingList.length > 0">
        <vue-seamless-scroll :data="meetingList" :class-option="classOption">
          <ul
            v-for="(item, index) in meetingList"
            :key="index"
          >
            <li class="first">{{ index + 1 }}</li>
            <li class="fifth" v-text="中国建设银行"></li>
            <li class="second">
              <div class="text">
                {{ item.meetingName }}
              </div>
            </li>
            <li class="third">{{ item.areaName }}</li>
            <li class="third">{{ item.time }}</li>
            <li :class="{fifth: true, redText: item.meetingStatus === '进行中'}">{{ item.meetingStatus }}</li>
          </ul>
        </vue-seamless-scroll>
      </div>
      <div class="null-data" v-else-if="!finished">
        <div class="is-loading">
          <div class="curtain">
            <div class="loader"></div>
          </div>
        </div>
      </div>
      <div class="null-data" v-else>
        <img src="../assets/null_data.png" alt="">
        <div style="color: #ffffff;">暂无会议</div>
      </div>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import { getUrlKey, format } from '@/utils'
import request from '../utils/request'
export default {
  components: {
    vueSeamlessScroll
  },
  data() {
    return {
      floor: '',
      timeNow: '',
      meetingList: [],
      classOption: {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 6, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: false, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      },
      timer: null,
      listTimer: null,
      finished: false,
    }
  },
  created() {
    // 设置楼层
    this.floor = getUrlKey('floor') || '5';
    // 获取当前时间
    this.timer = setInterval(() => {
      this.timeNow = format.call(new Date(), 'hh:mm');
    }, 1000);
    this.getMeetingList();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.listTimer);
  },
  methods: {
    async getMeetingList() {
      const companyToken = getUrlKey('companyToken') || '00001';
      const time = format.call(new Date(), 'yyyy-MM-dd hh:mm:ss');
      this.meetingList = await this.getList(this.floor, time, companyToken);
      this.finished = true;
      setInterval(async () => {
        const timeNew = format.call(new Date(), 'yyyy-MM-dd hh:mm:ss');
        this.meetingList = await this.getList(this.floor, timeNew, companyToken);
      }, 1000 * 60);
    },
    async getList(floor, time, companyToken) {
      let list = [];
      try {
        const data = await request('/MeetingServlet', {
          method: 'GET',
          data: {
            companyToken,
            hicaction: 'getMeetingByFloorAndTime',
            floor,
            time,
          }
        })
        if (data.code === '1' && data.success) {
          list = data.result
        }
      } catch (error) {
        console.log(error)
      }
      return list;
    }
  }
}
</script>

<style scoped>
.screen {
  width: 100%;
  height: 100vh;
  background-color: #182740;
  overflow: hidden;
}
.header {
  height: 100px;
  padding: 0 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3581e4;
}
.header .line {
  width: 2px;
  height: 48px;
  margin: 0 30px;
  background-color: #fff;
  border-radius: 1px;
}
.header .side {
  display: flex;
  align-items: center;
}
.header .side .text {
  color: #ffffff;
  font-size: 42px;
  /* font-weight: 700; */
}
.header .logo {
  width: 346px;
  height: 64px;
}
.header .logo img {
  width: 100%;
  height: 100%;
}
.list {
  width: 100%;
  height: calc(100vh - 100px);
  padding: 0;
  display: flex;
  flex-direction: column;
  border-collapse: collapse;
  font-size: 42px;
}
.list ul {
  display: flex;
  align-items: center;
  text-align: left;
}
.list ul .first {
  /* width: 11%; */
  flex: 1;
  text-align: center;
}
.list ul .second {
  /* width: 34%; */
  flex: 3;
}
.list ul .third,
.list ul .fourth {
  /* width: 21%; */
  flex: 2;
}
.list ul .fifth {
  /* width: 13%; */
  flex: 1.2;
}
.list .thead {
  background-color: #101b2c;
}
.list .thead li {
  padding-top: 17px;
  padding-bottom: 24px;
  color: #3581e4;
  font-weight: 400;
}
.list .tbody {
  flex: 1;
  overflow: hidden;
  /* 清除滚动框 */
  /* 清除滚动框结束 */
}
.list .tbody ul {
  min-height: 148px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}
.list .tbody ul:nth-child(odd) {
  background-color: #182740;
}
.list .tbody ul:nth-child(even) {
  background-color: #152339;
}
.list .tbody ul li {
  padding: 18.5px 0;
}
.list .tbody ul .text {
  padding-right: 60px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.list .tbody ul .redText {
  color: #eb5b5b;
}
.list .null-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader {
	position:fixed;
	left:50%;
	top:50%;
	margin:-0.2em 0 0 -0.2em;
	text-indent:-9999em;
	border-top:0.3em solid rgba(0,0,0,0.1);
	border-right:0.3em solid rgba(0,0,0,0.1);
	border-bottom:0.3em solid rgba(0,0,0,0.1);
	border-left:0.3em solid #555;
	-moz-transform:translateZ(0);
	-webkit-transform:translateZ(0);
	transform:translateZ(0);
	-moz-animation:loader 300ms infinite linear;
	-webkit-animation:loader 300ms infinite linear;
	animation:loader 300ms infinite linear;
	-moz-transition:all 500ms ease;
	-o-transition:all 500ms ease;
	-webkit-transition:all 500ms ease;
	transition:all 500ms ease;
}
.loader,.loader:after {
	border-radius:50%;
	width:2em;
	height:2em;
}
.curtain {
	position:fixed;
	width:100%;
	height:100%;
	top:0;
	left:0;
	background-color:white;
	-moz-transition:all 600ms ease;
	-o-transition:all 600ms ease;
	-webkit-transition:all 600ms ease;
	transition:all 600ms ease;
	filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
	opacity:0;
	z-index:0;
	overflow:hidden;
}
@-webkit-keyframes loader {
	0% {
	-webkit-transform:rotate(0deg);
	transform:rotate(0deg);
}
100% {
	-webkit-transform:rotate(360deg);
	transform:rotate(360deg);
}
}@-moz-keyframes loader {
	0% {
	-moz-transform:rotate(0deg);
	transform:rotate(0deg);
}
100% {
	-moz-transform:rotate(360deg);
	transform:rotate(360deg);
}
}@keyframes loader {
	0% {
	-webkit-transform:rotate(0deg);
	transform:rotate(0deg);
}
100% {
	-webkit-transform:rotate(360deg);
	transform:rotate(360deg);
}
}.is-loading {
	overflow:hidden;
}
.is-loading .curtain {
	filter:progid:DXImageTransform.Microsoft.Alpha(enabled=false);
	opacity:1;
	z-index:99;
}
.is-loading .loader {
	filter:progid:DXImageTransform.Microsoft.Alpha(enabled=false);
	opacity:1;
}
</style>
