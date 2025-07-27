const config = require("../config");
module.exports.load = async() => {
    const express = require("express");
    const path = require("path");
    const bodyParser = require("body-parser");
    var cors = require('cors');
    const apiRouter = require("./routes/api");
    const payRouter = require("./routes/pay");
    const donateRouter = require("./routes/donate");
    const donateGetRouter = require("./routes/donate.get");
    const authRouter = require("./routes/auth");
    const adminsRouter = require("./routes/admins");
    const mainRouter = require("./routes/scpsl");
    const styleRouter = require("./routes/style");
    const usersRouter = require("./routes/users");
    const clansRouter = require("./routes/clans");
    const clansWarsRouter = require("./routes/clans.wars");
    const communityRouter = require("./routes/community");
    const cookieParser = require('cookie-parser');
    const bs = require("../helpers/better-sessions");
    const discordEmbed = require("../helpers/discordEmbed");
    const vhost = require('vhost');
    const cdn_host = config.dashboard.cdn;
    app = express();
    let CachedData = [];

    const _session = config.testing ? bs({
        name: 'sid',
        expires: new Date(Date.now() + 86400000),
        httpOnly: false,
        domain: 'localhost',
        path: '/',
        secure: false
    }) : bs();
    app
    .disable("x-powered-by")
    .use(cors())
    .use((req, res, next) => {
        if(!config.testing && (
            `${req.originalUrl}`.startsWith('/css') ||
            `${req.originalUrl}`.startsWith('/js') ||
            `${req.originalUrl}`.startsWith('/img') ||
            `${req.originalUrl}`.startsWith('/bin') ||
            `${req.originalUrl}`.startsWith('/cursors')
        )) res.header('Cache-Control', 'max-age=345600');
        next();
    })
    .use(express.static(path.join(__dirname, "/public")))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .engine("html", require("ejs").renderFile)
    .set("view engine", "ejs")
    .set('views', path.join(__dirname, "/views"))
    .use(cookieParser())
    .use(_session.init)
    .use(vhost('scpsl.store', async(req, res) => res.redirect(`https://scpsl.shop${req.originalUrl}`)))
    .use(function(req, res, next){
        req._ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace('::ffff:', '').replace('::1', '127.0.0.1');
        next();
    })
    .use(discordEmbed)
    .use(function(req, res, next){
        if(req.method == 'GET') return next();
        try{if(req.query.token == config.token) return next();}catch{}
        const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        if(CachedData.filter(x => x.ip == req._ip && x.url == url && x.date + 500 > Date.now()).length > 0){
            if(req.method == 'GET'){
                return res.status(429).send('<html oncut="return false;"ondragstart="return false;"ondrop="return false;"oncontextmenu="return false;">'+
                '<head><link rel="stylesheet" href="/css/modules/error429.css"><title>fydne | Error 429</title></head><body>Too Many Requests</body></html>');
            }
            else return res.sendStatus(429);
        }
        let cache = CachedData.find(x => x.ip == req._ip && x.url == url);
        if(cache == null || cache == undefined) CachedData.push({ip:req._ip, url, date: Date.now()});
        else cache.date = Date.now();
        next();
    })
    .use(function(req, res, next){
        let str = `IP: ${req._ip} `;
        str += `Method: ${req.method} `;
        str += `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        console.log(str);
        str = null;
        next();
    })
    .use(apiRouter)
    .use(payRouter)
    .use(donateRouter)
    .use(donateGetRouter)
    .use(authRouter)
    .use(adminsRouter)
    .use(mainRouter)
    .use(require('./routes/desktop'))
    .use(styleRouter)
    .use(usersRouter)
    .use(clansRouter)
    .use(clansWarsRouter)
    .use(communityRouter)
    .use(function(req, res){
        res.status(404).render("errors/404.ejs", {cdn_host});
    })
    .use(function(err, req, res, next) {
        res.status(500).render("errors/500.ejs", {cdn_host});
        const { Webhook } = require('discord-webhook-node');
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
        console.log(err)
    })
    require("http").createServer(app).listen(2631, 'localhost');
    if(config.testing){
        require("http").createServer(app).listen(80);
    }
};