const {Server} = require('qurre-socket');
const config = require("./config");
const logger = require("./logger");
const mongoose = require("mongoose");
const statsData = require("./mongo/stats");
const accountsData = require("./mongo/accounts");
const adminsData = require("./mongo/admins");
const clansData = require("./mongo/clans");
const tpsData = require("./mongo/tps");
const rolesData = require("./mongo/roles");
const donatesData = require("./mongo/donate");
const customizesData = require("./mongo/customize");
const visualData = require('./mongo/visuals');
const ptrsData = require("./mongo/patrols");
const locationsData = require("./mongo/locations");

const actionData = require("./mongo/action");

mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    logger.log("Connected to the Mongodb database.", "log");
    Init();
}).catch((err) => {
    logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
});
async function Init() {
    let CachedIPS = [];
    const _server = new Server(2467, config.ip);
    let SCPServers = [];
    let OnlineCached = [];
    _server.on('connection', (socket)=>{
        let authorized = false;

        setInterval(() => {
            if (!authorized) {
                socket.emit('token.required');
            }
        }, 1000);

        socket.on('SCPServerInit', (token) => {
            if(token != config.ApiToken) return;
            authorized = true;
            if(!SCPServers.some(x => x == socket.id)) SCPServers.push(socket.id);
            socket.emit('SCPServerInit');
        });
        socket.on('disconnect', () => {
            SCPServers = SCPServers.filter(x => x != socket.id);
        });
        socket.on('SendToSCPChangeRoleStatus', async([role]) => {
            const address = socket.sock.remoteAddress?.replace('::ffff:', '');
            if(address != '::1' && address != '127.0.0.1' && address != config.ip && address != config.webip && address != config.socketip) return;
            for (let i = 0; i < SCPServers.length; i++) {
                const _socket = _server.clients.find(x => x.id == SCPServers[i]);
                if(_socket == null || _socket == undefined) continue;
                _socket.emit('ChangeFreezeSCPServer', role);
            }
        });


        socket.on('web.getips', async([uid]) => {
            const address = socket.sock.remoteAddress?.replace('::ffff:', '');
            if(address != '::1' && address != '127.0.0.1'
            && address != config.ip && address != config.webip
            && address != config.socketip) {
                return;
            }

            let _chips = [];
            for (let i = 0; i < CachedIPS.length; i++) {
                const _lcips = CachedIPS[i];
                _chips.push(..._lcips.data);
            }
            socket.emit('web.getips', _chips, uid);
        });

        socket.on('server.clearips', async([server]) => {
            if(!authorized) {
                return;
            }

            if (!CachedIPS.some(x => x.server == server)) {
                return;
            }

            CachedIPS.find(x => x.server == server).data = [];
        });

        socket.on('server.leave', async([server, userid]) => {
            if(!authorized) {
                return;
            }

            const _dt = CachedIPS.find(x => x.server == server);
            _dt.data = _dt.data.filter(x => x.userid != userid);
        });

        socket.on('server.addip', async([server, ip, userid, nick]) => {
            if(!authorized) {
                return;
            }

            if (CachedIPS.some(x => x.server == server)) {
                CachedIPS.find(x => x.server == server).data.push({ ip, userid, nick });
            } else {
                CachedIPS.push({ server, data: [ { ip, userid, nick } ] });
            }

            if (!userid.endsWith('@steam')) {
                return;
            }

            await locationsData.deleteMany({
                player: userid.replace('@steam', ''),
                server: server,
            });

            await new locationsData({
                player: userid.replace('@steam', ''),
                nickname: nick,
                location: await GetLocByIp(ip),
                ip: ip,
                date: new Date(Date.now()),
                server: server,
            }).save()
        });


        socket.on('server.join', async([userid, ip]) => {
            if(!authorized) return;
            try{
                let _steam = true;
                if(userid.includes("@discord")) _steam = false;
                let _data;
                let _user = userid.replace('@discord', '').replace('@steam', '');
                if(_steam) _data = await statsData.findOne({steam: _user});
                else _data = await statsData.findOne({discord: _user});
                if(_data == null || _data == undefined){
                    if(_steam) _data = new statsData({steam: _user})
                    else _data = new statsData({discord: _user})
                }
                if(_data != null && _data != undefined){
                    if(_data.ips == null || _data.ips == undefined){
                        await _data.save();
                        if(_steam) _data = await statsData.findOne({steam: _user});
                        else _data = await statsData.findOne({discord: _user});
                        _data.ips.push(ip);
                        _data.markModified('ips');
                        await _data.save();
                    }
                    else if(_data.ips.filter(x => x == ip).length < 1){
                        _data.ips.push(ip);
                        _data.markModified('ips');
                        await _data.save();
                    }
                }
            }catch(e){logger.log(e, "error")}
            try{
                let _steam = true;
                if(userid.includes("@discord")) _steam = false;
                let _data;
                let _user = userid.replace('@discord', '').replace('@steam', '');
                if(_steam) _data = await accountsData.findOne({steam: _user});
                else _data = await accountsData.findOne({discord: _user});
                if(_data != null && _data != undefined && (_data.time == 'Нет данных' || _data.time == '')){
                    _data.time = `${Date.now()}`;
                    await _data.save();
                }
            }catch(e){logger.log(e, "error")}
        });
        socket.on('server.tps', async([id, name, tps, players]) => {
            if(!authorized) return;
            players = parseInt(players);
            tps = parseInt(tps);
            if(isNaN(tps) || isNaN(players)) return;
            if(tps == 0) return;
            let data = await tpsData.findOne({id});
            if(data == null) data = new tpsData({id, name});
            const date = Date.now();
            const tpsleng = data.tps.length;
            if(tpsleng > 17280 || true){
                let _tpsns = tpsleng - 15000;
                if(0 > _tpsns) _tpsns = 0;
                let frnd = false;
                for (let i = _tpsns; !frnd && i < data.tps.length; i++) {
                    if(date - data.tps[i].date < 1000 * 60 * 60 * 24 * 5){
                        _tpsns = i;
                        frnd = true;
                    }
                }
                data.tps = data.tps.slice((_tpsns > 0 ? _tpsns : 0), tpsleng);
            }
            data.name = name;
            data.tps.push({date, tps, players});
            data.markModified('tps');
            await data.save();
        });
        socket.on('server.online', async([ip, port, name, online, max]) => {
            if(!authorized) return;
            if(!OnlineCached.some(x => x.ip == ip && x.port == port)) return OnlineCached.push({ip, port, name, online, max, date: Date.now()});
            let _data = OnlineCached.find(x => x.ip == ip && x.port == port);
            _data.name = name;
            _data.online = online;
            _data.max = max;
            _data.date = Date.now();
        });
        socket.on('website.online.get', (uid) => socket.emit('socket.online.send', OnlineCached.filter(x => x.date > Date.now() - 60000), uid));

        socket.on('server.database.clans', async() => {
            if(!authorized) return;
            const clans = await clansData.find();
            let tags = [];
            for (let i = 0; i < clans.length; i++) tags.push(clans[i].tag)
            socket.emit('socket.database.clans', tags)
        });

        socket.on('database.admin.kick', async([uid, type]) => {
            if(!authorized) return;
            const admData = await adminsData.findOne({id:uid});
            if(admData == null || admData == undefined) return;
            if(type == 1){
                admData.sl.kicks++;
                admData.markModified('sl');
                await admData.save();
            }else if(type == 2){
                admData.slhrp.kicks++;
                admData.markModified('slhrp');
                await admData.save();
            }
        });
        socket.on('database.admin.ban', async([uid, type]) => {
            if(!authorized) return;
            const admData = await adminsData.findOne({id:uid});
            if(admData == null || admData == undefined) return;
            if(type == 1){
                admData.sl.bans++;
                admData.markModified('sl');
                await admData.save();
            }else if(type == 2){
                admData.slhrp.bans++;
                admData.markModified('slhrp');
                await admData.save();
            }
        });

        socket.on('database.get.data', async([uid, discord, type, guid]) => {
            if(!authorized) return;
            let json = {steam: uid};
            if(discord) json = {discord: uid};
            const answer = {
                money: 0,
                xp: 0,
                lvl: 0,
                to: 0,

                donater: false,
                trainee: false,
                helper: false,
                mainhelper: false,
                admin: false,
                mainadmin: false,
                selection: false,
                control: false,
                maincontrol: false,
                warnings: 0,

                prefix: '',
                clan: '',
                clanColor: '',
                found: false,
                name: 'null',
                id: 0,
                discord: '',
                login: '',

                gradient: {
                    fromA: '#000000',
                    toA: '#ffffff',
                    fromB: '#ffffff',
                    toB: '#000000',
                    prefix: 'гыг'
                }
            }
            const stats = await statsData.findOne(json);
            if(stats != null && stats != undefined){
                answer.money = stats.money;
                answer.xp = stats.xp;
                answer.lvl = stats.lvl;
                answer.to = stats.to;
            }
            const account = await accountsData.findOne(json);
            if(!account) return socket.emit('database.get.data', answer, guid);
            setTimeout(() => GetPatrol(), 0);
            answer.prefix = account.prefix;
            answer.found = true;
            answer.name = account.name == '' ? account.user : account.name;
            answer.id = account.id;
            answer.discord = account.discord;
            answer.login = account.user;
            answer.gradient = account.gradient;

            const clanData = await clansData.findOne({tag: account.clan});
            if (clanData) {
                answer.clan = clanData.tag;
                answer.clanColor = clanData.color;
            }

            const admData = await adminsData.findOne({id:account.id, sabbatical: false});
            if(admData) {
                const adm = type == 1 ? admData.sl : admData.slhrp;
                answer.trainee = adm.trainee;
                answer.helper = adm.helper;
                answer.mainhelper = adm.mainhelper;
                answer.admin = adm.admin;
                answer.mainadmin = adm.mainadmin;
                answer.selection = adm.selection;
                answer.control = adm.control ?? false;
                answer.maincontrol = admData.control;
                answer.it = admData.it;
                answer.warnings = adm.warnings;
            }

            socket.emit('database.get.data', answer, guid);

            async function GetPatrol(){
                const ptrData = await ptrsData.findOne({id:account.id});
                if(ptrData == null || ptrData == undefined) return;
                socket.emit('database.get.patrol', ptrData.soldier, guid, ptrData.verified);
            }
        });

        socket.on('database.get.donate.roles', async([uid, server, guid]) => {
            if(!authorized) return;
            const roleData = await rolesData.find({owner:uid, freezed:false});
            let roles = [];
            roleData.forEach(role => {
                if(role.server == -1 || role.server == server || server == 3 || server == 4 || server == 5) roles.push(role.id);//*
            });
            socket.emit('database.get.donate.roles', roles, guid);
        });
        socket.on('database.get.donate.ra', async([uid, server, guid]) => {
            if(!authorized) return;
            const donateData = await donatesData.find({owner:uid});
            let donates = [];
            donateData.forEach(donate => {
                if(donate.server == -1 || donate.server == server || server == 3 || server == 4 || server == 5) donates.push({//*
                    force:donate.force,
                    give:donate.give,
                    effects:donate.effects,
                    players_roles:donate.players_roles,
                    prefix:donate.prefix,
                    color:donate.color,
                });
            });
            socket.emit('database.get.donate.ra', donates, guid);
        });
        socket.on('database.get.donate.customize', async([uid, guid]) => {
            if(!authorized) return;
            const donateData = await customizesData.findOne({owner:uid, active:true});
            if(donateData == null || donateData == undefined) return;
            socket.emit('database.get.donate.customize', {genetics:donateData.genetics, scales:donateData.scales}, guid);
        });
        socket.on('database.get.donate.visual', async([uid, guid]) => {
            if(!authorized) return;
            const donateData = await visualData.findOne({owner:uid, active:true});
            if(donateData == null || donateData == undefined) return;
            socket.emit('database.get.donate.visual', {
                root: donateData.root,
                ClassD: donateData.ClassD,
                Scientist: donateData.Scientist,
                Guard: donateData.Guard,
                MTF: donateData.MTF,
                Chaos: donateData.Chaos,
                Hand: donateData.Hand
            }, guid);
        });

        socket.on('database.add.time', async([uid, type, time]) => {
            if(!authorized) return;
            const admData = await adminsData.findOne({id:uid});
            if(admData == null || admData == undefined) return;
            if(type == 1){
                admData.sl.time += time;
                admData.markModified('sl');
                await admData.save();
            }else if(type == 2){
                admData.slhrp.time += time;
                admData.markModified('slhrp');
                await admData.save();
            }
        });

        socket.on('database.remove.admin', async([uid]) => {
            if(!authorized) return;
            RemoveAdmin();
            RemoveVerifiedPatrol();
            async function RemoveAdmin() {
                const admData = await adminsData.findOne({id:uid});
                if(admData == null || admData == undefined) return;
                admData.sl.trainee = false;
                admData.sl.helper = false;
                admData.sl.mainhelper = false;
                admData.sl.admin = false;
                admData.sl.mainadmin = false;
                admData.sl.selection = false;
                admData.sl.control = false;
                admData.slhrp.trainee = false;
                admData.slhrp.helper = false;
                admData.slhrp.mainhelper = false;
                admData.slhrp.admin = false;
                admData.slhrp.mainadmin = false;
                admData.slhrp.selection = false;
                admData.slhrp.control = false;
                admData.control = false;
                admData.it = false;
                admData.markModified('sl');
                admData.markModified('slhrp');
                await admData.save();
            }
            async function RemoveVerifiedPatrol() {
                const ptrData = await ptrsData.findOne({id:uid});
                if(ptrData == null || ptrData == undefined) return;
                ptrData.verified = false;
                await ptrData.save();
            }
        });

        socket.on('database.add.stats', async([uid, discord, xp, money, guid]) => {
            if(!authorized) return;
            let json = {steam: uid};
            if(discord) json = {discord: uid};
            const stats = await statsData.findOne(json);
            if(stats == null || stats == undefined) return;
            stats.xp += xp;
            stats.money += money;
            if(stats.xp >= stats.to){
                stats.xp -= stats.to;
                stats.lvl++;
                stats.to = stats.lvl * 250 + 750;
            }
            if(stats.money < 0){
                stats.money = 0;
                socket.emit('database.update.zero.money', discord, uid);
            }
            await stats.save();
            socket.emit('database.get.stats', {xp:stats.xp, lvl:stats.lvl, to:stats.to, money:stats.money}, guid);
        })
        socket.on('database.get.stats', async([uid, discord, guid]) => {
            if(!authorized) return;
            let json = {steam: uid};
            if(discord) json = {discord: uid};
            const stats = await statsData.findOne(json);
            if(stats == null || stats == undefined) return;
            socket.emit('database.get.stats', {xp:stats.xp, lvl:stats.lvl, to:stats.to, money:stats.money}, guid);
        })
        socket.on('database.internal.unsafe.set_level', async([uid, level]) => {
            if (!authorized) return;
            if (level > 99 || level < 1) return;
            const stats = await statsData.findOne({steam: uid.replace('@steam', '')});
            if (!stats) return;
            stats.lvl = level;
            stats.xp = 0;
            stats.to = stats.lvl * 250 + 750;
            await stats.save();
            socket.emit('database.get.stats', {xp:stats.xp, lvl:stats.lvl, to:stats.to, money:stats.money}, uid);
        })

        socket.on('database.get.adm.steams', async() => {
            if(!authorized) return;
            let webids = [];

            const patrols = await ptrsData.find({verified:true});
            for (let i = 0; i < patrols.length; i++) {
                const patrol = patrols[i];
                if (!webids.includes(patrol.id)) {
                    webids.push(patrol.id);
                }
            }

            const adms = await adminsData.find();
            for (let i = 0; i < adms.length; i++) {
                const adm = adms[i];
                if (adm.sl.trainee || adm.sl.helper || adm.sl.mainhelper || adm.sl.admin || adm.sl.mainadmin ||
                    adm.sl.control || adm.control || adm.owner || adm.it
                ) {
                    if (!webids.includes(adm.id)) {
                        webids.push(adm.id);
                    }
                }
            }

            let userids = [];
            for (let i = 0; i < webids.length; i++) {
                const webid = webids[i];
                const account = await accountsData.findOne({id: webid});
                if (account.steam != '' && !userids.includes(account.steam)) {
                    userids.push(account.steam);
                }
            }

            socket.emit('database.get.adm.steams', userids);
        })


        /*
        socket.on('action.save.secs', async([userid, seconds, serverid]) => {
            if(!authorized) {
                return;
            }

            if (!await actionData.exists({ userid: userid, server: serverid })) {
                await new actionData({ userid: userid, server: serverid, seconds: seconds }).save();
                return;
            }

            let action = await actionData.findOne({ userid: userid, server: serverid });
            if (!action) {
                return;
            }

            action.seconds += seconds;
            await action.save();
        });

        socket.on('action.get.stats', async([userid, serverid]) => {
            if(!authorized) {
                return;
            }

            let topList = await actionData.find({ server: serverid });
            topList = topList.sort((a, b) => b.seconds - a.seconds);

            let topSecs = [];
            let topUserids = [];
            let secs = 0;
            let intop = '-';

            for (let i = 0; i < topList.length; i++) {
                const topData = topList[i];

                if (i < 10) {
                    topSecs.push(topData.seconds);
                    topUserids.push(topData.userid);
                }

                if (topData.userid == userid) {
                    secs = topData.seconds;
                    intop = (i + 1).toString();
                }
            }

            socket.emit('action.get.stats', topSecs, secs, intop, userid, topUserids);
        });
        */
    });
    await _server.initialize();
}

async function GetLocByIp(ip) {
    try {
        const yandexApi = '';
        const resp = await fetch('https://locator.api.maps.yandex.ru/v1/locate?apikey=' + yandexApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ip: [
                    { address: ip }
                ]
            })
        });
        const json = await resp.json();
        return json.location.point.lat + ',' + json.location.point.lon;
    } catch {
        const resp = await fetch('https://api.scpsl.shop/geoip?ip=' + ip);
        const json = await resp.json();
        return json.loc;
    }
}