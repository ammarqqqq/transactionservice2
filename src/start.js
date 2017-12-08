console.log("Starting service transaction test")
console.log(process.env.NODE_ENV);
console.log(process.env.DNSDOMAIN);
require('./server.js').start();
