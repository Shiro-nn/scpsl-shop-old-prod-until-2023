const vhost = require('vhost');
const express = require("express"),
router = express.Router();
const Roles = require('./modules/DonateRoles');
const Servers = require('./modules/DonateServers');
const accountsData = require("../../base/accounts");
const DonatesData = require("../../base/donate");
const RolesData = require("../../base/roles");
const config = require("../../config");
const cdn_host = config.dashboard.cdn;

router.get('/donate', async(req, res) => {
	//if (req.bs.data.user == null) return res.redirect(`/auth?redirect=donate/roles`);
	const servers = Servers.GetAll();
	res.render("donate/roles.ejs", {cdn_host, servers});
});
router.get('/donate/ra', async(req, res) => {
	if (req.bs.data.user == null) return res.redirect(`/auth?redirect=donate/ra`);
	const servers = Servers.GetAll();
	res.render("donate/ra.ejs", {cdn_host, servers});
});
router.get('/donate/customize', async(req, res) => {
	if (req.bs.data.user == null) return res.redirect(`/auth?redirect=donate/customize`);
	res.render("donate/customize.ejs", {cdn_host});
});
router.get('/donate/visual', async(req, res) => {
	if (req.bs.data.user == null) return res.redirect(`/auth?redirect=donate/visual`);
	res.render("donate/visual.ejs", {cdn_host});
});
router.get('/donate/manage', async(req, res, next) => {
	if (req.bs.data.user == null) return res.redirect(`/auth?redirect=donate/manage`);
	if(req.bs.data.user.id != 1) return next();
	const DonateData = await DonatesData.find();
	const RoleData = await RolesData.find();
	const allData = await accountsData.find();
	res.render("donate/control.ejs", {
		adata: allData,
		ddata: DonateData,
		rdata: RoleData,
		cdn_host, Servers, Roles: Roles.roles
	});
});

router.post('/donate/get/roles', async(req, res) => {
	//if (req.bs.data.user == null) return res.json({discount: 0, roles: []});
	res.json(Roles);
});

router.get('/donate/roles', (req, res) => res.redirect('/donate'));

module.exports = router;