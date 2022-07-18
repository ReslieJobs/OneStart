<template>
<div>
  <div class="count-font" v-if="viewable && !expired"><div class="cfon1">距离{{title}}</div><div class="cfon2">还有<div class="day" v-if="lday > 0">{{lday}}</div><span v-if="lday > 0">天</span><div class="hour" v-if="lhour > 0">{{lhour}}</div><span v-if="lhour > 0">时</span><div class="min" v-if="lmin > 0">{{lmin}}</div><span v-if="lmin > 0">分</span><div class="sec" v-if="lday < 1">{{lsec}}</div><span v-if="lday < 1">秒</span></div></div>
  <div class="count-font cfon1" v-else>{{tips}}</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      deadline: '', //结束时间
      days: '',
      hours: '',
      minutes: '',
      seconds: '',
      expired: false,
      lday: '', //补零后格式，以下同
      lhour: '',
      lmin: '',
      lsec: '',
      viewable: false, //是否可见
      title: '',
      tips: '' //计时结束后提示
    }
  },
  created () {
    var ctimer = setInterval(() => {
      // 计算时间
      var countDownDate = new Date(this.deadline).getTime()
      var now = new Date().getTime()
      var diff = countDownDate - now
      // 时间格式转换
      var tdays = Math.floor(diff / (1000 * 60 * 60 * 24))
      var thours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var tminutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      var tseconds = Math.floor((diff % (1000 * 60)) / 1000)
      // 补零
      this.days = tdays < 10 ? '0' + tdays : tdays
      this.hours = thours < 10 ? '0' + thours : thours
      this.minutes = tminutes < 10 ? '0' + tminutes : tminutes
      this.seconds = tseconds < 10 ? '0' + tseconds : tseconds
      // 检查时间是否已到
      if (diff < 0) {
        clearInterval(ctimer)
        this.expired = true
      }
      this.lday = this.days
      this.lhour = this.hours
      this.lmin = this.minutes
      this.lsec = this.seconds
    }, 1000)
  },
  methods: {
    getData () {
      var that = this
      this.$axios.get(`https://2019.one/api/countd.php`, {
        params: {
          id: '0'
        }
      })
        .then(res => {
          if (res.data.viewable === '1') {
            that.viewable = true
          } else {
            that.viewable = false
          }
          that.deadline = res.data.deadline
          that.title = res.data.title
          that.tips = res.data.tips
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{
  margin: 0;
  padding: 0;
}
.count-font{
  color: #fff;
  font-size: 13px;
  z-index: 2;
  vertical-align: middle;
  text-shadow: 0 3px 5px rgba(0, 0, 0, .5);
}

.day,.hour,.min,.sec{
  display: inline-block;
}
</style>
