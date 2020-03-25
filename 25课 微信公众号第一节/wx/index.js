/**
 * 微信后台开发的一个demo - 自动回复机器人
 *
 * 启动：
 * 在https://www.ngrok.cc/ 配置一个隧道，本地启动ngrok
 * 在微信管理系统上配置服务器
 * 运行本js。
 * 注意上面三者必须一一对应。
 */
const Koa = require('koa');
const Router = require('koa-router');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');

const conf = require('./conf');

const app = new Koa();
app.use(bodyParser());
app.use(statics(__dirname + '/'));

app.use(async (ctx, next) => {
    console.log(ctx.request);
    await next();
});

const router = new Router();
const wechat = require('co-wechat');

router.all('/wechat', wechat(conf).middleware(
    async message => {
        console.log('input message:');
        console.log(message);
        return getMsg(message);
    }
))

function getMsg(msg){
    const content = msg.Content || '';
    if(content.includes('?')) return '请以?结束你的问题';
    if(content === '?' || content === '？') return '尽管问，答错了算我输!';
    return content.replace(/[?？]/g, '!').replace('吗', '')
}

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8080);
