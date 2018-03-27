
export default {
    created () {
        console.log('@@##this is mixin test');
    },
    sockets: {
        disconnect: function (val) {
            console.log('@@## in mixin game socket disconnect:' + val);
        }
    }
}
