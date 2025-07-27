const verificator = require('./modules/auth/verificator');
const mongo = {
    accounts: require('../../base/accounts'),
    temps: require('../../base/temps'),
    resets: require('../../base/resets'),
};
const decryptor = require('./modules/auth/cryptoData');
const mails = require('./modules/mails/Manager');

const config = require('../../config');
const express = require('express'),
router = express.Router();
const ipinfo = require('ipinfo');

router.get('/authorization', (req, res) => res.redirect('/auth'));

router.get('/auth', async(req, res) => {
	if(verificator.checkAuth(req)){
        if(req.query.redirect) return res.redirect('/' + req.query.redirect);
        return res.redirect('/info');
    }
	res.render('auth/main.ejs', {cdn_host:config.dashboard.cdn});
});

router.get('/auth/verify', async(req, res) => {
	res.render('auth/verify.ejs', {cdn_host:config.dashboard.cdn, key: req.query?.key});
});


router.post('/auth/logout', async(req, res) => {
	res.clearCookie('sid');
    await req.bs.destroy();
    res.sendStatus(200);
});
router.post('/auth/login', async(req, res) => {
	if(verificator.checkAuth(req)) return res.status(400).json({error: true, msg: 'Вы уже авторизованы'});
	const data = req.body;
	const login = await decryptor.login(data.login, data.pass);
	if(login.length < 3) return res.status(400).json({error: true, msg: 'В логине должно быть более 3-х символов включительно'});
	let account = await mongo.accounts.findOne({user: login});
	if(account == null) account = await mongo.accounts.findOne({email: login.toLowerCase()});
	if(account == null) return res.status(400).json({error: true, msg: 'Аккаунт не найден'});
	if(!decryptor.ValidatePass(data.pass, account.pass)) return res.status(400).json({error: true, msg: 'Неверный пароль'});
    
    account.last_active = Date.now();
    await account.save();

    req.bs.data.id = account.id;
    req.bs.data.user = {
        id:account.id,
        user:account.user,
        email:account.email,
        style:account.style,
        discord:account.discord,
    }
	await req.bs.save(data.remember ? new Date(Date.now() + /* 30 days */ 2592000000) : new Date(Date.now() + /* 1 day */ 86400000)); // x / 1000 / 60 / 60 / 24
	res.json({error:false});

    const useragent = req.headers['user-agent'];
    if(!account.ips.some(x => x == req._ip)){
        account.ips.push(req._ip);
		account.markModified('ips');
        await account.save();
        ipinfo(req._ip, '').then(cLoc => mails.ips(account, cLoc, useragent));
    }
});
router.post('/auth/register', async(req, res) => {
	if(verificator.checkAuth(req)) return res.status(400).json({error: true, msg: 'Вы уже авторизованы'});
	const data = req.body;
	if(data.nick.length < 2) return res.status(400).json({error: true, msg: 'В нике должно быть более 2-х символов включительно'});
	const decrypt = await decryptor.register(data.email, data.login, data.nick, data.pass);
	if(!validateEmail(decrypt.email)) return res.status(400).json({error: true, msg: 'Введите действительную почту'});
	if(decrypt.login.length < 3) return res.status(400).json({error: true, msg: 'В логине должно быть более 3-х символов включительно'});

	const email = decrypt.email;
	const login = decrypt.login;
	if(await mongo.accounts.exists({email})) return res.status(400).json({error: true, msg: 'Аккаунт с данной почтой уже зарегистрирован'});
	if(await mongo.accounts.exists({user:login})) return res.status(400).json({error: true, msg: 'Аккаунт с данным логином уже зарегистрирован'});
	const uid = decryptor.guid(100);
	await (new mongo.temps({email, login, pass: decryptor.cryptoPass(data.pass), nick:data.nick, uid})).save();
	const _emerr = await new Promise(rv => mails.accounts.verify(data.nick, decrypt.email, `https://${config.dashboard.baseURL}/auth/verify?key=${uid}`, (e) => rv(e)));
	if(_emerr) return res.status(400).json({error: true, msg: 'Произошла ошибка при отправке сообщения на почту'});
	res.json({error:false});
});
router.post('/auth/reset', async(req, res) => {
	if(verificator.checkAuth(req)) return res.status(400).json({error: true, msg: 'Вы уже авторизованы'});
	const data = req.body;
	const email = await decryptor.reset(data.email);
	if(!validateEmail(email)) return res.status(400).json({error: true, msg: 'Введите действительную почту'});
	let account = await mongo.accounts.findOne({email: email});
	if(account == null) return res.status(400).json({error: true, msg: 'Аккаунт не найден'});
    const uid = decryptor.guid(100);
	await (new mongo.resets({account: account.id, code: uid})).save();
    
    ipinfo(req._ip, '').then(cLoc => SendEmail(cLoc)).catch(() => SendEmail({}));
    function SendEmail(ipinfo){
        const useragent = req.headers['user-agent'];
        mails.accounts.reset(account, ipinfo, useragent, `https://${config.dashboard.baseURL}/authorization/reset-password/${uid}`, function(e, m){
            if (!e) return res.json({error:false});
            return res.status(400).json({error: true, msg: 'Произошла ошибка при отправке сообщения на почту'});
        })
    }
});


function validateEmail(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
}















router.get('/authorization/reset-password/:key', async(req, res) => {
    const passKey = req.params.key;
    const _data = await mongo.resets.findOne({code: passKey});
    if(_data == null || _data == undefined) return res.redirect('/auth');
    res.render("auth/reset.ejs", {cdn_host:config.dashboard.cdn});
});
router.post('/authorization/reset-password/:key', async(req, res) => {
    if(req.body.pass == null || req.body.pass == undefined) return res.status(400).json({error: true, msg: 'Пароль должен быть не менее 6 символов'});
    if(req.body.pass == null || req.body.pass == undefined || req.body.pass.length < 6) return res.status(400).json({error: true, msg: 'Пароль должен быть не менее 6 символов'});
    const newPass = decryptor.cryptoPass(req.body.pass);
	const passKey = req.params.key;
    req.bs.destroy();
    const _data = await mongo.resets.findOne({code: passKey});
    if(_data == null || _data == undefined) return res.status(400).json({error: true, msg: 'Аккаунт не найден'});
    const userData = await mongo.accounts.findOne({id: _data.account});
    if(userData == null || userData == undefined) return res.status(400).json({error: true, msg: 'Аккаунт не найден'});
    userData.pass = newPass;
    await userData.save();
    _data.deleteOne();
    const useragent = req.headers['user-agent'];
    req.bs.clearAll(`\"id\":${userData.id},`);
    res.json({error: false});
    ipinfo(req._ip, '').then(cLoc => mails.accounts.changed(userData, cLoc, useragent)).catch(() => mails.accounts.changed(userData, {}, useragent));
});

module.exports = router;