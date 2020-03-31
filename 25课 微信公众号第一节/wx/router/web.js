/**
 * 微信网页端开发demo
 */
const Router = require('koa-router');
const router = new Router({prefix: '/web'});

const conf = require('../conf.test.js');
const {ClientToken} = require('.././mongoose');
const OAuth = require('co-wechat-oauth');
const oauth = new OAuth(conf.appid, conf.appsecret,
    async function (openid){
        return await ClientToken.getToken(openid)
    },
    async function (openid, token){
        return await ClientToken.setToken(openid, token)
    });

/**
 * 微信授权第三方登录
 *  第一步：用户同意授权，获取code
 */
router.get('/wxAuthorize', async ctx => {
    console.log('本机服务器地址' + ctx.href);
    const state = ctx.query.id; //防止CSRF攻击的参数
    const scope = 'snsapi_userinfo';
    // const localUrl = ctx.href; // ctx.href本机服务器地址 http://tyler4400.vipgz4.idcfengye.com/web/wxAuthorize
    // const localUrl = 'tyler4400.vipgz4.idcfengye.com';
    // const redirectUrl = localUrl + '/web/wxCallback';
    let redirectUrl = ctx.href;
    redirectUrl = redirectUrl.replace('wxAuthorize', 'wxCallback');
    const wxAuthorizeUrl = oauth.getAuthorizeURL(redirectUrl, state, scope);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>重定向到wx授权的地址:');
    console.log(wxAuthorizeUrl);
    ctx.redirect(wxAuthorizeUrl);
});

/**
 * 微信授权第三方登录
 * 第二步：通过code换取网页授权access_token
 */
router.get('/wxCallback', async ctx => {
    const code = ctx.query.code;
    const res = await oauth.getAccessToken(code);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>通过code换取网页授权:');
    console.log(res.data);
    const {accessToken, openid} = res.data;
    ctx.redirect('http://tyler4400.vipgz4.idcfengye.com/index.html?openid=' + openid);
});
/**
 * 微信授权第三方登录
 * 第二步：获取用户信息
 */
router.get('/getUser', async ctx => {
    const openid = ctx.query.openid;
    const userInfo = await oauth.getUser(openid);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>获取用户信息:');
    console.log(userInfo);
    ctx.body = userInfo;

});

module.exports = router;
