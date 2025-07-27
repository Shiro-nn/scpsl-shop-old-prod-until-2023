const clansData = require('../base/clans');
const invsData = require('../base/invites');
const accountsData = require('../base/accounts');
const config = require('../config');
module.exports = async(req, res, next) => {
    //if(req.originalUrl.includes('test')) console.log(req.headers);
    const _bot = `${req.headers['user-agent']}`.toLowerCase();
    req._discordBot = _bot.includes('discordbot') || _bot.includes('twitterbot');
    if(!req._discordBot) return next();
    const _url = `${req.originalUrl}`.toLowerCase();
    switch (_url) {
        case '/info':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Информация',
                metaDesc:'Основная информация > Купленные донаты, игровая статистика на серверах'});
            break;
        case '/profile':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Профиль',
            metaDesc:'Здесь вы можете изменить настройки аккаунта, а также пополнить баланс'});
            break;
        case '/trade':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Обмен монет',
            metaDesc:'Продавайте свои монетки за рубли. Будет Скоро...'});
            break;
        case '/my/status' || '/status':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Статус серверов', metaDesc:'Статус серверов'});
            break;
        case '/style' || '/style/frame':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Список стилей', metaDesc:'Список публичных стилей'});
            break;
        case '/style/my' || '/style/frame/my':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Список стилей', metaDesc:'Список Ваших стилей'});
            break;
        case '/style/create':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Создать стиль', metaDesc:'Создайте Ваш собственный стиль'});
            break;
        case '/clans/list':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Список кланов', metaDesc:'Найдите клан для себя'});
            break;
        case '/clans/create':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Создать клан',
                metaDesc:'Хотите собственный клан? Можете создать его прямо здесь'});
            break;
        case '/admins/sl/stats':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Статистика Администрации',
                metaDesc:'Ваша административная статистика в SL отделе'});
            break;
        case '/admins/sl/list':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Администрация', metaDesc:'Администрация SL отдела'});
            break;
        case '/admins/hrp/stats':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Статистика Администрации',
                metaDesc:'Ваша административная статистика в HRP-SL отделе'});
            break;
        case '/admins/hrp/list':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Администрация', metaDesc:'Администрация HRP-SL отдела'});
            break;
        case '/donate':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne', metaTitle:'fydne | Донат',
                metaDesc:'Выберите тип доната, который хотите приобрести'});
            break;
        case '/donate/ra':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne > Донат \'Сборка админки\'', metaTitle:'fydne | Сборка админки',
                metaDesc:'Хотите собрать админ-панель под себя? Здесь Вы можете выбрать именно те права, которые нужны именно Вам'});
            break;
        case '/donate/customize':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne > Донат \'Кастомизация\'', metaTitle:'fydne | Кастомизация',
                metaDesc:'Хотите особенного персонажа? Вы можете изменить генетику своего персонажа, сделав уникальным'});
            break;
        case '/donate/roles':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne > Донат \'Готовые Роли\'', metaTitle:'fydne | Готовые Роли',
                metaDesc:'Особенные готовые роли > Радужная роль, Прайм, Священник, Маг, Мудрец и Звездочка > Каждая роль имеет свои особенности'});
            break;
        case '/donate/visual':
            res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:'fydne > Донат \'Визуал\'', metaTitle:'fydne | Визуал',
                metaDesc:'Хотите питомцев или визуальные эффекты? Вы можете выбрать их для своего персонажа'});
            break;
        default:
            if(_url.startsWith('/clans/')){
                const _cltag = `${_url.replace('/clans/', '').split('/')[0]}`.toUpperCase();
                const clan = await clansData.findOne({tag: _cltag});
                if(clan == null || clan == undefined || !clan.public) return res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn,
                    embedName:`fydne > Клан ???`, metaTitle:'fydne', metaDesc:'Клан не найден'});
                return res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:`fydne > Клан '${clan.name}'`, metaTitle:`fydne | Клан '${clan.name}'`,
                    metaDesc:clan.desc, embedImg:clan.img, embedBig:true, color:clan.color});
            }
            if(_url.startsWith('/inv/')){
                const _invtag = _url.replace('/inv/', '').split('/')[0];
                const inv = await invsData.findOne({code: _invtag});
                if(inv == null || inv == undefined) return res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn,
                    embedName:`fydne > Приглашение в клан`, metaTitle:'fydne', metaDesc:'Приглашение не найдено'});
                let clanprim = {name: 'error', img: '', color: '#ffff00'};
                const clan = await clansData.findOne({tag: inv.clan});
                if(clan != null && clan != undefined) clanprim = {name: clan.name, img: clan.img, color: clan.color};
                let metaDesc = `Вы получили приглашение в клан '${clanprim.name}'`;
                const user = await accountsData.findOne({id: inv.by});
                if(user != null && user != undefined) metaDesc = `${user.name == '' ? user.user : user.name} приглашает Вас в клан '${clanprim.name}'`;
                return res.render('modules/meta.ejs', {cdn_host:config.dashboard.cdn, embedName:`fydne > Приглашение в клан '${clanprim.name}'`, metaTitle:'fydne',
                    metaDesc, embedImg:clanprim.img, color:clanprim.color});
            }
            next();
            break;
    }
}