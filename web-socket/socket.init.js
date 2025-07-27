const https = require("https");
const http = require("http");
const crt = require("./crt");
const soket_io = require("./socket");
const bs = require("./helpers/better-sessions");
module.exports = async() => {
    const _session = bs();
    /*
    const server = https.createServer({
        key: crt.key,
        cert: crt.crt,
        passphrase: ''
    });
    */
    const server = http.createServer();
    server.listen(2345, 'localhost');
    soket_io.load(server, _session);
};