const crypto = require('crypto');
const express = require("express"),
router = express.Router();
const vhost = require('vhost');
const https = require('https');
const CryptoJS = require('crypto-js');
const accountsData = require("../../base/accounts");
const clansData = require("../../base/clans");
const achievementsData = require("../../base/achievements");
const paymentsData = require("../../base/payments");
const DonatesData = require("../../base/donate");
const rolesData = require("../../base/roles");
const boostsData = require("../../base/boosts");
const EmojisData = require("../../base/emoji");
const StatsData = require("../../base/stats");
const geoipData = require("../../base/geoip");
const doubtfulsData = require("../../base/doubtful");
const config = require("../../config");
const ipinfo = require("ipinfo");
const { Webhook } = require('discord-webhook-node');
const cdn_host_link = config.dashboard.cdn;
const host = config.dashboard.baseURL;
const APIhost = config.dashboard.api;
router.post('/api/user', vhost(host, async(req, res) => {
    let user;
    if(req.query.user == 'this' && req.bs.data.user !== null && req.bs.data.user !== undefined) user = req.bs.data.user.id;
	else user = parseInt(req.query.user);
    if(isNaN(user)) user = undefined;
	let type = req.query.type?.toLowerCase();
    if(type == 'clan'){
        let AllAchievements = await achievementsData.find();
		let userData = await accountsData.findOne({ id: user });
        if(userData == null || userData == undefined) return res.status(404).send('404');
        let achievements = [];
        userData.achievements.forEach(function(achieve) {
            var achievement = AllAchievements.filter(x => x.name == achieve)[0];
            if(achievement != null) achievements.push({img: achievement.img, desc: achievement.desc});
        });
		let access = 0;
		let color = 'red';
		let public = false;
        const clan = await clansData.findOne({ tag: userData.clan });
		const role = await rolesData.findOne({owner:userData.id, id:2, freezed:false})
        if(clan != null && clan != undefined){
            if(clan.users.filter(x => x.user == userData.id).length > 0) access = clan.users.filter(x => x.user == userData.id)[0].access;
            color = clan.color;
			public = clan.public;
		}
        res.status(200).json({
			status: 'ok',
			username: (userData.name == '' ? userData.user : userData.name),
			avatar: userData.avatar,
			banner: userData.banner,
			clan: userData.clan,
			prime: (role != null && role != undefined),
			achievements,
			access, color, public
		})
    }
    else if(type == 'banner'){
		let udata = await accountsData.findOne({ id: user });
        if(udata == null || udata == undefined) return res.status(404).send('404');
		res.status(200).send(udata.banner);
    }
    else if(type == 'main'){
		let userData = await accountsData.findOne({ id: user });
		if(userData == null || userData == undefined) return res.status(404).send('404');
		res.status(200).json({username: (userData.name == '' ? userData.user : userData.name), avatar: userData.avatar, id: userData.id})
    }
    else if(type == 'avatar'){
		let userData = await accountsData.findOne({ id: user });
		if(userData == null || userData == undefined) return res.status(404).send('404');
		res.status(200).send(userData.avatar);
    }
    else if(type == 'username'){
		let userData = await accountsData.findOne({ id: user });
		if(userData == null || userData == undefined) return res.status(404).send('404');
		res.status(200).send(userData.name == '' ? userData.user : userData.name);
    }
    else if(type == 'currency'){
		if(req.bs.data.user == null || req.bs.data.user == undefined) return res.status(401).send('401');
		let userData = await accountsData.findOne({ id: req.bs.data.user.id });
		if(userData == null || userData == undefined) return res.status(404).send('404');
		let money = 0;
		let statsData = {steam:[], discord:[]};
		if(userData.steam != '') statsData.steam = await StatsData.findOne({ steam: userData.steam });
		if(userData.discord != '') statsData.discord = await StatsData.findOne({ discord: userData.discord });
		if(statsData.steam != undefined && statsData.steam != null &&
			statsData.steam.money != undefined && statsData.steam.money != null) money += statsData.steam.money;
		if(statsData.discord != undefined && statsData.discord != null &&
			statsData.discord.money != undefined && statsData.discord.money != null) money += statsData.discord.money;
		res.status(200).send({balance: userData.balance, money});
    }
    else if(type == 'id'){
		res.json({id:user});
    }
    else res.status(404).send('404');
}));
router.post('/api/boosts', vhost(host, async(req, res) => {
	const BoostId = parseInt(req.query.id);
    if(isNaN(BoostId)) return res.sendStatus(400);
	const boost = await boostsData.findOne({id: BoostId});
	if(boost === null || boost === undefined) return res.sendStatus(404);
	res.json({id: boost.id, name: boost.name, img: boost.img, sum: boost.sum});
}));
router.post('/api/emoji', vhost(host, async(req, res) => {
	let type = req.query.type?.toLowerCase();
    let emj = parseInt(req.query.id);
    if(isNaN(emj)) emj = undefined;
	if(type == 'url'){
		let emoji = await EmojisData.findOne({ id: emj });
        if(emoji == null || emoji == undefined) return res.sendStatus(404);
		return res.send(emoji.url);
	}
	else if(type == 'name'){
		let emoji = await EmojisData.findOne({ id: emj });
        if(emoji == null || emoji == undefined) return res.sendStatus(404);
		return res.send(emoji.name);
	}
	else if(type == 'data'){
		let emoji = await EmojisData.findOne({ id: emj });
        if(emoji == null || emoji == undefined) return res.sendStatus(404);
		return res.json({name:emoji.name,url:emoji.url,id:emoji.id});
	}
	else if(type == 'all'){
		const emojis = await EmojisData.find();
		return res.json(emojis);
	}
    else res.sendStatus(404);
}));
router.post('/api/donate', vhost(host, async(req, res) => {
	let type = req.query.type?.toLowerCase();
	if(type == 'info'){
		if(req.bs.data.user == null || req.bs.data.user == undefined) return res.sendStatus(401);
		let userData = await accountsData.findOne({ id: req.bs.data.user.id });
		if(userData == null || userData == undefined) return res.status(404).send('404');
		let DonateData = null;try{DonateData = await DonatesData.findOne({_id:req.query.donate});}catch{return res.sendStatus(401);}
		if(DonateData == null || DonateData == undefined) return res.status(404).send('404');
		if(userData.id != 1 && userData.user != DonateData.owner) return res.sendStatus(401);
		res.status(200).json({
			owner: DonateData.owner,
			sum: DonateData.sum,
			promo: DonateData.promo,
			to: DonateData.to,
			force: DonateData.force,
			give: DonateData.give,
			effects: DonateData.effects,
			players_roles: DonateData.players_roles,
			prefix: DonateData.prefix,
			color: DonateData.color,
			server: DonateData.server,
		});
    }
	else if(type == 'moneyback'){
		if(req.bs.data.user == null || req.bs.data.user == undefined) return res.sendStatus(401);
		let userData = await accountsData.findOne({ id: req.bs.data.user.id });
		if(userData == null || userData == undefined) return res.sendStatus(404);
		let DonateData = null;
		try{DonateData = await DonatesData.findOne({_id:req.query.donate});}catch{return res.sendStatus(401);}
		if(DonateData == null || DonateData == undefined) return res.sendStatus(404);
		if(userData.id != 1 && userData.user != DonateData.owner) return res.sendStatus(401);
		let ownerData = await accountsData.findOne({ user: DonateData.owner });
		ownerData.balance += GetMoney(DonateData.sum, DonateData.promo, DonateData.to);
		await ownerData.save();
		await DonateData.deleteOne();
		res.status(200).send('ok');
		function GetMoney(sum, promo, date) {
			let allow_back = sum-promo;
			if(0 >= allow_back) return 0;
			var datetime_regex = /(\d\d)\.(\d\d)\.(\d\d\d\d)\s(\d\d):(\d\d)/;
			var date_arr = datetime_regex.exec(date);
			let days = 30;
			if(date_arr[2] == 2 || date_arr[2] == 4 || date_arr[2] == 6 || date_arr[2] == 8 || date_arr[2] == 9 || date_arr[2] == 11 || date_arr[2] == 1) days = 31;
			var to = new Date(date_arr[3], date_arr[2]-=1, date_arr[1]-=1, date_arr[4], date_arr[5]);
			let tt = getDaysBetweenDates(Date.now(),to);
			if(tt > 30) tt = 0;
			return Math.round((sum/days)*tt);
			function getDaysBetweenDates(d0, d1) {
				var msPerDay = 8.64e7;
				var x0 = new Date(d0);
				var x1 = new Date(d1);
				x0.setHours(12,0,0);
				x1.setHours(12,0,0);
				return Math.round( (x1 - x0) / msPerDay );
			}
		}
    }
    else res.status(404).send('404');
}));
router.all('/clan', vhost(APIhost, async(req, res) => ClanAPI(req, res)));
async function ClanAPI(req, res) {
	const type = req.query.type?.toLowerCase();
	const ClanTag = req.query.tag?.toUpperCase();
	if(type == 'users'){
		const access = parseInt(req.query.access);
		if(isNaN(access)) return res.sendStatus(400);
		if(access > 5 || access < 1) return res.sendStatus(400);
		const clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return res.sendStatus(404);
		if(!clan.public && req.query.token != config.token) return res.sendStatus(401);
		let users = []
		clan.users.filter(x => x.access == access).forEach(user => users.push(user.user));
		res.status(200).json({users});
	}
    else if(type == 'all_users'){
		const clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return res.sendStatus(404);
		if(!clan.public && req.query.token != config.token) return res.sendStatus(401);
		let lvl1 = [], lvl2 = [], lvl3 = [], lvl4 = [], lvl5 = [];
		clan.users.filter(x => x.access == 1).forEach(user => lvl1.push(user.user));
		clan.users.filter(x => x.access == 2).forEach(user => lvl2.push(user.user));
		clan.users.filter(x => x.access == 3).forEach(user => lvl3.push(user.user));
		clan.users.filter(x => x.access == 4).forEach(user => lvl4.push(user.user));
		clan.users.filter(x => x.access == 5).forEach(user => lvl5.push(user.user));
		res.status(200).json({lvl1, lvl2, lvl3, lvl4, lvl5});
	}
    else if(type == 'boosts'){
		const clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return res.sendStatus(404);
		if(!clan.public && req.query.token != config.token) return res.sendStatus(401);
		const boosts = await boostsData.find();
		let available = [];
		let boostsJson = [];
		for (let i = 0; i < boosts.length; i++) if(clan.boosts.filter(x => x.id == boosts[i].id).length == 0) available.push(boosts[i].id);
		for (let i = 0; i < clan.boosts.length; i++) boostsJson.push(clan.boosts[i].id);
		res.json({boosts: boostsJson, available});
	}
	else if(type == 'info'){
		const clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return res.sendStatus(404);
		if(!clan.public && req.query.token != config.token) return res.sendStatus(401);
		res.json({name: clan.name, tag: clan.tag, color: clan.color, public: clan.public, desc: clan.desc, boosts: clan.boosts.length, money: clan.money, balance: clan.balance});
	}
    else if(type == 'money'){
		let clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return res.status(404).send('404');
		res.status(200).send(clan.money);
	}
    else if(type == 'balance'){
		let clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return res.status(404).send('404');
		res.status(200).send(clan.balance);
	}
    else res.sendStatus(404);
};
router.post('/api/geoip', vhost(host, async(req, res) => GeoIPAPI(req, res)));
router.all('/geoip', vhost(APIhost, async(req, res) => GeoIPAPI(req, res)));
router.post('/api/doubtful', vhost(host, async(req, res) => DoubtfulAPI(req, res)));
router.all('/doubtful', vhost(APIhost, async(req, res) => DoubtfulAPI(req, res)));
router.post('/api/userips', vhost(host, async(req, res) => UserIPSAPI(req, res)));
router.all('/userips', vhost(APIhost, async(req, res) => UserIPSAPI(req, res)));
async function GeoIPAPI(req, res) {
	const ip = req.query.ip;
	if(ip == null || ip == undefined) return res.sendStatus(401);
    let geoip = await geoipData.findOne({ip});
	if(geoip == null){
		ipinfo(ip, '').then(async data => {
			geoip = new geoipData({
				ip:data.ip,
				city:data.city,
				region:data.region,
				country:data.country,
				loc:data.loc,
				org:data.org,
				postal:data.postal,
				timezone:data.timezone
			});
			await geoip.save();
			res.status(200).json({
				ip:geoip.ip,
				city:geoip.city,
				region:geoip.region,
				country:geoip.country,
				loc:geoip.loc,
				org:geoip.org,
				postal:geoip.postal,
				timezone:geoip.timezone
			});
		}).catch(() => res.status(200).json({ip, city:undefined,region:undefined,country:undefined,loc:undefined,org:undefined,postal:undefined,timezone:undefined}));
	}else{
		res.status(200).json({
			ip:geoip.ip,
			city:geoip.city,
			region:geoip.region,
			country:geoip.country,
			loc:geoip.loc,
			org:geoip.org,
			postal:geoip.postal,
			timezone:geoip.timezone
		});
	}
}

