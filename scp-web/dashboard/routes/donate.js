const Mails = require('./modules/mails/Manager');
const vhost = require('vhost');
const accountsData = require("../../base/accounts");
const DonatesData = require("../../base/donate");
const CustomizesData = require("../../base/customize");
const VisualData = require('../../base/visuals');
const RolesData = require("../../base/roles");
const pomocodesData = require("../../base/promo_codes");
const config = require("../../config");
const host = config.dashboard.baseURL;
const express = require("express"),
router = express.Router();
const Servers = require('./modules/DonateServers');
const Roles = require('./modules/DonateRoles');
const io = require("socket.io-client");
const socket = io(config.dashboard.socketio, { path: '/main/', secure: true, rejectUnauthorized: false });

router.post('/donate/buy/roles', vhost(host, async(req, res) => {//id mounth
	if (req.bs.data.user == null) {
		res.status(400).json({message:'login'});
		return;
	}

	const data = req.body;
	const donate = Roles.roles.find(x => x.id == parseInt(data.id));

	if(!donate) {
		res.status(401).json({message:"id"});
		return;
	}
	
	if (data.mounth != 1 && data.mounth != 3 && data.mounth != 6) {
		res.status(401).json({message:"mounth"});
		return;
	}

	const server = donate.allServers ? -1 : 1;

    const defaultDiscount = Math.floor(donate.sum * (Roles.discount / 100));
    const roleSum = Math.floor(donate.sum - defaultDiscount);
	let sum = roleSum;

	switch (data.mounth) {
		case 3: {
			const month = 3;
			const role_sum_x = roleSum * month;
			sum = Math.floor(role_sum_x - (role_sum_x * 0.05));
			break;
		}
		case 6: {
			const month = 6;
			const role_sum_x = roleSum * month;
			sum = Math.floor(role_sum_x - (role_sum_x * 0.1));
			break;
		}
	}

	const userData = await accountsData.findOne({ user: req.bs.data.user.user });
	if(userData.balance < sum) {
		res.status(401).json({ message:'money', sum: (sum-userData.balance) });
		return;
	}

	userData.balance -= sum;
	await userData.save();

	const dur = (1000 * 60 * 60 * 24 * 30 * data.mounth);
	const role = new RolesData({
		owner:userData.id,
		sum,
		id:donate.id,
		expires:Date.now() + dur,
		server,
		freeze_available: dur
	});
	await role.save();

	Mails.donates.role(userData, donate.name, donate.color, sum, Servers.GetById(server));
	res.status(200).json({message:'ok'});

	socket.emit('SendToSCPChangeRoleStatus', role);
}));

