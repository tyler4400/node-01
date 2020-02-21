const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
        const {url, method, headers} = req;
        if (url === '/' && method === 'GET') {
            fs.readFile('res.html', (err, data) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
                    console.log(url);
                    res.end('服务器错误');
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'text/html');
                    res.end(data);
                }
            })
        } else if (url === '/user') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(headers));
        } else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {

            fs.createReadStream('.' + url).pipe(res)
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            res.end('No Page 页面不存在');
        }
    }
);

console.log('sever listen at port 30000');
server.listen(30000);
