class Room {

  id;

  users = {};

  // 创建者
  owner;

  //房间名称
  roomName;

  lines = [];

  constructor(id) {
    this.id = id;
  }

  //房间加多一个人
  join (user) {
    if (user.name) {
      this.users[user.name] = user;
    }

    console.log('@@##room ' + this.id + ' has ' + this.users.length);
  }

  resetGame () {

  }

  updateGame () {

  }

  sendGameData () {

  }

  static hasRooms (rooms, id) {
    for (let item of rooms) {
      console.log('@@##rooms id ' + item.id);
      if (id == item.id) {
        return item;
      }
    }

    return null;
  }



}

export default Room;
