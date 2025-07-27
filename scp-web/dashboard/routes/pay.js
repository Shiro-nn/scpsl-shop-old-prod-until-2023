const Mails = require('./modules/mails/Manager');
const crypto = require('crypto');
const express = require("express"),
router = express.Router();
const vhost = require('vhost');
let accountsData = require("../../base/accounts");
let paymentsData = require("../../base/payments");
const config = require("../../config");
const host = config.dashboard.baseURL;
const APIhost = config.dashboard.api;
const { Webhook } = require('discord-webhook-node');



let cachedyk = [];
router.post('/yookassa', vhost(APIhost, async(req, res) => {
	try{
		const data = req.body;

		if (data.event != 'payment.succeeded' && data.event != 'payment.waiting_for_capture') {
			res.sendStatus(403);
			return;
		}

		if (data.object.test) {
			res.sendStatus(403);
			return;
		}

		if (!data.object.paid) {
			res.sendStatus(403);
			return;
		}

		if (cachedyk.includes(data.object.id)){
			res.sendStatus(200);
			return;
		}

		const resp = await try_fetch('https://api.yookassa.ru/v3/payments/' + data.object.id, {
			headers: {
				'Authorization': 'Basic ' + config.yookassa.token,
			},
		});
		const json = await resp.json();

		if(!json.paid) {
			res.sendStatus(403);
			return;
		}

		if(json.status == 'waiting_for_capture'){
			const resp2 = await try_fetch('https://api.yookassa.ru/v3/payments/' + data.object.id + '/capture', {
				headers: {
					'Authorization': 'Basic ' + config.yookassa.token,
					'Idempotence-Key': guid()
				},
				body: JSON.stringify(json.amount)
			});
			const json2 = await resp2.json();

			if (json2.status != "succeeded"){
				res.sendStatus(403);
				return;
			}
		}

		cachedyk.push(data.object.id);

		const payment = await paymentsData.findOne({yookassa: data.object.id});
		if(!payment) {
			res.sendStatus(404);
			return;
		}

		const paidSum = parseInt(json.amount.value);
		const getSum = parseInt(json.income_amount.value);

		let sum = paidSum;

		if (payment.sum != 0 && payment.sum <= paidSum && payment.sum >= getSum) {
			sum = payment.sum;
		}
		
		const userdata = await accountsData.findOne({user: payment.user});

		userdata.balance += sum;
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();

		res.sendStatus(200);

		payment.deleteOne();
		
		let pay_type = json.payment_method.title;
		switch (json.payment_method.type) {
			case 'sbp': pay_type = 'СБП'; break;
			case 'sberbank': pay_type = 'Sber Pay'; break;
			case 'yoo_money': pay_type = 'ЮMoney'; break;
			case 'qiwi': pay_type = 'Qiwi'; break;
			case 'tinkoff_bank': pay_type = 'Tinkoff Pay'; break;
			case 'bank_card': pay_type = json.payment_method.title + ' | ' + json.payment_method.card?.issuer_name; break;
			default: pay_type = json.payment_method.type; break;
		}
		const _shopName = 'YooKassa | ' + pay_type;
		Mails.donates.balanceup(userdata, sum, _shopName);
	}catch(err){
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }

	function try_fetch(url, params) {
		try{
			return fetch(url, params);
		}catch{
			return try_fetch(url, params);
		}
	}
}));

