<template>
    <div class="main">
            <div class="form">
                <h1>登录</h1>
                <div class="form-item">
                    <input type="text" v-model="loginInfo.tel" placeholder="请输入手机号" />
                </div>
               <div class="form-item">
                  <input type="text" v-model="loginInfo.name" placeholder="请输入姓名"/>
               </div>
               
              <button class="margin-t-10 am-button sub-btn" @click="submit">提交</button>
            </div>
    </div>
</template>
<script>
import Constants from '../common/Constants';
import VueSocketio from 'vue-socket.io';
import Vue from 'vue';

export default {
  data () {
    return {
      loginInfo: {
        name: '',
        tel: ''
      }
    };
  },
  // sockets: {
  //   connect: function (val) {
  //     console.log('socket connected:' + this.$socket.id + ' ' + JSON.stringify(val));
  //   },
  //   joinedRoom: function (val) {
  //     console.log('@@##joinedRoom from server:' + JSON.stringify(val));
  //   }
  // },
  methods: {
    testGame () {
      this.$router.push({ name: 'game' });
    },
    submit () {
      console.log('@@##submit:' + JSON.stringify(this.loginInfo));

      // this.$router.push({ name: 'chatroom' });
      let params = { name: this.loginInfo.name, roomId: this.loginInfo.tel };
      Vue.use(VueSocketio, 'http://localhost:3000/chat');
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
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;

  // border: gray solid 1px;
  // border-radius: 5px;

  h1 {
    color: #ff5000;
    text-align: center;
  }

  input {
    font-size: 18px;
    margin-top: 18px;
    padding: 20px;
    border: 0;
    outline: none;
    // border-bottom: gray solid 1px;
  }

  .form-item {
    border-bottom: #ff5000 solid 1px;
  }
}

.margin-t-10 {
  margin-top: 30px;
}

.am-button {
  font-size: 0.42666667rem;
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  border-radius: 0.6rem;
  text-align: center;
  border: 0;
}

.sub-btn {
  background: -webkit-linear-gradient(left, #ff9000, #ff5000) no-repeat;
  color: #fff;
  box-shadow: 0 0.08rem 0.16rem #f7c7b1;
}

.main {
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  height: 100%; // position: absolute;
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
