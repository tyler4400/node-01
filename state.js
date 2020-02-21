const os = require('os');
module.exports.showMem = () => {
    const mem = os.freemem() / os.totalmem() * 100;
    console.log(`内存占用率：${mem}`);
};

const cpuStat = require('cpu-stat');
module.exports.showCPU = () => {
    cpuStat.usagePercent((err, percent) => {
        console.log(`CPU占用率${percent}`);
    });
};
