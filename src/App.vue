<template>
  <router-view/>
</template>
<script>
export default({
})
</script>

<style>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  color: #fff !important;
  -webkit-text-fill-color: #fff;
  -webkit-transition: background-color 99999999s ease-in-out 0s;
  transition: background-color 99999999s ease-in-out 0s;
}
input:autofill,
input:autofill:hover,
input:autofill:focus {
  -webkit-text-fill-color: #fff;
  -webkit-transition: background-color 99999999s ease-in-out 0s;
  transition: background-color 99999999s ease-in-out 0s;
}
input::-webkit-input-placeholder{
    color:rgba(51, 51, 51, .6);
}
input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:rgba(51, 51, 51,.6);
}
input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:rgba(51, 51, 51,.6);
}
input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:rgba(51, 51, 51,.6);
}

@font-face{
font-family: 'opposans';
src: url('/public/fonts/OPPOSans-L.woff2');
}
@keyframes slide-in {
 0%{
    opacity: 0;
 }
 100%{
    opacity: 1;
 }
}
@keyframes slide-out {
 0%{
    opacity: 1;
 }
 100% {
    opacity: 0;
 }
}
.slide-enter-active {
  animation: slide-in .3s;
}
.slide-leave-active  {
  animation: slide-out .3s;
}
.slide-enter-from, .slide-leave-to {
   opacity: 0;
}

@keyframes vshow {
 0%{
    opacity: 0;
    bottom: -61%;
 }
 50%{
    opacity: 1;
    bottom: 90px;
 }
 100%{
    opacity: 1;
    bottom: 50px;
 }
}
@keyframes vhide {
 0%{
    opacity: 1;
    bottom: 50px;
 }
 50%{
    opacity: 1;
    bottom: 90px;
 }
 100% {
    opacity: 0;
    bottom: -61%;
 }
}
.vfade-enter-active {
  animation: vshow 0.5s;
}
.vfade-leave-active  {
  animation: vhide 0.5s;
}
.vfade-enter-from, .vfade-leave-to {
  opacity: 0;
}

/* alert start */
@keyframes show {
 0%{
    opacity: 0;
    top: 130%;
 }
 50%{
    opacity: 1;
    top: 25%;
 }
 100%{
    opacity: 1;
    top: 30%;
 }
}
@keyframes hide {
 0%{
    opacity: 1;
    top: 30%;
 }
 50%{
    opacity: 1;
    top: 25%;
 }
 100% {
    opacity: 0;
    top: 130%;
 }
}
.sfade-enter-active {
  animation: show 0.5s;
  /* transition: opacity .5s ease; */
}
.sfade-leave-active  {
  animation: hide 0.5s;
  /* transition: opacity .5s ease; */
}
.sfade-enter-from, .sfade-leave-to {
  opacity: 0;
}
.osfade-enter-active {
  animation: slide-in 0.5s;
}
.osfade-leave-active  {
  animation: slide-out 0.5s;
}
.osfade-enter-from, .osfade-leave-to {
  opacity: 0;
}
.flip-kj-list-move {
  transition: transform .1s;
}
.flip-kj-list{
  transition: all 1s;
}
.flip-kj-list-enter-active, .flip-kj-list-leave-active {
  transition: all 1s;
}
.flip-kj-list-leave-active {
  position: absolute;
}
.flip-kj-list-enter-from, .flip-kj-list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  left: 0;
  transform: scaleY(0);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter-from, .fade-leave-active {
  opacity: 0
}
.alertbox{
  background: var(--transwhite);
  backdrop-filter: blur(10px);
  color:#333;
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 30%;
  margin-left: -150px;
  width: 300px;
  box-shadow: 0 0 8px rgba(0, 0, 0, .2);
  border-radius: 20px;
  overflow: hidden;
}
.atitle{
  padding: 15px 0 0 0;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.acontent{
  padding: 15px 15px 18px 15px;
  max-width: 100%;
  word-wrap: wrap;
  word-break: break-word;
  font-size: 16px;
  max-width: 100%;
  border-bottom: 1px solid rgba(51, 51, 51, .1);
}
.aconfirm{
  padding: 15px 0;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: rgba(51,51,51,.5);
}
.aconfirmb-box{
  display: flex;
  width: 100%;
}
.aconfirmb{
  padding: 15px 0;
  width: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(51,51,51,.5);
}
.aconfirmb:nth-of-type(1){
  border-right: 1px solid rgba(51, 51, 51, .1);
}
/* alert end */
body:before {
  content: '';
  position: fixed;
  z-index: -2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif, '黑体';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  margin-top: 60px;
}
</style>
