const vhost = require('vhost');
const express = require("express"),
router = express.Router();
const AccountsData = require("../../base/accounts");
const DonatesData = require("../../base/donate");
const RolesData = require("../../base/roles");
const config = require("../../config");
const host = config.dashboard.baseURL;
const cdn_host = config.dashboard.cdn;
const Servers = require('./modules/DonateServers');
const Roles = require('./modules/DonateRoles');

router.get('/offline', async(req, res) => res.render('offline.ejs'));

router.get('/', async(req, res) => {
	res.render("index.ejs", {cdn:cdn_host+'/scpsl', cdn_host});
});
router.get('/old', async(req, res) => {
	res.render("index-old.ejs", {cdn_host});
});
router.get('/app', async(req, res) => {
	res.render("desktop/app.ejs", {cdn_host});
});
router.get('/tps', vhost(host, async(req, res) => {
	res.render("system/tps.ejs", {cdn_host});
}));
router.get('/info', vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=info');
	const DonateData = await DonatesData.find({owner: req.bs.data.user.user});
	const RoleData = await RolesData.find({owner: req.bs.data.user.id});
	const AccountData = await AccountsData.findOne({id: req.bs.data.user.id});
	res.render("settings/info.ejs", {ddata: DonateData, rdata: RoleData, adata: AccountData, cdn_host, Servers, Roles: Roles.roles});
}));
router.post('/internal/save_gradient',vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.json({error:'Вы не авторизованы', status:'error'});
	const Reg_Exp = /^#[0-9A-F]{6}$/i;
	const data = req.body;

	if(!Reg_Exp.test(data.fromA)) return res.json({error:'fromA не является валидным hex', status:'error'});
	if(!Reg_Exp.test(data.toA)) return res.json({error:'toA не является валидным hex', status:'error'});
	if(!Reg_Exp.test(data.fromB)) return res.json({error:'fromB не является валидным hex', status:'error'});
	if(!Reg_Exp.test(data.toB)) return res.json({error:'toB не является валидным hex', status:'error'});
	
	const AccountData = await AccountsData.findOne({id: req.bs.data.user.id});

	if(!AccountData) return res.json({error:'Аккаунт не найден', status:'error'});

	AccountData.gradient.fromA = data.fromA;
	AccountData.gradient.toA = data.toA;
	AccountData.gradient.fromB = data.fromB;
	AccountData.gradient.toB = data.toB;
	AccountData.gradient.prefix = data.prefix.substring(0, 20);

	AccountData.markModified('gradient');
	await AccountData.save();

	res.json({status:'ok'});
}));
router.all('/profile', vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=profile');
	res.render("settings/profile.ejs", {cdn_host});
}));
router.get('/sessions', vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=sessions');
	res.render("settings/sessions.ejs", {cdn_host});
}));
router.get('/trade', vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=trade');
	res.render("settings/trade.ejs", {cdn_host});
}));
(async()=>{
const mongoose = require("mongoose");
const systems = new mongoose.Schema({
    category: { type: String },
    name: { type: String },
    uptime: { type: Number },
    date: { type: Number },
    processes: { type: Number },
    cpus: { type: Array },
    memory: { type: Object },
    disks: { type: Array },
    network: { type: Array },
});
const categories = ['SCPSL', 'Modules', 'vpn']
router.get('/system', async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=system');
	if(req.bs.data.user.id != 1) return next();
	try{
		const conn = await mongoose.createConnection(config.mongoSystem).asPromise();
		if(conn == null) return;
		let arr_data = [];
		const collects = await conn.db.listCollections().toArray();
		for (let i = 0; i < collects.length; i++) {
			const collect_name = collects[i].name;
			const model = conn.model(collect_name, systems);
			const sysdata = await model.find();
			for (let ii = 0; ii < sysdata.length; ii++) {
				const sys = sysdata[ii];
				for (let iii = 0; iii < sys.disks.length; iii++) {
					const disk = sys.disks[iii];
					disk.name = disk.name.replaceAll('"', "");
				}
			}
			try{
				arr_data.push({
					category: sysdata[sysdata.length - 1].category,
					ip: collect_name,
					data: sysdata,
				});
			}catch{}
		}
		let arr2 = [];
		for (let i = 0; i < categories.length; i++) {
			const ct = categories[i];
			arr2.push(...arr_data.filter(x => x.category == ct));
			arr_data = arr_data.filter(x => x.category != ct);
		}
		arr2.push(...arr_data);
		try{res.render("system/index.ejs", {sysdata:arr2, cdn_host, prettyMs: require('pretty-ms')});}catch{}
		await conn.destroy(true);
	}catch(err){
        res.status(500).render("errors/500.ejs", {cdn_host});
        //const { Webhook } = require('discord-webhook-node');
        //const hook = new Webhook("");
        //hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
        console.log(err);
	}
});
/*
let conn;
let model;
router.get('/system', async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=system');
	if(req.bs.data.user.id != 1) return next();
	if(conn == null) conn = mongoose.createConnection(config.mongoSystem);
	if(model == null){
		if(conn == null) return;
		model = conn.model("system-stats", systems);
	}
	const sysdata = await model.find();
	res.render("system/index.ejs", {sysdata, cdn_host, prettyMs: require('pretty-ms')});
});
*/
})();
router.get('/locations', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth');
	if(req.bs.data.user.id != 1) return next();
	res.render("system/locations.ejs", {cdn_host});
}));
router.get('/servers_map', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth');
	if(req.bs.data.user.id != 1) return next();
	res.render("system/servers_map.ejs", {cdn_host});
}));
router.get('/locations/latest', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth');
	if(req.bs.data.user.id != 1) return next();
	res.render("system/latest_locations.ejs", {cdn_host});
}));

const cp = require('node:child_process');
router.get('/servers_map/get', vhost(host, async(req, res, next) => {
	const servers = cp.execSync('curl https://backend.scplist.kr/api/map');
	res.send(servers);
}));

router.get('/signup', (req, res) => res.redirect('/auth'));
router.get('/login', (req, res) => res.redirect('/auth'));

router.get('/discord', (req, res) => res.redirect(`https://${config.dashboard.connect}/discord`));
router.get('/steam', (req, res) => res.redirect(`https://${config.dashboard.connect}/steam`));

router.get('/status', (req, res) => res.redirect('https://status.scpsl.shop'));

module.exports = router;