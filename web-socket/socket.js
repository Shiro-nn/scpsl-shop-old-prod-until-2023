const accountsData = require("./base/accounts");
const tempsData = require("./base/temps");
const countsData = require("./base/counts");
const sessionsData = require('./helpers/better-sessions/mongo');
const adminsData = require("./base/admins");
const customizesData = require("./base/customize");
const visualsData = require("./base/visuals");
const rolesData = require("./base/roles");
const clansData = require("./base/clans");
const EmojisData = require("./base/emoji");
const boostsData = require("./base/boosts");
const pomocodesData = require("./base/promo_codes");
const tpsData = require("./base/tps");
const statsData = require("./base/stats");
const geoipData = require("./base/geoip");
const achievementsData = require("./base/achievements");
const DonateRoles = require('./modules/DonateRoles');
const AdminsModule = require('./modules/admins');
const ipinfo = require('ipinfo');
const crypto = require('crypto');
const crypt = require('./helpers/cryptoData');
const config = require("./config");
const { Client } = require('qurre-socket');
const { Server } = require("socket.io");
const { parse } = require('cookie');
const locationsData = require('./base/locations');

module.exports.load = async(server, _session) => {
    const io = new Server(server, {
        path: '/main/',
        cookie: true,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });
    io.use(async(socket, next) => {
        let cookietext = '';
        try{cookietext = (socket.request.headers.cookie || socket.handshake.auth.cookie)}catch{cookietext = socket.handshake.auth.cookie;}
        try{
            const cookies = parse(cookietext);
            const ck = cookies[_session.config.name];
            if(!ck) return next();
            const session = await _session.get(ck);
            session.id = ck;
            socket.session = session;
            next();
        }catch{next()}
    });
    let Sockets = [];
    const _client = new Client(2467, config.dashboard.socketIp);
    let WaitingOnlines = [];
    _client.on('socket.online.send', ([data, uid]) => {try{
        const _list = WaitingOnlines.filter(x => x.uid == uid);
        _list.forEach(_el => {
            const _socket = io.sockets.sockets.get(_el.socket);
            _socket.emit('onlines', data);
        });
    }catch{}});

    let WaitingIPS = [];
    _client.on('web.getips', async([data, uid]) => {try{
        let locs = [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const _loc = await GetLocByIp(element.ip);
            locs.push({ loc: _loc, userid: element.userid, nick: element.nick });
        }
        const _list = WaitingIPS.filter(x => x.uid == uid);
        _list.forEach(_el => {
            const _socket = io.sockets.sockets.get(_el.socket);
            _socket.emit('web.getips', locs);
        });
    }catch{}});

    async function GetLocByIp(ip) {
        let geoip = await geoipData.findOne({ip});
        if(geoip == null){
            const _dt = await sendipreq();
            if(_dt != undefined){
                geoip = new geoipData({
                    ip:_dt.ip,
                    city:_dt.city,
                    region:_dt.region,
                    country:_dt.country,
                    loc:_dt.loc,
                    org:_dt.org,
                    postal:_dt.postal,
                    timezone:_dt.timezone
                });
                await geoip.save();
                return geoip.loc;
            }
            return '0,0';
        }
        else return geoip.loc;
        function sendipreq() {
            return new Promise(resolve => ipinfo(ip, '').then(async data => resolve(data)).catch(() => resolve(undefined)));
        }
    }
    io.on('connection', (socket) => {
        const _cookie = crypt.sha256(socket.session?.id ?? '');
        let session = socket.session;
        function GetUID(){
            if(session == undefined || session == null) return 0;
            if(session.user == undefined || session.user == null) return 0;
            return session.user.id;
        }
        function GetLogin(){
            if(session == undefined || session == null) return '';
            if(session.user == undefined || session.user == null) return '';
            return session.user.user;
        }
        let CurClan = '';
        console.log(`Connected: ${socket.id}`);

        (async() => {
            let user = GetUID();

            if (user == 0) {
                return;
            }

            const userData = await accountsData.findOne({id: user});
            if(userData) {
                userData.last_active = Date.now();
                await userData.save();
            }
        })();

        socket.on('initial', (clan) => {
            CurClan = clan;
            let user = GetUID();
            Sockets.push({socket:socket.id, user, clan});
            socket.emit('you', user);
        });
        socket.on('disconnect', () => {
            if(CurClan != '') Sockets = Sockets.filter(x => x.socket != socket.id);
            WaitingOnlines = WaitingOnlines.filter(x => x.socket != socket.id);
            WaitingIPS = WaitingIPS.filter(x => x.socket != socket.id);
        });

        socket.on('auth.verify.check', async(key) => {
            const temp = await tempsData.findOne({uid:key});
            if(temp == null || temp == undefined) return socket.emit('auth.verify.check', true, 'Аккаунт не найден');
            if(!validateEmail(temp.email)) return socket.emit('auth.verify.check', true, 'Не удалось проверить почту');
            if(await accountsData.exists({email:temp.email})) return socket.emit('auth.verify.check', true, 'Аккаунт с данной почтой уже зарегистрирован');
            if(await accountsData.exists({user:temp.login})) return socket.emit('auth.verify.check', true, 'Аккаунт с данным логином уже зарегистрирован');
            const login = temp.login;
            if(login.length < 3) return socket.emit('auth.verify.check', true, 'В логине менее 3-х символов');
            let counts = await countsData.findOne();
            if(counts == null || counts == undefined) counts = await (new countsData()).save();
            counts.accounts += 1;
            await counts.save();
            await (new accountsData({id: counts.accounts, email: temp.email, user: temp.login, pass: temp.pass, name:temp.nick, date: GetDateTime()})).save();
            socket.emit('auth.verify.check', false, 'Аккаунт зарегистрирован');
            temp.deleteOne();

            function validateEmail(e) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(e);
            }
            function GetDateTime() {
                var date = new Date();
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
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
                if (parseInt(second) < 10) {
                    var t = "0";
                    t += second;
                    second = t;
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
                var time = day + "." + month + "." + year + " " + hour + ':' + minute + ':' + second;
                return time;
            };
        });
        socket.on('auth.sessions.get', async() => {
            const uid = GetUID();
            if(uid == 0) return socket.emit('auth.sessions.get', true, 'Вы не авторизованы');
            const sessions = await sessionsData.find({account: uid});
            let arr = [];
            sessions.forEach(session => {
                arr.push({
                    current: session.id == _cookie,
                    browser: session.browser,
                    loc: session.loc,
                    os: session.os,
                    expires: session.expires,
                    hash: session.id,
                    last: session.last,
                })
            });
            socket.emit('auth.sessions.get', false, arr);
        });
        socket.on('auth.sessions.close', async(hash) => {
            const uid = GetUID();
            if(uid == 0) return socket.emit('auth.sessions.close', true, 'Вы не авторизованы');
            const session = await sessionsData.findOne({id: hash, account: uid});
            if(session) session.deleteOne();
            socket.emit('auth.sessions.close', false, hash);
        });

        socket.on('info.auth', () => socket.emit('info.auth', GetUID() > 0));
        socket.on('get.uid', async() => socket.emit('get.uid', GetUID()));
        socket.on('get.panels', async() => {
            const panels = [
                {
                    name: 'Навигация',
                    kids: [
                        {name: 'Информация', url: '/info', icon: 'fa-info-circle', fa: 'fa-solid'},
                        {name: 'Настройки', url: '/profile', icon: 'fa-lock', fa: 'fa-solid'},
                        {name: 'Сессии', url: '/sessions', icon: 'fa-signal', fa: 'fa-solid'},
                        {name: 'Статус', url: '/status', icon: 'fa-exclamation-circle', fa: 'fa-solid'},
                        //{name: 'Обмен монет', url: '/trade', icon: 'fa-money-bill', fa: 'fa-solid'},
                        {name: 'TPS', url: '/tps', icon: 'fa-server', fa: 'fa-solid'},
                    ]
                },
                {
                    name: 'Стили',
                    kids: [
                        {name: 'Публичные стили', url: '/style', icon: 'fa-group', fa: 'fa-solid'},
                        {name: 'Свои стили', url: '/style/my', icon: 'fa-user', fa: 'fa-solid'},
                        {name: 'Создать стиль', url: '/style/create', icon: 'fa-css3', fa: 'fab'},
                    ]
                },
                {
                    name: 'Кланы',
                    kids: [
                        {name: 'Список кланов', url: '/clans/list', icon: 'fa-chess-rook', fa: 'fa-solid'},
                        {name: 'Создать клан', url: '/clans/create', icon: 'fa-chess-queen', fa: 'fa-solid'},
                    ]
                },
            ];
            const uid = GetUID();
            const adminData = await adminsData.findOne({id:uid});
            if(adminData != null && adminData != undefined){
                if(AdminsModule.ItsSlAdmin(adminData)) panels.push({
                    name: 'Администрация',
                    kids: [
                        {name: 'Администрация', url: '/admins', icon: 'fa-eye', fa: 'fa-solid'},
                    ]
                });
            }
            if(uid == 1){
                panels.push({
                    name: 'Верховный отдел',
                    kids: [
                        {name: 'Контроль Донатеров', url: '/donate/manage', icon: 'fa-info-circle', fa: 'fa-solid'},
                        {name: 'Системный отдел', url: '/system', icon: 'fa-server', fa: 'fa-solid'},
                    ]
                });
                panels.push({
                    name: 'Карты',
                    kids: [
                        {name: '', url: '/locations/latest', icon: 'fa-city', fa: 'fa-solid'},
                        {name: '', url: '/locations', icon: 'fa-map-location', fa: 'fa-solid'},
                        {name: '', url: '/servers_map', icon: 'fa-map-location', fa: 'fa-solid'},
                    ]
                });
                panels.push({
                    name: 'Комьюнити',
                    kids: [
                        {name: 'Промокоды', url: '/community/promocodes', icon: 'fa-ticket', fa: 'fa-solid'},
                        {name: 'Ачивки', url: '/community/achievements', icon: 'fa-trophy', fa: 'fa-solid'},
                        {name: 'Бусты', url: '/community/boosts', icon: 'fa-arrow-circle-up', fa: 'fa-solid'},
                        {name: 'Эмодзи', url: '/community/emojis', icon: 'fa-smile', fa: 'fa-solid'},
                    ]
                });
            }
            socket.emit('get.panels', panels);
        });
        socket.on('web.get_latest_locations', async(server, initDate, endDate) => {
            if(GetUID() != 1) return;

            let search = {};
            let date = {};

            if (!isNullOrEmpty(initDate)) {
                date['$gte'] = new Date(initDate);
            }
            if (!isNullOrEmpty(endDate)) {
                date['$lte'] = new Date(endDate);
            }

            if (server) {
                search.server = server;
            }
            if (!isNullOrEmpty(initDate) || !isNullOrEmpty(endDate)) {
                search.date = date;
            }

            const location = await locationsData.find(search);
            socket.emit('web.get_latest_locations', location);

            function isNullOrEmpty(str) {
                return !str || str.trim().length === 0;
            }
        });
        socket.on('web.getips', async() => {
            if(GetUID() != 1) return;
            const _uid = guid();
            WaitingIPS.push({uid:_uid, socket:socket.id})
            _client.emit('web.getips', _uid);
        });
        socket.on('steam.empty', async() => {
            const uid = GetUID();
            if(uid == 0) return;
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return;
            socket.emit('steam.empty', userData.steam == '');
        });
        socket.on('get.balance', async() => {
            const uid = GetUID();
            if(uid == 0) return;
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return;
            socket.emit('get.balance', userData.balance);
        });
        socket.on('get.profile', async() => {
            const uid = GetUID();
            if(uid == 0) return;
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return;
            const AllAchievements = await achievementsData.find();
            let achievements = [];
            userData.achievements.forEach(function(achieve) {
                let achievement = AllAchievements.filter(x => x.name == achieve)[0];
                if(achievement != null) achievements.push({img: achievement.img, desc: achievement.desc});
            });
            socket.emit('get.profile', {
                steam:userData.steam,
                discord:userData.discord,
                id:userData.id,
                balance:userData.balance,
                prefix:userData.prefix,
                name:userData.name,
                avatar:userData.avatar,
                banner:userData.banner,
                username:(userData.name == '' ? userData.user : userData.name),
                achievements,
            });
        });
        socket.on('get.stats', async() => {
            const uid = GetUID();
            if(uid == 0) return;
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return;
            const _data = {steam:{found:false}, discord:{found:false}, time:userData.time}
            if(userData.steam != ''){
                const stat = await statsData.findOne({steam: userData.steam});
                if(stat != null && stat != undefined)
                _data.steam = {found:true, money:stat.money, lvl:stat.lvl, xp:stat.xp, to:stat.to};
            }
            if(userData.discord != ''){
                const stat = await statsData.findOne({discord: userData.discord});
                if(stat != null && stat != undefined)
                _data.discord = {found:true, money:stat.money, lvl:stat.lvl, xp:stat.xp, to:stat.to};
            }
            socket.emit('get.stats', _data);
        })
        socket.on('get.admins', async(type) => {
            const uid = GetUID();
            if(uid == 0) return;
            const adminData = await adminsData.findOne({id:uid});
            if(adminData == null || adminData == undefined) return;
            if(type == 1){if(!AdminsModule.ItsSlAdmin(adminData)) return;}
            else if(type == 2){if(!AdminsModule.ItsHrpSlAdmin(adminData)) return;}
            else return;
            const allAdminsData = await adminsData.find({sabbatical: false});
            if(type == 1) return socket.emit('get.admins', type, adminData, allAdminsData.filter(x => AdminsModule.ItsSlAdmin(x) && x.id != 1));
            if(type == 2) return socket.emit('get.admins', type, adminData, allAdminsData.filter(x => AdminsModule.ItsHrpSlAdmin(x)));
        });
        socket.on('get.admin.data', async(uid, guid) => {
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return;
            const _json = {avatar:userData.avatar, username:(userData.name == '' ? userData.user : userData.name), steam:'', discord: ''};
            if(GetUID() == 1){
                _json.steam = userData.steam;
                _json.discord = userData.discord;
            }
            socket.emit('get.admin.data', _json, guid);
        });
        socket.on('get.user.info.by.owner', async(uid) => {
            if(GetUID() != 1) return;
            const userData = await accountsData.findOne({id:uid});
            if(userData == null || userData == undefined) return;
            const AllAchievements = await achievementsData.find();
            let achievements = [];
            userData.achievements.forEach(function(achieve) {
                let achievement = AllAchievements.filter(x => x.name == achieve)[0];
                if(achievement != null) achievements.push({img: achievement.img, desc: achievement.desc});
            });
            socket.emit('get.user.info.by.owner', {
                avatar:userData.avatar, steam:userData.steam, achievements,
                username:(userData.name == '' ? userData.user : userData.name),
                lastView: userData.last_active
            });
        });
        socket.on('access', async() => {
            if(CurClan == '') return;
            const access = await GetClanAccess(GetUID(), CurClan);
            socket.emit('access', access);
        });
        socket.on('UsersAccess', async() => {
            if(CurClan == '') return;
            const clan = await clansData.findOne({ tag: CurClan });
            if(clan === null || clan === undefined) return;
            let lvl1 = [], lvl2 = [], lvl3 = [], lvl4 = [], lvl5 = [];
            clan.users.filter(x => x.access == 1).forEach(user => lvl1.push(user.user));
            clan.users.filter(x => x.access == 2).forEach(user => lvl2.push(user.user));
            clan.users.filter(x => x.access == 3).forEach(user => lvl3.push(user.user));
            clan.users.filter(x => x.access == 4).forEach(user => lvl4.push(user.user));
            clan.users.filter(x => x.access == 5).forEach(user => lvl5.push(user.user));
            socket.emit('UsersAccess', {lvl1, lvl2, lvl3, lvl4, lvl5});
        });
        socket.on('donate_roles', async() => socket.emit('donate_roles', DonateRoles));
        socket.on('GetRole', async(_id) => {
            let _json = {_id, owner:GetUID()};
            if(_json.owner == 0) return;
            if(_json.owner == 1) _json = {_id};
            const _role = await rolesData.findOne(_json);
            if(_role === null || _role === undefined) return;
            socket.emit('GetRole', _role);
        });
        socket.on('ChangeFreezeRole', async(_id, uid) => {
            let _json = {_id, owner:GetUID()};
            if(_json.owner == 0) return;
            if(_json.owner == 1) _json = {_id};
            const _role = await rolesData.findOne(_json);
            if(_role === null || _role === undefined) return;
            let error_code = 0;
            if(_role.freezed){
                _role.freezed = false;
                if(_role.freeze_start !== 0) {
                    let inFreeze = Date.now() - _role.freeze_start;
                    _role.freeze_last -= inFreeze;
                    _role.expires += inFreeze;
                }
                _role.freeze_start = 0;
                _role.freeze_last = Date.now();
                try{
                    const adminData = await adminsData.findOne({id:_role.owner});
                    if(adminData && AdminsModule.ItsSlAdmin(adminData)) _role.freeze_last = 0;
                }catch{}
            }else if(_role.freeze_available < 1){
                error_code = 2;
            }else if(Date.now() - _role.freeze_last < 24 * 60 * 60 * 1000){
                error_code = 1;
            }else{
                _role.freezed = true;
                _role.freeze_start = Date.now();
            }
            await _role.save();
            socket.emit('ChangeFreezeRole', uid, error_code);
            socket.emit('GetRole', _role);
            if(error_code == 0) _client.emit('SendToSCPChangeRoleStatus', _role);
        });
        socket.on('SendToSCPChangeRoleStatus', async(role) => {
            const address = socket.handshake.address?.replace('::ffff:', '');
            if(address != '::1' && address != '127.0.0.1' && address != config.dashboard.socketIp) return;
            _client.emit('SendToSCPChangeRoleStatus', role);
        });
        socket.on('visual.get', async() => {
            const uid = GetUID();
            if(uid == 0) return;
            const _vis = await visualsData.findOne({owner:uid});
            if(_vis == null || _vis == undefined) return socket.emit('visual.get', GetVisData(uid));
            socket.emit('visual.get', _vis);
            function GetVisData(owner){
                return {
                    owner,
                    active: false,
                    expires: 0,
                    sum: 0,
                    root: {
                        nimb: false,
                        light: false,
                        doctor: false,
                        flasher: false,
                    },
                    ClassD: {
                        nimb: true,
                        light:{
                            buy: true,
                            color: {r: 255, g: 0, b: 0}
                        },
                        doctor: true,
                        flasher: true,
                    },
                    Scientist: {
                        nimb: true,
                        light:{
                            buy: true,
                            color: {r: 255, g: 0, b: 0}
                        },
                        doctor: true,
                        flasher: true,
                    },
                    Guard: {
                        nimb: true,
                        light:{
                            buy: true,
                            color: {r: 255, g: 0, b: 0}
                        },
                        doctor: true,
                        flasher: true,
                    },
                    MTF: {
                        nimb: true,
                        light:{
                            buy: true,
                            color: {r: 255, g: 0, b: 0}
                        },
                        doctor: true,
                        flasher: true,
                    },
                    Chaos: {
                        nimb: true,
                        light:{
                            buy: true,
                            color: {r: 255, g: 0, b: 0}
                        },
                        doctor: true,
                        flasher: true,
                    },
                    Hand: {
                        nimb: true,
                        light:{
                            buy: true,
                            color: {r: 255, g: 0, b: 0}
                        },
                        doctor: true,
                        flasher: true,
                    },
                };
            }
        });
        socket.on('customize', async() => {
            const customizeData = await customizesData.findOne({ owner: GetLogin() });
            if(customizeData == null || customizeData == undefined) return;
            socket.emit('customize', {sum:customizeData.sum, scales:customizeData.scales, genetics:customizeData.genetics, expires:customizeData.to});
        });
        socket.on('ur_salt', async(user) => {
            //const address = socket.handshake.address?.replace('::ffff:', '').replace('::1', '127.0.0.1');
            const hashed = sha256(/*address + */user);
            socket.emit('ur_salt', hashed);
        });
        socket.on('username', async(user, uid) => {
            if(user == 'this') user = GetUID();
            const userData = await accountsData.findOne({ id: user });
            if(userData == null || userData == undefined) return;
            socket.emit('username', (userData.name == '' ? userData.user : userData.name), uid);
        });
        socket.on('my.balance', async() => {
            const userData = await accountsData.findOne({ id: GetUID() });
            if(userData == null || userData == undefined) return;
            socket.emit('my.balance', userData.balance);
        });
        socket.on('get.user.main.info', async(user, uid) => {
            if(user == 'this') user = GetUID();
            const userData = await accountsData.findOne({id:user});
            if(userData == null || userData == undefined) return;
            socket.emit('get.user.main.info', {username: (userData.name == '' ? userData.user : userData.name), avatar: userData.avatar, id: userData.id}, uid);
        });
        socket.on('avatar', async(user, uid) => {
            if(user == 'this') user = GetUID();
            const userData = await accountsData.findOne({id: user});
            if(userData == null || userData == undefined) return;
            socket.emit('avatar', userData.avatar, uid);
        });
        socket.on('clan.is.main', async(clan) => {
            const userData = await accountsData.findOne({id: GetUID()});
            if(userData == null || userData == undefined) return;
            socket.emit('clan.is.main', userData.clan == clan.toUpperCase());
        });
        socket.on('emoji_data', async(emj, uid) => {
            const emoji = await EmojisData.findOne({id: emj});
            if(emoji == null || emoji == undefined) return;
            socket.emit('emoji_data', {name:emoji.name,url:emoji.url,id:emoji.id}, uid);
        });
        socket.on('emoji_all', async() => {
            const emojis = await EmojisData.find();
            socket.emit('emoji_all', emojis);
        });
        socket.on('boosts', async(BoostId, uid) => {
            const boost = await boostsData.findOne({id: BoostId});
            if(boost === null || boost === undefined) return;
            socket.emit('boosts', {id: boost.id, name: boost.name, img: boost.img, sum: boost.sum}, uid);
        });
        socket.on('promocode', async(promo, uid) => {
            const promoData = await pomocodesData.findOne({code: promo.toLowerCase()});
            if(promoData == null || promoData == undefined) return socket.emit('promocode', null, true, uid);
            if(promoData.owner == GetLogin()) return socket.emit('promocode', null, true, uid);
            socket.emit('promocode', {code: promoData.code, owner: promoData.owner, to_owner: promoData.to_owner, to_user: promoData.to_user}, false, uid);
        });
        socket.on('onlines', async() => {
            const _uid = guid();
            WaitingOnlines.push({uid:_uid, socket:socket.id})
            _client.emit('website.online.get', _uid);
        });
        socket.on('tps', async() => {
            let tps = await tpsData.find();
            socket.emit('tps', tps);
        });
        socket.on('profile', async(id) => {
            const AllAchievements = await achievementsData.find();
            const userData = await accountsData.findOne({id});
            if(userData == null || userData == undefined) return socket.emit('profile', {}, true);
            let achievements = [];
            userData.achievements.forEach(function(achieve) {
                let achievement = AllAchievements.filter(x => x.name == achieve)[0];
                if(achievement != null) achievements.push({img: achievement.img, desc: achievement.desc});
            });
            let access = 0;
            let color = 'red';
            let public = false;
            const clan = await clansData.findOne({ tag: userData.clan });
            const role = await rolesData.findOne({owner:userData.id, id:2, freezed:false})
            if(clan != null && clan != undefined){
                if(clan.users.filter(x => x.user == userData.id).length > 0) access = clan.users.filter(x => x.user == userData.id)[0].access;
                color = clan.color;
                public = clan.public;
            }
            socket.emit('profile', {
                username: (userData.name == '' ? userData.user : userData.name),
                avatar: userData.avatar,
                banner: userData.banner,
                clan: userData.clan,
                prime: (role != null && role != undefined),
                achievements,
                access, color, public
            }, false);
        });
    });
    const GetClanAccess = async(user, ClanTag) => {
		let access = 0;
        if(user == 0) return access;
		const clan = await clansData.findOne({ tag: ClanTag });
		if(clan === null || clan === undefined) return access;
		const userData = await accountsData.findOne({ id: user });
        if(userData == null || userData == undefined) return access;
		if(clan.users.filter(x => x.user == userData.id).length > 0) access = clan.users.filter(x => x.user == userData.id)[0].access;
        return access;
    }
    const sha256 = function(str) {
        return crypto.createHash('sha256').update(str).digest('hex');
    }
    const guid = function(){return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {let r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}