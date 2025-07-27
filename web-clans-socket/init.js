const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./helpers/logger');
const init = async () => {
    mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        logger.log('Connected to the Mongodb database.', 'log');
        try{
            require('./socket.init')();
        }catch(e){
            console.log(e);
        }
    }).catch((err) => {
        logger.log(`Unable to connect to the Mongodb database. Error: ${err}`, 'error');
        setTimeout(() => init(), 5000);
    });
};
init();
process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));
setInterval(() => {}, 1000);