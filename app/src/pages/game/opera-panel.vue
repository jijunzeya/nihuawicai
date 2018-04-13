<template>
   <div class="panel-layout">
     <mt-range
          style="width:80px"
          v-model="lineWidth"
          :min="1"
          :max="40"
          :bar-height="2">
         <div slot="start">1</div>
         <div slot="end">40</div>
      </mt-range>
       {{lineWidth}}
   </div>
</template>
<script>
export default {
  data () {
    return {
      lineWidth: 2
    }
  }
}
</script>

<style lang="less" scoped>
.panel-layout {
  display: flex;
  flex: 1;
  .circle {
    border: 1px solid lawngreen;
  }
}
</style>

