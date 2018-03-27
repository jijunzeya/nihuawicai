<template>
    <div class="main">
        <div class="left">
            <messages></messages>
        </div>
        <div class="right">
            <div class="up">
                <rooms @selectRoom="selectRoom"></rooms>
            </div>
            <div class="down">
                <people-online :people="users"></people-online>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        'messages': () => import('./messages.vue'),
        'rooms': () => import('./rooms.vue'),
        'people-online': () => import('./people-online.vue')
    },
    data () {
        return {
            users: []
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
        selectRoom (users) {
            this.users = users;
        }
    },
    created () {

    }
}
</script>
<style lang="less" scoped>
.main {
  display: flex;
  .left {
    flex: 1;
    background: #ff00ff;
    height: 100vh;
    display: flex;
  }
  .right {
    width: 300px;
    height: 100vh;
    background: #00f;
    .up {
      height: 50vh;
      background: #ffff00;
      overflow: auto;
    }
    .down {
      height: 50vh;
      background: #00ffff;
      overflow: auto;
    }
  }
}
</style>