let doubtfulsArray = [];
async function DoubtfulAPI(req, res) {
	const SteamID64 = req.query.steam;

	if (!SteamID64) {
		res.sendStatus(400);
		return;
	}

    let doubtful = await doubtfulsData.findOne({id:SteamID64, expires: { $lte: Date.now() } });
	if (doubtful) {
		res.status(200).json({
			id: doubtful.id,
			banned: doubtful.banned,
			days_since_last_ban: doubtful.daysSinceLastBan,
			level: doubtful.level,
			game_hours: doubtful.gameHours,
			created: doubtful.created,
			created_formatted: GetDate(new Date(doubtful.created)).split(' ')[0]
		});
		return;
	}

	const uid = guid();

	if (doubtfulsArray.some(x => x.steam == SteamID64)) {
		doubtfulsArray.push({steam:SteamID64, uid, res});
		return;
	}

	doubtfulsArray.push({steam:SteamID64, uid, res});

	const data1 = await try_json_fetch(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1?key=${config.SteamAPI}&steamids=${SteamID64}&format=json`);
	const player = data1.players.find(x => x.SteamId == SteamID64);

	const data3 = await try_json_fetch(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${config.SteamAPI}&steamid=${SteamID64}`);
	const level = data3.response.player_level ?? 0;

	const data4 = await try_json_fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.SteamAPI}&steamid=${SteamID64}`);
	let game_hours = 0;
	if (data4.response.games) {
		const game_data = data4.response.games.find(x => x.appid == 700330);
		if (game_data) {
			game_hours = game_data.playtime_forever;
		}
	}

	const resp2 = await fetch(`https://steamid.xyz/${SteamID64}`);
	const data2 = await resp2.text();

	const resp5 = await fetch(`https://steamcommunity.com/profiles/${SteamID64}?xml=1`);
	const data5 = await resp5.text();
	const arr5 = data5.split('<privacyMessage>');
	let setuped = true;
	if (arr5.length > 1) {
		setuped = !arr5[1].includes('not yet set up');
	}

	const date_string = data2.split('<i>Account Created:</i>')[1].split('<br>')[0].trim();
	const visible = data2.split('<i>Visibility:</i>')[1].split('<br>')[0].trim();
	const date_array = date_string.split(' ');

	let date = 0;
	if(visible == 'Public' && 3 >= date_array.length && date_array[2] != '1970'){
		let month = 0;

		switch (date_array[1]) {
			case 'Feb': month = 1; break;
			case 'Mar': month = 2; break;
			case 'Apr': month = 3; break;
			case 'May': month = 4; break;
			case 'Jun': month = 4; break;
			case 'Jul': month = 6; break;
			case 'Aug': month = 7; break;
			case 'Sep': month = 8; break;
			case 'Oct': month = 9; break;
			case 'Nov': month = 10; break;
			case 'Dec': month = 11; break;
			default: break;
		}

		date = new Date(date_array[2], month, date_array[0]).getTime();
	}

	doubtful = new doubtfulsData({
		id: SteamID64,
		setuped: setuped,
		banned: player.DaysSinceLastBan > 0 || player.NumberOfGameBans > 0 || player.NumberOfVACBans > 0,
		daysSinceLastBan: player.DaysSinceLastBan,
		created: date,
		level: level,
		gameHours: game_hours,

		expires: Date.now() + (1000 * 60 * 60), // 1 hour
	});
	await doubtful.save();

	const _json = {
		id: doubtful.id,
		setuped: doubtful.setuped,
		banned: doubtful.banned,
		days_since_last_ban: doubtful.daysSinceLastBan,
		level: doubtful.level,
		game_hours: doubtful.gameHours,
		created: doubtful.created,
		created_formatted: GetDate(new Date(doubtful.created)).split(' ')[0]
	};

	res.status(200).json(_json);

	let cached_array = doubtfulsArray.filter(x => x.steam == SteamID64 && x.uid != uid);
	for (let i = 0; i < cached_array.length; i++) {
		try { cached_array[i].res.status(200).json(_json); } catch { }
	}
	cached_array = [];
	doubtfulsArray = doubtfulsArray.filter(x => x.steam != SteamID64);

	async function try_json_fetch(url, i = 0) {
		try {
			const resp = await fetch(url);
			const json = await resp.json();
			return json;
		} catch {
			if (i > 5) {
				return {};
			}
			return new Promise(async resolve => {
				const json = await try_json_fetch(url, i + 1);
				resolve(json);
			});
		}
	}
};

