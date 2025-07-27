const express = require("express"),
router = express.Router();
const vhost = require('vhost');
let accountsData = require("../../base/accounts");
let stylesData = require("../../base/styles");
let countsData = require("../../base/counts");
const config = require("../../config");
const host = config.dashboard.baseURL;
const cdn_host = config.dashboard.cdn;

router.get('/css/custom_style', vhost(host, async(req, res) => {
    if(req.query.style !== null && req.query.style !== undefined){
        let styleData = await stylesData.findOne({ link: req.query.style });
        res.send(styleData.code)
    }else{
        if (req.bs.data.user == null) return res.send('');
        if (req.bs.data.user.style == 0) return res.send('');
        let styleData = await stylesData.findOne({ id: req.bs.data.user.style });
        if(styleData === null || styleData === undefined) return res.send('');
        res.send(styleData.code);
        //res.format({'text/css': async function(){
        //}})
    }
}));
router.get('/css/custom_style_get.css', vhost(host, async(req, res) => {
    res.format({'text/css': async function(){
        if(req.query.style !== null && req.query.style !== undefined){
            let styleData = await stylesData.findOne({ link: req.query.style });
            res.send(styleData.code)
        }else{
            if (req.bs.data.user == null) return res.send('');
            if (req.bs.data.user.style == 0) return res.send('');
            let styleData = await stylesData.findOne({ id: req.bs.data.user.style });
            if(styleData === null || styleData === undefined) return res.send('');
            res.send(styleData.code);
        }
    }})
}));

router.get('/style', vhost(host, async(req, res) => {
	if (req.bs.data.user != null) return res.render("style/all.ejs", {my : false, cdn_host});
    const styleData = await stylesData.find({ public: true, link_access: true });
    res.render("style/frame.ejs", {sdata : styleData, cdn_host});
}));
router.get('/style/my', vhost(host, async(req, res) => {
	if (req.bs.data.user == null) return res.redirect('/auth?redirect=style/my');
    res.render("style/all.ejs", {my : true, cdn_host});
}));
router.get('/style/frame', vhost(host, async(req, res) => {
	let styleData = await stylesData.find({public: true, link_access: true});
    res.render("style/frame.ejs", {sdata : styleData, cdn_host});
}));
router.get('/style/frame/my', vhost(host, async(req, res) => {
	if (req.bs.data.user == null) return res.redirect('/auth?redirect=style/frame/my');
    const styleData = await stylesData.find({author: req.bs.data.user.id});
    res.render("style/frame.ejs", {sdata : styleData, cdn_host});
}));
router.get('/style/see/:themeID', vhost(host, async(req, res) => {
    const styleData = await stylesData.findOne({ link: req.params.themeID });
    if(styleData === null || styleData === undefined) return res.redirect('/style/frame');
    if(!(styleData.link_access || styleData.author === req.bs.data.user?.id)) return res.redirect('/style/frame');
    const ownerData = await accountsData.findOne({user: styleData.author});
    styleData.views++;
    await styleData.save();
    res.render("style/see.ejs", {sdata:styleData, odata:ownerData, cdn_host});
}));

router.post('/style/see/:themeID', vhost(host, async(req, res) => {
    if(req.bs.data.user == null) return res.redirect(`/style/see/${req.params.themeID}`);
    const styleData = await stylesData.findOne({link: req.params.themeID});
    if(styleData === null || styleData === undefined) return res.redirect('/style/frame');
    if(!(styleData.link_access || styleData.author === req.bs.data.user.id)) return res.redirect('/style/frame');
    if(!(req.body.comment === 'comment' && req.body.description !== '')) return res.redirect(`/style/see/${req.params.themeID}`);
    let id = styleData.comments.length++;
    styleData.comments.push({
        id: id,
        userid: req.bs.data.user.id,
        time: Date.now(),
        desc: req.body.description,
    });
    styleData.markModified('comments');
    await styleData.save();
    res.redirect(`/style/see/${req.params.themeID}`);
}));

router.get('/style/add/:themeID', vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.redirect(`/auth?redirect=style/add/${req.params.themeID}`);
    let styleData = await stylesData.findOne({link: req.params.themeID});
    if(styleData === null || styleData === undefined) return res.redirect('/style/frame');
    if(!(styleData.link_access || styleData.author === req.bs.data.user.id)) return res.redirect('/style/frame');
    req.bs.data.user.style = styleData.id;
    await req.bs.save();
    const userData = await accountsData.findOne({user: req.bs.data.user.user});
    userData.style = styleData.id;
    styleData.use++;
    await userData.save();
    await styleData.save();
    res.redirect(`/style/see/${req.params.themeID}`);
}));


router.get('/style/edit/:themeID', vhost(host, async(req, res) => {
    if(req.bs.data.user == null) return res.redirect(`/auth?redirect=style/edit/${req.params.themeID}`);
    const styleData = await stylesData.findOne({ link: req.params.themeID });
    if(styleData === null || styleData === undefined) return res.redirect('/style/frame');
    if(styleData.author != req.bs.data.user.id) return res.redirect('/style/frame');
    res.render("style/edit.ejs", {sdata: styleData, cdn_host});
}));
router.post('/style/edit/:themeID', vhost(host, async(req, res) => {
	if(req.bs.data.user == null) return res.status(200).send(`/auth?redirect=style/edit/${req.params.themeID}`);
    const styleData = await stylesData.findOne({link: req.params.themeID});
    if(styleData === null || styleData === undefined) return res.status(200).send('/style/frame');
    if(styleData.author != req.bs.data.user.id) return res.status(200).send(`/style/see/${styleData.link}`);
    try{
        let data = req.body;
        styleData.desc = data.desc.trim();
        styleData.public = data.public_access;
        styleData.link_access = data.link_access
        styleData.code = data.code.trim();
        styleData.imgs = data.imgs;
        await styleData.save();
        res.status(200).send(`/style/see/${styleData.link}`);
    }catch{res.status(200).send(`/style/see/${styleData.link}`)}
}));

router.get('/style/create', vhost(host, async(req, res) => {
    if(req.bs.data.user == null) return res.redirect('/auth?redirect=style/create');
    res.render("style/create.ejs", {cdn_host});
}));
router.post('/style/create', vhost(host, async(req, res) => {
    if(req.bs.data.user == null) return res.redirect('/auth?redirect=style/create');
    let data = req.body;
    if(data == null || data == undefined || data.name == undefined || data.desc == undefined || data.public_access == undefined ||
        data.link_access == undefined || data.code == undefined || data.imgs == undefined) return res.status(200).send('/style/create');
    const userData = await accountsData.findOne({ user: req.bs.data.user.user });
    if(userData.achievements.filter(x => x == 'style').length < 1){
        userData.achievements.push('style');
        await userData.save();
    }
    let counts = await countsData.findOne();
    if(counts === null || counts === undefined) counts = new countsData();
    counts.styles++;
    await counts.save();
    let styleData = new stylesData({id:counts.styles});
    styleData.author = userData.id;
    styleData.name = data.name.trim();
    styleData.desc = data.desc.trim();
    styleData.public = data.public_access;
    styleData.link_access = data.link_access
    styleData.code = data.code.trim();
    styleData.imgs = data.imgs;
    let link = guid();
    var save_interval = setInterval(async() => {
        let sData = await stylesData.findOne({ link: link });
        if(sData === null || sData === undefined){
            styleData.link = link;
            await styleData.save();
            res.status(200).send(`/style/see/${link}`);
            clearInterval(save_interval);
        }
    }, 100);
}));
const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});}
module.exports = router;