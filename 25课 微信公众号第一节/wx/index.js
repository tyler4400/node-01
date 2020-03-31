/**
 * 微信后台开发的一个demo - 自动回复机器人
 *
 * 启动：
 * 在https://www.ngrok.cc/ 配置一个隧道，本地启动ngrok
 * 在微信管理系统上配置服务器
 * 运行本js。
 * 注意上面三者必须一一对应。
 * 打开浏览器 origin/index.html
 */
const Koa = require('koa');
const Router = require('koa-router');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');
const axios = require('axios');

// const conf = require('./conf');
const conf = require('./conf.test.js');

const app = new Koa();
app.use(bodyParser());
app.use(statics(__dirname + '/public'));

app.use(async (ctx, next) => {
    console.log('>>>>>>>>>>>>>>>>>>incoming request:');
    console.log(ctx.request);
    try {
        await next();
    } catch (e) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>全局报错了');
        console.error(e);
        ctx.body = e.message;
    }
});

const router = new Router();
const wechat = require('co-wechat');

/**
 * 接受微信服务器的消息接口，并返回相应结果
 */
router.all('/wechat', wechat(conf).middleware(
    async message => {
        console.log('>>>>>>>>>>>>>>>>>>微信消息接口');
        console.log(message);
        return getMsg(message);
    }
));

/**
 * 从微信服务器获取access_token
 */
const tokenCache = {
    access_token: '',
    updateTime: Date.now(),
    expires_in: 7200
};
router.get('/getTokens', async ctx => {
    const tokenUrl = getTokenServerUrl();
    const res = await axios.get(tokenUrl);
    console.log('>>>>>>>>>>>>>>>>>>从微信服务器获取access_token返回');
    console.log(res.data);
    Object.assign(tokenCache, res.data, {
        updateTime: Date.now()
    });
    ctx.body = res.data
});

/**
 * 从微信服务器获取粉丝数量
 */
router.get('/getFollowers', async ctx => {
    const url = getFollowersUrl();
    const res = await axios.get(url);
    console.log('>>>>>>>>>>>>>>>>>>从微信服务器获取粉丝数量返回');
    console.log(res.data);
    ctx.body = res.data
});

/**
 * 从微信服务器获取菜单配置（使用现有封装好的库）
 * 使用本demo必须启动mongodb服务，token存储在mongodb中
 */
const WechatAPI = require('co-wechat-api');
const {ServerToken} = require('./mongoose');
const api = new WechatAPI(
    conf.appid,
    conf.appsecret,
    // 取Token
    async () => {
        const token = await ServerToken.findOne()
        console.log('取出的token:' + token);
    },
    // 存Token
    async token => {
        await ServerToken.updateOne({}, token, {upsert: true})
        console.log('放入的token:' + token);
    }
);
router.get('/getMenu', async ctx => {
    let res = await api.getMenu();
    console.log(res.data);
    ctx.body = res
});

function getMsg(msg){
    const content = msg.Content || '';
    if (content.includes('?')) return '请以?结束你的问题';
    if (content === '?' || content === '？') return '尽管问，答错了算我输!';
    return content.replace(/[?？]/g, '!').replace('吗', '')
}

function getTokenServerUrl(){
    const wxDomain = `https://api.weixin.qq.com`;
    const path = `/cgi-bin/token`;
    const param = `?grant_type=client_credential&appid=${conf.appid}&secret=${conf.appsecret}`;
    return wxDomain + path + param;
}

function getFollowersUrl(){
    return `https://api.weixin.qq.com/cgi-bin/user/get?access_token=${tokenCache.access_token}`
}

/**
 * 微信网页端开发demo
 * @type {module:koa-router|Router}
 */
const webRouters = require('./router/web');
app.use(webRouters.routes());

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8080, () => {
    console.log('app listens at port 8080');
});
