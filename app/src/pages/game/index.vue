<template>
  <div class="canvas-wrap">
    <canvas :width="width" :height="height" class="canvas" ref="canvas"></canvas>
    <div>
      <button>确认</button>
       <button @click="backDraw()" class="back-btn">回退</button>
    </div>
  </div>
</template>
<script>
import Game from '@/game';
import SocketMixin from '@/pages/common/socket-mixin';
export default {
  mixins: [SocketMixin],
  data () {
    return {
      game: null,
      width: 0,
      height: 0

    }
  },
  sockets: {
    disconnect: function (val) {
      console.log('@@## in mixin game socket disconnect:' + val);
      this.$router.push('/login');
    },
    connect: function (val) {
      console.log('game socket connected:' + val);
    },
    gamePointData: function (val) {
      console.log('@@##game point data from server:' + JSON.stringify(val));
      this.game.receivePointData(val);
    },
    gameLinesData: function (val) {
      console.log('@@##gameLinesData from server:' + JSON.stringify(val));
      this.game.receiveLineData(val);
    },
    ERR_CONNECTION_REFUSED: function (val) {

    }
  },
  methods: {
    backDraw () {
      console.log('@@##回退');
      this.game.backDraw();
    }

  },
  mounted () {
    let canvas = this.$refs.canvas;
    this.game = new Game(canvas, this.$socket);
    var bbox = canvas.getBoundingClientRect();
    console.log('@@##mounted:' + bbox.width + ' ' + bbox.height);
    this.width = bbox.width;
    this.height = bbox.height;
  },
  created () {
    console.log('@@##game index created');
  }

}
</script>
<style lang="less" scoped>
.canvas-wrap {
  display: flex;
  flex-direction: column;
  background: #00ff00;
  height: 100%;
  .canvas {
    height: 100%;
    background: #0000ff;
    // border: 10px solid #c3c3c3;
  }
  .back-btn {
    background: #ffff00;
    padding: 1rem;
  }
}
</style>

