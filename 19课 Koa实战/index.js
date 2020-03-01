const Koa = require('koa');
const app = new Koa();

// app.use(async (ctx, next) => {
//
// })

// 输出响应时间中间件
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-response-time');
    console.log(`输出计时：${ctx.method}-${ctx.url}-${rt}`);
});

// 统计响应时间中间件
app.use(async (ctx, next) => {
    const start = Date.now();
    console.log('开始计时');
    await next();
    const ms = Date.now() - start;
    ctx.set('X-response-time', `${ms}ms`);
    console.log('计时结束');
});

// 错误处理
app.use(async (ctx, next) => {
    try{
        await next();
    }catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = err.message;

        // 触发应用层级错误事件
        ctx.app.emit("error", err,  ctx);
        console.error('捕获到错误：', err.message);
    }
});


// const sleep = time => new Promise(resolve => setTimeout(resolve, time))

// app.use(async ctx => {
//     // await sleep();
//     ctx.staus = 200;
//     ctx.type = 'html';
//     ctx.body = '<h1>hello, koa</h1>';
// });

const index = require('./routes/index');
const users = require('./routes/user');
app.use(index.routes());
app.use(users.routes());


app.listen(3000);
console.log('app listens at port 3000');