async function UserIPSAPI(req, res) {
	const SteamID64 = req.query.steam;
	if(SteamID64 == null || SteamID64 == undefined) return res.sendStatus(400);
	if(req.query.token != config.token) return res.sendStatus(403);
    const stats = await StatsData.findOne({steam:SteamID64});
	if(stats == null) return res.sendStatus(400);
	let geoips = [];
	let ips = [];
	for (let i = 0; i < stats.ips.length; i++) {
		const _ip = stats.ips[i];
		if(geoips.filter(x => x.ip == _ip).length > 0) continue;
		let geoip = await geoipData.findOne({ip:_ip});
		if(geoip == null){
			const _d = await GetIpData(_ip, geoip);
			geoips.push(_d);
		}else{
			geoips.push({
				ip:geoip.ip,
				city:geoip.city,
				region:geoip.region,
				country:geoip.country,
				loc:geoip.loc,
				org:geoip.org,
				postal:geoip.postal,
				timezone:geoip.timezone
			});
		}
		ips.push(_ip);
	}
	res.status(200).json({
		steam:stats.steam, ips, geoips
	});
};
async function GetIpData(ip, geoip) {
	return new Promise(resolve => {
		ipinfo(ip, '').then(async data => {
			geoip = new geoipData({
				ip:data.ip,
				city:data.city,
				region:data.region,
				country:data.country,
				loc:data.loc,
				org:data.org,
				postal:data.postal,
				timezone:data.timezone
			});
			await geoip.save();
			resolve({
				ip:geoip.ip,
				city:geoip.city,
				region:geoip.region,
				country:geoip.country,
				loc:geoip.loc,
				org:geoip.org,
				postal:geoip.postal,
				timezone:geoip.timezone
			});
		}).catch(() => resolve({ip, city:undefined,region:undefined,country:undefined,loc:undefined,org:undefined,postal:undefined,timezone:undefined}));
	});
}
router.post('/api/avatar', vhost(host, async(req, res) => {
	if(req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		let data = req.body;
		let userData = await accountsData.findOne({ user: req.bs.data.user.user });
		userData.avatar = `${cdn_host_link}/scpsl/users/avatars/${userData.id}/${data.hash}.${data.format}`;
		await userData.save();
		res.status(200).send('ok');
    }
}));
router.post('/api/banner', vhost(host, async(req, res) => {
	if(req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		let data = req.body;
		let userData = await accountsData.findOne({ user: req.bs.data.user.user });
		userData.banner = `${cdn_host_link}/scpsl/users/banner/${userData.id}/${data.hash}.${data.format}`;
		await userData.save();
		res.status(200).send('ok');
    }
}));
router.post('/api/banner/delete', vhost(host, async(req, res) => {
	if(req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		let userData = await accountsData.findOne({ user: req.bs.data.user.user });
		userData.banner = '';
		await userData.save();
		res.status(200).send('ok');
    }
}));
router.post('/api/prefix', vhost(host, async(req, res) => {
	if (req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		if(req.body.prefix.length > 20) return res.status(400).send('many_length');
		let userData = await accountsData.findOne({ user: req.bs.data.user.user });
		if(req.body.prefix !== null && req.body.prefix !== undefined) userData.prefix = req.body.prefix;
		await userData.save();
		try{res.redirect("/profile");}catch{}
	};
}));
router.post('/api/name', vhost(host, async(req, res) => {
	if (req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		if(req.body.name.length > 25) return res.status(400).send('many_length');
		let userData = await accountsData.findOne({ user: req.bs.data.user.user });
		if(req.body.name !== null && req.body.name !== undefined) userData.name = req.body.name;
		await userData.save();
		try{res.redirect("/profile");}catch{}
	};
}));

