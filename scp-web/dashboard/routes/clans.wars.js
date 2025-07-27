const express = require('express'),
router = express.Router();
const vhost = require('vhost');

const config = require('../../config');
const host = config.dashboard.baseURL;
const cdn_host = config.dashboard.cdn;

router.get('/wars', vhost(host, async(req, res) => {
	res.render('clans/wars/list.ejs', {cdn_host});
}));
router.get('/wars/create', vhost(host, async(req, res) => {
	res.render("clans/wars/create.ejs", {cdn_host});
}));
router.get('/wars/:tag', vhost(host, async(req, res) => {
	res.render("clans/wars/war.ejs", {cdn_host, tag:req.params.tag.toLowerCase()});
}));

router.post('/wars/create', vhost(host, async(req, res) => {
	const clan_tag = req.params.tag.toUpperCase();
	if(req.bs.data.user == null) return res.redirect(`/clans?redirect=clans/${clan_tag}`);
	const data = req.body;
	const clan = await clansData.findOne({ tag: clan_tag });
	if(clan === null || clan === undefined) return res.status(404).send('404');
	if(clan.users.filter(x => x.user == req.bs.data.user.id).length > 0 && clan.users.filter(x => x.user == req.bs.data.user.id)[0].access >= 3){
		clan.desc = data.desc.substring(0, 300);
		await clan.save();
		res.status(200).send('ok');
	}
	else res.status(404).send('404');
}));
module.exports = router;