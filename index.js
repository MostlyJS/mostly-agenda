require = require("esm")(module/*, options*/);
console.time('mostly-agenda import');
module.exports = require('./src/index').default;
console.timeEnd('mostly-agenda import');