// total: 17
const PaysList = [
	{
		label: 'Банковские карты',
		ways: [
			//{img: 'card2', name: 'Карты (Все страны)', commission: '0%', min: 10, id: 1},

			{img: 'ru', name: 'Карты (RUB) // Резерв', commission: '0%', min: 1, id: 26}, // yookassa

			//{img: 'ru', name: 'Карты (RUB) // Резерв', commission: '6%', min: 10, id: 22},
			//{img: 'earth', name: 'Карты (USD) // Резерв', commission: '6%', min: 100, id: 20},

			//{img: 'ru', name: 'Банковские карты (Россия)', commission: '4%', min: 10, id: 14},
			//{img: 'ru', name: 'Карты РФ [Qiwi P2P]', commission: '0-2%', min: 1, id: 16},
			//{img: 'card', name: 'Банковские карты (Все)', commission: '0%', min: 15, id: 18},
			//{img: 'kz', name: 'Банковские карты (Казахстан)', commission: '7%', min: 800, id: 2},
			//{img: 'ua', name: 'Банковские карты (Украина)', commission: '15%', min: 200, id: 13},
			//{img: 'earth', name: 'Банковские карты (USD)', commission: '15%', min: 10, id: 12},
		]
	},
	{
		label: 'Онлайн платежи',
		ways: [
			{img: 'sbp', name: 'СБП', commission: '0%', min: 1, id: 3},
			{img: 'steam', name: 'Steam Pay', commission: '5% + 10₽', min: 50, id: 4},
			{img: 'sber', name: 'Sber Pay', commission: '0%', min: 1, id: 15},
			{img: 'tinkoff', name: 'Tinkoff Pay', commission: '0%', min: 1, id: 17},
			//{img: 'yandex', name: 'Yandex Pay', commission: '4%', min: 100, id: 19},
		]
	},
	{
		label: 'Электронные кошельки',
		ways: [
			//{img: 'qiwi', name: 'Qiwi', commission: '6%', min: 100, id: 5},
			{img: 'yoomoney', name: 'YooMoney', commission: '0%', min: 1, id: 6},
			//{img: 'fk', name: 'FK Wallet', commission: '0%', min: 10, id: 7},
			{img: 'paypal', name: 'PayPal', commission: '6%', min: 100, id: 21},
		]
	},
	/*
	{
		label: 'Крипта',
		ways: [
			{img: 'btc', name: 'Bitcoin', commission: '0%', min: 100, id: 8},
			{img: 'ltc', name: 'Litecoin', commission: '0%', min: 100, id: 9},
			{img: 'eth', name: 'Ethereum', commission: '0%', min: 50, id: 10},
			{img: 'tron', name: 'Tron', commission: '0%', min: 150, id: 11},
		]
	},
	*/
	{
		label: 'Другое',
		ways: [
			{img: 'cryptomus', name: 'Cryptomus - Крипта', commission: '0%', min: 100, id: 24},
			{img: 'freekassa', name: 'Freekassa - Другое', commission: '?%', min: 100, id: 25},
		]
	},
];
const OtherList = {
	24: { min: 100, type: 'cryptomus' },
	25: { min: 100, type: 'freekassa' }
};
const FKList = {
	//1:{ min: 300, comms: 0, fk: 36 },
	//14:{ min: 100, comms: 0, fk: 12 },
	19:{ min: 100, comms: 0, fk: 12 },
	2:{ min: 800, comms: 0, fk: 41 },
	//3:{ min: 50, comms: 0, fk: 42 },
	4:{ min: 50, comms: 0, fk: 27 },
	//5:{ min: 100, comms: 0, fk: 10 },
	7:{ min: 10, comms: 0, fk: 1 },
	8:{ min: 100, comms: 0, fk: 24 },
	9:{ min: 100, comms: 0, fk: 25 },
	10:{ min: 50, comms: 0, fk: 26 },
	11:{ min: 150, comms: 0, fk: 39 },
	12:{ min: 10, comms: 0, fk: 32 },
	13:{ min: 200, comms: 0, fk: 7 },
};

const YMList = {
	23: { min: 2, comms: 0, type: 'AC' },
};

const YKList = {
	3: { min: 1, comms: 0, type: 'sbp' },
	6: { min: 1, comms: 0, type: 'yoo_money' },
	15:{ min: 1, comms: 0, type: 'sberbank' },
	17:{ min: 1, comms: 0, type: 'tinkoff_bank' },
	26:{ min: 1, comms: 0, type: 'bank_card' },
};

const DPList = {
	14: { min: 10, comms: 4, type: 'card' },
};

const DAList = {
	20: { min: 100, comms: 6, type: 'bankCardUsd' },
	21: { min: 100, comms: 6, type: 'payPalUsd' },
	22: { min: 10, comms: 6, type: 'bankCardRubDobro' },
};

const QiwiP2PList = {
	5: { min: 1, comms: 0, type: 'qw' },
	16:{ min: 1, comms: 0, type: 'card' },
};

const CardList = {
	1: { min: 1, comms: 0 }
}

router.get('/api/da-pay/:payId', vhost(host, async(req, res) => {
	if (!req.params.payId || req.params.payId == 'null' || req.params.payId == 'undefined') {
		res.send('<script>history.back();</script>');
		return;
	}

	const payData = await paymentsData.findById(req.params.payId);

	if (!payData) {
		res.send('<script>history.back();</script>');
		return;
	}

	if (!payData.isDA) {
		res.send('<script>history.back();</script>');
		return;
	}

	const DAPay = DAList[payData.payId];
	if (!DAPay) {
		res.send('<script>history.back();</script>');
		return;
	}

	let sum = payData.sum;

	if(DAPay.min > sum){
		payData.sum = DAPay.min;
		sum = payData.sum;
		await payData.save();
	}

	if(DAPay.comms > 0){
		sum = sum + (sum * DAPay.comms / 100);
	}

	res.render('internal-pays/donationalerts.ejs', {
		sum: sum,
		uid: req.params.payId,
		system: DAPay.type,
		account: config.donationAlerts.id,
		expires: payData.DAExpires - (1000 * 60 * 5), // - 5 mins
	});
}));

