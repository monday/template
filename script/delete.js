const del = require('del');
const config = require('./config');



// destディレクトリ削除
del.sync(config.dest);
