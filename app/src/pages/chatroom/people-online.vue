<template>
    <div class="layout">
        <strong>在线人数</strong>
        <li v-for="person in persons" :key="person.id">
            <strong>{{person.nickName}}</strong>

        </li>
    </div>
</template>
<script>
import Constants from '../../common/Constants';
export default {
    props: ['people'],
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