router.get('/api/card-pay/success', vhost(host, async(req, res) => {
	res.send(`<html style="background: #0c0d13;"><script>window.parent.postMessage('{"type": "billing", "action": "paySuccess"}', '*');</script></html>`);
}));
router.get('/api/card-pay/waiting', vhost(host, async(req, res) => {
	res.render('internal-pays/waiting.ejs');
}));
router.post('/api/card-pay/:payId/check', vhost(host, async(req, res) => {
	if (!req.params.payId || req.params.payId == 'null' || req.params.payId == 'undefined') {
		res.json({status: 'error', message: 'payment id is null'});
		return;
	}

	const payData = await paymentsData.findById(req.params.payId);

	if (!payData) {
		res.json({status: 'error', message: 'payment not found'});
		return;
	}

	if (payData.CardYkCheck.length < 1) {
		res.json({status: 'error', message: 'payment arguments not found'});
		return;
	}

    const checkoutStatusResp = await fetch('https://yoomoney.ru/checkout/payments/v2/payment/status', {
        method: 'post',
        headers: {
            'User-Agent': req.headers['user-agent'],
            'Content-Type': 'application/json',
        },
        body: payData.CardYkCheck,
    });
    const checkoutStatus = await checkoutStatusResp.json();

	if (checkoutStatus.status == 'progress') {
		res.json({status: 'progress'});
		return;
	}
	if (checkoutStatus.status != 'success') {
		res.json({status: 'error', message: 'error on payment system side'});
		return;
	}

	if (checkoutStatus.payload.status != 'Success'){
		res.json({status: 'error', message: 'payment pending'});
		return;
	}

	res.json({status: 'success'});
}));
router.get('/api/card-pay/:payId', vhost(host, async(req, res) => {
	if (!req.params.payId || req.params.payId == 'null' || req.params.payId == 'undefined') {
		res.render('internal-pays/error.ejs', {cdn_host:config.dashboard.cdn});
		return;
	}

	const payData = await paymentsData.findById(req.params.payId);

	if (!payData) {
		res.render('internal-pays/error.ejs', {cdn_host:config.dashboard.cdn});
		return;
	}

	if (!payData.isCard) {
		res.render('internal-pays/error.ejs', {cdn_host:config.dashboard.cdn});
		return;
	}

	if (!CardList[payData.payId]) {
		res.render('internal-pays/error.ejs', {cdn_host:config.dashboard.cdn});
		return;
	}

	res.render('internal-pays/custom.ejs', {
		cdn_host:config.dashboard.cdn,
		expires: payData.CardExpires - (1000 * 60 * 5), // - 5 mins
	});
}));
router.post('/api/card-pay/:payId', vhost(host, async(req, res) => {
	if (!req.params.payId || req.params.payId == 'null' || req.params.payId == 'undefined') {
		res.json({error: true, message: 'Кривой аргумент в ссылке'});
		return;
	}

	const cardData = req.body;

	if (!cardData.num || typeof(cardData.num) != 'string') {
		res.json({error: true, message: 'Не указан номер карты'});
		return;
	}

	if (!cardData.cvc || typeof(cardData.cvc) != 'string') {
		res.json({error: true, message: 'Не указан CVC код карты'});
		return;
	}

	if (!cardData.expires || typeof(cardData.expires) != 'object') {
		res.json({error: true, message: 'Не указан срок истечения карты'});
		return;
	}

	const payData = await paymentsData.findById(req.params.payId);

	if (!payData) {
		res.json({error: true, message: 'Оплата не найдена'});
		return;
	}

	if (!payData.isCard) {
		res.json({error: true, message: 'Оплата создана через другую платежную систему'});
		return;
	}

	const CardPay = CardList[payData.payId];
	if (!CardPay) {
		res.json({error: true, message: 'Не найден указанный id оплаты'});
		return;
	}

	let sum = payData.sum;

	if(CardPay.min > sum){
		payData.sum = CardPay.min;
		sum = payData.sum;
		await payData.save();
	}

	if(CardPay.comms > 0){
		sum = sum + (sum * CardPay.comms / 100);
	}

	const answerBin = await getCardByBin(cardData.num.slice(0, 6));

	if (!answerBin.valid) {
		res.json({error: true, message: 'Не удалось найти банк, выпустившего карту'});
		return;
	}

	payData.CardBank = answerBin.issuer.name;

	cardData.cvc = CryptoJS.AES.decrypt(cardData.cvc, cardData.num).toString(CryptoJS.enc.Utf8);

	/*
	try {
		await ProcessYookassaPayment(req, res, cardData, payData, sum, answerBin);
		return;
	} catch {}
	*/

	await ProcessMailruPayment(req, res, cardData, payData, sum, answerBin);
}));

