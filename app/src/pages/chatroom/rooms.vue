<template>
    <div class="layout">
        <strong>房间</strong>
        <li v-for="(value,key) of rooms" :key="key">
            <strong>{{key}}</strong>
            <strong>({{value.users.length}})</strong>

            <button @click="joinRoom(value)">加入</button>
            <button @click="beginGame(value)">游戏</button>
        </li>
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
        joinRoom (value) {
            this.$emit('selectRoom', value.users);
        },
        beginGame (value) {
            this.$router.push({ name: 'game' });
        }
    },
    mounted () {
        console.log('@@##mounted()');
        this.$socket.emit(Constants.GET_ROOMS, {}, result => {
            console.log('@@##get rooms:' + result);
            if (result) {
                this.rooms = result;
            }
        });
    },
    created () {
        console.log('@@##created!');
    }
}
</script>