router.post('/yoomoney', vhost(APIhost, async(req, res) => {
	try {
		const data = req.body;
		const hash1 = `${data.notification_type}&${data.operation_id}&${data.amount}&${data.currency}&${data.datetime}&${data.sender}&${data.codepro}&${config.yoomoney.secret}&${data.label}`;
		const hash = crypto.createHash('sha1').update(hash1).digest('hex');

		if (data.sha1_hash != hash) {
			res.sendStatus(403);
			return;
		}
		if (data.unaccepted == 'true') {
			res.sendStatus(403);
			return;
		}
		if (data.label == '') {
			res.sendStatus(403);
			return;
		}
		
		const payment = await paymentsData.findById(data.label);
		if (!payment) {
			res.sendStatus(403);
			return;
		}

		const paidSum = parseInt(data.withdraw_amount);
		const getSum = parseInt(data.amount);

		let sum = paidSum;

		if (payment.sum != 0 && payment.sum <= paidSum && payment.sum >= getSum) {
			sum = payment.sum;
		}

		const userdata = await accountsData.findOne({ user: payment.user });

		userdata.balance += sum;
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();

		res.sendStatus(200);

		payment.deleteOne();

		let pay_type = 'YooMoney';
		if (data.sender == '') {
			pay_type += ' | Карта';
		} else {
			pay_type += ' | Кошелек ' + data.sender.substring(0, 4) + ' ' + data.sender.substring(4, 8) + ' ' + 'XXXX' + ' ' + data.sender.substring(12, 16);
		}
		Mails.donates.balanceup(userdata, sum, pay_type);
	} catch(err) {
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }
}));

router.post('/cryptomus', vhost(APIhost, async(req, res) => {
	try {
		const sign = req.body.sign;
		delete req.body.sign;
		const data = req.body;
		
		if (crypto.createHash('md5').update(Buffer.from(JSON.stringify(data)).toString('base64') + config.cryptomus.key).digest('hex') != sign) {
			res.sendStatus(403);
			return;
		}

		if (!data.is_final) {
			res.sendStatus(403);
			return;
		}

		if (data.status != 'paid' && data.status != 'paid_over'){
			res.sendStatus(403);
			return;
		}

		if (data.order_id == '') {
			res.sendStatus(403);
			return;
		}
		
		const payment = await paymentsData.findById(data.order_id);
		if (!payment) {
			res.sendStatus(403);
			return;
		}

		let sum = parseInt(data.amount);

		const sendBody = JSON.stringify({uuid:data.uuid});
		const resp = await fetch('https://api.cryptomus.com/v1/payment/info', {
			method: 'POST',
			headers: {
				'merchant': config.cryptomus.merchant,
				'sign': crypto.createHash('md5').update(Buffer.from(sendBody).toString('base64') + config.cryptomus.key).digest('hex'),
				'Content-Type': 'application/json',
			},
			body: sendBody,
		});
		const json = await resp.json();

		if (json.state == 0 && typeof(json.result) == 'object') {
			if (!json.result.is_final){
				res.sendStatus(403);
				return;
			}

			if (json.result.status != 'paid' && json.result.status != 'paid_over'){
				res.sendStatus(403);
				return;
			}

			if (json.result.payment_amount) {
				sum = parseInt(json.result.payment_amount);
			}
		}

		const userdata = await accountsData.findOne({ user: payment.user });

		userdata.balance += sum;
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();

		try { res.sendStatus(200); } catch { }

		payment.deleteOne();

		Mails.donates.balanceup(userdata, sum, 'Cryptomus | ' + data.payer_currency);
	} catch(err) {
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }
}));

router.post('/paypalych', vhost(APIhost, async(req, res) => {
	try{
		const data = req.body;

		if (data.Status != 'SUCCESS') {
			res.sendStatus(403);
			return;
		}

		const hash = crypto.createHash('md5').update(`${data.OutSum}:${data.InvId}:${config.paypalych.token}`).digest('hex').toUpperCase();

		if (data.SignatureValue != hash) {
			res.sendStatus(403);
			return;
		}

		const preresp = await fetch('https://paypalych.com/api/v1/bill/status?id=' + data.TrsId, {
			headers: {
				'Authorization': 'Bearer ' + config.paypalych.token,
			}
		});
		const resp = await preresp.json();

		if (resp.status == 'FAIL') {
			await paymentsData.deleteOne({_id: data.InvId});
			res.sendStatus(200);
			return;
		}

		if (resp.status != 'SUCCESS') {
			res.sendStatus(403);
			return;
		}

		const payment = await paymentsData.findById(data.InvId);
		if(!payment) {
			res.sendStatus(403);
			return;
		}

		const sum = parseInt(resp.amount);
		
		const userdata = await accountsData.findOne({user: payment.user});

		userdata.balance += sum;
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();

		res.sendStatus(200);

		payment.deleteOne();

		let _shopName = 'PayPalych';

		if (data.AccountType == 'BANK_CARD') {
			_shopName += ' | Банковская карта ' + data.AccountNumber;
		}

		Mails.donates.balanceup(userdata, sum, _shopName);
	}catch(err){
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }
}));

