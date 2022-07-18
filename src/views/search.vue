<template>
  <div class="hello">
    <div class="mainbox">
  <div class="title" v-if="!settings[0].timesettings.showTime">{{settings[0].title}}</div>
  <div class="timetitle" v-if="settings[0].timesettings.showTime">
    <div class="ntime">
      <span class="noon" v-if="settings[0].timesettings.showNoon&&settings[0].timesettings.isTwelveHour">{{nowDateTime.noon}}</span><span>{{nowDateTime.ntime}}</span><span v-if="settings[0].timesettings.showSec">{{nowDateTime.seconds}}</span>
    </div>
    <div class="ndate" v-if="checkNdateShow()">
      <span>{{outputDateTime()}}</span><span v-if="settings[0].timesettings.showWeek">{{nowDateTime.week}}</span><span v-if="settings[0].timesettings.showLunarYear">{{getlunar('y')}}年</span><span v-if="settings[0].timesettings.showLunarDate">{{getlunar('d')}}</span><span v-if="settings[0].timesettings.showJieqi&&nowDateTime.lunar[1]!==''">{{nowDateTime.lunar[1]}}</span><span v-if="settings[0].timesettings.showFestival&&nowDateTime.lunar[2][0]!==''&&nowDateTime.lunar[2][0]!=='grey'">{{nowDateTime.lunar[2][0]}}</span><span v-if="settings[0].timesettings.showFestival&&nowDateTime.lunar[2][1]!==''">{{nowDateTime.lunar[2][1]}}</span>
    </div>
  </div>
  <div class="countdownbox" v-if="settings[0].countdownSettings.showcountdown">
    <countdown ref="vcountdown"/>
  </div>
  <div class="s-box"><input ref="inp" type="search" @blur="blurd" @focus="focused" @keyup.enter="doSearch" class="s" :class="ishadow" :id="mid" v-on:input="test" v-model="word" placeholder="搜点什么吧">
  <transition name="fade">
  <span ref="spans" v-show="inputed" style="color:#333;" class="type" @click="doSelectShow"><span v-show="typeShow">{{fdata[index].na}}</span><span v-show="cShow">收起</span></span>
  </transition>

  <transition name="fade">
  <span class="searchico icon-arrow-right" id="ds" v-show="inputed" @click="doSearch"></span>
  </transition>
  </div>
</div>

<transition name="slide">
    <div class="selectbox icheck-material-deeppurple" v-show="showSelect" ref="scrollDiv" title="滚动以查看更多搜索引擎">
      
      <div class="linkbox" v-for="(item, index) in fdata" :key="index" :class="[checkclass(item.va), index===fdata.length-1?'lastlinkbox':'']" @click="changeW(item.va, index)">
      
        <span>{{item.na}}</span>
      
      </div>
    </div>
</transition>-->
  <div class="thinkbox" title="滚动以查看更多推荐词" ref="suggestion">
    <div class="thinkw" v-for="(sitem, index) in sug" :key="index" @click="doSug(sitem)">{{sitem}}</div>
  </div>
  <div class="kjbox" ref="kjbox" :class="showkjb?'kjboxns':''">
  <div class="kjlink" title="点击打开在线工具" v-if="!showkset" @click="switchOnlineToolsShow">
    <a href="#">
      <div class="kjimgbox"><img src="/img/tool.svg" class="kjimg"></div>
      <div class="kjname">在线工具</div>
    </a>
  </div>
  <div class="kjlink" v-for="(kitem, index) in kjlink" :key="kitem.name">
    <a :href="kitem.link" target="_blank" :class="showkset?'kjblinkd':'index'+index">
      <div class="kjimgbox"><img src="/img/globe.svg" class="kjimg"></div>
      <div class="kjname">{{kitem.name}}</div>
    </a>
  </div>
  <div class="kjlink" title="编辑快捷链接" @click="showKjadd" v-if="!showeditset"><div class="kjadd"><div class="addimgbox"><img class="addimg" src="/img/pencil.svg"></div></div></div>
  <div class="kjlink kjlinklast" title="点击打开设置" @click="showGset" v-if="!showeditset"><div class="kjadd"><div class="addimgbox"><img class="addimg" src="/img/settings.svg"></div></div></div>
</div>
<transition name="fade">
  <div class="kjsetting" v-show="showeditset">
    <div class="kjstitle">编辑快捷链接</div>
    <span class="kjstips">将通过Cookies存储您的设置</span>
    <div class="kjeditbigbox" ref="kjebigbox">
    <transition-group name="flip-kj-list">
    <div class="kjeditbox" v-for="(keitem,index) in kjlink" :key="keitem.keyname">
      <div class="kjindex">{{index}}</div>
      <div class="kjsbtn kjmove" @click="doKjlinkMove(Number(index),Number(index) - Number(moveindex[index]))"><div class="addimgbox"><img src="/img/arrow-up.svg" class="addimg"></div></div>
      <input type="text" class="kjsmoveind" v-model="moveindex[index]">
      <div class="kjsbtn kjmove" @click="doKjlinkMove(Number(index),Number(index) + Number(moveindex[index]))"><div class="addimgbox"><img src="/img/arrow-down.svg" class="addimg"></div></div>
      <input type="text" v-model="keitem.name" class="kjsdetail">
      <input type="text" v-model="keitem.link" class="kjsdetail">
      <div class="kjsbtn kjmove kjdelete" @click="conDelete(index)"><div class="addimgbox"><img src="/img/trash-empty.svg" class="delimg"></div></div>
    </div>
    </transition-group>
    </div>
    <div class="kjeditbox kjeditadd">
      <input type="text" placeholder="请输入名称" v-model="linkname" class="kjsdetail">
      <input type="text" placeholder="请输入链接" v-model="inslink" class="kjsdetail">
      <div class="kjsbtn" @click="addNewLink">添加</div>
    </div>
    <div class="kjsbb"><div class="kjsbtn" @click="saveKjadd">保存</div><div class="kjsbtn" @click="closeKjadd">关闭</div></div>
  </div>
