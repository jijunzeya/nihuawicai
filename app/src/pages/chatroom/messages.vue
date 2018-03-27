<template>
    <div class="layout">
        <div class="message">
            <strong>{{userInfo.name}}在当前房间:{{userInfo.roomId}}</strong>
            <li class="message-item" v-for="message in messages" :key="message.message">
                <span>{{message.message}}</span>
                <strong>{{message.nick}}</strong>
            </li>
        </div>
        <div class="input">
            <input v-model="sendMessage" placeholder="请输入消息"></input>
            <button @click="send()">发送</button>
        </div>
    </div>
</template>
<script>
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
        }
    },
    methods: {
        send () {
            console.log('@@##send:' + this.sendMessage);
            this.$socket.emit('userChat', this.sendMessage);
        }
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
  margin: 10px;
  width: 100%;
  .message {
    flex: 1;
    width: 100%;
    .message-item {
      display: flex;
    }
  }
  .input {
    display: flex;
  }
}
</style>