router.post('/freekassa', vhost(APIhost, async(req, res) => {
	try{
		const data = req.body;
		if(parseInt(data.MERCHANT_ID) != config.freekassa.shop) return res.sendStatus(403);
		const hash = crypto.createHash('md5').update(`${config.freekassa.shop}:${data.AMOUNT}:${config.freekassa.private}:${data.MERCHANT_ORDER_ID}`).digest('hex');
		if(data.SIGN != hash) return res.sendStatus(403);
		const payment = await paymentsData.findById(data.MERCHANT_ORDER_ID);
		if(payment == null || payment == undefined) return res.sendStatus(403);
		const userdata = await accountsData.findOne({user: payment.user});
		userdata.balance += parseInt(data.AMOUNT);
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();
		res.status(200).send('YES');
		payment.deleteOne();
		const _shopName = 'FreeKassa | ' + ParseShop(parseInt(data.CUR_ID));
		Mails.donates.balanceup(userdata, parseInt(data.AMOUNT), _shopName);
		if(userdata.email != data.P_EMAIL){
			setTimeout(() => {
				Mails.donates.balanceup({
					email: data.P_EMAIL,
					name: '',
					user: (userdata.name == '' ? userdata.user : userdata.name),
					avatar: userdata.avatar,
					id: userdata.id,
					balance: userdata.balance
				}, parseInt(data.AMOUNT), _shopName, false);
			}, 1000);
		}
	}catch(err){
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }

	function ParseShop(id) {
		switch (id) {
			case 1: return 'FK WALLET RUB';
			case 2: return 'FK WALLET USD';
			case 3: return 'FK WALLET EUR';
			case 4: return 'VISA RUB';
			case 6: return 'Yoomoney';
			case 7: return 'VISA UAH';
			case 8: return 'MasterCard RUB';
			case 9: return 'MasterCard UAH';
			case 10: return 'Qiwi';
			case 11: return 'VISA EUR';
			case 12: return 'МИР';
			case 13: return 'Онлайн банк';
			case 14: return 'USDT (ERC20)';
			case 15: return 'USDT (TRC20)';
			case 16: return 'Bitcoin Cash';
			case 17: return 'BNB';
			case 18: return 'DASH';
			case 19: return 'Dogecoin';
			case 20: return 'ZCash';
			case 21: return 'Monero';
			case 22: return 'Waves';
			case 23: return 'Ripple';
			case 24: return 'Bitcoin';
			case 25: return 'Litecoin';
			case 26: return 'Ethereum';
			case 27: return 'SteamPay';
			case 28: return 'Мегафон';
			case 32: return 'VISA USD';
			case 33: return 'Perfect Money USD';
			case 34: return 'Shiba Inu';
			case 35: return 'QIWI API';
			case 36: return 'Card RUB API';
			case 37: return 'GooglePay';
			case 38: return 'ApplePay';
			case 39: return 'Tron';
			case 40: return 'Webmoney WMZ';
			case 41: return 'VISA / MasterCard KZT';
			case 42: return 'СБП';
			default: return '????';
		}
	}
}));

