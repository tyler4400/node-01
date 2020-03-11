const Router = require('koa-router');
const router = new Router({prefix: '/users'});

// 文件上传
const upload = require('koa-multer')({dest: './public/images'});
router.post('/upload', upload.single('file'), ctx => {
    console.log(ctx.req.file); // 注意数据存储在原始请求中
    console.log(ctx.req.body); // 注意数据存储在原始请求中
    ctx.body = "上传成功";
});

module.exports = router;
