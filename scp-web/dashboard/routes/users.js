const express = require("express"),
router = express.Router();
const vhost = require('vhost');
let accountsData = require("../../base/accounts");
const config = require("../../config");
const host = config.dashboard.baseURL;
const cdn_host = config.dashboard.cdn;
router.get('/users', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect('/auth?redirect=users');
	if(req.bs.data.user.id != 1) return next();
	let users = await accountsData.find();
	res.render("users/load.ejs", {users, cdn_host});
}));
router.get('/users/:UserID', vhost(host, async(req, res, next) => {
	if(req.bs.data.user == null) return res.redirect(`/auth?redirect=users/${req.params.UserID}`);
	if(req.bs.data.user.id != 1) return next();
	res.render("users/user.ejs", {uid:req.params.UserID, cdn_host});
}));
module.exports = router;