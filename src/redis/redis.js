
const config = require('../config/db-config');
const Redis = require('ioredis');
// const redis = new Redis(config.REDIS.PORT, config.REDIS.IP);
const redis = new Redis({
  port: config.REDIS.PORT,          // Redis port
  host: config.REDIS.IP,   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: config.REDIS.PWD
  // db: 0
});
// 使用2号库
redis.select(2);
// key在baowan/ot文件夹下
const PRE_KEY = 'zzb:ot:';
// const redislock = require('ioredis-lock');
// const lock = redislock.createLock(redis, {
//   timeout: 20000,
//   retries: 3,
//   delay: 600
// });
console.log('@@##redis init success!');

module.exports = {
  // getLock () {
  //   return lock;
  // },
  // getRedislock () {
  //   return redislock;
  // },
  set (key, value) {
    redis.set(PRE_KEY + key, value);
  },
  async get (key) {
    let value = await redis.get(PRE_KEY + key);
    return value;
  },
  del (key) {
    redis.del(PRE_KEY + key);
  },
  setEX (key, value, timeout) { // 设置key过期时间
    redis.setex(PRE_KEY + key, timeout, value);
  }
};
