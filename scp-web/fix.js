const mongoose = require( "mongoose" );
const accounts = require( "./base/accounts" );
const achievements = require( "./base/achievements" );
const boosts = require( "./base/boosts" );
const clans = require( "./base/clans" );
const styles = require( "./base/styles" );
const emojis = require( "./base/emoji" );

const config = require("./config");

mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(async() => {
	console.log("Connected to the Mongodb database.", "log");
	const users = await accounts.find({});
	for (const user of await users) {
		user.avatar = user.avatar.replace('scpsl.shop', '.ru');
		user.banner = user.banner.replace('scpsl.shop', '.ru');
		console.log('saving', user.user);
		await user.save();
		console.log('saved', user.user);
	}

	const acvh = await achievements.find({});
	for (const achievement of await acvh) {
		achievement.img = achievement.img.replace('scpsl.shop', '.ru');
		console.log('saving', achievement.desc);
		await achievement.save();
		console.log('saved', achievement.desc);
	}

	const bsts = await boosts.find({});
	for (const boost of await bsts) {
		boost.img = boost.img.replace('scpsl.shop', '.ru');
		console.log('saving', boost.name);
		await boost.save();
		console.log('saved', boost.name);
	}

	const clns = await clans.find({});
	for (const clan of await clns) {
		clan.img = clan.img.replace('scpsl.shop', '.ru');
		console.log('saving', clan.name);
		await clan.save();
		console.log('saved', clan.name);
	}

	const stls = await styles.find({});
	for (const style of await stls) {
		style.code = style.code.replace('scpsl.shop', '.ru');
		for (let img in style.imgs)
			style.imgs[img] = style.imgs[img].replace('scpsl.shop', '.ru');
		style.markModified('imgs');
		console.log('saving', style.name);
		await style.save();
		console.log('saved', style.name);
	}

	const emjs = await emojis.find({});
	for (const emoji of await emjs) {
		emoji.url = emoji.url.replace('scpsl.shop', '.ru');
		console.log('saving', emoji.name);
		await emoji.save();
		console.log('saved', emoji.name);
	}
}).catch((err) => {
	console.log(err)
});