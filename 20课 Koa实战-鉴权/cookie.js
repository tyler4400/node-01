/**
 * cookie的使用
 * @type {module:http}
 */
const http = require('http');
http.createServer((req, res) => {
    if (req.url === '/favicon.ico') return;
    console.log('cookie:', req.headers.cookie);

    //Set-Cookie 不是自定义的，浏览器在识别到header里的Set-Cookie字段时，会自动把值存储到cookie里
    res.setHeader('Set-Cookie', 'sid=waff');
    res.end('cookie time!');
}).listen(3000);