router.post('/donate/buy/ra', vhost(host, async(req, res) => {
	if (req.bs.data.user == null) return res.status(400).json({message:'login'});
	const data = req.body;
	const server = parseInt(data.server);
	let sum = 0;
	let promo = 0;
	let promo_use = false;
	if(data.ra_open) sum += 25;
	if(data.force) sum += 100;
	if(data.give) sum += 100;
	if(data.effects) sum += 200;
	if(data.players_roles) sum += 50;
	let promoData = await pomocodesData.findOne({ code: data.promocode.toLowerCase() });
	if(promoData != null && promoData != undefined && promoData.owner != req.bs.data.user.user){
		sum = Math.round((sum/100)*(100 - promoData.to_user));promo_use=true;promo = Math.floor((sum/100)*promoData.to_owner);
	}
	if(!Servers.Includes(server)) return res.status(401).json({message:'server'});
	let userData = await accountsData.findOne({ user: req.bs.data.user.user });
	if(userData.balance < sum) return res.status(401).json({message:'money',sum:(sum-userData.balance)});
	const ub = userData.balance;
	userData.balance = ub - sum;
	let DonateData = new DonatesData();
	DonateData.to = GetDateTime();
	DonateData.sum = sum;
	DonateData.promo = promo;
	DonateData.owner = userData.user;
	DonateData.force = data.force;
	DonateData.give = data.give;
	DonateData.effects = data.effects;
	DonateData.players_roles = data.players_roles;
	DonateData.prefix = data.prefix;
	DonateData.color = data.color;
	DonateData.server = server;
	await DonateData.save();
	await userData.save();
	if(promo_use){
		let promoOwnerData = await accountsData.findOne({ user: promoData.owner });
		if(promoOwnerData != null && promoOwnerData != undefined){
			const pob = promoOwnerData.balance;
			promoOwnerData.balance = pob + Math.floor((sum/100)*promoData.to_owner);
			await promoOwnerData.save();
		}
	}
	res.send('ok');
	Mails.donates.ra(userData, DonateData, sum);
}));
router.post('/donate/buy/customize', vhost(host, async(req, res) => {
	if (req.bs.data.user == null) return res.redirect(`/auth?redirect=donate/customize`);
	const data = req.body;
	if(data.genetics == null || data.genetics == undefined) return res.status(401).send('data');
	if(data.scales == null || data.scales == undefined) return res.status(401).send('data');
	const userData = await accountsData.findOne({ user: req.bs.data.user.user });
	let CustomizeData = await CustomizesData.findOne({owner:userData.user});
	if(CustomizeData == null || CustomizeData == undefined) CustomizeData = new CustomizesData({to:Date.now(), owner:userData.user});
	if(!CustomizeData.active){
		const _data = UpdateData();
		CustomizeData.sum = _data.sum;
		CustomizeData.scales = _data.scales;
		CustomizeData.genetics = _data.genetics;
		const sum = GetSum(CustomizeData.sum);
		if(userData.balance < sum) return res.status(401).json({message:'money', sum:(sum-userData.balance)});
		const ub = userData.balance;
		userData.balance = Math.ceil(ub - sum);
		CustomizeData.to = Date.now() + (1000 * 60 * 60 * 24 * 30);
		CustomizeData.active = true;
		await userData.save();
		CustomizeData.markModified("sum");
		CustomizeData.markModified("scales");
		CustomizeData.markModified("genetics");
		await CustomizeData.save();
		Mails.donates.customize(userData, Math.ceil(sum), CustomizeData.to);
	}else{
		const _data = UpdateData();
		if(Changed(CustomizeData, _data)){
			let __sum = GetSum(_data.sum) - GetSum(CustomizeData.sum);
			if(__sum < 0) __sum = 0;
			else if(__sum > 0) {
				const time_difference = (CustomizeData.to - Date.now()) / (1000 * 60 * 60 * 24 * 30);
				__sum = __sum * time_difference;
				if(userData.balance < __sum) return res.status(401).json({message:'money',sum:(__sum-userData.balance)});
				const ub = userData.balance;
				userData.balance = Math.ceil(ub - __sum);
				await userData.save();
				Mails.donates.customize(userData, Math.ceil(__sum), CustomizeData.to);
			}
			CustomizeData.sum = _data.sum;
			CustomizeData.scales = _data.scales;
			CustomizeData.genetics = _data.genetics;
			CustomizeData.markModified("sum");
			CustomizeData.markModified("scales");
			CustomizeData.markModified("genetics");
			await CustomizeData.save();
		}else{
			const sum = GetSum(CustomizeData.sum);
			if(userData.balance < sum) return res.status(401).json({message:'money', sum:(sum-userData.balance)});
			const ub = userData.balance;
			userData.balance = Math.ceil(ub - sum);
			await userData.save();
			CustomizeData.to = CustomizeData.to + (1000 * 60 * 60 * 24 * 30);
			await CustomizeData.save();
			Mails.donates.customize(userData, Math.ceil(sum), CustomizeData.to);
		}
	}
	res.send('ok');
	function UpdateData() {
		let CustomizeData = {
			sum:{
				ClassD: 0,
				Scientist: 0,
				Guard: 0,
				Mtf: 0,
				Chaos: 0,
				Serpents: 0,
			},
			scales:{
				ClassD: 100,
				Scientist: 100,
				Guard: 100,
				Mtf: 100,
				Chaos: 100,
				Serpents: 100,
			},
			genetics:{
				ClassD: {
					adrenaline_compatible: false,
					adrenaline_rush: false,
					native_armor: false,
				},
				Scientist: {
					adrenaline_compatible: false,
					adrenaline_rush: false,
					native_armor: false,
				},
				Guard: {
					adrenaline_compatible: false,
					adrenaline_rush: false,
					native_armor: false,
				},
				Mtf: {
					adrenaline_compatible: false,
					adrenaline_rush: false,
					native_armor: false,
				},
				Chaos: {
					adrenaline_compatible: false,
					adrenaline_rush: false,
					native_armor: false,
				},
				Serpents: {
					adrenaline_compatible: false,
					adrenaline_rush: false,
					native_armor: false,
				},
			},
		}
		{
			const data = UpdateSum(0);
			CustomizeData.sum.ClassD = data.sum;
			CustomizeData.scales.ClassD = data.scale;
			CustomizeData.genetics.ClassD = data.genes;
		}
		{
			const data = UpdateSum(1);
			CustomizeData.sum.Scientist = data.sum;
			CustomizeData.scales.Scientist = data.scale;
			CustomizeData.genetics.Scientist = data.genes;
		}
		{
			const data = UpdateSum(2);
			CustomizeData.sum.Guard = data.sum;
			CustomizeData.scales.Guard = data.scale;
			CustomizeData.genetics.Guard = data.genes;
		}
		{
			const data = UpdateSum(3);
			CustomizeData.sum.Mtf = data.sum;
			CustomizeData.scales.Mtf = data.scale;
			CustomizeData.genetics.Mtf = data.genes;
		}
		{
			const data = UpdateSum(4);
			CustomizeData.sum.Chaos = data.sum;
			CustomizeData.scales.Chaos = data.scale;
			CustomizeData.genetics.Chaos = data.genes;
		}
		{
			const data = UpdateSum(5);
			CustomizeData.sum.Serpents = data.sum;
			CustomizeData.scales.Serpents = data.scale;
			CustomizeData.genetics.Serpents = data.genes;
		}
		return CustomizeData;
	}
	function GetSum(sum) {
		return sum.ClassD+sum.Scientist+sum.Guard+sum.Mtf+sum.Chaos+sum.Serpents
	}
	function UpdateSum(type) {
		let do_sum = 0;
		const do_scale = GetScale(type);
		if(do_scale > 100) do_sum = (do_scale - 100)*3;
		else if(do_scale < 100) do_sum = (100 - do_scale)*4;
		const gens_data = GetGenes(type);
		if(gens_data.adrenaline_compatible) do_sum += 150;
		if(gens_data.adrenaline_rush) do_sum += 150;
		if(gens_data.native_armor) do_sum += 125;
		return {sum:do_sum, scale:do_scale, genes:gens_data};
	}
	function GetGenes(type) {
		try{
			if(type == 0) return {
				adrenaline_compatible: data.genetics.ClassD.adrenaline_compatible,
				adrenaline_rush: data.genetics.ClassD.adrenaline_rush,
				native_armor: data.genetics.ClassD.native_armor,
			};
			if(type == 1) return {
				adrenaline_compatible: data.genetics.Scientist.adrenaline_compatible,
				adrenaline_rush: data.genetics.Scientist.adrenaline_rush,
				native_armor: data.genetics.Scientist.native_armor,
			};
			if(type == 2) return {
				adrenaline_compatible: data.genetics.Guard.adrenaline_compatible,
				adrenaline_rush: data.genetics.Guard.adrenaline_rush,
				native_armor: data.genetics.Guard.native_armor,
			};
			if(type == 3) return {
				adrenaline_compatible: data.genetics.Mtf.adrenaline_compatible,
				adrenaline_rush: data.genetics.Mtf.adrenaline_rush,
				native_armor: data.genetics.Mtf.native_armor,
			};
			if(type == 4) return {
				adrenaline_compatible: data.genetics.Chaos.adrenaline_compatible,
				adrenaline_rush: data.genetics.Chaos.adrenaline_rush,
				native_armor: data.genetics.Chaos.native_armor,
			};
			if(type == 5) return {
				adrenaline_compatible: data.genetics.Serpents.adrenaline_compatible,
				adrenaline_rush: data.genetics.Serpents.adrenaline_rush,
				native_armor: data.genetics.Serpents.native_armor,
			};
		}catch{}
		return {
			adrenaline_compatible: false,
			adrenaline_rush: false,
			native_armor: false,
		};
	}
	function GetScale(type) {
		let dodata = DoGet();
		if(isNaN(dodata)) dodata = 100;
		else if(dodata < 85) dodata = 85;
		else if(dodata > 115) dodata = 115;
		return dodata;
		function DoGet() {
			if(type == 0) return parseInt(data.scales.ClassD);
			if(type == 1) return parseInt(data.scales.Scientist);
			if(type == 2) return parseInt(data.scales.Guard);
			if(type == 3) return parseInt(data.scales.Mtf);
			if(type == 4) return parseInt(data.scales.Chaos);
			if(type == 5) return parseInt(data.scales.Serpents);
			return 100;
		}
	}
	function Changed(vanilla_data, new_data) {
		if(vanilla_data.scales.ClassD != new_data.scales.ClassD) return true;
		if(vanilla_data.scales.Scientist != new_data.scales.Scientist) return true;
		if(vanilla_data.scales.Guard != new_data.scales.Guard) return true;
		if(vanilla_data.scales.Mtf != new_data.scales.Mtf) return true;
		if(vanilla_data.scales.Chaos != new_data.scales.Chaos) return true;
		if(vanilla_data.scales.Serpents != new_data.scales.Serpents) return true;
		
		if(vanilla_data.genetics.ClassD.adrenaline_compatible != new_data.genetics.ClassD.adrenaline_compatible) return true;
		if(vanilla_data.genetics.Scientist.adrenaline_compatible != new_data.genetics.Scientist.adrenaline_compatible) return true;
		if(vanilla_data.genetics.Guard.adrenaline_compatible != new_data.genetics.Guard.adrenaline_compatible) return true;
		if(vanilla_data.genetics.Mtf.adrenaline_compatible != new_data.genetics.Mtf.adrenaline_compatible) return true;
		if(vanilla_data.genetics.Chaos.adrenaline_compatible != new_data.genetics.Chaos.adrenaline_compatible) return true;
		if(vanilla_data.genetics.Serpents.adrenaline_compatible != new_data.genetics.Serpents.adrenaline_compatible) return true;
		
		if(vanilla_data.genetics.ClassD.adrenaline_rush != new_data.genetics.ClassD.adrenaline_rush) return true;
		if(vanilla_data.genetics.Scientist.adrenaline_rush != new_data.genetics.Scientist.adrenaline_rush) return true;
		if(vanilla_data.genetics.Guard.adrenaline_rush != new_data.genetics.Guard.adrenaline_rush) return true;
		if(vanilla_data.genetics.Mtf.adrenaline_rush != new_data.genetics.Mtf.adrenaline_rush) return true;
		if(vanilla_data.genetics.Chaos.adrenaline_rush != new_data.genetics.Chaos.adrenaline_rush) return true;
		if(vanilla_data.genetics.Serpents.adrenaline_rush != new_data.genetics.Serpents.adrenaline_rush) return true;
		
		if(vanilla_data.genetics.ClassD.native_armor != new_data.genetics.ClassD.native_armor) return true;
		if(vanilla_data.genetics.Scientist.native_armor != new_data.genetics.Scientist.native_armor) return true;
		if(vanilla_data.genetics.Guard.native_armor != new_data.genetics.Guard.native_armor) return true;
		if(vanilla_data.genetics.Mtf.native_armor != new_data.genetics.Mtf.native_armor) return true;
		if(vanilla_data.genetics.Chaos.native_armor != new_data.genetics.Chaos.native_armor) return true;
		if(vanilla_data.genetics.Serpents.native_armor != new_data.genetics.Serpents.native_armor) return true;
		
		return false;
	}
}));
router.post('/donate/buy/visual', async(req, res) => {
	if (req.bs.data.user == null) return res.status(400).json({error: true, message: 'Вы неавторизованы'});
	const data = req.body;
	if(!data || !data.root || !data.ClassD || !data.Scientist || !data.Guard || !data.MTF || !data.Chaos || !data.Hand) return res.status(401).json({error: true, message: 'Неверно переданы данные'});
	const userData = await accountsData.findOne({ user: req.bs.data.user.user });
	if(!userData) return res.status(400).json({error: true, message: 'Аккаунт не найден'});
	let _visual = await VisualData.findOne({owner:userData.id});
	if(!_visual) _visual = new VisualData({owner:userData.id});

	const sums = {
		nimb: 99,
		light: 75,
		doctor: 399,
		flasher: 599,
	}
	let sum = 0;

	if(data.root.nimb) sum += sums.nimb;
	if(data.root.light) sum += sums.light;
	if(data.root.doctor) sum += sums.doctor;
	if(data.root.flasher) sum += sums.flasher;
	
	if(!_visual.active){
		return res.status(400).json({error: true, message: 'Покупка визуала отключена'});
		if(userData.balance < sum) return res.status(400).json({error: true, message: `Недостаточно баланса на аккаунте (${userData.balance}/${sum}₽)`});
		_visual.root.nimb = data.root.nimb ?? false;
		_visual.root.light = data.root.light ?? false;
		_visual.root.doctor = data.root.doctor ?? false;
		_visual.root.flasher = data.root.flasher ?? false;

		SubUpdate(_visual.ClassD, data.ClassD);
		SubUpdate(_visual.Scientist, data.Scientist);
		SubUpdate(_visual.Guard, data.Guard);
		SubUpdate(_visual.MTF, data.MTF);
		SubUpdate(_visual.Chaos, data.Chaos);
		SubUpdate(_visual.Hand, data.Hand);

		_visual.sum = sum;
		_visual.active = true;
		_visual.expires = Date.now() + 2592000000; // (1000 * 60 * 60 * 24 * 30)

		userData.balance -= sum;
		await userData.save();

		_visual.markModified('root');
		_visual.markModified('ClassD');
		_visual.markModified('Scientist');
		_visual.markModified('Guard');
		_visual.markModified('MTF');
		_visual.markModified('Chaos');
		_visual.markModified('Hand');
		await _visual.save();

		res.json({error: false, data: _visual, type: `приобретен за ${sum}₽`});
		Mails.donates.visual(userData, Math.ceil(sum), _visual.expires, 'Активирован (Приобретен)');
		return;
	}

	if(_visual.root.doctor != data.root.doctor ||
	_visual.root.flasher != data.root.flasher ||
	_visual.root.light != data.root.light ||
	_visual.root.nimb != data.root.nimb){
		let nsum = sum - _visual.sum;
		if(nsum < 0) nsum = 0;
		const cf = (_visual.expires - Date.now()) / (1000 * 60 * 60 * 24 * 30);
		nsum = Math.ceil(nsum * cf);
		if(userData.balance < nsum) return res.status(400).json({error: true, message: `Недостаточно баланса на аккаунте (${userData.balance}/${nsum}₽)`});

		_visual.root.nimb = data.root.nimb ?? false;
		_visual.root.light = data.root.light ?? false;
		_visual.root.doctor = data.root.doctor ?? false;
		_visual.root.flasher = data.root.flasher ?? false;
	
		SubUpdate(_visual.ClassD, data.ClassD);
		SubUpdate(_visual.Scientist, data.Scientist);
		SubUpdate(_visual.Guard, data.Guard);
		SubUpdate(_visual.MTF, data.MTF);
		SubUpdate(_visual.Chaos, data.Chaos);
		SubUpdate(_visual.Hand, data.Hand);
	
		_visual.sum = sum;
	
		userData.balance -= nsum;
		await userData.save();

		_visual.markModified('root');
		_visual.markModified('ClassD');
		_visual.markModified('Scientist');
		_visual.markModified('Guard');
		_visual.markModified('MTF');
		_visual.markModified('Chaos');
		_visual.markModified('Hand');
		await _visual.save();
	
		res.json({error: false, data: _visual, type: `обновлен за ${nsum}₽`});
		if(nsum > 0) Mails.donates.visual(userData, Math.ceil(nsum), _visual.expires, 'Докуплен');
		else Mails.donates.visual(userData, Math.ceil(nsum), _visual.expires, 'Убран один из элементов');
		return;
	}
	
	if(AnotherSub(_visual.Chaos, data.Chaos) ||
		AnotherSub(_visual.Chaos, data.Chaos) ||
		AnotherSub(_visual.ClassD, data.ClassD) ||
		AnotherSub(_visual.Guard, data.Guard) ||
		AnotherSub(_visual.Hand, data.Hand) ||
		AnotherSub(_visual.MTF, data.MTF) ||
		AnotherSub(_visual.Scientist, data.Scientist)){
			SubUpdate(_visual.ClassD, data.ClassD);
			SubUpdate(_visual.Scientist, data.Scientist);
			SubUpdate(_visual.Guard, data.Guard);
			SubUpdate(_visual.MTF, data.MTF);
			SubUpdate(_visual.Chaos, data.Chaos);
			SubUpdate(_visual.Hand, data.Hand);

			_visual.markModified('ClassD');
			_visual.markModified('Scientist');
			_visual.markModified('Guard');
			_visual.markModified('MTF');
			_visual.markModified('Chaos');
			_visual.markModified('Hand');
			await _visual.save();

			return res.json({error: false, data: _visual, type: 'изменен'});
	}
	
	if(_visual.sum != sum) return res.status(400).json({error: true, message: 'Что-то пошло не так; Разница в стоимости определилась неверно'});
	if(userData.balance < sum) return res.status(400).json({error: true, message: `Недостаточно баланса на аккаунте (${userData.balance}/${sum}₽)`});
	if(sum == 0) return res.status(400).json({error: true, message: 'Нельзя продлить визуал, если он стоит 0₽'});

	
	return res.status(400).json({error: true, message: 'Продление визуала отключено'});
	
	_visual.active = true;
	_visual.expires = _visual.expires + 2592000000; // (1000 * 60 * 60 * 24 * 30)

	userData.balance -= sum;
	await userData.save();
	await _visual.save();

	res.json({error: false, data: _visual, type: `продлен за ${sum}₽`});
	Mails.donates.visual(userData, Math.ceil(sum), _visual.expires, 'Продлен');
	return;
	
	function AnotherSub(latest, now) {
		if(latest.doctor != now.doctor ||
			latest.flasher != now.flasher ||
			latest.nimb != now.nimb ||
			latest.light.buy != now.light.buy ||
			latest.light.color.r != now.light.color.r ||
			latest.light.color.g != now.light.color.g ||
			latest.light.color.b != now.light.color.b)
			return true;
	}
	
	function SubUpdate(root, sub) {
		root.nimb = sub.nimb ?? false;
		if(sub.light){
			root.light.buy = sub.light.buy ?? false;
			if(sub.light.color){
				root.light.color.r = isNaN(sub.light.color.r) ? 255 : sub.light.color.r;
				root.light.color.g = isNaN(sub.light.color.g) ? 255 : sub.light.color.g;
				root.light.color.b = isNaN(sub.light.color.b) ? 255 : sub.light.color.b;
			}
		}
		root.doctor = sub.doctor ?? false;
		root.flasher = sub.flasher ?? false;
	}
});

function GetDateTime() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 2;
	var year = date.getFullYear();
	var hour = date.getHours();
	var minute = date.getMinutes();
	if (parseInt(month) == 2 && parseInt(day) > 28) {
		day = "28";
	}
	if ((parseInt(month) == 4 || parseInt(month) == 6 || parseInt(month) == 9 || parseInt(month) == 11) && parseInt(day) > 30) {
		day = "30";
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
	month = `${month}`.replaceAll('001', '01');
	var time = day + "." + month + "." + year + " " + hour + ':' + minute;
	return time;
}

module.exports = router;