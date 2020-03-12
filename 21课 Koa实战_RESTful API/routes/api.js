const Router = require('koa-router');
const router = new Router({prefix: '/api'});
const captcha = require('trek-captcha');

router.get('/captcha', async ctx => {
    console.log(ctx.session.captcha);
    const { token, buffer } = await captcha({ size: 4 });
    console.log('token', token);
    ctx.session.captcha = token;
    ctx.body = buffer;
})

module.exports = router;
