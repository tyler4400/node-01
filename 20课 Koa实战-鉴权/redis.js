/**
 * redis 的基本使用demo
 * Created by Tyler on 2020/3/5 16:36.
 */
const redis = require('redis');
const client = redis.createClient(3000, 'localhost');

client.set('hello', '11111');
client.get('hello', (err, v) => {
    console.log(err);
    console.log('redis key: ', v);
});
