<template>
    <div class="layout">
        <strong class="title">房间</strong>
        <div class="room-item" v-for="(value,key) of rooms" :key="key">
            
            <span class="row1">房间:<strong>{{key}}</strong></span>
            <span class="row2">人数:<strong>{{value.users.length}}</strong></span>

            <mt-button size="small" @click="joinRoom(value,key)">详情</mt-button>
            <mt-button size="small" @click="beginGame(value)">游戏</mt-button>
        </div>
    </div>
</template>
<script>
import Constants from '../../common/Constants';
export default {
  data () {
    return {
      onlineNum: 0,
      rooms: {}
    }
  },
  sockets: {
    [Constants.GET_ROOMS] (val) {
      console.log('@@##online GET_ROOMS:' + JSON.stringify(val));
      this.rooms = val;
    }
  },
  methods: {
    joinRoom (value, key) {
      this.$emit('selectRoom', { roomId: key, users: value.users });
    },
    beginGame (value) {
      this.$router.push({ name: 'game' });
    }
  },
  mounted () {
    console.log('@@##rooms mounted()');
    this.$socket && this.$socket.emit(Constants.GET_ROOMS, {}, result => {
      console.log('@@##get rooms:' + result);
      if (result) {
        this.rooms = result;
      }
    });
  },
  created () {
    if (!this.$socket) {
      this.$router.push({ path: '/login' });
    }
    console.log('@@##created!');
  }
}
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: auto;
  .room-item {
    padding: 4px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d8d8d8;
    .row1 {
      flex: 3;
    }
    .row2 {
      flex: 3;
    }
  }
}
.title {
  position: relative;
  text-align: center;
  padding: 8px;
  font-size: 14pt;
}
</style>



