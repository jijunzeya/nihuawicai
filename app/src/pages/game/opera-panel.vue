<template>
  <div class="panel-layout">
    <div class="font-layout">
      <mt-range style="width:80px" v-model="lineWidth" :min="1" :max="40" :bar-height="2">
        <div slot="start">1</div>
        <div slot="end">40</div>
      </mt-range>
      <span>线宽: {{lineWidth}}</span>
    </div>
    <div class="color-layout"></div>
    <mt-button class="back-btn" size="small" @click="backDraw()">回退</mt-button>

    <div>

    </div>
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
  .font-layout {
    display: flex;
    flex-direction: column;
    span {
      text-align: center;
    }
  }

  .color-layout {
    flex: 1;
  }

  .back-btn {
    float: right;
  }
}
</style>

