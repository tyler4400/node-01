const fs = require('fs');
// const data = fs.readFileSync('./package.json');
// console.log(data.toString('utf-8'));

const util = require('util');
const readFile = util.promisify(fs.readFile);
readFile('./package.json').then(data => {
    console.log(data.toString());
});
