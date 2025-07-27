const vhost = require('vhost');
const express = require("express"),
router = express.Router();
const AdminsModule = require('./modules/admins');
const adminsData = require("../../base/admins");
const config = require("../../config");
const host = config.dashboard.baseURL;
const cdn_host = config.dashboard.cdn;

router.get('/admins', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=admins');
	const adminData = await adminsData.findOne({id: req.bs.data.user.id});
	if(!adminData) return next();
	if(!AdminsModule.ItsSlAdmin(adminData)) return next();
	res.render("settings/admins/adm.ejs", {
		cdn_host, aid: 1
	});
}));
router.get('/admins/sl', vhost(host, async(req, res, next) => {
	res.redirect('/admins');
}));
router.get('/admins/sl/stats', vhost(host, async(req, res, next) => {
	res.redirect('/admins');
}));
router.get('/admins/sl/list', vhost(host, async(req, res, next) => {
	res.redirect('/admins');
}));

module.exports = router;