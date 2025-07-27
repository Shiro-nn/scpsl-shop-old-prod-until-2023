const vhost = require('vhost');
const express = require("express"),
router = express.Router();
const config = require("../../config");
const host = config.dashboard.baseURL;
const cdn_host = config.dashboard.cdn;
const achievementsData = require("../../base/achievements");
const pomocodesData = require("../../base/promo_codes");
const boostsData = require("../../base/boosts");
const EmojisData = require("../../base/emoji");
const countsData = require("../../base/counts");

router.get('/community/achievements', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/achievements');
	if(req.bs.data.user.id != 1) return next();
	const achievements = await achievementsData.find();
	res.render("community/achievements.ejs", {cdn_host, achievements});
}));
router.post('/community/achievements', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/achievements');
	if(req.bs.data.user.id != 1) return next();
	let data = req.body;
	await new achievementsData({name:data.name, img:data.img, desc:data.desc}).save();
	res.status(200).send('ok');
}));
router.get('/community/promocodes', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/promocodes');
	if(req.bs.data.user.id != 1) return next();
	const promoData = await pomocodesData.find({owner: req.bs.data.user.user});
	res.render("community/promocodes.ejs", {pdata: promoData, cdn_host});
}));
router.post('/community/promocodes', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/promocodes');
	if(req.bs.data.user.id != 1) return next();
	let data = req.body;
	if(data.mode == 'create') CreatePromo();
	else if(data.mode == 'edit'){
		let promoData = await pomocodesData.findOne({code: data.code, owner: req.bs.data.user.user});
		if(promoData == null || promoData == undefined) return res.redirect('/community/promocodes');
		if(data.promo > 10) data.promo = 5;
		promoData.to_owner = data.promo;
		promoData.to_user = 10 - data.promo;
		await promoData.save();
		res.redirect('/community/promocodes');
	}
	async function CreatePromo() {
		let promo = 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
		let __ = await pomocodesData.findOne({code: promo});
		if(__ == null || __ == undefined){
			let promoData = new pomocodesData();
			if(data.promo > 10) data.promo = 5;
			promoData.to_owner = data.promo;
			promoData.to_user = 10 - data.promo;
			promoData.owner = req.bs.data.user.user;
			promoData.code = promo;
			await promoData.save();
			res.redirect('/community/promocodes');
		}else{CreatePromo();}
	}
}));
router.get('/community/boosts', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/boosts');
	if(req.bs.data.user.id != 1) return next();
	const boosts = await boostsData.find();
	res.render("community/boosts.ejs", {cdn_host, boosts});
}));
router.post('/community/boosts', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/boosts');
	if(req.bs.data.user.id != 1) return next();
	const data = req.body;
	let counts = await countsData.findOne();
	if(counts === null || counts === undefined) counts = new countsData({boosts: 0});
	counts.boosts++;
	await counts.save();
	await new boostsData({name:data.name, img:data.img, sum:data.sum, id:counts.boosts}).save();
	res.status(200).send('ok');
}));
router.get('/community/emojis', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/emojis');
	if(req.bs.data.user.id != 1) return next();
	const emojis = await EmojisData.find();
	res.render("community/emojis.ejs", {cdn_host, emojis});
}));
router.post('/community/emojis', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=community/emojis');
	if(req.bs.data.user.id != 1) return next();
	const data = req.body;
	let counts = await countsData.findOne();
	if(counts === null || counts === undefined) counts = new countsData({emojis: 0});
	counts.emojis++;
	await counts.save();
	await new EmojisData({
		name: data.name,
		url: data.img,
		id: counts.emojis
	}).save();
	res.status(200).send('ok');
}));
module.exports = router;