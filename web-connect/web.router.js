const express = require('express'),
router = express.Router();
const accountsData = require('./mongo/accounts');
const adminsData = require('./mongo/admins');
const AdminsModule = require('./helpers/admins');
const config = require('./config');
const passport = require('passport');
const cdn_host = config.cdn;
const axios = require('axios');
router.get('/check', (req, res) => res.sendStatus(200));
router.get('/steam', passport.authenticate('steam', {failureRedirect: 'https://scpsl.shop/profile?error'}));
router.get('/steam/verify', passport.authenticate('steam', {failureRedirect: 'https://scpsl.shop/profile?error'}), async(req, res) => {
	if(req.bs.data.user == null || req.bs.data.user == undefined) return res.redirect('https://scpsl.shop/authorization');

	const clears = await accountsData.find({steam: req.user._json.steamid});
	for (let i = 0; i < clears.length; i++) {
		const clear = clears[i];
		clear.steam = '';
		await clear.save();
	}

	const userData = await accountsData.findOne({id: req.bs.data.user.id});
	userData.steam = req.user._json.steamid;
	if(userData.avatar == `${cdn_host}/scpsl/users/avatars/unknow.png`){
		try{
			const hash = guid();
            const dir = `scpsl/users/avatars/${userData.id}`;
            const name = `${hash}.png`;
			await axios.post(`${cdn_host}/upload/link`, {}, {
				params: {
					link: req.user._json.avatarfull,
					name: name,
					dir: dir
				}
			});
			userData.avatar = `${cdn_host}/${dir}/${name}`;
		}catch{}
	}
	await userData.save();
	res.redirect('https://scpsl.shop/profile');
});
router.get('/steam/verify/notify', async(req, res) => {
	res.send('<html style="background-color: #0D1117; color:antiquewhite;">' +
	'<h1>Идет привязка стима, ожидайте..</h1>' +
	'<script>' +
	'window.location.href = window.location.href.replace("/notify", "");' +
	'</script>' +
	'<script>' +
	'let date = Date.now();' +
	'let notify = false;' +
	'setInterval(() => {' +
	'if(!notify && Date.now() - date > 15000){' +
	'notify = true;' +

	'{' +
	'const element = document.createElement("br");' +
	'document.body.appendChild(element);' +
	'}' +

	'{' +
	'const element = document.createElement("h1");' +
	'element.innerHTML = "Сервера стима не отвечают<br>Не закрывайте это окно даже после выдачи ошибки";' +
	'document.body.appendChild(element);' +
	'}' +

	'{' +
	'const element = document.createElement("br");' +
	'document.body.appendChild(element);' +
	'}' +

	'{' +
	'const element = document.createElement("h1");' +
	'element.innerHTML = "Мы по прежнему пытаемся привязать ваш стим";' +
	'document.body.appendChild(element);' +
	'}' +

	'}' +
	'}, 1000);' +
	'</script>' +
	'</html>')
});
router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', {failureRedirect: 'https://scpsl.shop/profile?error'}), async function(req, res) {
	if(req.bs.data.user == null || req.bs.data.user == undefined) return res.redirect('https://scpsl.shop/authorization');

	const userData = await accountsData.findOne({id: req.bs.data.user.id});
	const adminData = await adminsData.findOne({id: req.bs.data.user.id});
	if(!adminData || !AdminsModule.ItsAdmin(adminData)){
		let isAdmin = false;
		const clears = await accountsData.find({discord: userData.discord});
		for (let i = 0; i < clears.length; i++) {
			const adminClear = await adminsData.findOne({id: clears.id});
			if(!adminClear || !AdminsModule.ItsAdmin(adminClear)){
				const clear = clears[i];
				clear.discord = '';
				await clear.save();
			}else{
				isAdmin = true;
			}
		}
		if(isAdmin){
			res.send('<html style="background-color: #0D1117; color:antiquewhite;">' +
			'<h1>Данный дискорд привязан к другому аккаунту, который является текущим администратором</h1>' +
			'<script>' +
			'history.pushState("fydne", "fydne", location.origin + location.pathname);' +
			'</script>' +
			'</html>');
			return;
		}
		userData.discord = req.user.id;
	}
	if(userData.avatar == `${cdn_host}/scpsl/users/avatars/unknow.png` && `${req.user.avatar}` != 'null'){
		try{
			const hash = guid();
            const dir = `scpsl/users/avatars/${userData.id}`;
            const name = `${hash}.png`;
			await axios.post(`${cdn_host}/upload/link`, {}, {
				params: {
					link: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
					name: name,
					dir: dir
				}
			});
			userData.avatar = `${cdn_host}/${dir}/${name}`;
		}catch{}
    }
	try{
		if(userData.steam == '' && req.user.connections.length > 0){
			const _data = req.user.connections.filter(x => x.verified && x.type == 'steam');
			if(_data.length > 0){
				const clears = await accountsData.find({steam: _data[0].id});
				for (let i = 0; i < clears.length; i++) {
					const clear = clears[i];
					clear.steam = '';
					await clear.save();
				}
				userData.steam = _data[0].id;
			}
		}
	}catch{}
	await userData.save();
	req.bs.data.user.discord = userData.discord;
	await req.bs.save(true);
	res.redirect('https://scpsl.shop/profile');
});

const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});}

module.exports = router;