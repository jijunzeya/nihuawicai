<template>
  <div class="wrapper">
    <div class="box1">这是字体大小</div>
    <div class="box2"></div>
    <div class="box3"></div>
    <div class="box4"></div>
    <div class="box5">又是一个字体哦</div>
  </div>
</template>

<style lang="less" scoped>
// @import '../assets/css/var.less';
@import '../assets/css/common.less';

.wrapper div {
  height: 1rem;
}

.box1 {
  /* 750 * 20% */
  width: 150px;
  background-color: coral;
  font-size: 22dpx;
}

.box2 {
  /* 750 * 40% */
  width: 300px;
  background-color: skyblue;
}

.box3 {
  /* 750 * 60% */
  width: 450px;
  background-color: palegreen;
}

.box4 {
  /* 750 * 80% */
  width: 600px;
  background-color: wheat;
}
</style>