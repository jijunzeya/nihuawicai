<template>
    <div class="main">
        <div class="header">头部</div>
        <div class="content">
            <div class="form">
                <input type="text" v-model="loginInfo.tel" placeholder="请输入手机号"></input>
                <input type="text" v-model="loginInfo.name" placeholder="请输入姓名"></input>
                <button @click="submit">提交</button>
                 <button @click="testGame">游戏</button>
            </div>
        </div>

        <div class="footer">Footer</div>

    </div>
</template>
<script>
import Constants from '../common/Constants';
export default {
  data () {
    return {
      loginInfo: {
        name: '',
        tel: ''
      }
    };
  },
  sockets: {
    connect: function () {
      console.log('socket connected');
    },
    joinedRoom: function (val) {
      console.log('@@##joinedRoom from server:' + JSON.stringify(val));
    }
  },
  methods: {
    testGame () {
      this.$router.push({ name: 'game' });
    },
    submit () {
      console.log('@@##submit:' + JSON.stringify(this.loginInfo));

      // this.$router.push({ name: 'chatroom' });
      let params = { name: this.loginInfo.name, roomId: this.loginInfo.tel };
      this.$socket.emit(
        'createRoom',
        params,
        result => {
          console.log('@@##createRoom !' + JSON.stringify(result));
          localStorage.setItem('userInfo', JSON.stringify(params));
          this.$router.push({ name: 'chatroom' });
        }
      );
    }
  },
  created () {
    console.log('@@##login created:' + Constants.GET_ROOMS);
  }
};
</script>
<style lang="less" scoped>
.form {
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  input {
    margin: 20px;
    padding: 10px;
  }
}

.main {
  display: flex;
  flex-direction: column;
  height: 100vh; // position: absolute;
  .header {
    height: 70px; // width: 100%;
    background: #ff00ff; // position: fixed;
    // z-index: 1;
  }
  .content {
    // position: absolute;
    // width: 100%;
    background: #ffff00; //
    // height: 100%;
    // top: 70px;
    // bottom: 70px;
    flex: 1; // overflow: auto;
    span {
      width: 100px;
      height: 100px;
    }
  }
  .footer {
    height: 70px; // width: 100%; //
    // bottom: 0;
    // position: fixed;
    background: #00ff00; //
    // z-index: 1;
  }
}
</style>
