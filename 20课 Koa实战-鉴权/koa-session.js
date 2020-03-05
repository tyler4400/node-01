/**
 * 使用koa-session的一个示例
 * Created by Tyler on 2020/3/5 16:03.
 */
const koa = require('koa');
const app = new koa();
const session = require('koa-session');

app.keys = ['secret keys that cant not be leaked'];

const SESS_CONFIG = {
    key: 'kkb:sess',
    maxAge: 24 * 60 * 60, // 单位秒
    httpOnly: true,
    signed: true // 签名
};
app.use(session(SESS_CONFIG, app));

app.use(ctx => {
    if (ctx.path === './favicon.ico') return;
    let counter = ctx.session.counter || 0;
    ctx.session.counter = ++counter;
    ctx.body = `第${counter}次访问`;
});

app.listen(3000);