/*
const QurreAPI = require('qurre-pay');
const Qurre = new QurreAPI(config.payments.secret, config.payments.public);
router.post('/api/checkpays', vhost(host, async(req, res) => CheckPayAPI(req, res)));
router.post('/checkpays', async(req, res) => CheckPayAPI(req, res));
async function CheckPayAPI(req, res){
	try{
		//const Ips = await Qurre.GetServiceIps();
		//if(!Ips.includes(req._ip)) return res.sendStatus(403);
		if(req._ip != '185.105.89.106' && req._ip != '127.0.0.1') return res.sendStatus(403);
		let payData = await paymentsData.findOne();
		if(payData === null || payData === undefined) {
			payData = new paymentsData();
		}
		const payment = payData.payments.find(x => x.id == req.body.payment);
		if(payment == null || payment == undefined) return res.sendStatus(403);
		const Pay = await Qurre.GetPaymentInfo(req.body.payment);
		if(!Pay.paid) return res.sendStatus(403);
		const userdata = await accountsData.findOne({ user: payment.user });
		userdata.balance += Pay.sum;
		await userdata.save();
		if(userdata.achievements.filter(x => x == 'donater').length < 1){
			userdata.achievements.push('donater');
			await userdata.save();
		}
		res.sendStatus(200);
		payData.payments.pull(payment);
		payData.markModified('payments')
		await payData.save();
		Mails.donates.balanceup(userdata, Pay.sum, Pay.method);
	}catch(err){
        const hook = new Webhook("");
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }
};

router.post('/payok', vhost(APIhost, async(req, res) => {
	
}));
*/

/*
const qiwiCheck = async() => {
	await paymentsData.deleteMany({isQiwi: true, qiwiExpires: {$lte: Date.now()}});

	const pays = await paymentsData.find({isQiwi: true});

	if (pays.length == 0) {
		return;
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

	pays.forEach(async pay => {
		const resp = await fetch('https://edge.qiwi.com/qw-p2p-checkout-api/v1/invoice/' + pay.qiwiTag, {
			method: 'GET',
			headers: {
				'Authorization': 'TokenHead ' + auth.access_token,
				'Cookie': cookie,
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			},
		});

		const invoice = await resp.json();

		if (invoice.invoiceStatus == 'EXPIRED') {
			await pay.deleteOne();
			return;
		}

		if (invoice.invoiceStatus == 'PAID') {
			let sum = parseInt(invoice.amount.amount);

			if (isNaN(sum)) {
				await pay.deleteOne();
				return;
			}
			
			const userdata = await accountsData.findOne({user: pay.user});
	
			userdata.balance += sum;
			if(!userdata.achievements.some(x => x == 'donater')){
				userdata.achievements.push('donater');
			}
			await userdata.save();
	
			pay.deleteOne();
			
			const _shopName = 'Qiwi P2P';
			Mails.donates.balanceup(userdata, sum, _shopName);

			return;
		}

		if (Date.now() > pay.qiwiExpires) {
			await pay.deleteOne();
			return;
		}
	});
};

(() => {
	setInterval(() => qiwiCheck(), 1000 * 30);
	qiwiCheck();
})();
*/

/*
const DonatePayCheck = async() => {
	await paymentsData.deleteMany({isDP: true, DPExpires: {$lte: Date.now()}});

	const pays = await paymentsData.find({isDP: true});

	if (pays.length == 0) {
		return;
	}

	const resp = await fetch(`https://donatepay.ru/api/v1/transactions?access_token=${config.donationPay.token}&limit=100&before=&after=&skip=&order=&type=&status=success`);
	const json = await resp.json();

	pays.forEach(async pay => {
		const check_pay = json.data.find(x => x.comment == pay._id.toString());

		if (!check_pay) {
			return;
		}

		if (check_pay.status == 'cancel') {
			await pay.deleteOne();
			return;
		}

		if(check_pay.status != 'success') {
			return;
		}

		const paidSum = parseInt(check_pay.to_pay);
		const getSum = parseInt(check_pay.to_cash);

		let sum = paidSum;

		if (pay.sum != 0 && pay.sum <= paidSum && pay.sum >= getSum) {
			sum = pay.sum;
		}
		
		const userdata = await accountsData.findOne({user: pay.user});

		userdata.balance += sum;
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();

		await pay.deleteOne();

		Mails.donates.balanceup(userdata, sum, 'DonatePay');
	});
};

(() => {
	setInterval(() => safeRun(), 1000 * 15);
	safeRun();
	
	function safeRun() {
		try {
			DonatePayCheck();
		} catch(err) {
			console.error('DonatePay error:');
			console.error(err);
		}
	}
})();
*/

