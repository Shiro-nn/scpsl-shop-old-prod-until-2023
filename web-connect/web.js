const config = require('./config');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const bs = require("./helpers/better-sessions");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const SteamStrategy = require('passport-steam').Strategy;
const scopes = ['identify', 'email', 'connections'];

module.exports = async() => {
    passport.serializeUser(function(user, done) {
        done(null, user);
    })
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    passport.use(new DiscordStrategy({
        clientID: '',
        clientSecret: '',
        callbackURL: `https://${config.url}/discord/callback`,
        scope: scopes
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    passport.use(new SteamStrategy({
        returnURL: `https://${config.url}/steam/verify/notify`,
        realm: `https://${config.url}/`,
        apiKey: config.SteamAPI
    }, function (identifier, profile, done) {
        process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
        });
        }
    ));
    const _session = bs();
    const app = express();
    app
    .disable("x-powered-by")
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(session({
        name: 'another.session',
        secret: '',
        proxy: true,
        resave: true,
        saveUninitialized: true,
    }))
    .use(_session.init)
    .use(passport.initialize())
    .use(passport.session())
    .use(require('./web.router'))
    .use(function(req, res){
        res.status(404).send('not found');
    })
    .use(async function(err, req, res, next) {
        try{
            let str = req.originalUrl.trim().split('?');
            if(str[0] == '/steam/verify' && err == 'Invalid return URL' && str.length > 1){
                res.redirect('/steam');
                return;
            }
        }catch{}
        try{
            let str = req.originalUrl.trim().split('?');
            if(str[0] == '/steam/verify' && err.openidError.message == 'Invalid or replayed nonce' && str.length > 1){
                await new Promise(r => setTimeout(r, 5000));
                res.redirect(req.originalUrl);
                return;
            }
        }catch{}
        res.status(500).send('Internal Server Error');
        const { Webhook } = require('discord-webhook-node');
        const hook = new Webhook("");
        hook.setUsername('Connect');
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
        console.log(err)
    })
    http.createServer(app).listen(2535, 'localhost');
};