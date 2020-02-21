const buf1 = Buffer.alloc(10);
console.log(buf1);

const buf02 = Buffer.from([1, 2, 3]);
console.log(buf02);

const buf3 = Buffer.from("Buffer创建");
console.log(buf3);
console.log(buf3.toString());

buf1.write('123');
console.log(buf1);

const buf04 = Buffer.concat([buf1, buf3]);
console.log(buf04.toString('utf-8'));
