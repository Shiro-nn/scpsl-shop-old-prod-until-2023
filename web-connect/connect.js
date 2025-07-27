const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./helpers/logger');
(() => {
    mongoose.set('strictQuery', false);
    mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        logger.log('Connected to the Mongodb database.', 'log');
        require('./web')();
    }).catch((err) => logger.log('Unable to connect to the Mongodb database. Error:'+err, 'error'));
})();
process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));