</transition>
<transition name="fade">
<div class="kjsetting kjgset" v-show="showgset">
  <div class="kjstitle settings-title">设置</div>
  <div class="setbox"><div class="settext">自定义logo文字</div><div @click="switchzdytitle" class="switchbtn" :class="{'sbs':settings[0].iszdytitle}"><div class="scircle" :class="{'sbc':settings[0].iszdytitle}"></div></div></div>
  <transition name="slide">
  <input type="text" maxlength="10" v-if="settings[0].iszdytitle" placeholder="字数不超过10个" class="kjsinp setbox" v-model="settings[0].title">
  </transition>
  <div class="setbox"><div class="settext">倒计时</div><div @click="switchCountDownShow" class="switchbtn" :class="{'sbs':settings[0].countdownSettings.showcountdown}"><div class="scircle" :class="{'sbc':settings[0].countdownSettings.showcountdown}"></div></div></div>
  <transition name="slide">
  <div class="timesetbox countdownset" v-show="settings[0].countdownSettings.showcountdown">
    <div class="timesetbox-inner"><div class="settext">自定义倒计时</div><div @click="switchzdycountdown()" class="switchbtn" :class="{'sbs':settings[0].countdownSettings.iszdycountdown}"><div class="scircle" :class="{'sbc':settings[0].countdownSettings.iszdycountdown}"></div></div></div>
    <input type="text" class="kjsinp countinp" placeholder="截止时间" :disabled="!settings[0].countdownSettings.iszdycountdown" v-model="settings[0].countdownSettings.zdydeadline" v-on:input="setCountDown">
    <input type="text" class="kjsinp countinp" placeholder="事件标题" :disabled="!settings[0].countdownSettings.iszdycountdown" v-model="settings[0].countdownSettings.zdytitle" v-on:input="setCountDown">
    <input type="text" class="kjsinp countinp" placeholder="截止后显示内容" :disabled="!settings[0].countdownSettings.iszdycountdown" v-model="settings[0].countdownSettings.zdytips" v-on:input="setCountDown">
    <div class="countsettips" @click="showHowCountSet">如何设置？</div>
  </div>
  </transition>
  <div class="setbox"><div class="settext">显示时间</div><div @click="switchTimeShow" class="switchbtn" :class="{'sbs':settings[0].timesettings.showTime}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showTime}"></div></div></div>
  <transition name="slide">
  <div class="timesetbox" v-show="settings[0].timesettings.showTime">
    <div class="timesetbox-inner"><div class="settext">显示秒数</div><div @click="switchTimeSettings('sec')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showSec}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showSec}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">12小时制</div><div @click="switchTimeSettings('twelvehour')" class="switchbtn" :class="{'sbs':settings[0].timesettings.isTwelveHour}"><div class="scircle" :class="{'sbc':settings[0].timesettings.isTwelveHour}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示时段(12小时制)</div><div @click="switchTimeSettings('noon')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showNoon}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showNoon}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示月日</div><div @click="switchTimeSettings('date')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showDate}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showDate}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示年份</div><div @click="switchTimeSettings('year')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showYear}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showYear}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示星期</div><div @click="switchTimeSettings('week')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showWeek}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showWeek}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示农历年份</div><div @click="switchTimeSettings('lunaryear')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showLunarYear}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showLunarYear}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示农历日期</div><div @click="switchTimeSettings('lunardate')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showLunarDate}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showLunarDate}"></div></div></div>
    <div class="timesetbox-inner"><div class="settext">显示二十四节气</div><div @click="switchTimeSettings('jieqi')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showJieqi}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showJieqi}"></div></div></div>
    <div class="timesetbox-inner tbi-last"><div class="settext">显示节日</div><div @click="switchTimeSettings('festival')" class="switchbtn" :class="{'sbs':settings[0].timesettings.showFestival}"><div class="scircle" :class="{'sbc':settings[0].timesettings.showFestival}"></div></div></div>
  </div>
  </transition>
  <div class="setbox"><div class="settext">背景模糊</div><div @click="switchblur" class="switchbtn" :class="{'sbs':settings[0].isblur==='isblur'}"><div class="scircle" :class="{'sbc':settings[0].isblur==='isblur'}"></div></div></div>
  <div class="setbox"><div class="settext">减低亮度</div><div @click="switchblack" class="switchbtn" :class="{'sbs':settings[0].isblack==='isblack'}"><div class="scircle" :class="{'sbc':settings[0].isblack==='isblack'}"></div></div></div>
  <div class="setbox"><div class="settext">必应壁纸</div><div @click="switchbing" class="switchbtn" :class="{'sbs':settings[0].isbing==='isbing'}"><div class="scircle" :class="{'sbc':settings[0].isbing==='isbing'}"></div></div></div>
  <transition name="slide">
  <div class="timesetbox" v-show="settings[0].isbing==='isbing'">
    <div class="timesetbox-inner tbi-last"><div class="settext">4K壁纸</div><div @click="switchbinguhd" class="switchbtn" :class="{'sbs':settings[0].isbinguhd}"><div class="scircle" :class="{'sbc':settings[0].isbinguhd}"></div></div></div>
  </div>
  </transition>
  <div class="setbox"><div class="settext">自定义图片</div><div @click="switchzdy" class="switchbtn" :class="{'sbs':settings[0].iszdy}"><div class="scircle" :class="{'sbc':settings[0].iszdy}"></div></div></div>
  <transition name="slide">
  <a href="javascript:;" class="a-upload setbox" v-if="settings[0].iszdy"><input type="file" id="id" name="image" class="getImgUrl_file" @change="shangc($event)" accept="image/jpg,image/jpeg,image/png">选择自定义图片</a>
  </transition>
  <div class="kjsbb gsbb">
    <div class="kjsbtn gsbtn gsbtnfs" @click="doOutputShow('out')">导出数据</div><div class="kjsbtn gsbtn gsbtnfe" @click="doOutputShow('in')">导入数据</div>
  </div>
  <div class="kjsbb gsbb"><div class="kjsbtn gsbtn gsbtnfs" @click="savebgs">保存</div><div class="kjsbtn gsbtn " @click="showGset">取消</div><div class="kjsbtn gsbtn gsbtnfe" @click="confreset">重置</div></div>
  <div class="kjsbb gsbb"></div>
</div>
</transition>
<div class="c">
  <div class="cleft">© 2020 - 2022 <a href="https://blog.2019.one" target="_blank">Curry</a> <span @click="switchVer" class="cver">V{{version}}</span></div>
</div>
<transition name="vfade">
<div class="verbox" v-if="this.showver">
  <div class="vertitle">更新历史</div>
  <div class="verdetail-outter">
  <div class="verdetail" v-for="(itemu, index) in updateList.slice().reverse()" :key="index">
    <div class="vernum">{{itemu.version}}</div>
    <div class="verinfo" v-html="itemu.information"></div>
  </div>
  </div>
  <div class="kjsbtn verclose" @click="switchVer">关闭</div>
</div>
</transition>
<transition name="sfade">
    <div class="alertbox" ref="alert" v-if="alertShow" :style="{zIndex: aindex}">
      <div class="atitle">
        {{atitle}}
      </div>
      <div class="acontent" v-html="atext">
      </div>
      <div class="aconfirm" @click="closeAlert">
        确定
      </div>
    </div>
  </transition>
  <transition name="sfade">
    <div class="alertbox" ref="calert" v-if="confirmShow" :style="{zIndex: cindex}">
      <div class="atitle">
        {{ctitle}}
      </div>
      <div class="acontent" v-html="ctext">
      </div>
      <div class="aconfirmb-box">
      <div class="aconfirmb" @click="caction">
        确定
      </div>
      <div class="aconfirmb" @click="closeConfirm">
        再想想
      </div>
      </div>
    </div>
  </transition>
  <transition name="sfade">
    <div class="alertbox" ref="alert" v-if="outputAlertShow" :style="{zIndex: cindex}">
      <div class="atitle">
        导入/导出
      </div>
      <div class="acontent">
        <div class="outputnotice" v-if="outputable">导出成功！以下为导出的数据，可复制后在其他设备或浏览器进行导入！<span v-if="settings[0].iszdy">PS:自定义图片需要单独下载，可点击下面的链接进行下载！</span></div>
        <div class="outputnotice" v-if="!outputable && !isinputsuccess">将其他设备或浏览器导出的数据粘贴到下面输入框中即可进行导入！</div>
        <textarea name="optext" rows="5" v-model="outputText" class="outputTextArea" placeholder="请在此粘贴要导入的数据" v-if="!isinputsuccess" :disabled="outputable"></textarea>
        <div class="copybtn kjsbtn copyed" v-if="outputable" @click="copyToClip">点我复制到剪贴板</div>
        <a :href="bloburl" v-if="settings[0].iszdy" target="_blank"><div class="kjsbtn">点我下载自定义图片</div></a>
        <div class="inputsuccess" v-if="isinputsuccess">导入成功！将自动在{{outputCountDown}}秒后为您刷新页面！</div>
      </div>
      <div class="aconfirm oconfirm" @click="inputSet" v-if="outputStat==='in'">
        确定导入
      </div>
      <div class="aconfirm" @click="closeOutputAlert">
         关闭
      </div>
    </div>
  </transition>
  <transition name="osfade">
    <div class="alertbox onlinetoolbox" ref="alert" v-if="onlineToolsShow" :style="{zIndex: cindex}">
      <div class="atitle">
        在线工具
      </div>
      <div class="acontent onlinetoolcontent">
        <a :href="itemsl.link" v-for="(itemsl,index) in onlinetoolsList" :key="index" target="_blank"><div class="kjsbtn kjsbtntools">{{itemsl.name}}</div></a>
      </div>
      <div class="aconfirm" @click="switchOnlineToolsShow">
        关闭
      </div>
    </div>
  </transition>
  <div class="bbg" :class="[settings[0].isblur,settings[0].isblack]"></div>
  </div>
</template>

