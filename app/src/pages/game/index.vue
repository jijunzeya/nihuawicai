<template>
  <div class="canvas-wrap">
    <mt-header title="你画我猜">
      <router-link to="/" slot="left">
        <mt-button icon="back">back</mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div class="content">
      <div class="left">
        <canvas :width="width" :height="height" class="canvas" ref="canvas"></canvas>
        <div class="opera-panel">
          <opera-panel></opera-panel>
          <!-- <mt-button class="back-btn" size="small" @click="backDraw()">回退</mt-button> -->
        </div>
        <div class="input">
          <input v-model="inputMessage" v-on:keyup.enter="send" placeholder="请输入内容" />

          <mt-button type="primary" @click="send()" size="small">发送答案</mt-button>

        </div>
      </div>
      <div class="right">
        <game-chat></game-chat>
      </div>

    </div>
  </div>
</template>
<script>
import Game from '@/game';
import SocketMixin from '@/pages/common/socket-mixin';
export default {
  mixins: [SocketMixin],
  components: {
    'game-chat': () => import('@/pages/game/game-chat.vue'),
    'opera-panel': () => import('@/pages/game/opera-panel.vue')
  },
  data () {
    return {
      inputMessage: null,
      game: null,
      width: null,
      height: null

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
    this.game = new Game(canvas, this.$socket, () => {
      this.$router.push({ name: 'login' });
    });
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
  height: 100%;

  .content {
    display: flex;
    flex: 1;
    flex-direction: row;
    .left {
      display: flex;
      flex: 7;
      flex-direction: column;
      .opera-panel {
        height: 20vh;
        // padding: 16px;
        border: 1px solid #c3c3c3;
        display: flex;
        .back-btn {
          align-content: flex-end;
        }
      }

      .input {
        height: 5vh;
        display: flex;
        margin: 8px;
        input {
          flex: 1;
          margin-right: 8px;
        }
      }
      .canvas {
        flex: 1;
        height: 60vh;
        // border: 10px solid #c3c3c3;
      }
    }
    .right {
      padding: 8px;
      flex: 3;
      border: 1px solid #c3c3c3;
    }
  }
}
</style>

