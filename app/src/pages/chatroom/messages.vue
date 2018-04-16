<template>
    <div class="layout">
       <strong class="title">{{userInfo.name}}在当前房间:{{userInfo.roomId}}</strong>
        <div class="message" ref="message">
            <div  v-for="(message,index) in messages" :key="index">
               <div :class="[userInfo.name!==message.nick?'message-item':'message-item-me']">
                <strong>{{message.nick}}: </strong> <span>{{message.message}}</span>
               </div>
            </div>
        </div>
        <div class="input">
            <input v-model="sendMessage" v-on:keyup.enter="send" placeholder="请输入消息" />
            
            <mt-button type="primary" @click="send()" size="small">发送</mt-button>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
  data () {
    return {
      sendMessage: '',
      messages: [],
      userInfo: {}
    }
  },
  sockets: {
    serverSendUserChat (val) {
      console.log('@@##message serverSendUserChat :' + JSON.stringify(val))
      this.messages.push(val);
      Vue.nextTick(() => {
        this.$refs.message.scrollTop = this.$refs.message.scrollHeight;
      })
    }
  },
  // watch: {
  //   'messages': function (val) {
  //     this.$refs.message.scrollTop = this.$refs.message.offsetHeight;
  //   }
  // },
  methods: {
    send () {
      console.log('@@##send:' + this.sendMessage);
      this.$socket.emit('userChat', this.sendMessage);
      this.sendMessage = null;
    },
    handleScroll (event) {
      console.log('@@##hhandleScroll:' + event.pageYOffset);
    }
  },
  mounted () {
    console.log('@@##message mounted');
    this.$refs.message.addEventListener('scroll', this.handleScroll);
  },
  created () {
    console.log('@@##created');
    let localUser = localStorage.getItem('userInfo');
    this.userInfo = localUser ? JSON.parse(localUser) : {};
  }
}
</script>
<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column; // height: 100vh;
  width: 100%;
  .title {
    position: relative;
    text-align: center;
    padding: 8px;
    font-size: 14pt;
    // color: white;
    // background: #3e9fff;
  }
  .message {
    flex: 1;
    width: 100%;
    margin: 5px;
    overflow: auto;
    .message-item {
      display: flex;
      margin: 8px 8px 8px 0;
      padding: 8px 4px;
      background: #f3f3f3;
      border: 1px solid #f3f3f3;
      border-radius: 2px;
      float: left;
      clear: both;
    }

    .message-item-me {
      display: flex;
      margin: 8px 8px 8px 0;
      padding: 8px 4px;
      background: #dbf4fe;
      border: 1px solid #dbf4fe;
      border-radius: 2px;
      justify-content: flex-end;
      float: right;
      clear: both;
    }
  }
  .input {
    display: flex;
    margin: 8px;
    input {
      flex: 1;
      margin-right: 8px;
    }
  }
}
</style>