async function ProcessYookassaPayment(req, res, cardData, payData, sum, answerBin) {
	if (!(answerBin.country.alpha3 == 'RUS' || answerBin.currency == 'RUB' || answerBin.scheme == 'NSPK MIR')) {
		throw Error('card not supported');
	}

	const createPayResp = await fetch('https://api.yookassa.ru/v3/payments', {
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + config.yookassa.token,
			'Idempotence-Key': guid(),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			amount: {
				value: sum,
				currency: 'RUB',
			},
			capture: true,
			payment_method_data: {
				type: 'bank_card'
			},
			confirmation: {
				type: 'redirect',
				return_url: 'https://scpsl.shop/api/card-pay/success'
			},
			'description': 'Пополнение баланса'
		}),
	});
	const createPay = await createPayResp.json();

	const userAgent = req.headers['user-agent'];
	const orderId = createPay.id;

	const orderRes = await fetch('https://yoomoney.ru/checkout/payments/v2/contract/bankcard?orderId='+orderId);
	const orderData = await orderRes.text();

	let checkoutKey;
	{
		const preParsed = orderData.split('checkoutClientApi')[1].split('secretKey')[1].split(',')[0];

		if(!preParsed.startsWith('"')){
			const hook = new Webhook("");
			hook.send('Ошибка при создании оплаты.\nВ yookassa, по видимому, изменили структуру данных. Строка "preParsed" не начинается с \`"\`');
			throw new Error('something wrong');
		}

		const preJson = JSON.parse('{"test' + preParsed + '}');
		checkoutKey = preJson.test;
	}

	payData.yookassa = createPay.id;
	payData.CardYkCheck = JSON.stringify({orderId: orderId, sk: checkoutKey});
	await payData.save();

	const cardTokensResp = await fetch('https://paymentcard.yoomoney.ru/webservice/storecard/api/storeCardForPayment', {
		method:'post',
		headers: {
			'User-Agent':userAgent,
			'Content-Type':'application/x-www-form-urlencoded',
		},
		body: JSON.stringify({
			cardholder: 'CARD HOLDER',
			pan: cardData.num, // card num
			expireDate: '20'+cardData.expires.year+cardData.expires.month, // year(YYYY)month
			csc: cardData.cvc,
			requestId: orderId
		}) + ':'
	});
	const cardTokens = await cardTokensResp.json();

	if (cardTokens.status != 'success') {
		throw new Error('something wrong');
	}

	const cardCheckoutResp = await fetch('https://yoomoney.ru/checkout/payments/v2/payment/anycard/start', {
		method: 'post',
		headers: {
			'User-Agent':userAgent,
			'Content-Type':'application/json',
		},
		body: JSON.stringify({
			cardSynonym: cardTokens.result.cardSynonym,
			orderId: orderId,
			sk: checkoutKey,
		})
	});
	let cardCheckout = await cardCheckoutResp.json();

	while (cardCheckout.status == 'progress') {
		await new Promise(resolve => setTimeout(() => resolve(), 1000));
		const checkoutStatus = await fetch('https://yoomoney.ru/checkout/payments/v2/payment/status', {
			method: 'post',
			headers: {
				'User-Agent':userAgent,
				'Content-Type':'application/json',
			},
			body: JSON.stringify({
				orderId: orderId,
				sk: checkoutKey,
			})
		});
		cardCheckout = await checkoutStatus.json();
	}

	if (cardCheckout.status != 'success') {
		throw Error('something wrong');
	}

	const redirect = {
		isPost: true,
		url: cardCheckout.payload.authParams.url,
		data: cardCheckout.payload.authParams.payload
	}

	res.json({
		status: 'success',
		redirect: redirect,
		statusCheck: payData._id
	});
}
async function ProcessMailruPayment(req, res, cardData, payData, sum, answerBin) {
    const cookies = [];
    const userAgent = req.headers['user-agent'];

	let url_redirect;
	let error_log = '';

	// send to boosty api
    const formdata = new FormData();
    formdata.append('amount', sum);
    formdata.append('pay_method', (answerBin.country.alpha3 == 'RUS' || answerBin.currency == 'RUB' || answerBin.scheme == 'NSPK MIR') ? 'card' : 'card_global');
    formdata.append('currency', 'RUB');
    formdata.append('is_mobile', false);
    formdata.append('message', '[]');
    //formdata.append('message', '[{"type":"text","content":"hello","modificator":""}]');

    const resp = await fetch('https://api.boosty.to/v1/payment/url/' + config.boosty.receiverNick + '/donation/author?from_page=blog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + config.boosty.payerToken,
            'User-Agent': userAgent,
        },
        body: new URLSearchParams(formdata).toString()
    });
    const auth = await resp.json();

	if (auth.error) {
		error_log = auth.error_description;
	} else {
		url_redirect = auth.url;
	}

	if (!url_redirect) {
		const da_resp = await fetch('https://www.donationalerts.com/api/v1/payin/invoice', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				amount: sum,
				commission_covered: 0,
				currency: 'RUB',
				email: 'no-reply@scpsl.shop',
				extra: {
					apid: '338452562_00148ba6ff11608a7ad796a5c38f68d7'
				},
				message_type: 'text',
				system: ((answerBin.country.alpha3 == 'RUS' || answerBin.currency == 'RUB' || answerBin.scheme == 'NSPK MIR') ? 'bankCardRubDobro' : 'bankCardUsd'),
				type: 'donation',
				user_id: config.donationAlerts.id
			})
		});
		const da_pay = await da_resp.json();

		if (da_pay.success == false) {
			error_log = da_pay.errors[0].message;
		} else {
			url_redirect = da_pay.data.redirect_url;

			if (da_pay.data.action == 'wait') {
				while (!url_redirect) {
					try {
						const da_resp2 = await fetch(`https://www.donationalerts.com/api/v1/payin/invoice?type=donation&id=${da_pay.data.invoice_id}&hash=${da_pay.data.hash}`);
						const da_wait = await da_resp2.json();

						if (da_wait.data.action == 'redirect') {
							url_redirect = da_wait.data.redirect_url;
							break;
						}
					} catch (err) {
						console.warn(err);
					}

					await new Promise(resolve => setTimeout(() => resolve(), 1000));
				}
			}
		}
	}

	if (!url_redirect) {
		res.json({error: true, message: 'Произошла ошибка на моменте создания платежа: ' + error_log});
		return;
	}

	// follow redirects and save cookies
	const redirResp = await fetch(url_redirect, {
        headers: {
            'accept': '*/*',
            'User-Agent': userAgent,
        }
    });
    cookies.push(...redirResp.headers.getSetCookie());

    const redirectionResp = new URL(redirResp.url);

	// waiting like legits users
    await new Promise(resolve => setTimeout(() => resolve(), 10000));

	// sending card data
    const payerFormdata = new FormData();
    payerFormdata.append('session_id', redirectionResp.searchParams.get('session_id'));
    payerFormdata.append('signature', redirectionResp.searchParams.get('signature'));
    //payerFormdata.append('add_card', 'False');
    payerFormdata.append('cardholder', 'SIMPLE MAILRU');
    payerFormdata.append('pan', cardData.num);
    payerFormdata.append('cvv', cardData.cvc);
    payerFormdata.append('exp_date', cardData.expires.month + '.20' + cardData.expires.year);

    const payerResp = await fetch('https://cpg.money.mail.ru/api/in/order/pay', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: parseCookies(cookies),
            'Referer': redirResp.url,
            'User-Agent': userAgent,
        },
        body: new URLSearchParams(payerFormdata).toString()
    });
    cookies.push(...payerResp.headers.getSetCookie());

	const payerJson = await payerResp.json();

	// get status of operation
    let status = null;

    while (status == null) {
        await new Promise(resolve => setTimeout(() => resolve(), 1000));

        const statusResp = await fetch(payerJson.url, {
            headers: {
                'accept': '*/*',
                cookie: parseCookies(cookies),
                'Referer': redirResp.url,
                'User-Agent': userAgent,
            }
        });
        const statusJson = await statusResp.json();

		if (statusJson.threeds_fingerprint) {
			continue;
		}

        if (statusJson.status != 'OK_CONTINUE') {
            status = statusJson;
        }
    }

	if (status.status == 'OK_FINISH') {
		const statusUrl = new URL(payerJson.url);
		payData.CardTag = statusUrl.search.substring(1);
		await payData.save();
	}

	const redirect = {
		isPost: false,
		url: undefined, // status.acs_url,
	}

	if (redirect.url == undefined) {
		redirect.isPost = true;

		if (status.threeds_fingerprint) {
			redirect.url = status.threeds_fingerprint.method_url;
			redirect.data = status.threeds_fingerprint;

			delete redirect.data.method_url;
		} else if (status.threeds_challenge) {
			redirect.url = status.threeds_challenge.acs_url;
			redirect.data = status.threeds_challenge;

			delete redirect.data.acs_url;
		} else if (status.threeds_data) {
			redirect.url = status.acs_url;
			redirect.data = status.threeds_data;
		}
	}

	res.json({
		status: status.status,
		error: {...status.error, transaction_status: status.transaction_status},
		redirect: redirect,
	});

	function parseCookies(cookies) {
		return cookies.map((entry) => {
			const parts = entry.split(';');
			const cookiePart = parts[0];
			return cookiePart;
		}).join(';');
	}
}

router.post('/api/payment/getBankByBin', vhost(host, async(req, res) => {
	const json = await getCardByBin(req.query.bin);
	res.json(json);
}));

