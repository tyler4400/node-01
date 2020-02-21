const { showCPU, showMem } = require('./state');
setInterval(() =>{
    showCPU();
    showMem();
}, 1000);