<script>
import icon from '../assets/icon.css'
import countdown from '../components/countdown'
import useClipboard from 'vue-clipboard3'
import {EncryptByDES, DecryptFromDes} from '../des.js'
export default {
  name: 'search',
  components: {
    countdown
  },
  data () {
    return {
      kjlink: [
        {link: 'https://www.baidu.com', name: '百度', keyname: '百度'},
        {link: 'https://www.bilibili.com', name: 'B站', keyname: 'B站'},
        {link: 'https://www.google.com', name: 'Google', keyname: 'Google'},
        {link: 'https://www.taobao.com', name: '淘宝', keyname: '淘宝'},
        {link: 'https://www.jd.com', name: '京东', keyname: '京东'},
        {link: 'https://www.youku.com', name: '优酷', keyname: '优酷'}
      ],
      defkjlink: [
        {link: 'https://www.baidu.com', name: '百度'},
        {link: 'https://www.bilibili.com', name: 'B站'},
        {link: 'https://www.google.com', name: 'Google'},
        {link: 'https://www.taobao.com', name: '淘宝'},
        {link: 'https://www.jd.com', name: '京东'},
        {link: 'https://www.youku.com', name: '优酷'}
      ],
      settings: [
        {
          defimg: '/img/bg4.jpg',
          deftitle: 'OneStart',
          img: '',
          isblur: '',
          isblack: '',
          iszdy: false,
          iszdytitle: false,
          isbing: '',
          isbinguhd: false,
          title: 'OneStart',
          // ver: '',
          timesettings: {
            showTime: true,
            showSec: false,
            showDate: true,
            showYear: true,
            showWeek: true,
            showLunarDate: true,
            showLunarYear: true,
            showJieqi: true,
            showFestival: true,
            isTwelveHour: false,
            showNoon: false
          },
          countdownSettings: {
            showcountdown: true,
            iszdycountdown: false,
            zdydeadline: '',
            zdytitle: '',
            zdytips: ''
          }
        }
      ],
      defcountdownSettings: {
        showcountdown: true,
        iszdycountdown: false,
        zdydeadline: '',
        zdytitle: '',
        zdytips: ''
      },
      defTimeSettings: {
        showTime: true,
        showSec: false,
        showDate: true,
        showYear: true,
        showWeek: true,
        showLunarDate: true,
        showLunarYear: true,
        showJieqi: true,
        showFestival: true,
        isTwelveHour: false,
        showNoon: false
      },
      msg: '设置',
      word: '',
      linkname: '',
      inslink: '',
      linkpos: '',
      delindex: '',
      type: 'Bing',
      index: '4',
      fdata: [{va: 'Bing', na: 'Bing'}, {va: 'Baidu', na: 'Baidu'}, {va: 'Google', na: 'Google'}, {va: 'Sogou', na: 'Sogou'}, {va: '360', na: '360'}],
      inputed: false,
      mid: 'kw',
      ishadow: '',
      // showkset: false, // 已弃用
      showSelect: false,
      showgset: false,
      showeditset: false,
      showver: false,
      onlineToolsShow: false,
      typeShow: true,
      cShow: false,
      alertShow: false,
      confirmShow: false,
      outputAlertShow: false,
      outputable: true,
      outputText: '',
      outputStat: '',
      outputCountDown: 3,
      isinputsuccess: false,
      showkjb: true,
      atitle: '',
      atext: '',
      ctitle: '',
      ctext: '',
      aindex: '998',
      cindex: '999',
      moveindex: [],
      sug: '',
      caction: '',
      bingUrl: '',
      bingUrlUHD: '',
      bloburl: '',
      zdyguodu: '',
      titleguodu: '',
      onlinetoolsList: [
      ],
      updateList: [],
      nowDateTime: {
        ntime: '',
        seconds: '',
        date: '',
        week: '',
        year: '',
        noon: '',
        lunar: ['', '', ['', '']]
      }, // 当前日期时间
      timer: '',
      version: '',
      icon
    }
  },
  created () {
    console.log('%cWelcome to OneStart', 'color: #00abdc;font-size: 24px;font-weight: bold;')
    console.log('%c始于2019', 'color:#333;padding-top:5px;padding-bottom:5px;')
    console.log('%c坚持以简约为主', 'color:#333;padding-top:5px;padding-bottom:5px;')
    this.currentTime()
    var that = this
    this.$axios.get(`https://www.2019.one/api/links/`, {
      params: {
      }
    })
      .then(res => {
        // console.log(res.data)
        that.fdata = res.data
        for (var i = 0; i < that.fdata.length; i++) {
          if (that.fdata[i].isdef === 'true') {
            that.index = i
            that.type = that.fdata[i].va
            break
          }
        }
      })
      .catch(error => {
        console.error(error)
      })
    this.$axios.get(`https://www.2019.one/api/links/oltools.php`, {
      params: {
      }
    })
      .then(res => {
        that.onlinetoolsList = res.data
      })
      .catch(error => {
        console.error(error)
      })
    this.$axios.get(`https://www.2019.one/api/lunar/total.php`, {
      params: {
      }
    })
      .then(res => {
        that.nowDateTime.lunar = res.data
        that.doWhiteBlack()
      })
      .catch(error => {
        console.error(error)
      })
  },
  mounted () {
    // console.log(this.bingUrl + '测试')
    if (this.$cookies.isKey('kjlink')) {
      this.kjlink = JSON.parse(this.$cookies.get('kjlink'))
      if (this.kjlink[0].keyname !== undefined) {
        console.log('------')
      } else {
        let newArr = []
        this.kjlink.map((item, index) => {
          newArr.push(
            Object.assign({}, item, {
              keyname: item.name
            })
          )
          console.log(index)
        })
        this.kjlink = newArr
        this.saveLinks()
      }
    } else {
      this.$cookies.set('kjlink', JSON.stringify(this.kjlink), -1)
    }
    if (window.localStorage.getItem('bgsettings') !== null) {
      this.settings = JSON.parse(window.localStorage.getItem('bgsettings'))
      if (this.settings[0].defimg === '/static/bg4.jpg') {
        this.settings[0].defimg = '/img/bg4.jpg'
        window.localStorage.setItem('bgsettings', JSON.stringify(this.settings))
      }
    } else {
      window.localStorage.setItem('bgsettings', JSON.stringify(this.settings))
    }
    if (!this.settings[0].title) {
      this.settings[0].title = 'OneStart'
    }
    if (!this.settings[0].iszdytitle) {
      this.settings[0].iszdytitle = false
    }
    if (!this.settings[0].timesettings) {
      this.settings[0].timesettings = this.defTimeSettings
    }
    if (!this.settings[0].countdownSettings) {
      this.settings[0].countdownSettings = this.defcountdownSettings
    }
    if (this.settings[0].timesettings.showNoon === undefined) {
      this.settings[0].timesettings.showNoon = this.defTimeSettings.showNoon
    }
    if (this.settings[0].isbinguhd === undefined) {
      this.settings[0].isbinguhd = false
    }
    if (this.settings[0].isbing !== 'isbing') {
      this.settings[0].isbing = ''
      if (this.settings[0].img !== '' && this.settings[0].iszdy) {
        document.styleSheets[0].addRule('body:before', 'background:url(data:image/jpeg;base64,' + this.settings[0].img + ') no-repeat center!important;background-size:cover!important;')
      } else {
        document.styleSheets[0].addRule('body:before', 'background:url(' + this.settings[0].defimg + ') no-repeat center!important;background-size:cover!important;')
      }
    } else {
      this.getBingImg()
    }
    var abc = this.$refs.scrollDiv
    var kj = this.$refs.kjbox
    var firefox = navigator.userAgent.indexOf('Firefox') !== -1
    firefox ? abc.addEventListener('DOMMouseScroll', this.mouseWheel, false) : abc.addEventListener('mousewheel', this.mouseWheel, false)
    firefox ? kj.addEventListener('DOMMouseScroll', this.kmouseWheel, false) : kj.addEventListener('mousewheel', this.kmouseWheel, false)
    if (this.settings[0].ver) {
      delete this.settings[0].ver
    }
    this.getVer()
    window.localStorage.setItem('bgsettings', JSON.stringify(this.settings))
    this.saveLinks()
    this.setCountDown()
  },
  methods: {
    creatkjeditHeight () {
      this.$refs.kjebigbox.style.height = this.kjlink.length * 38 + 'px'
      console.log(this.$refs.kjebigbox)
    },
    showKjadd () {
      if (!this.showgset) {
        if (this.showeditset === true) {
          this.showeditset = false
          this.checkSetShow()
        } else {
          if (this.moveindex.length !== this.kjlink.length) {
            this.generateMoveindex()
          }
          this.showeditset = true
          this.checkSetShow()
        }
      } else {
        this.showAlert('提示', '请先关闭设置！')
      }
    },
    closeKjadd () {
      this.showeditset = false
      this.checkSetShow()
    },
    saveKjadd () {
      this.saveLinks()
      this.showAlert('提示', '保存成功！')
      this.closeKjadd()
    },
    generateMoveindex () {
      this.moveindex = []
      for (var i = 0; i < this.kjlink.length; i++) {
        this.moveindex[i] = '1'
      }
    },
    doKjlinkMove (index, tindex) {
      if (index > tindex && index > 0 && tindex > -1) {
        this.kjlink.splice(tindex, 0, this.kjlink[index])
        this.kjlink.splice(index + 1, 1)
        this.moveindex.splice(tindex, 0, this.moveindex[index])
        this.moveindex.splice(index + 1, 1)
      } else if (index < tindex && index !== this.kjlink.length - 1 && tindex < this.kjlink.length) {
        this.kjlink.splice(tindex + 1, 0, this.kjlink[index])
        this.kjlink.splice(index, 1)
        this.moveindex.splice(tindex + 1, 0, this.moveindex[index])
        this.moveindex.splice(index, 1)
      } else {
        if (index === 0) {
          this.showAlert('提示', '亲，不能再上移啦！')
        } else if (index === this.kjlink.length - 1) {
          this.showAlert('提示', '亲，不能再下移啦！')
        } else if (tindex < 0) {
          this.showAlert('错误', '上移位数溢出！(<= -1)')
        } else if (tindex > this.kjlink.length - 1) {
          this.showAlert('错误', '下移位数溢出！(>= ' + this.kjlink.length + ')')
        }
      }
    },
    switchOnlineToolsShow () {
      if (this.onlineToolsShow) {
        this.onlineToolsShow = false
      } else {
        this.onlineToolsShow = true
      }
    },
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1]) // 解码base64得到二进制字符串
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength) // 创建8位无符号整数值的类型化数组
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i) // 数组接收二进制字符串
      }
      return new Blob([uInt8Array], {type: contentType})
    },
    doOutputShow (stat) {
      if (stat === 'out') {
        this.outputable = true
        this.outputStat = stat
        var bkarr = []
        bkarr[0] = this.$cookies.get('kjlink')
        var bko = JSON.parse(window.localStorage.getItem('bgsettings'))
        bko[0].img = ''
        bkarr[1] = JSON.stringify(bko)
        this.outputText = EncryptByDES(JSON.stringify(bkarr), 'cw2019ljj')
        if (this.settings[0].iszdy) {
          var blob = this.base64ToBlob('data:image/png;base64,' + JSON.parse(window.localStorage.getItem('bgsettings'))[0].img)
          this.bloburl = URL.createObjectURL(blob)
        }
        this.showOutputAlert()
      } else if (stat === 'in') {
        if (this.outputStat === 'out') {
          this.outputText = ''
        }
        this.outputable = false
        this.outputStat = stat
        this.showOutputAlert()
      }
    },
    showOutputAlert () {
      if (this.outputAlertShow === true) {
        this.outputAlertShow = false
        setTimeout(() => {
          this.outputAlertShow = true
        }, 10)
      } else {
        this.outputAlertShow = true
      }
    },
    closeOutputAlert () {
      if (this.outputStat === 'out') {
        this.outputText = ''
      }
      this.outputAlertShow = false
    },
    copyToClip () {
      let that = this
      const { toClipboard } = useClipboard()
      const copy = async (Msg) => {
        try {
          //复制
          await toClipboard(Msg)
          //下面可以设置复制成功的提示框等操作
          that.showAlert('提示', '已成功为你复制到剪贴板！')
          } catch (e) {
          //复制失败
          that.showAlert('错误', '数据复制失败！')
          console.error(e)
        }
      }
      copy(this.outputText)
    },
    inputSet () {
      var toast = setTimeout(() => {
        this.showAlert('错误', '解码失败，请检查数据是否有误！')
      }, 150)
      var DecText = DecryptFromDes(this.outputText, 'cw2019ljj')
      if (DecText === '') {
        clearTimeout(toast)
        this.showAlert('错误', '输入数据不能为空')
      } else if (this.dataLength(DecText) < 560) {
        clearTimeout(toast)
        this.showAlert('错误', '输入数据有误')
      } else {
        var setdt = JSON.parse(DecText)
        if (setdt instanceof Array) {
          clearTimeout(toast)
          this.$cookies.set('kjlink', setdt[0], -1)
          window.localStorage.setItem('bgsettings', setdt[1])
          this.isinputsuccess = true
          var t = setInterval(() => {
            this.outputCountDown > 0 ? this.outputCountDown-- : this.outputCountDown
          }, 1000)
          setTimeout(() => {
            clearInterval(t)
            location.reload()
          }, 3000)
        } else {
          clearTimeout(toast)
          this.showAlert('错误', '输入数据有误')
        }
      }
    },
    dataLength (fData) {
      var intLength = 0
      for (var i = 0; i < fData.length; i++) {
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255)) {
          intLength = intLength + 2
        } else {
          intLength = intLength + 1
        }
      }
      return intLength
    },
    switchVer () {
      this.showver = !this.showver
    },
    showHowCountSet () {
      this.showAlert('小提示', '请按照如"Feb 4, 2022 20:00:00"的格式设置截止时间即可!')
    },
    getVer () {
      var that = this
      this.$axios.get(`https://www.2019.one/api/startver/`, {
        params: {
        }
      })
        .then(res => {
          that.updateList = res.data
          that.version = that.updateList[that.updateList.length - 1].version
          console.log('%c-当前版本：V' + this.version + '-', 'color:#333;padding-top:5px;padding-bottom:5px;')
        })
        .catch(error => {
          console.error(error)
        })
    },
    getlunar (type) {
      if (type === 'y' && this.nowDateTime.lunar.length !== 0) {
        return this.nowDateTime.lunar[0].split('年')[0]
      } else if (type === 'd' && this.nowDateTime.lunar.length !== 0) {
        return this.nowDateTime.lunar[0].split('年')[1]
      }
    },
    doWhiteBlack () {
      var style = '-webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);-ms-filter: grayscale(100%);-o-filter: grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);_filter:none;'
      if (this.nowDateTime.lunar[2][0] === '国家公祭日') {
        document.styleSheets[0].addRule('html', style)
      } else if (this.nowDateTime.lunar[2][0] === 'grey') {
        document.styleSheets[0].addRule('html', style)
      }
    },
    getTime () {
      var _this = this
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      var hh
      if (this.settings[0].timesettings.isTwelveHour) {
        hh = new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours()
      } else {
        hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      }
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.setDay(new Date())
      this.setNoon(new Date())
      _this.nowDateTime.ntime = hh + ':' + mf
      _this.nowDateTime.seconds = ':' + ss
      _this.nowDateTime.date = mm + '月' + dd + '日'
      _this.nowDateTime.year = yy + '年'
    },
    setDay (timedat) {
      var week
      if (timedat.getHours() === 0) week = '星期日'
      if (timedat.getDay() === 1) week = '星期一'
      if (timedat.getDay() === 2) week = '星期二'
      if (timedat.getDay() === 3) week = '星期三'
      if (timedat.getDay() === 4) week = '星期四'
      if (timedat.getDay() === 5) week = '星期五'
      if (timedat.getDay() === 6) week = '星期六'
      this.nowDateTime.week = week
    },
    setNoon (timedat) {
      var noon
      if (timedat.getHours() === 0) noon = '半夜'
      if (timedat.getHours() > 0 && timedat.getHours() < 6) noon = '凌晨'
      if (timedat.getHours() > 5 && timedat.getHours() < 12) noon = '上午'
      if (timedat.getHours() > 11 && timedat.getHours() < 13) noon = '中午'
      if (timedat.getHours() > 12 && timedat.getHours() < 18) noon = '下午'
      if (timedat.getHours() > 17 && timedat.getHours() < 19) noon = '傍晚'
      if (timedat.getHours() > 18) noon = '晚上'
      this.nowDateTime.noon = noon
      // 0-1半夜 1-6凌晨 6-12上午 12-13中午 13-18下午 18-19傍晚 19-0晚上
    },
    outputDateTime () {
      if (this.settings[0].timesettings.showYear && this.settings[0].timesettings.showDate) {
        return this.nowDateTime.year + this.nowDateTime.date
      } else if (this.settings[0].timesettings.showYear) {
        return this.nowDateTime.year
      } else if (this.settings[0].timesettings.showDate) {
        return this.nowDateTime.date
      } else {
        return ''
      }
    },
    currentTime () {
      this.timer = setInterval(this.getTime, 500)
    },
    getBingImg () {
      var that = this
      this.$axios.get(`/bing`, {
        params: {
          format: 'js',
          idx: 0,
          n: 1,
          mkt: 'zh-CN'
        }
      })
        .then(res => {
          that.bingUrl = res.data.images[0].url
          that.bingUrlUHD = res.data.images[0].url.replace(/1920x1080/g, 'UHD')
          if (that.settings[0].isbinguhd) {
            document.styleSheets[0].addRule('body:before', 'background:url(https://cn.bing.com/' + this.bingUrlUHD + ') no-repeat center!important;background-size:cover!important;')
          } else {
            document.styleSheets[0].addRule('body:before', 'background:url(https://cn.bing.com/' + this.bingUrl + ') no-repeat center!important;background-size:cover!important;')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    showGset () {
      if (this.showgset) {
        this.showgset = false
        this.checkSetShow()
      } else {
        this.showgset = true
        this.checkSetShow()
      }
    },
    checkSetShow () {
      if (!this.showeditset && !this.showgset) {
        setTimeout(() => {
          this.showkjb = true
        }, 500)
      } else {
        this.showkjb = false
      }
    },
    savebgs () {
      window.localStorage.setItem('bgsettings', JSON.stringify(this.settings))
      this.showAlert('提示', '保存成功！')
      this.showGset()
    },
    setCountDown () {
      if (this.settings[0].countdownSettings.iszdycountdown) {
        this.$refs.vcountdown.viewable = true
        this.$refs.vcountdown.deadline = this.settings[0].countdownSettings.zdydeadline
        this.$refs.vcountdown.title = this.settings[0].countdownSettings.zdytitle
        this.$refs.vcountdown.tips = this.settings[0].countdownSettings.zdytips
      } else {
        this.$refs.vcountdown.getData()
      }
    },
    switchCountDownShow () {
      this.settings[0].countdownSettings.showcountdown = !this.settings[0].countdownSettings.showcountdown
      if (this.settings[0].countdownSettings.showcountdown) {
        this.$nextTick(() => { this.setCountDown() })
      }
    },
    switchzdycountdown () {
      this.settings[0].countdownSettings.iszdycountdown = !this.settings[0].countdownSettings.iszdycountdown
      this.setCountDown()
    },
    switchzdy () {
      if (!this.settings[0].iszdy && this.settings[0].isbing !== 'isbing') {
        this.settings[0].iszdy = true
        this.zdyguodu = true
        if (this.settings[0].img !== '') {
          document.styleSheets[0].addRule('body:before', 'background:url(data:image/jpeg;base64,' + this.settings[0].img + ') no-repeat center!important;background-size:cover!important;')
        }
      } else if (this.settings[0].isbing !== 'isbing') {
        this.settings[0].iszdy = false
        this.zdyguodu = false
        document.styleSheets[0].addRule('body:before', 'background:url(' + this.settings[0].defimg + ') no-repeat center!important;background-size:cover!important;')
      } else if (this.settings[0].isbing === 'isbing') {
        this.showAlert('提示', '请先关闭必应壁纸')
      }
    },
    switchblur () {
      if (this.settings[0].isblur === '') {
        this.settings[0].isblur = 'isblur'
      } else {
        this.settings[0].isblur = ''
      }
    },
    switchzdytitle () {
      if (this.settings[0].timesettings.showTime) {
        this.showAlert('提示', '请先关闭时间logo再进行此操作！')
      } else {
        if (!this.settings[0].iszdytitle) {
          this.settings[0].iszdytitle = true
          this.settings[0].title = this.titleguodu
        } else {
          this.settings[0].iszdytitle = false
          this.titleguodu = this.settings[0].title
          this.settings[0].title = this.settings[0].deftitle
        }
      }
    },
    switchblack () {
      if (this.settings[0].isblack === '') {
        this.settings[0].isblack = 'isblack'
      } else {
        this.settings[0].isblack = ''
      }
    },
    switchbing () {
      if (this.settings[0].isbing !== 'isbing') {
        this.settings[0].isbing = 'isbing'
        this.getBingImg()
        if (this.zdyguodu === true) {
          this.settings[0].iszdy = false
        }
      } else {
        this.settings[0].isbing = ''
        document.styleSheets[0].addRule('body:before', 'background:url(' + this.settings[0].defimg + ') no-repeat center!important;background-size:cover!important;')
        if (this.zdyguodu === true) {
          this.switchzdy()
        }
      }
    },
    switchbinguhd () {
      this.settings[0].isbinguhd = !this.settings[0].isbinguhd
      this.getBingImg()
    },
    switchTimeShow () {
      if (this.settings[0].timesettings.showTime) {
        this.settings[0].timesettings.showTime = false
      } else {
        this.settings[0].timesettings.showTime = true
      }
    },
    checkNdateShow () {
      if (this.settings[0].timesettings.showDate || this.settings[0].timesettings.showYear || this.settings[0].timesettings.showWeek || this.settings[0].timesettings.showLunarDate || this.settings[0].timesettings.showLunarYear || this.settings[0].timesettings.showJieqi || this.settings[0].timesettings.showFestival) {
        return true
      } else {
        return false
      }
    },
    switchTimeSettings (type) {
      switch (type) {
        case 'sec':
          this.settings[0].timesettings.showSec = !this.settings[0].timesettings.showSec
          break
        case 'date':
          this.settings[0].timesettings.showDate = !this.settings[0].timesettings.showDate
          break
        case 'year':
          this.settings[0].timesettings.showYear = !this.settings[0].timesettings.showYear
          break
        case 'week':
          this.settings[0].timesettings.showWeek = !this.settings[0].timesettings.showWeek
          break
        case 'lunardate':
          this.settings[0].timesettings.showLunarDate = !this.settings[0].timesettings.showLunarDate
          break
        case 'lunaryear':
          this.settings[0].timesettings.showLunarYear = !this.settings[0].timesettings.showLunarYear
          break
        case 'jieqi':
          this.settings[0].timesettings.showJieqi = !this.settings[0].timesettings.showJieqi
          break
        case 'festival':
          this.settings[0].timesettings.showFestival = !this.settings[0].timesettings.showFestival
          break
        case 'twelvehour':
          this.settings[0].timesettings.isTwelveHour = !this.settings[0].timesettings.isTwelveHour
          break
        case 'noon':
          if (this.settings[0].timesettings.isTwelveHour) {
            this.settings[0].timesettings.showNoon = !this.settings[0].timesettings.showNoon
          } else {
            this.showAlert('提示', '请先启用12小时制再进行此操作！')
          }
          break
        default:
          console.log('Err On TimeSettings')
      }
    },
    showAlert (t, w) {
      this.aindex = '999'
      this.cindex = '998'
      if (this.alertShow === true) {
        this.alertShow = false
        setTimeout(() => {
          this.alertShow = true
        }, 10)
      } else {
        this.alertShow = true
      }
      this.atitle = t
      this.atext = w
    },
    closeAlert () {
      this.alertShow = false
    },
    showConfirm (t, w, a) {
      this.aindex = '998'
      this.cindex = '999'
      if (this.confirmShow === true) {
        this.confirmShow = false
        setTimeout(() => {
          this.confirmShow = true
        }, 100)
      } else {
        this.confirmShow = true
      }
      this.caction = a
      this.ctitle = t
      this.ctext = w
    },
    closeConfirm () {
      this.confirmShow = false
    },
    shangc () {
      let files = document.getElementById('id').files[0]
      let fileSize = 0
      if (files) {
        fileSize = files.size
        if (fileSize > 10 * 1024 * 1024) {
          alert('文件大小不能大于10M！')
          return false
        } else if (fileSize < 1) {
          alert('文件大小不能为0M！')
          return false
        }
      } else {
        return false
      }
      // 转码base64
      let reader = new FileReader()
      let imgFile
      reader.readAsDataURL(files)
      reader.onload = e => {
        imgFile = e.target.result
        let arr = imgFile.split(',')
        this.settings[0].img = arr[1]
        document.styleSheets[0].addRule('body:before', 'background:url(data:image/jpeg;base64,' + this.settings[0].img + ') no-repeat center!important;background-size:cover!important;')
      }
    },
    addNewLink () {
      var name = this.linkname
      var link = this.inslink
      var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/
      if (!reg.test(link)) {
        this.showAlert('错误', '此网址不是以http://或https://开头，或者不是网址！')
      } else if (this.checkMult(link)) {
        this.showAlert('错误', '已经有这条链接了！')
      } else if (name === '') {
        this.showAlert('错误', '名称不能为空！')
      } else {
        var lobj = {link: link, name: name, keyname: name}
        this.kjlink.push(lobj)
        this.moveindex.push('1')
        this.creatkjeditHeight()
      }
    },
    checkMult (link) {
      for (var i = 0; i < this.kjlink.length; i++) {
        if (this.kjlink[i].link === link) {
          return true
        }
      }
    },
    saveLinks () {
      this.$cookies.set('kjlink', JSON.stringify(this.kjlink), -1)
    },
    conDelete (index) {
      this.delindex = index
      this.showConfirm('提示', '确定要删除吗？', this.doDelete)
    },
    doDelete () {
      this.kjlink.splice(this.delindex, 1)
      this.creatkjeditHeight()
      this.closeConfirm()
    },
    confreset () {
      this.showConfirm('小心...', '确定要重置设置吗？您所做的所有设置和快捷链接都将恢复至默认状态！', this.doReset)
    },
    doReset () {
      // defimg: '/static/bg4.jpg',
      // deftitle: 'OneStart',
      // img: '',
      // isblur: '',
      // isblack: '',
      // iszdy: false,
      // iszdytitle: false,
      // isbing: '',
      // isbinguhd: false,
      // title: '',
      this.settings[0].defimg = '/static/bg4.jpg'
      this.settings[0].deftitle = 'OneStart'
      this.settings[0].img = ''
      this.settings[0].isblur = ''
      this.settings[0].isblack = ''
      this.settings[0].iszdy = false
      this.settings[0].iszdytitle = false
      this.settings[0].isbing = ''
      this.settings[0].isbinguhd = false
      this.settings[0].title = ''
      this.settings[0].timesettings = this.defTimeSettings
      this.settings[0].countdownSettings = this.defcountdownSettings
      window.localStorage.setItem('bgsettings', JSON.stringify(this.settings))
      this.$cookies.set('kjlink', JSON.stringify(this.defkjlink), -1)
      this.closeConfirm()
      location.reload()
    },
    doSug (w) {
      this.word = w
      this.doSearch()
    },
    dokSetShow () {
      if (!this.showgset) {
        if (this.showkset === true) {
          this.showkset = false
          this.checkSetShow()
        } else {
          this.showkset = true
          this.checkSetShow()
        }
      } else {
        this.showAlert('提示', '请先关闭设置！')
      }
    },
    mouseWheel (e) {
      e = e || window.event
      if (e.stopPropagation) { // 这是取消冒泡
        e.stopPropagation()
      } else {
        e.cancelBubble = true
      }
      if (e.preventDefault) { // 这是取消默认行为，要弄清楚取消默认行为和冒泡不是一回事
        e.preventDefault()
      } else {
        e.returnValue = false
      }
      var abc = this.$refs.scrollDiv
      if (e.deltaY < 0) {
        abc.scrollLeft = abc.scrollLeft - 40
      } else {
        abc.scrollLeft = abc.scrollLeft + 40
      }
    },
    kmouseWheel (e) {
      e = e || window.event
      if (e.stopPropagation) { // 这是取消冒泡
        e.stopPropagation()
      } else {
        e.cancelBubble = true
      }
      if (e.preventDefault) { // 这是取消默认行为，要弄清楚取消默认行为和冒泡不是一回事
        e.preventDefault()
      } else {
        e.returnValue = false
      }
      var kj = this.$refs.kjbox
      if (e.deltaY < 0) {
        kj.scrollLeft = kj.scrollLeft - 40
      } else {
        kj.scrollLeft = kj.scrollLeft + 40
      }
    },
    changeW (va, ind) {
      if (this.inputed === true) {
        this.type = va
        this.index = ind
        this.$nextTick(() => {
          this.$refs.inp.style.paddingRight = this.$refs.spans.offsetWidth + 50 + 'px'
          this.changeId(this.type)
        })
      }
    },
    changeId (t) {
      var that = this
      for (var j = 0; j < that.fdata.length; j++) {
        if (t === that.fdata[j].va) {
          that.mid = that.fdata[j].mid
          break
        }
      }
    },
    test () {
      this.inputed = true
      this.changeW(this.type, this.index)
      if (this.word === '') {
        this.sug = ''
        this.$refs.suggestion.style.height = '0px'
        this.$refs.suggestion.style.marginTop = '0px'
        this.inputed = false
        if (this.showSelect === true) {
          this.doSelectShow()
        }
      } else {
        var that = this
        this.$axios.get(`/bdlx/su?p=3&cb=window.bdsug.sug`, {
          params: {
            wd: that.word
          }
        })
          .then(res => {
            var resd = res.data
            if (typeof resd === 'string') {
              var matches = resd.replace('window.bdsug.sug(', '').replace('});', '')
              var index = matches.lastIndexOf('s:')
              matches = matches.substring(index + 2, matches.length)
              // matches匹配到的是数组，数组第一个是所有正则表达式匹配的字符串，第二个是第一个小括号匹配到的字符串
              var jsonData = JSON.parse(matches)
              if (that.word !== '') {
                that.sug = jsonData
                if (that.sug.length < 6) {
                  if (that.sug.length !== 0) {
                    that.$refs.suggestion.style.height = (that.sug.length * 41) + 'px'
                    that.$refs.suggestion.style.marginTop = '10px'
                  } else {
                    that.$refs.suggestion.style.height = '0px'
                    that.$refs.suggestion.style.marginTop = '0px'
                  }
                } else {
                  that.$refs.suggestion.style.height = '246px'
                  that.$refs.suggestion.style.marginTop = '10px'
                }
              } else {
                that.sug = ''
                that.$refs.suggestion.style.height = '0px'
                that.$refs.suggestion.style.marginTop = '0px'
              }
            }
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    selectType (t) {
      var that = this
      for (var k = 0; k < that.fdata.length; k++) {
        if (t === that.fdata[k].va) {
          window.open(that.fdata[k].link + that.word + that.fdata[k].back)
          break
        }
      }
    },
    selectTypem (t) {
      var that = this
      for (var k = 0; k < that.fdata.length; k++) {
        if (t === that.fdata[k].va) {
          window.open(that.fdata[k].mlink + that.word + that.fdata[k].mback)
          break
        }
      }
    },
    doSearch () {
      if (this.word === '') {
        this.showAlert('Oops!', '真的不要搜索点东西么？')
      } else {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
          // 手机版地址
          this.selectTypem(this.type)
        } else {
          // 电脑版地址
          this.selectType(this.type)
        }
      }
    },
    doSelectShow () {
      if (this.showSelect === true) {
        this.showSelect = false
        this.cShow = false
        this.typeShow = true
        this.changeW(this.type, this.index)
      } else {
        this.showSelect = true
        this.cShow = true
        this.typeShow = false
        this.changeW(this.type, this.index)
      }
    },
    checkclass (va) {
      if (va === this.type) {
        return 'vselected'
      }
    },
    saveChange () {
      this.showSelect = true
    },
    blurd () {
      // 失去焦点了
      this.ishadow = ''
    },
    focused () {
      // 获得焦点了
      this.ishadow = 'ishadow'
    }
  },
  beforeUnmount: function () {
    // 实例销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.mainbox{
  width: 100%;
  margin: 88px auto 0 auto;
}
.selectbox::-webkit-scrollbar,.thinkbox::-webkit-scrollbar,.kjbox::-webkit-scrollbar,.verdetail-outter::-webkit-scrollbar, .outputTextArea::-webkit-scrollbar, .onlinetoolcontent::-webkit-scrollbar,.kjeditbox::-webkit-scrollbar {display:none}
.title{
  width: 100%;
  text-align: center;
  font-size: 60px;
  color: #fff;
  text-shadow: 0 4px 7px rgba(0, 0, 0, .2);
}
.timetitle{
  width: 100%;
  text-align: center;
  color:#fff;
}
.noon{
  font-size: 25px;
}
.ntime{
  font-size: 65px;
  text-shadow: 0 4px 7px rgba(0, 0, 0, .2);
}
.ndate{
  font-size: 13px;
  text-shadow: 0 3px 5px rgba(0, 0, 0, .5);
}
.ndate span{
  margin: 0 1.5px;
}

.kjeditbox{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  width: 100%;
  overflow-x: scroll;
  transition: all 1s;
}
.kjeditbigbox{
  transition: all 1s;
  height: 228px;
}
.kjeditbigbox,.kjeditbigbox span{
  width: 100%;
}
.kjeditbox div,.kjeditbox input{
  padding: 6px!important;
  border-radius: 6px!important;
  margin-right: 5px!important;
  margin-left: 0!important;
}
.kjeditbox .addimgbox{
  padding: 0!important;
  margin: 0!important;
}
.kjeditadd{
  margin-bottom: 0!important;
}
.kjeditbox .kjmove{
  display:flex;
  justify-content: center;
  align-items: center;
  height: 21px;
}
.kjeditbox .kjdelete{
  background: rgba(243, 0, 0, .50)!important;
}
.kjeditbox .kjdelete:hover{
  background: rgba(243, 0, 0, .69)!important;
}
.kjeditbox input{
  margin-bottom: 0!important;
}
.kjsdetail{
  max-width: 150px;
  width: auto!important;
}
.kjeditbox:last-child{
  margin-right: 0!important;
}
.kjindex{
  min-width: 16px!important;
  color: var(--textcolor);
}
.kjsmoveind{
  width: 30px!important;
  text-align: center;
}
.wxtips{
  width: 100%;
  color: #fff;
  font-size: 15px;
  margin-bottom: 5px;
}
.tiptext{
  display:inline-block;
  border-radius: 25px;
  padding: 10px;
  background: rgba(255,255,255,.2);
  backdrop-filter: blur(10px);
}
.selectbox{
  width: 48%;
  max-height: 15rem;
  overflow-x: scroll;
  margin: 10px auto 0;
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
  display:flex;
  flex-direction: row;
  justify-items: flex-start;
  align-items: center;
  align-content: flex-start;
  flex-wrap: nowrap;
  transition: all .3s;
}
.linkbox{
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  color: var(--textcolor);
  box-shadow: var(--insetshadowcolor);
  background: var(--transwhite);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 15px;
}
.lastlinkbox{
  margin-right: 0!important;
}

.linkbox span{
  display: inline-block;
  width: 100%;
  text-overflow: ellipsis;
  line-height: 17px;
  vertical-align: middle;
  box-sizing: border-box;
}
.thinkbox{
  width: 48%;
  background: var(--transwhite);
  box-shadow: var(--shadowcolor);
  backdrop-filter: blur(10px);
  margin: 0 auto;
  border-radius: 15px;
  overflow-y: scroll;
  height: 0px;
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
  transition: all 0.3s;
}
.thinkboxm{
  margin-top: 7px!important;
}
.thinkw{
  text-align: left;
  color: var(--textcolor);
  padding: 10px;
  cursor: pointer;
  line-height: 21px;
  transition: all .3s;
}
.thinkw:hover{
  background: var(--transwhitelight);
  padding-left: 15px;
  transition: all .3s;
}
select:focus {
  outline:none;
}
input:focus {
  outline:none;
}
   input[type=search]::-webkit-search-cancel-button{
    -webkit-appearance: none;/*此处只是去掉默认的小×*/
}

.linkbox:hover{
  background: var(--transwhitelight);
  box-shadow: var(--insetshadowcolor-dark);
}
.vselected{
  box-shadow: 0 0 6px #006acebe inset!important;
  -webkit-text-stroke:1px#333;
}
.s-box{
  width: 48%;
  height: 50px;
  margin: 50px auto 0 auto;
  position: relative;
}
.s{
  width: 100%;
  height: 50px;
  line-height: 50px;
  border: none;
  border-radius: 15px;
  box-sizing: border-box;
  background: var(--transwhite);
  background-blend-mode: multiply;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadowcolor);
  display: inline-block;
  padding-left: 15px;
  padding-right: 135px;
  text-align: left;
  font-size: 20px;
  color: var(--textcolor);
  transition: all 0.3s;
}
.s:hover,.s:focus{
  background: var(--transwhitelight);
  transition: all 0.3s;
}
.ishadow{
  background: rgba(255,255,255,.4);
  transition: all 0.3s;
}
.searchico{
  -webkit-tap-highlight-color: transparent;
  position:absolute;
  right: 2px;
  top: 0;
  background: rgba(0,0,0,0);
  font-size: 23px;
  line-height: 50px;
  text-align: center;
  height: 50px;
  width: 45px;
  border: none;
  cursor: pointer;
  color: #333;
  -webkit-tap-highlight-color: transparent;
}
.hello,.hello input{
  font-family: 'opposans';
  font-weight: bold;
}
.kjbox{
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  justify-content: flex-start;
  align-items: center;
  width: 48%;
  margin:10px auto 0 auto;
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
  vertical-align:middle;
}
.kjboxns{
  margin-bottom: 50px!important;
}
.kjboxsmt{
  margin-top: 4px!important;
}
.kjbox a:link,.kjadd,.kjsetbtn{
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  color: var(--textcolor);
  -webkit-tap-highlight-color: transparent;
  border-radius: 15px;
  padding: 8px 15px;
  transition: all .3s;
  justify-content: center;
  align-items: center;
}
.kjblinkd{
  border-radius: 15px 0 0 15px!important;
}
a.kjblinkd:hover{
  background: var(--transwhitelight);
  box-shadow: var(--insetshadowcolor-dark);
}

.kjadd{
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
}
.kjbox a:visited{
  color: var(--textcolor);
}
.kjbox img{
  height: 18px;
}
.kjimgbox,.addimgbox,.delimgbox{
  overflow: hidden;
  width: 16px;
  height: 16px;
  margin-right: 3px;
  display: inline-block;
  position: relative;
}
.kjimg,.addimg,.delimg{
  height: 16px!important;
  width: 16px!important;
  filter: drop-shadow(16px 0 #333);
  position: relative;
  left: -16px;
  opacity: 0.9;
}
.delimg{
  filter: drop-shadow(16px 0 #fff)!important;
}
.addimgbox,.delimgbox{
  margin-right: 0px!important;
}
.addimg{
  opacity: 1;
}
.kjlink{
  -webkit-tap-highlight-color: transparent;
  margin-right: 10px;
  border-radius: 15px;
  line-height: 20px;
  box-shadow: var(--insetshadowcolor);
  background: var(--transwhite);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: var(--textcolor);
  cursor: pointer;
  font-size: 15px;
}
.kjlinklast{
  margin-right: 0px!important;
}
.kjlink a:hover,.kjadd:hover,.kjsetbtn:hover{
  background: var(--transwhitelight);
  box-shadow: var(--insetshadowcolor-dark);
}
.dellink{
  -webkit-tap-highlight-color: transparent;
  color: #fff;
  display: flex;
  height: 20px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px 8px 8px;
  background: rgba(243, 0, 0, .69);
  border-radius: 0 15px 15px 0;
  box-shadow: var(--insetshadowcolor);
  transition: all .3s;
}
.dellink:hover{
  background: rgba(243, 0, 0, .79);
  box-shadow: var(--insetshadowcolor-dark);
}
.kjsetting{
  width: calc(48% - 30px);
  background: var(--transwhite);
  box-shadow: var(--shadowcolor);
  backdrop-filter: blur(10px);
  margin: 10px auto 50px auto;
  padding: 0 15px;
  border-radius: 15px;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.kjsinp,.kjsins input,.kjeditbox input{
  width: 60%;
  max-height: 39px;
  background: var(--transblack);
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--textcolor);
}
.countinp{
  width: calc(100% - 30px)!important;
}
.countsettips{
  font-size: 16px;
  color: var(--textcolor);
  cursor: pointer;
}
.setbox input{
  padding: 10px 15px!important;
  border-radius: 15px!important;
}
.kjsins{
  color: var(--textcolor);
}
.kjsins input{
  padding: 5px 10px!important;
  margin-bottom: 0!important;
  width: 20px!important;
  margin: 0 5px;
}
.kjsbb{
  display: flex;
  margin: 15px;
}
.kjsbtn{
  padding: 10px 30px;
  background: var(--transblack);
  border-radius: 15px;
  margin: 0 5px;
  cursor: pointer;
  white-space: nowrap;
  transition: all .3s;
  color:var(--textcolor);
  -webkit-tap-highlight-color: transparent;
}
.kjsbtn:hover{
  background: var(--transblacklight);
}
.kjstitle{
padding: 10px 0;
color:var(--textcolor);
}
.settings-title{
  padding: 15px 0!important;
}
.kjstips{
  color:rgba(51, 51, 51, .5)
}
.timesetbox{
  width: 60%;
  max-height: 378px;
  background: var(--transblack);
  z-index: 999;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 15px;
}

.c{
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 13px;
  color: #fff;
  text-align: left;
  background: rgba(255,255,255,.0);
}
.cleft{
  height: 30px;
  border-radius: 15px;
  line-height: 30px!important;
  backdrop-filter: blur(10px);
  text-shadow: 0 0 3px rgba(0, 0, 0, .3);
  -webkit-tap-highlight-color: transparent;
}
.cleft,.cright{
  padding: 0 15px;
  transition: all .3s;
}
.cright{
  cursor: pointer;
}
.cright:hover{
  background: rgba(255,255,255,.5);
  transition: all .3s;
}
.c a:link,.c a:visited{
  text-decoration: none;
  color: #fff;
}
.cver{
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.bbg{
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  z-index: -1;
  transition: all .3s;
}
.isblur{
  backdrop-filter: blur(20px);
  transition: all .3s;
}
.isblack{
  background: rgba(0,0,0,.3);
  transition: all .3s;
}

.setbox,.timesetbox-inner{
  width: 60%;
  display: flex;
  justify-content: space-between;
  margin: 0 0 15px 0;
}
.timesetbox-inner{
  width: 100%!important;
}
.tbi-last{
  margin-bottom: 0!important;
}
.gsbb{
  margin-top: 0!important;
  margin-left: 0!important;
  margin-right: 0!important;
  width: 35%;
  justify-content: space-between;
}
.gsbtn{
  width: 100%;
  margin: 0;
  padding-left: 7.5px!important;
  padding-right: 7.5px!important;
}
.gsbtnfs{
  margin-left: 0!important;
  margin-right: 7.5px!important;
}
.gsbtnfe{
  margin-left: 7.5px!important;
  margin-right: 0!important;
}
.settext{
  color: var(--textcolor);
}
.switchbtn{
  width: 40px;
  height: 20px;
  border: 2px solid var(--textcolor);
  border-radius: 12px;
  transition: all .3s;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.sbs{
  background: var(--transblack);
  transition: all .3s;
}
.sbc{
  margin: 1px 1px 1px 21px!important;
  transition: all .3s;
}
.scircle{
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--textcolor);
  margin: 1px 1px 1px 1px;
  transition: all .3s;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.a-upload {
    padding: 10px 15px;
    max-height: 42px;
    width: 60%;
    position: relative;
    cursor: pointer;
    color: var(--textcolor);
    background: rgba(0,0,0,.15);
    border-radius: 15px;
    display: block;
    margin-bottom: 15px;
    text-decoration: none;
    transition: all .3s;
}

.a-upload input{
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    filter: alpha(opacity=0);
    cursor: pointer;
}

.a-upload:hover {
  background: rgba(0,0,0,.25);
  transition: all .3s;
  text-decoration: none;
  cursor: pointer;
}
.type{
  -webkit-tap-highlight-color: transparent;
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  position: absolute;
  display: inline-block;
  border: none;
  color:rgba(0, 0, 0, 0);
  background: rgba(0,0,0,0);
  right: 47px;
  top: 0;
  width: auto;
  height: 50px;
  line-height: 50px;
  font-size: 17px;
  text-align: center;
  cursor: pointer;
}
.verbox{
  position: fixed;
  background: var(--transwhite);
  padding: 20px;
  backdrop-filter: blur(10px);
  left: 50%;
  bottom: 50px;
  margin-left: calc(0px - 10%);
  width: calc(20% - 40px);
  height: 60%;
  box-shadow: var(--shadowcolor);
  border-radius: 20px;
}
.vernum,.verinfo{
  text-align: left;
  color: var(--textcolor);
}
.verdetail-outter{
  height: calc(100% - 107px);
  overflow-y: scroll;
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
  vertical-align:middle;
}
.vertitle{
  color: var(--textcolor);
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid #00000023;
  font-size: 18px;
  -webkit-text-stroke:1px#333;
}
.verinfo{
  margin-bottom: 10px;
  font-size: 14px;
}
.vernum{
  font-size: 16px;
  -webkit-text-stroke:1px#333;
}
.verclose{
  margin: 10px 0 0 0!important;
}
option{
  text-align: center!important;
  color: #fff!important;
}
.outputTextArea{
  resize: none;
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: var(--transblack);
  border-radius: 10px;
  padding: 8px;
}
.oconfirm{
  border-bottom: 1px solid rgba(51, 51, 51, .1);
}
.copybtn{
  cursor: pointer;
}
a:link{
  text-decoration: none;
}
.copyed{
  margin-bottom: 5px;
}
.outputnotice{
  font-size: 15px!important;
  margin-bottom: 3px;
}
.kjsbtntools{
  margin-bottom: 15px;
}
.onlinetoolbox .aconfirm{
  border-top: 1px solid rgba(51, 51, 51, .1);
  position: absolute;
  bottom: 0;
}
.onlinetoolbox{
  height: 386px;
  top: calc(50% - 193px);
}
.onlinetoolcontent{
  max-height: calc(100% - 121px);
  overflow-y: scroll;
  padding-top: 0!important;
  padding-bottom: 0!important;
  margin-top: 15px;
  margin-bottom: 18px;
  border-bottom: none;
  display: flex;
  flex-direction: column;
}
.onlinetoolcontent a:link{
  text-decoration: none;
}
select::-ms-expand { display: none;}
@media screen and (min-height:601px) and (min-width:900px)
{
.mainbox{
  margin-top:15%!important;
}
}
@media screen and (min-width:900px)
{
.mainbox{
  margin-top:117px;
}
.s-box{
  width: 48%!important;
}
.setbox,.timesetbox,.gsbb{
  width: 35%!important;
}
}
@media screen and (min-width:901px) and (max-width:1259px)
{
  .kjeditbox{
    justify-content: left;
  }
}
@media screen and (min-width:900px) and (max-width:1280px)
{
  .setbox,.timesetbox,.gsbb{
    width: 45%!important;
  }
  .verbox{
    margin-left: calc(0px - 15%);
    width: calc(30% - 40px);
  }
}
@media screen and (min-width:500px) and (max-width:719px)
{
.kjeditbox{
  justify-content: left;
}
}
/* 窗口宽度大于500px小于900px */
@media screen and (min-width:500px) and (max-width:900px)
{
  .s-box{
    width: 85%!important;
  }
  .thinkbox{
    width: 85%;
  }
  .selectbox,.kjbox{
    width: 85%;
  }
  .selectbox{
    width: 85%;
  }
  .kjsetting{
    width: calc(85% - 30px);
  }
  .kjsinp{
    width: 85%;
  }
  .setbox,.timesetbox,.gsbb{
    width: 50%!important;
  }
  .verbox{
    margin-left: calc(0px - 26%);
    width: calc(52% - 40px);
  }

}
/* 窗口宽度小于500px */
@media screen and (max-width:500px)
{
  .kjeditbox{
  justify-content: left;
  }
  .mainbox{
  margin-top:50px;
  }
  .s-box{
    width: 88%!important;
  }
  .selectbox,.kjbox{
    width: 88%;
  }
  .thinkbox{
    width: 88%;
  }
  .kjsetting{
    width: calc(88% - 30px);
  }
  .kjsinp{
    width: 88%;
  }
  .selectbox label{
    width: 100%;
  }
  .setbox,.timesetbox,.gsbb{
    width: 80%!important;
  }
  .verbox{
    margin-left: calc(0px - 33%);
    width: calc(66% - 40px);
  }
}
/* 宽度小于300 */
@media screen and (max-width:300px)
{
  .setbox,.timesetbox,.gsbb{
    width: 80%!important;
  }
  .verbox{
    margin-left: calc(0px - 45%);
    width: calc(90% - 40px);
  }
}
@media screen and (max-height:388px)
{
.onlinetoolbox{
  height: 100%;
  top: 0;
  left: 0;
  margin-left: 0;
  width: 100%;
}
}
</style>