router.post('/api/payment/list', vhost(host, async(req, res) => {
	res.json(PaysList);
}));
router.post('/api/payment', vhost(host, async(req, res) => {
	if(!req.bs.data.user) return res.json({error: true, msg: 'Вы не авторизованы'});
	if(!req.query.type) return res.json({error: true, msg: 'Не указан тип платежной системы'});
	if(!req.query.sum) return res.json({error: true, msg: 'Не указана сумма платежа'});

	const type = parseInt(req.query.type);
	if(isNaN(type)) return res.json({error: true, msg: 'Тип платежной системы указан неверно (не является числом)'});

	let pre_sum = parseInt(req.query.sum);
	if(isNaN(pre_sum)) return res.json({error: true, msg: 'Сумма указана неверно (не является числом)'});

	try {
	const CardPay = CardList[type];

	if (CardPay) {
		let sum = pre_sum;

		if(CardPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		const payData = new paymentsData({
			user: req.bs.data.user.user,
			sum: pre_sum,
			payId: type,
			isCard: true,
			CardExpires: Date.now() + (1000 * 60 * 35) // 35 mins
		});
		await payData.save();

		res.json({ error: false, url: '/api/card-pay/' + payData._id });
		return;
	}
	} catch { }

	try{
	const FKPay = FKList[type];
	if(FKPay){
		let sum = pre_sum;
		if(FKPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		if(FKPay.comms > 0){
			sum = sum + (sum * FKPay.comms / 100);
		}

		const payData = new paymentsData({user: req.bs.data.user.user});
		await payData.save();

		const api_key = '39ff5a96cd03829dbb88c6db09a8c53d';
		const body = {
			shopId: `${config.freekassa.shop}`,
			nonce: `${Date.now() - 1672513200000}`,

			paymentId: payData._id,
			i: FKPay.fk,
			email: req.bs.data.user.email,
			ip: req._ip,
			amount: sum,
			currency: 'RUB',
		};

		const sortedKeys = Object.keys(body).sort();
		const sortedValues = sortedKeys.map(key => body[key]);
		const sign = crypto.createHmac('sha256', api_key).update(sortedValues.join('|')).digest('hex');
		body.signature = sign;

		if(type == 19){
			const hash = crypto.createHash('md5').update(`${config.freekassa.shop}:${body.amount}:${config.freekassa.public}:RUB:${payData._id}`).digest('hex');
			const urlPay = `https://pay.freekassa.com/?m=${config.freekassa.shop}&currency=RUB&oa=${body.amount}&o=${payData._id}&s=${hash}&i=${FKPay.fk}`;
			res.json({error: false, url: urlPay});
			return;
		}

		const resp = await fetch('https://api.freekassa.com/v1/orders/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		try{
			const _url = await resp.json();
			if(!_url.location){
				return res.json({error: true, msg: 'Произошла ошибка у платежного шлюза'});
			}
			res.json({error: false, url: _url.location});
		}catch{
			return res.json({error: true, msg: 'Произошла ошибка при парсинге ответа от платежного шлюза'});
		}
		return;
	}
	}catch{}

	try {
	const YMPay = YMList[type];

	if (YMPay) {
		let sum = pre_sum;

		if(YMPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		const payData = new paymentsData({
			user: req.bs.data.user.user,
			sum: pre_sum,
			payId: type,
		});
		await payData.save();

		if(YMPay.comms > 0){
			sum = sum + (sum * YMPay.comms / 100);
		}

		res.json({
			error: false,
			url: 'https://yoomoney.ru/quickpay/confirm',
			isPost: true,
			data: {
				receiver: config.yoomoney.wallet,
				label: payData._id,
				sum: sum,
				paymentType: YMPay.type,
				successURL: `https://${config.dashboard.baseURL}/profile`,
				'quickpay-form': 'button',
			}
		});

		return;
	}
	} catch(e) { console.error(e); }

	try{
	const YKPay = YKList[type];

	if(YKPay){
		let sum = pre_sum;

		if(YKPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		if(YKPay.comms > 0){
			sum = sum + (sum * YKPay.comms / 100);
		}

		const resp = await try_fetch('https://api.yookassa.ru/v3/payments', {
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + config.yookassa.token,
				'Idempotence-Key': guid(),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				amount: {
					value: sum,
					currency: 'RUB',
				},
				capture: true,
				payment_method_data: {
					type: YKPay.type
				},
				confirmation: {
					type: 'redirect',
					return_url: 'https:///iprofile'
				},
				'description': 'Пополнение баланса'
			}),
		});
		const _json = await resp.json()

		const payData = new paymentsData({
			user: req.bs.data.user.user,
			yookassa: _json.id,
			sum: pre_sum,
		});
		await payData.save();

		res.json({error: false, url: 'https:///internal/redirect?orderId=' + _json.id});
		//res.json({error: false, url: _json.confirmation.confirmation_url});
		return;
	}
	}catch{}

	try{
	const DPPay = DPList[type];

	if (DPPay) {
		let sum = pre_sum;

		if(DPPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		if(DPPay.comms > 0){
			sum = sum + (sum * DPPay.comms / 100);
		}

		const payData = new paymentsData({
			user: req.bs.data.user.user,
			sum: pre_sum,
			payId: type,
			isDP: true,
			DPExpires: (Date.now() + (6 * 60 * 60 * 1000)) // 6 hrs
		});
		await payData.save();

		const resp = await try_fetch('https://donatepay.ru/donate/donation/' + config.donationPay.id, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				audio_record: null,
				media_id: null,
				boss: '',
				target: '',
				premium: {},
				client_id: guid(),
				comment: payData._id.toString(),
				currency: 'RUB',
				name: 'average fydne player',
				payment_system: DPPay.type,
				redirect_url: 'https://scpsl.shop/profile?amount=' + sum + '&currency=RUB',
				sum: sum.toString(),
			}),
		});
		const _json = await resp.json();

		if (_json.error) {
			res.json({ error: true, msg: _json.message });
		}

		let answer = { error: false, url: _json.data.action };
		if (_json.data.method == 'post') {
			answer.isPost = true;
			answer.data = _json.data;
			delete answer.data['method'];
			delete answer.data['action'];
		}
		res.json(answer);
		return;
	}
	}catch{}

	try{
	const DAPay = DAList[type];

	if (DAPay) {
		let sum = pre_sum;

		if(DAPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		const payData = new paymentsData({
			user: req.bs.data.user.user,
			sum: pre_sum,
			payId: type,
			isDA: true,
			DAExpires: (Date.now() + (65 * 60 * 1000)) // 65 mins
		});
		await payData.save();

		res.json({error: false, url: '/api/da-pay/' + payData._id});
		return;
	}
	}catch{}

	try{
	const QiwiPay = QiwiP2PList[type];

	if(QiwiPay){
		let sum = pre_sum;

		if(QiwiPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		if(QiwiPay.comms > 0){
			sum = sum + (sum * QiwiPay.comms / 100);
		}

		const resp_auth = await fetch('https://w.qiwi.com/oauth/token?grant_type=anonymous&client_id=checkout_anonymous', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			},
		});
		const cookie = resp_auth.headers.get('set-cookie');
		const auth = await resp_auth.json();

		const _date = new Date(Date.now() + (3 * 60 * 60 * 1000) + (15 * 60 * 1000)); // msk 3 gmt + 15 minutes
		let _expire = _date.getUTCFullYear() + '-' + dateTimePad((_date.getUTCMonth() + 1), 2) + '-' + dateTimePad(_date.getUTCDate(), 2);
		_expire += 'T' + dateTimePad(_date.getUTCHours(), 2) + dateTimePad(_date.getUTCMinutes(), 2);

		const resp = await fetch('https://edge.qiwi.com/checkout-api/invoice/create', {
			method: 'POST',
			headers: {
				'Authorization': 'TokenHead ' + auth.access_token,
				'Cookie': cookie,
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

			},
			body: JSON.stringify({
				amount: sum,
				comment: "Пополнение баланса",
				currency: "rub",
				customers: [],
				expire_date_time: _expire,
				extras: [
					{code: "apiClient", value: "p2p-admin"},
					{code: "apiClientVersion", value: "0.17.0"},
					{code: "paySourcesFilter", value: QiwiPay.type},
				],

				public_key: config.qiwiP2P
			}),
		});
		const _json = await resp.json()

		const payData = new paymentsData({
			user: req.bs.data.user.user,
			isQiwi: true,
			qiwiTag: _json.invoice_uid,
			qiwiExpires: (Date.now() + (15 * 60 * 1000)) // 15 min
		});
		await payData.save();

		res.json({error: false, url: 'https://oplata.qiwi.com/form?invoiceUid=' + _json.invoice_uid});
		return;
	}
	}catch{}

	try {
		const OtherPay = OtherList[type];

		let sum = pre_sum;

		if(OtherPay.min > sum){
			res.json({error: true, msg: 'Сумма платежа меньше минимальной суммы'});
			return;
		}

		if(OtherPay){
			switch (OtherPay.type) {
				case 'cryptomus': {
					const payData = new paymentsData({user: req.bs.data.user.user});
					await payData.save();

					const siteUrl = 'https://' + config.dashboard.baseURL;

					const body = JSON.stringify({
						amount: `${sum}`,
						currency: 'RUB',
						order_id: payData._id,
						lifetime: 10800, // 3 hrs
						url_return: siteUrl + '/profile',
						url_success: siteUrl + '/profile',
						url_callback: 'https://' + config.dashboard.api + '/cryptomus',

					});
					const resp = await fetch('https://api.cryptomus.com/v1/payment', {
						method: 'POST',
						headers: {
							'merchant': config.cryptomus.merchant,
							'sign': crypto.createHash('md5').update(Buffer.from(body).toString('base64') + config.cryptomus.key).digest('hex'),
							'Content-Type': 'application/json',
						},
						body: body,
					});
					const _json = await resp.json();

					if (_json.state == 1 && _json.message) {
						res.json({error: true, msg: _json.message});
						return;
					}

					res.json({error: false, url: _json.result.url});
					return;
				}

				case 'freekassa': {
					const payData = new paymentsData({user: req.bs.data.user.user});
					await payData.save();

					const hash = crypto.createHash('md5').update(`${config.freekassa.shop}:${sum}:${config.freekassa.public}:RUB:${payData._id}`).digest('hex');
					const urlPay = `https://pay.freekassa.com/?m=${config.freekassa.shop}&currency=RUB&oa=${sum}&o=${payData._id}&s=${hash}`;
					res.json({error: false, url: urlPay});
					return;
				}

				default:
					break;
			}
		}
	} catch { }

	res.json({error: true, msg: 'Не найден тип платежной системы'});

	function try_fetch(url, params, i = 1) {
		if (i == 6) {
			return fetch(url, params);
		}

		try{
			return fetch(url, params);
		}catch{
			return new Promise(prom => {
				setTimeout(async() => {
					const resp = await try_fetch(url, params, i + 1);
					prom(resp);
				}, 500);
			})
		}
	}
}));

