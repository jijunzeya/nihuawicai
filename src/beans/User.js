class User {

    //私有属性
    id;
    //实例属性
    score;

    //昵称
    nickName;

    //所在房间id
    roomId;

    constructor(id, nick) {
        this.id = id;
        this.nickName = nick;
    }

    getID() {
        return this.id;
    }

    toString() {
        console.log('User toString:' + User.toString())
    }



}

User.staticPro = '静态属性User'

export default User;