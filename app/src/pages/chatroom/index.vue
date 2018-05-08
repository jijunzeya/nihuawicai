<template>
  <div class="index-layout">
    <mt-header title="聊天大厅">
      <!-- <router-link to="/"> -->
      <mt-button slot="left" icon="back" @click="onBack">back</mt-button>
      <!-- </router-link> -->
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <div class="main">
      <div class="left">
        <messages></messages>
      </div>
      <div class="right">
        <div class="up">
          <rooms @selectRoom="selectRoom"></rooms>
        </div>
        <div class="down">
          <people-online :people="users" :roomId="roomId"></people-online>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
  components: {
    'messages': () => import('./messages.vue'),
    'rooms': () => import('./rooms.vue'),
    'people-online': () => import('./people-online.vue')
  },
  data () {
    return {
      users: [],
      roomId: null
    }
  },
  sockets: {
    disconnect: function (val) {
      console.log('@@##chat room index.vue game socket disconnect:' + val);
      this.$router.push('/login');
    },
    serverSendUserChat (val) {
      console.log('@@##index serverSendUserChat:' + JSON.stringify(val))
    }
  },
  methods: {
    onBack () {
      MessageBox.confirm('确定退出大厅?').then(action => {
        console.log('@@##message box :' + action);
      }, cancel => {
        console.log('@@##message box :' + cancel);
      });
    },
    selectRoom (val) {
      this.users = val.users;
      this.roomId = val.roomId;
    }
  },
  created () {

  }
}
</script>
<style lang="less" scoped>
.index-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.main {
  display: flex;
  flex: 1;
  height: 100%;
  .left {
    flex: 1;
    // height: 100%;
    display: flex;
    margin: 8px;
    border: gray solid 1px;
    border-radius: 0.5px;
  }
  .right {
    flex: 1;
    width: 20%;
    // height: 100%;
    display: flex;
    margin: 8px 8px 8px 0;
    flex-direction: column;
    .up {
      // margin: 8px;
      border: gray solid 1px;
      border-radius: 0.5px;
      flex: 1;
      overflow: auto;
    }
    .down {
      margin-top: 8px;
      border: gray solid 1px;
      border-radius: 0.5px;
      flex: 1;
      overflow: auto;
    }
  }
}
</style>