router.post('/api/balance', vhost(host, async(req, res) => {
	if (req.bs.data.user == null){
		res.status(200).json({error: false, url: '/auth?redirect=profile'});
    }else{
		const payData = new paymentsData({user: req.bs.data.user.user});
		await payData.save();
		const hash = crypto.createHash('md5').update(`${config.freekassa.shop}:${req.body.sum}:${config.freekassa.public}:RUB:${payData._id}`).digest('hex');
		const url = `https://pay.freekassa.com/?m=${config.freekassa.shop}&currency=RUB&oa=${req.body.sum}&o=${payData._id}&s=${hash}`;
		res.status(200).json({error: false, url});
	};
}));
/*
router.post('/api/balance', vhost(host, async(req, res) => {
	if (req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		let payData = await paymentsData.findOne();
		if(payData === null || payData === undefined) {
			payData = new paymentsData();
		}
		const code = guid();
		payData.payments.push({
			id: code,
			user: req.bs.data.user.user
		});
        payData.paymentid++;
		await payData.save();
		res.status(200).json({
			payment: payData.paymentid,
			uid: code,
			sum: req.body.sum,
			to: '4100116714720369'
		});
	};
}));
const QurreAPI = require('qurre-pay');
const Qurre = new QurreAPI(config.payments.secret, config.payments.public);
router.post('/api/balance', vhost(host, async(req, res) => {
	if (req.bs.data.user == null){
        res.redirect(`/auth?redirect=profile`);
    }else{
		let payData = await paymentsData.findOne();
		if(payData === null || payData === undefined) {
			payData = new paymentsData();
		}
		const Payment = await Qurre.CreatePayment(req.body.sum, `Пополнение баланса №${payData.paymentid}`);
		payData.payments.push({
			id: Payment.payment,
			user: req.bs.data.user.user
		});
        payData.paymentid++;
		await payData.save();
		res.status(200).send(Payment.link);
	};
}));
*/
module.exports = router;
function GetDate(date, add = {
	days: 0,
	months: 0,
	years: 0,
	hours: 0,
	minutes: 0
}) {
	let day = date.getDate() + add.days;
	let month = date.getMonth() + 1 + add.months;
	let year = date.getFullYear() + add.years;
	let hour = date.getHours() + add.hours;
	let minute = date.getMinutes() + add.minutes;
	if (parseInt(month) == 2 && parseInt(day) > 28) {
		day = "1";
		month = '3';
	}
	if ((parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) && parseInt(day) > 30) {
		day = "1";
		const mnth = parseInt(month) += 1;
		month = mnth;
	}
	if(parseInt(day) > 31){
		day = "1";
		const mnth = parseInt(month) += 1;
		month = mnth;
	}
	if (parseInt(day) < 10) {
		var t = "0";
		t += day;
		day = t;
	}
	if (parseInt(hour) < 10) {
		var t = "0";
		t += hour;
		hour = t;
	}
	if (parseInt(minute) < 10) {
		var t = "0";
		t += minute;
		minute = t;
	}
	if (parseInt(month) == 13) {
		month = "01";
		year = date.getFullYear() + 1;
	}
	if (parseInt(month) < 10) {
		var t = "0";
		t += month;
		month = t;
	}
	var time = day + "." + month + "." + year + " " + hour + ':' + minute;
	return time;
}

const guid = function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});}

function dateTimePad(value, digits){
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}








const cardsCached = [];
async function getCardByBin(bin) {
	bin = bin.slice(0, 6);

	let cachedBin = cardsCached.find(x => x.number == bin);

	if (cachedBin) {
		return cachedBin;
	}

	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
		const httpsAgent = new https.Agent({
			rejectUnauthorized: false,
			maxCachedSessions: 0
		});
		const resp = await fetch('https://bin-ip-checker.p.rapidapi.com?bin=' + bin, {
			method: 'post',
			agent: httpsAgent,
			data: JSON.stringify({bin: bin}),
			headers: {
				'content-type': 'application/json',
				'X-RapidAPI-Key': config.rapidBinKey,
				'X-RapidAPI-Host': 'bin-ip-checker.p.rapidapi.com',
			},
		});
		const json = await resp.json();

		if (json.success) {
			cardsCached.push(json.BIN);
			return json.BIN;
		}

		return json;
	} catch (err) {
		console.error(err);
		return { valid: false, error: 'request failed' }
	}
}