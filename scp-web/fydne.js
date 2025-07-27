const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./helpers/logger");
const DonatesData = require("./base/donate");
const CustomizesData = require("./base/customize");
const VisualsData = require("./base/visuals");
const RolesData = require("./base/roles");
const accountsData = require("./base/accounts");
const InvitesData = require("./base/invites");
const io = require("socket.io-client");
const socket = io(config.dashboard.socketio, { path: '/main/', secure: true, rejectUnauthorized: false });
const init = async () => {
    mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        logger.log("Connected to the Mongodb database.", "log");
        require("./dashboard/app").load();
        //(new require('./base/wars')({})).save();
        //BDupdate();
        CheckDonators();
        Checkinvites();
        CheckClanBoosts();
        require('./helpers/runScripts')();
    }).catch((err) => {
        console.log(err)
        logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });
};
process.on('unhandledRejection', (err) => console.error(err));
process.on('uncaughtException', (err) => console.error(err));
const BDupdate = async () => {
    let balance = 0;
    const zeroActive = await accountsData.find({last_active: 0});
    for (let i = 0; i < zeroActive.length; i++) {
        const element = zeroActive[i];
        if (element.balance > 10) {
            balance += element.balance;
            console.log(`${element.balance} - ${element.user}`)
        }
    }
    console.log('count: ' + zeroActive.length);
    console.log('sum: ' + balance);
};
/*
const BDupdate = async () => {
    const RolesData = require("./base/roles");
    const roles = await RolesData.find({freezed: false});
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        role.expires = role.expires + (1000 * 60 * 60 * 24 * 3)
        await role.save();
        console.log(`${role}`);
    }
};
const BDupdate = async () => {
    const RolesData = require("./base/roles");
    const Mails = require('./dashboard/routes/modules/mails/Manager');
    let array = [
        "discord id"
    ];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const userData = await accountsData.findOne({discord: element});

        const role = new RolesData({owner:userData.id, sum:75, id:1, expires:Date.now() + (1000 * 60 * 60 * 24 * 30 * 1), server: -1});
        await role.save();
        Mails.donates.role(userData, "Радужная роль", "#dd4bad", 0, "Все сервера");
        console.log(`Выдана роль: ID: ${userData.id}; nick: ${userData.name}; balance: ${userData.balance}`);
    }
};
*/
async function RefreshPayments() {
    const QurreAPI = require('qurre-pay');
    const Qurre = new QurreAPI(config.payments.secret, config.payments.public);
    let paymentsData = require("./base/payments");
    let payData = await paymentsData.findOne();
    if(payData === null || payData === undefined) return;
    const _ar = payData.payments;
    for (let i = 0; i < _ar.length; i++) {
        const payment = _ar[i];
        const status = await Qurre.CancelPayment(payment.id);
        if(status?.status == "successfully"){
            console.log(payment);
            const cc = payData.payments.length;
            payData.payments.pull(payment);
            console.log(`${cc} - ${payData.payments.length}`);
            payData.markModified('payments')
            await payData.save();
        }
        console.log(status);
    }
    payData.markModified('payments')
    await payData.save();
}
const CheckClanBoosts = async () => {
    setInterval(async() => {
        const ClansData = require("./base/clans");
        const clans = await ClansData.find();
        for (let o = 0; o < clans.length; o++) {
            const clan = clans[o];
            let edited = false;
            for (let i = 0; i < clan.boosts.length; i++) {
                const boost = clan.boosts[i];
                if(Date.now() > boost.to){
                    clan.boosts.pull(boost);
                    edited = true;
                }
            }
            if(edited){
                clan.markModified('boosts');
                await clan.save();
            }
        }
    }, 60000);
};
const CheckDonators = async () => {
    setInterval(async() => {
        const donate = await DonatesData.find({});
        donate.forEach(async function (don) {
            if(!ComparisonDate(don.to)) await DonatesData.deleteOne({owner: don.owner, to: don.to});
        });
        const customize = await CustomizesData.find({active:true});
        customize.forEach(async function (cz) {
            if(Date.now() > cz.to){
                cz.active = false;
                await cz.save();
            }
        });
        const visuals = await VisualsData.find({active:true});
        visuals.forEach(async function (_vs) {
            if(Date.now() > _vs.expires){
                _vs.active = false;
                await _vs.save();
            }
        });
        const roles = await RolesData.find({freezed:false});
        roles.forEach(async function (rl) {
            if(Date.now() > rl.expires){
                socket.emit('SendToSCPChangeRoleStatus', rl);
                await rl.deleteOne();
            }
        });
    }, 60000);
};
const Checkinvites = async () => {
    setInterval(async() => {
        const invite = await InvitesData.find();
        invite.forEach(async function (inv) {
            if(Date.now() > inv.expires) await InvitesData.deleteOne({code: inv.code});
        });
    }, 60000);
};
function ComparisonDate(to) {
    var firstDate = to;
    var secondDate = GetDateTime();
    var datetime_regex = /(\d\d)\.(\d\d)\.(\d\d\d\d)\s(\d\d):(\d\d)/;
    var first_date_arr = datetime_regex.exec(firstDate);
    var first_datetime = new Date(first_date_arr[3], first_date_arr[2], first_date_arr[1], first_date_arr[4], first_date_arr[5]);
    var second_date_arr = datetime_regex.exec(secondDate);
    var second_datetime = new Date(second_date_arr[3], second_date_arr[2], second_date_arr[1], second_date_arr[4], second_date_arr[5]);
    if (first_datetime.getTime() > second_datetime.getTime()) return true;
    else return false;
};
function GetDateTime() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
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
    var time = day + "." + month + "." + year + " " + hour + ':' + minute;
    return time;
};
init();