const DonationAlertsCheck = async() => {
	await paymentsData.deleteMany({isDA: true, DAExpires: {$lte: Date.now()}});

	const pays = await paymentsData.find({isDA: true});

	if (pays.length == 0) {
		return;
	}

	const resp = await fetch('https://www.donationalerts.com/api/v1/alerts/donations', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + config.donationAlerts.token,
        },
	});
	const json = await resp.json();

	pays.forEach(async pay => {
		const check_pay = json.data.find(x => x.message == pay._id.toString());

		if (!check_pay) {
			return;
		}

		const paidSum = parseInt(check_pay.amount);

		let sum = paidSum;

		if (pay.sum != 0 && pay.sum <= paidSum) {
			sum = pay.sum;
		}
		
		const userdata = await accountsData.findOne({user: pay.user});

		userdata.balance += sum;
		if(!userdata.achievements.some(x => x == 'donater')){
			userdata.achievements.push('donater');
		}
		await userdata.save();

		await pay.deleteOne();

		Mails.donates.balanceup(userdata, sum, 'Donation Alerts | ' + check_pay.payin_system.title);
	});
};

(() => {
	setInterval(() => safeRun(), 1000 * 15);
	safeRun();

	function safeRun() {
		try {
			DonationAlertsCheck();
		} catch(err) {
			console.error('DonationAlerts error:');
			console.error(err);
		}
	}
})();



const userAgentBoosty = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const BoostyCheck = async() => {
	await paymentsData.deleteMany({isCard: true, CardExpires: {$lte: Date.now()}});

	const pays = await paymentsData.find({isCard: true});

	if (pays.length == 0) {
		return;
	}

	pays.forEach(async pay => {
		if (pay.CardTag == '') {
			return;
		}

		const resp = await fetch('https://cpg.money.mail.ru/api/transaction/extcheck/?' + pay.CardTag, { // /check/?
			method: 'POST',
			headers: {
				'User-Agent': userAgentBoosty,
			},
		});

		const invoice = await resp.json();

		if (invoice.status == 'ERR_FINISH') {
			await pay.deleteOne();
			return;
		}

		if (invoice.status == 'OK_FINISH' && invoice.order_status == 'PAID') {
			if (isNaN(pay.sum)) {
				await pay.deleteOne();
				return;
			}
			
			const userdata = await accountsData.findOne({user: pay.user});
	
			userdata.balance += pay.sum;
			if(!userdata.achievements.some(x => x == 'donater')){
				userdata.achievements.push('donater');
			}
			await userdata.save();
	
			pay.deleteOne();
			
			const _shopName = 'Карты | ' + invoice.payment_info.merchant_name + ' | ' + (invoice.bank_name ?? pay.CardBank);
			Mails.donates.balanceup(userdata, pay.sum, _shopName);

			return;
		}

		if (Date.now() > pay.CardExpires) {
			await pay.deleteOne();
			return;
		}
	});
};

let BoostySended = false;
const BoostyHooker = require('./modules/mails/Manager');
const BoostyTokenExpiresCheck = async() => {
    const token_expires = await fetch('https://api.boosty.to/v1/blog/' + config.boosty.receiverNick + '/subscription_level/?show_free_level=true', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + config.boosty.payerToken,
            'User-Agent': userAgentBoosty,
        },
    });
    const token_expires_check = await token_expires.json();

    if (token_expires_check.error) {
		if (BoostySended) {
			return;
		}
		BoostyHooker.pays.boostyTokenExpires('Истек токен плательщика для Boosty. Надо обновить.\n' + token_expires_check.error + ' // ' + token_expires_check.error_description);
		BoostySended = true;
        return;
    }
};
(() => {
	setInterval(() => safeRun(), 1000 * 15);
	setInterval(() => tokenCheck(), 1000 * 60);
	safeRun();
	tokenCheck();

	function safeRun() {
		try {
			BoostyCheck();
		} catch(err) {
			console.error('Boosty error:');
			console.error(err);
		}
	}

	function tokenCheck() {
		try {
			BoostyTokenExpiresCheck();
		} catch(err) {
			console.error('Boosty token check error:');
			console.error(err);
		}
	}
})();

module.exports = router;

const guid = function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});}