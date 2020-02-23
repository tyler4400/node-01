/**
 * steps for running this
 * 1. node 01telnet.js
 * 2. switch to another console
 * 3. telnet localhost 9000
 */

const net = require('net');
const chatServer = net.createServer();
const clintList = [];

chatServer.on('connection', client => {
        client.write('hello, world!\n');
        clintList.push(client);
        client.on('data', data => {
            console.log('received:' + data.toString());
            clintList.forEach(v => {
                v.write(data);
            })
        })
    }
);
console.log('sever listen at port 9000');
chatServer.listen(9000);
