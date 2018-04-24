class User {

  //私有属性
  id;
  //实例属性
  score;

  //昵称
  nickName;

  //所在房间id
  roomId;

  token;

  constructor(id, nick, token) {
    this.id = id;
    this.nickName = nick;
    this.token = token;
  }

  getID () {
    return this.id;
  }

  toString () {
    console.log('User toString:' + User.toString())
  }



}

User.staticPro = '静态属性User'

export default User;