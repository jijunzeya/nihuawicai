<template>
    <div class="layout">
        <strong class="title">在线人数(房间:{{roomId}})</strong>
        <div class="people-item" v-for="person in persons" :key="person.id">
            <strong>{{person.nickName}}</strong>
            <mt-button size="small" @click="beginGame(value)">私聊</mt-button>
        </div>
    </div>
</template>
<script>
import Constants from '../../common/Constants';
export default {
  props: ['people', 'roomId'],
  data () {
    return {
      persons: []
    }
  },
  sockets: {
    [Constants.GET_ROOM_PERSONS] (val) {
      console.log('@@##online GET_ROOMS:' + JSON.stringify(val));
      this.persons = val;
    }

  },
  watch: {
    people (newV, oldV) {
      this.persons = newV;
    }
  },
  created () {
    console.log('@@##created!');
  }
}
</script>
<style lang="less" scoped>
.title {
  position: relative;
  text-align: center;
  padding: 8px;
  font-size: 14pt;
}
.layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: auto;
}
.people-item {
  padding: 4px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d8d8d8;
  strong {
    flex: 1;
  }
}
</style>


