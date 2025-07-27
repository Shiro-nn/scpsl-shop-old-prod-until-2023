const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    target: 'http://localhost:2600',
    changeOrigin: false,
    ws: true,
    router: {
        'scpsl.shop': 'http://localhost:2631',
        'api.scpsl.shop': 'http://localhost:2631',
        'connect.scpsl.shop': 'http://localhost:2535',

        'socket.scpsl.shop/main': 'http://localhost:2345',
        'socket.scpsl.shop/clans-wars': 'http://localhost:2792',
        'socket.scpsl.shop/clans': 'http://localhost:2734',

        'bot.fydne.dev': 'http://localhost:2385',

        'sl-web.fydne.dev': 'http://localhost:3424',

        'cdn.scpsl.shop': 'http://localhost:2653',
        'reserve.fydne.dev': 'http://localhost:2653',
    },
    onError: (err, req, res) => {try{
        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });
        res.end('Proxy error');
    }catch{}},
};
const webProxy = createProxyMiddleware(options);
const app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
    try{
        if(req.get("host")?.startsWith('api')){
            res.set('Access-Control-Allow-Origin', '*');
            next();
            return;
        }
    }catch{}
    next();
})
app.use((req, res, next) => {
    req.headers['x-forwarded-for'] = (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    next();
})
app.use(webProxy);
{
    const server = app.listen(80);
    server.on('upgrade', webProxy.upgrade);
}
{
    const server = require('https').createServer({key: '', cert: ''}, app);

    server.addContext('fydne.dev', {
        key: require('./.crt/fydne').key,
        cert: require('./.crt/fydne').crt
    });
    server.addContext('*.fydne.dev', {
        key: require('./.crt/fydne').key,
        cert: require('./.crt/fydne').crt
    });

    server.addContext('scpsl.shop', {
        key: require('./.crt/scpsl').key,
        cert: require('./.crt/scpsl').crt
    });
    server.addContext('*.scpsl.shop', {
        key: require('./.crt/scpsl').key,
        cert: require('./.crt/scpsl').crt
    });

    server.listen(443);
    server.on('upgrade', webProxy.upgrade);
}
process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));