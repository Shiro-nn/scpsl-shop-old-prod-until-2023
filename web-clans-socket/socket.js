const { Server } = require("socket.io");
const { parse } = require('cookie');
const accountsData = require('./data/accounts');
const countsData = require('./data/counts');
const invsData = require('./data/invites');
const clansData = require('./data/clans');
const emojisData = require('./data/emoji');
const boostsData = require('./data/boosts');
const chatsData = require('./data/chats');
const statsData = require('./data/stats');
module.exports = async(server, _session) => {
    const io = new Server(server, {
        path: '/clans/',
        cookie: true,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });
    io.use(async(socket, next) => {
        socket.session = {};
        let cookietext = '';
        try{cookietext = (socket.request.headers.cookie || socket.handshake.auth.cookie)}catch{cookietext = socket.handshake.auth.cookie;}
        try{
            const cookies = parse(cookietext);
            const ck = cookies[_session.config.name];
            if(!ck) return next();
            const session = await _session.get(ck);
            socket.session = session;
            next();
        }catch{next()}
    });
    io.on('connection', (socket) => {
        let session = socket.session;
        function GetUID(){
            if(session == undefined || session == null) return 0;
            if(session.user == undefined || session.user == null) return 0;
            return session.user.id;
        }
        let CurClan = '';
        socket.on('login', (clan) => {
            CurClan = clan;
            let user = GetUID();
            socket.emit('login', user);
            socket.session.clan = CurClan;
        });
        socket.on('get.static.info', async() => {
            if(CurClan == '') return;
            const clan = await clansData.findOne({ tag: CurClan });
            if(clan === null || clan === undefined) return socket.emit('clan.not.found');
            if(!clan.public && !clan.users.some(x => x.user == GetUID())) return socket.emit('clan.not.found');
            socket.emit('get.static.info', {
                name: clan.name,
                desc: clan.desc,
                img: clan.img,
                color: clan.color,
                public: clan.public,
                balance: clan.balance,
                money: clan.money,
            });
        });
        socket.on('get.first.info', async() => {
            if(CurClan == '') return;
            const clan = await clansData.findOne({ tag: CurClan });
            if(clan === null || clan === undefined) return socket.emit('clan.not.found');
            const uid = GetUID();
            const access = await GetClanAccessByData(uid, clan);
            if(!clan.public && access == 0) return socket.emit('clan.not.found');
            let userClan = '';
            const userData = await accountsData.findOne({id:uid});
            if(userData != null && userData != undefined) userClan = userData.clan;
            socket.emit('get.first.info', {
                name: clan.name,
                desc: clan.desc,
                img: clan.img,
                color: clan.color,
                public: clan.public,
                balance: clan.balance,
                money: clan.money,
                tag: clan.tag,
                access, userClan
            });
        });
        socket.on('get.my.access', async() => {
            if(CurClan == '') return socket.emit('get.my.access', 0);
            const access = await GetClanAccess(GetUID(), CurClan);
            socket.emit('get.my.access', access);
        });
        
        socket.on('join.by.inv', async(inv) => {
            const uid = GetUID();
            if(uid == 0) return socket.emit('join.by.inv', false, 'Вы не авторизованы');
            const invite = await invsData.findOne({code:inv});
            if(invite === null || invite === undefined) return socket.emit('join.by.inv', false, 'Приглашение не найдено');
            const clan = await clansData.findOne({tag:invite.clan});
            if(clan === null || clan === undefined) return socket.emit('join.by.inv', false, 'Клан не найден');
            if(clan.users.some(x => x.user == uid)) return socket.emit('join.by.inv', false, 'Вы уже состоите в данном клане');
            clan.users.push({user: uid, access: 1});
            clan.markModified('users');
            const _nnf = {msg: `<@${uid}> вступил в клан по приглашению <@${invite.by}>`, date: Date.now()}
            clan.notifications.push(_nnf);
            clan.markModified('notifications');
            await clan.save();
            const userData = await accountsData.findOne({id:uid});
            if(userData != null && userData != undefined && userData.clan == ''){
                userData.clan = clan.tag;
                await userData.save();
            }
            socket.emit('join.by.inv', true, clan.tag);
            SendNewNotify(_nnf, clan.tag);
            JoinInClan(uid, clan.tag);
        });
        socket.on('event.join', async() => {
            if(CurClan == '') return socket.emit('event.join', false, 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('event.join', false, 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('event.join', false, 'Клан не найден');
            if(!clan.public) return socket.emit('event.join', false, 'Клан приватный');
            if(clan.users.some(x => x.user == uid)) return socket.emit('event.leave', false, 'Вы уже состоите в данном клане');
            clan.users.push({user: uid, access: 1});
            clan.markModified('users');
            const _nnf = {msg: `<@${uid}> вступил в клан`, date: Date.now()}
            clan.notifications.push(_nnf);
            clan.markModified('notifications');
            await clan.save();
            const userData = await accountsData.findOne({id:uid});
            let clupd = false;
            if(userData != null && userData != undefined && userData.clan == ''){
                clupd = true;
                userData.clan = clan.tag;
                await userData.save();
            }
            socket.emit('event.join', true, clupd);
            SendNewNotify(_nnf, CurClan);
            JoinInClan(uid, CurClan);
        });
        socket.on('event.leave', async() => {
            if(CurClan == '') return socket.emit('event.leave', false, 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('event.leave', false, 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('event.leave', false, 'Клан не найден');
            if(!clan.users.some(x => x.user == uid)) return socket.emit('event.leave', false, 'Вы не состоите в данном клане');
            
            if(clan.users.some(x => x.user == uid && x.access == 5)){
                var __list = clan.users;
                __list.sortById = function() {
                    this.sort(function(a,b) {
                        return a.access - b.access;
                    });
                };
                __list.sortById();
                try{
                    clan.users.find(x => x.user == __list[0].user).access = 5;
                    const _nggf = {msg:`<@${__list[0].user}> получил права на клан от <@${uid}>`, date: Date.now()};
                    clan.notifications.push(_nggf);
                    SendNewNotify(_nggf, CurClan);
                }catch{}
            }

            var _list = clan.users.filter(x => x.user == uid);
            _list.forEach(element => clan.users.pull(element));
            clan.markModified('users');
            const _nnf = {msg: `<@${uid}> покинул клан`, date: Date.now() + 1};
            clan.notifications.push(_nnf);
            clan.markModified('notifications');
            await clan.save();
            SendNewNotify(_nnf, CurClan);
            if(clan.users.length == 0) await clan.deleteOne();

            const userData = await accountsData.findOne({id:uid});
            if(userData != null && userData != undefined && userData.clan == clan.tag){
                userData.clan = '';
                await userData.save();
            }

            socket.emit('event.leave', true);

            LeaveFromClan(uid, CurClan);
        });
        socket.on('event.make.main', async() => {
            if(CurClan == '') return socket.emit('event.make.public', false, 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('event.make.public', false, 'Вы не авторизованы');
            const userData = await accountsData.findOne({id:uid});
            if(userData === null || userData === undefined) return socket.emit('event.make.public', false, 'Ваш аккаунт не найден');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('event.make.public', false, 'Клан не найден');
            if(!clan.users.some(x => x.user == uid)) return socket.emit('event.make.public', false, 'Вы не состоите в данном клане');
            userData.clan = clan.tag;
            await userData.save();
            socket.emit('event.make.main', true);
        });
        socket.on('event.make.public', async() => {
            if(CurClan == '') return socket.emit('event.make.public', false, 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('event.make.public', false, 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('event.make.public', false, 'Клан не найден');
            if(clan.public) return socket.emit('event.make.public', false, 'Клан уже публичный');
            if(!clan.users.some(x => x.user == uid && x.access >= 4)) return socket.emit('event.make.public', false, 'Недостаточно прав');
            clan.public = true;
            const _nnf = {msg: `<@${uid}> сделал клан публичным`, date: Date.now()};
            clan.notifications.push(_nnf);
            clan.markModified('notifications');
            await clan.save();
            socket.emit('event.make.public', true);
            SendNewNotify(_nnf, CurClan);
        });
        socket.on('event.make.private', async() => {
            if(CurClan == '') return socket.emit('event.make.private', false, 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('event.make.private', false, 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('event.make.private', false, 'Клан не найден');
            if(!clan.public) return socket.emit('event.make.private', false, 'Клан уже приватный');
            if(!clan.users.some(x => x.user == uid && x.access >= 4)) return socket.emit('event.make.private', false, 'Недостаточно прав');
            clan.public = false;
            const _nnf = {msg: `<@${uid}> сделал клан приватным`, date: Date.now()};
            clan.notifications.push(_nnf);
            clan.markModified('notifications');
            await clan.save();
            socket.emit('event.make.private', true);
            SendNewNotify(_nnf, CurClan);
        });
        socket.on('event.invite', async() => {
            if(CurClan == '') return socket.emit('event.invite', false, 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('event.invite', false, 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('event.invite', false, 'Клан не найден');
            if(!clan.users.some(x => x.user == uid && x.access >= 2)) return socket.emit('event.invite', false, 'Недостаточно прав');
			async function CreateInv() {
				const _code = 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});
				const __ = await invsData.findOne({code: _code});
				if(__ == null || __ == undefined){
					await new invsData({code:_code, clan:clan.tag, expires:(Date.now() + 1000 * 60 * 60 * 24), by:uid}).save();
                    socket.emit('event.invite', true, `https://scpsl.shop/inv/${_code}`);
				}else{CreateInv();}
			}
			CreateInv();
        });
        
        socket.on('add.exch', async(type, amount) => {
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('error.handler', 'Вы не авторизованы');
            amount = parseInt(amount);
            if(isNaN(amount) || amount < 1) return socket.emit('error.handler', 'Неверно указано количество');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            if(!clan.users.some(x => x.user == uid)) return socket.emit('error.handler', 'Недостаточно прав');
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return socket.emit('error.handler', 'Ваш аккаунт не найден');
            if(type == 1){
                if(amount > userData.balance) return socket.emit('error.handler', `Недостаточно баланса аккаунта (${userData.balance}/${amount})`);
                userData.balance -= amount;
                clan.balance += amount;
                if(amount > 10){
                    const _jsonNotify = {msg: `<@${uid}> положил в клан ${amount}₽`, date: Date.now()};
                    clan.notifications.push(_jsonNotify);
                    clan.markModified('notifications');
                    SendNewNotify(_jsonNotify, CurClan);
                }
                SendUpdateBalance(clan.balance, CurClan);
                await userData.save();
                await clan.save();
                const _target = clan.users.find(x => x.user == uid);
                if(_target.balance == null || _target.balance == undefined) _target.balance = amount;
                else _target.balance += amount;
                clan.markModified('users');
                await clan.save();
            }else if(type == 2){
                let moneyup = 0;
                const _steam = userData.steam == '' ? {money:0} : await statsData.findOne({steam:userData.steam});
                const _discord = userData.discord == '' ? {money:0} : await statsData.findOne({discord:userData.discord});
                if(amount > (_steam == null ? 0 : _steam.money) + (_discord == null ? 0 : _discord.money))
                    return socket.emit('error.handler', 'Недостаточно монеток '+
                    `(${(_steam == null ? 0 : _steam.money) + (_discord == null ? 0 : _discord.money)}/${amount})`);
                if(_steam != null){
                    const _am = Math.min(amount, _steam.money);
                    _steam.money -= _am;
                    _steam.save();
                    moneyup += _am;
                }
                if(_discord != null && (amount - moneyup) > 0){
                    const _am = Math.min(amount - moneyup, _discord.money);
                    _discord.money -= _am;
                    _discord.save();
                    moneyup += _am;
                }
                clan.money += moneyup;
                if(amount > 100){
                    const _jsonNotify = {msg: `<@${uid}> положил в клан ${moneyup} монет`, date: Date.now()};
                    clan.notifications.push(_jsonNotify);
                    clan.markModified('notifications');
                    SendNewNotify(_jsonNotify, CurClan);
                }
                SendUpdateMoney(clan.money, CurClan);
                await clan.save();
                const _target = clan.users.find(x => x.user == uid);
                if(_target.money == null || _target.money == undefined) _target.money = moneyup;
                else _target.money += moneyup;
                clan.markModified('users');
                await clan.save();
            }else return socket.emit('error.handler', 'Неверно указан тип пополнения');
        });

        socket.on('get.news', async() => {
            if(CurClan == '') return socket.emit('get.news', false, 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('get.news', false, 'Клан не найден');
            socket.emit('get.news', true, '', clan.news);
        });
        socket.on('remove.news', async(id) => {
            if(CurClan == '') return socket.emit('remove.news', false, 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('remove.news', false, 'Клан не найден');
            if(!clan.users.some(x => x.user == GetUID() && x.access >= 3)) return socket.emit('remove.news', false, 'Недостаточно прав');
            const _nwms = clan.news.find(x => x.date == id);
            clan.news.pull(_nwms);
            clan.markModified('news');
            await clan.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                cl.emit('remove.news', true, id);
            });
        });
        socket.on('create.news', async(msg) => {
            if(CurClan == '') return socket.emit('create.news', false, 'Клан не авторизован');
            msg = msg.trim().substring(0, 200);
            msg = msg.replace(/\n/g, '\\n').replace(/\\n/g, '\n').trim();
            if(2 > msg.length) return socket.emit('create.news', false, 'Ваша новость слишком короткая');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('create.news', false, 'Клан не найден');
            const uid = GetUID();
            if(!clan.users.some(x => x.user == uid && x.access >= 3)) return socket.emit('create.news', false, 'Недостаточно прав');
            const _nwsdt = {user: uid, msg, date: Date.now()};
            clan.news.push(_nwsdt);
            clan.markModified('news');
            await clan.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                cl.emit('create.news', true, _nwsdt);
            });
        });

        socket.on('get.notifications', async(since, loaded) => {
            if(CurClan == '') return socket.emit('get.notifications', false, 'Клан не авторизован');
            if(since == null || since == undefined) return socket.emit('get.notifications', false, 'Неверный аргумент поиска');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('get.notifications', false, 'Клан не найден');
            if(loaded == null || loaded == undefined) loaded = 0;
            if(loaded == clan.notifications.length) return socket.emit('get.notifications', true, '', []);
            const cnf = clan.notifications.reverse();
            if(since == 0) return socket.emit('get.notifications', true, '', cnf.slice(0, 5));
            let rtnf = [];
            let df = false;
            for (let i = 0; rtnf.length < 5 && i < cnf.length; i++) {
                const _nf = cnf[i];
                if(df) rtnf.push(_nf);
                else if(_nf.date == since) df = true;
            }
            socket.emit('get.notifications', true, '', rtnf);
        });
        
        socket.on('get.users', async() =>{
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            socket.emit('get.users', clan.users);
        });
        socket.on('change.user', async(user, lvl) =>{
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            const _uid = GetUID();
            const _access = await GetUnSafeClanAccess(_uid, clan);
            if(_access < 3) return socket.emit('error.handler', 'Недостаточно доступа');
            if(!clan.users.some(x => x.user == user)) return socket.emit('error.handler', 'Пользователь не найден');
            const _target = clan.users.find(x => x.user == user);
            if(_target.access >= _access) return socket.emit('error.handler', 'Недостаточно прав');
            if(lvl > _target.access){
                if(_access < 4) return socket.emit('error.handler', 'Недостаточно прав');
                if(lvl >= _access) return socket.emit('error.handler', 'Недостаточно прав');
            }
            _target.access = lvl;
            clan.markModified('users');
            await clan.save();

            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                cl.emit('change.user', _target);
            });
        });
        socket.on('kick.user', async(user) =>{
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            const _uid = GetUID();
            const _access = await GetUnSafeClanAccess(_uid, clan);
            if(_access < 4) return socket.emit('error.handler', 'Недостаточно доступа');
            if(!clan.users.some(x => x.user == user)) return socket.emit('error.handler', 'Пользователь не найден');
            const _target = clan.users.find(x => x.user == user);
            if(_target.access >= _access) return socket.emit('error.handler', 'Недостаточно прав');
            clan.users.pull(_target);
            clan.markModified('users');
            const _nnf = {msg: `<@${_uid}> кикнул <@${user}> из клана`, date: Date.now()}
            clan.notifications.push(_nnf);
            clan.markModified('notifications');
            await clan.save();
            LeaveFromClan(_target.user, CurClan);
            SendNewNotify(_nnf, CurClan);

            const account = accountsData.findOne({id:user});
            if(account.clan == clan.tag){
                account.clan = '';
                await account.save();
            }
        });

        socket.on('boosts.get', async() =>{
            const boosts = await boostsData.find();
            socket.emit('boosts.get', boosts);
        });
        socket.on('boosts.get.clan', async() =>{
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            socket.emit('boosts.get.clan', clan.boosts);
        });
        socket.on('boosts.buy.clan', async(id) =>{
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            if(id == undefined || id == null) return socket.emit('error.handler', 'Неверно указаны аргументы');
            const uid = GetUID();
            if(uid == 0) return socket.emit('error.handler', 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            if(!clan.users.some(x => x.user == uid && x.access >= 4)) return socket.emit('error.handler', 'Недостаточно прав');
            if(clan.boosts.some(x => x.id == id)) return socket.emit('error.handler', 'Буст уже приобретен');
            const boost = await boostsData.findOne({id});
            if(boost == null || boost == undefined) return socket.emit('error.handler', 'Буст не найден');
            if(boost.sum > clan.balance) return socket.emit('error.handler', 'Недостаточно средств в казне клана');
            clan.balance -= boost.sum;
            const _jsonBoost = {id: boost.id, to:Date.now() + (1000 * 60 * 60 * 24 * 30)};
            clan.boosts.push(_jsonBoost);
            clan.markModified('boosts');
            const _jsonNotify = {msg: `<@${uid}> приобрел буст '${boost.name}' за ${boost.sum}₽`, date: Date.now()};
            clan.notifications.push(_jsonNotify);
            clan.markModified('notifications');
            await clan.save();

            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                cl.emit('boosts.bought.clan', _jsonBoost);
            });
            SendNewNotify(_jsonNotify, CurClan);
            SendUpdateBalance(clan.balance, CurClan);
        });

        socket.on('update.avatar', async(hash) => {
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            const uid = GetUID();
            if(uid == 0) return socket.emit('error.handler', 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            if(!clan.users.some(x => x.user == uid && x.access >= 3)) return socket.emit('error.handler', 'Недостаточно прав');
            clan.img = `https://cdn.scpsl.shop/scpsl/clans/logo/${clan.tag}/${hash}.png`;
            await clan.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                    cl.emit('update.avatar', clan.img);
            });
        });
        socket.on('settings.update', async(name, desc, color) => {
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            if(name == null || name == undefined || name.length < 2) return socket.emit('error.handler', 'Название клана слишком короткое');
            if(desc == null || desc == undefined) return socket.emit('error.handler', 'Описание клана не найдено');
            if(color == null || color == undefined) return socket.emit('error.handler', 'Цвет клана неизвестен');
            const uid = GetUID();
            if(uid == 0) return socket.emit('error.handler', 'Вы не авторизованы');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            if(!clan.users.some(x => x.user == uid && x.access >= 3)) return socket.emit('error.handler', 'Недостаточно прав');
            clan.name = name.substring(0, 20).replace(/\n/g, '\\n').replace(/\<(?!\:)(?!\@)(.+?)\>/g, '&lt;$1&gt;');
            clan.desc = desc.substring(0, 200).replace(/\n/g, '\\n').replace(/\<(?!\:)(?!\@)(.+?)\>/g, '&lt;$1&gt;');
            clan.color = rgbToHex(parseRGB(color.r), parseRGB(color.g), parseRGB(color.b));
            await clan.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                    cl.emit('settings.update', clan.name, clan.desc, clan.color);
            });
        });

        socket.on('get.emojis', async() =>{
            const emojis = await emojisData.find();
            socket.emit('get.emojis', emojis);
        });
        socket.on('get.emoji', async(id, uid) =>{
            const emoji = await emojisData.findOne({id});
            if(emoji == null || emoji == undefined) return;
            socket.emit('get.emoji', {name:emoji.name,url:emoji.url,id:emoji.id}, uid);
        });

        socket.on('message.get.all', async() => {
            if(CurClan == '') return socket.emit('message.get.all', false, 'Клан не авторизован');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('message.get.all', false, 'Клан не найден');
            if(!clan.public && !clan.users.some(x => x.user == GetUID())) return socket.emit('message.get.all', false, 'Недостаточно прав');
            let chatData = await chatsData.findOne({clan: clan.tag});
            if(chatData == null || chatData == undefined) chatData = await new chatsData({clan: clan.tag}).save();
            socket.emit('message.get.all', true, '', chatData.messages);
        });
        socket.on('message.send', async(text) => {
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            if(text == undefined || text == null) return socket.emit('error.handler', 'Неверно указаны аргументы');
            text = `${text}`.trim().substring(0, 1000);
            if(text.length < 2) return socket.emit('error.handler', 'Сообщение слишком короткое');
            const clan = await clansData.findOne({tag: CurClan});
            if(clan === null || clan === undefined) return socket.emit('error.handler', 'Клан не найден');
            const uid = GetUID();
            if(!clan.users.some(x => x.user == uid)) return socket.emit('error.handler', 'Вы не состоите в данном клане');
            let counts = await countsData.findOne();
            if(counts == null || counts == undefined) counts = new countsData();
            counts.messages++;
            await counts.save();
            let chatData = await chatsData.findOne({clan: clan.tag});
            if(chatData == null || chatData == undefined) chatData = new chatsData({clan: clan.tag});
            const jsn = {msg:text, date: Date.now(), user:uid, id:counts.messages, edited:false};
            chatData.messages.push(jsn);
            chatData.markModified('messages');
            await chatData.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == clan.tag)
                cl.emit('message.get', jsn);
            });
        });
        socket.on('message.edit', async(id, text) => {
            if(CurClan == '') return socket.emit('message.edit', false, 'Клан не авторизован');
            if(id == undefined || id == null || text == undefined || text == null) return socket.emit('message.edit', false, 'Неверно указаны аргументы');
            text = `${text}`.trim().substring(0, 1000);
            if(text.length < 2) return socket.emit('message.edit', false, 'Сообщение слишком короткое');
            const uid = GetUID();
            if(uid == 0) return socket.emit('message.edit', false, 'Вы не авторизованы');
            const chatData = await chatsData.findOne({clan: CurClan});
            if(chatData == null || chatData == undefined) return socket.emit('message.edit', false, 'Сообщение не найдено');
            const message = chatData.messages.find(x => x.user == uid && x.id == id);
            if(message == null || message == undefined) return socket.emit('message.edit', false, 'Сообщение не найдено');
            if(message.msg == text) return socket.emit('message.edit', false, 'Текст сообщения не был изменен');
            message.edited = true;
            message.msg = text;
            chatData.markModified('messages');
            await chatData.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == CurClan)
                cl.emit('message.edit', true, message);
            });
        });
        socket.on('message.delete', async(id) => {
            if(CurClan == '') return socket.emit('error.handler', 'Клан не авторизован');
            if(id == undefined || id == null) return socket.emit('error.handler', 'Неверно указаны аргументы');
            const uid = GetUID();
            if(uid == 0) return socket.emit('error.handler', 'Вы не авторизованы');
            const chatData = await chatsData.findOne({clan: CurClan});
            if(chatData == null || chatData == undefined) return socket.emit('error.handler', 'Сообщение не найдено');
            const message = chatData.messages.find(x => x.id == id);
            if(message == null || message == undefined) return socket.emit('error.handler', 'Сообщение не найдено');
            if(message.user != uid){
                const _acs = await GetClanAccess(uid, CurClan);
                if(_acs < 3) return socket.emit('error.handler', 'Отказано в доступе');
            }
            chatData.messages.pull(message);
            chatData.markModified('messages');
            await chatData.save();
            io.sockets.sockets.forEach(cl => {
                if(cl.session.clan == CurClan)
                cl.emit('message.delete', id);
            });
        });



        socket.on('get.all.clans', async() => {
            let _data = [];
            const clans = await clansData.find({public: true});
            for (let i = 0; i < clans.length; i++) {
                const clan = clans[i];
                _data.push({
                    tag:clan.tag,
                    name:clan.name,
                    img:clan.img,
                    color:clan.color,
                    desc:clan.desc,
                    users:clan.users.length
                });
            }
            socket.emit('get.all.clans', _data);
        });
        socket.on('get.my.clans', async() => {
            let _data = [];
            const _uid = GetUID();
            if(_uid == 0) return;
            const clans = await clansData.find();
            for (let i = 0; i < clans.length; i++) {
                const clan = clans[i];
                if(clan.users.some(x => x.user == _uid)){
                    _data.push({
                        tag:clan.tag,
                        name:clan.name,
                        img:clan.img,
                        color:clan.color,
                        desc:clan.desc,
                        users:clan.users.length
                    });
                }
            }
            socket.emit('get.my.clans', _data);
        });
    });
    const SendNewNotify = async(data, ClanTag) => {setTimeout(() => {
        io.sockets.sockets.forEach(cl => {
            if(cl.session.clan == ClanTag)
            cl.emit('get.notification', data);
        });
    }, 0)}
    const SendUpdateBalance = async(value, ClanTag) => {setTimeout(() => {
        io.sockets.sockets.forEach(cl => {
            if(cl.session.clan == ClanTag)
            cl.emit('update.balance', value);
        });
    }, 0)}
    const SendUpdateMoney = async(value, ClanTag) => {setTimeout(() => {
        io.sockets.sockets.forEach(cl => {
            if(cl.session.clan == ClanTag)
            cl.emit('update.money', value);
        });
    }, 0)}
    const JoinInClan = async(user, ClanTag) => {setTimeout(() => {
        io.sockets.sockets.forEach(cl => {
            if(cl.session.clan == ClanTag)
            cl.emit('clan.join', user);
        });
    }, 0)}
    const LeaveFromClan = async(user, ClanTag) => {setTimeout(() => {
        io.sockets.sockets.forEach(cl => {
            if(cl.session.clan == ClanTag)
            cl.emit('clan.leave', user);
        });
    }, 0)}
    const GetClanAccess = async(id, ClanTag) => {
		let access = 0;
        if(id == 0) return access;
		const clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return access;
        return GetUnSafeClanAccess(id, clan);
    }
    const GetClanAccessByData = async(id, clan) => {
		let access = 0;
        if(id == 0) return access;
		if(clan === null || clan === undefined) return access;
        return GetUnSafeClanAccess(id, clan);
    }
    const GetUnSafeClanAccess = async(id, clan) => {
		let access = 0;
        for (let i = 0; access == 0 && i < clan.users.length; i++) {
            const _cu = clan.users[i];
            if(_cu.user == id){
                access = _cu.access;
                return _cu.access;
            }
        }
        return access;
    }
    const componentToHex = (c) => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    const rgbToHex = (r, g, b) => "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    const parseRGB = (value) => {
        if(isNaN(value)) return 0;
        if(value < 0) return 0;
        if(value > 255) return 255;
        return value;
    }
};