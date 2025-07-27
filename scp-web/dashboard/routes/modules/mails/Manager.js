const { SMTPClient } =  require('../emailjs');
const DonateServers = require('../DonateServers');
const DateToString = require('../DateToString');
const WebHooks = require('./WebHooks');
const TgHook = require('./TgHook');
const Messages = require('./messages/index');
const platform = require('platform');
const servers = {
    accounts: new SMTPClient({host:'smtp.zoho.eu',user:'@scpsl.shop',password:'',ssl:true}), //
    ips: new SMTPClient({host:'smtp.zoho.eu',user:'@scpsl.shop',password:'',ssl:true}), //
    donates: new SMTPClient({host:'smtp.zoho.eu',user:'@scpsl.shop',password:'',ssl:true}) //
}

const sends = {
    accounts: {
        verify: function(nick, email, link, callback) {
            servers.accounts.send({
                from: 'Уведомление аккаунта <@scpsl.shop>',
                to: email,
                subject: 'Подтверждение почты',
                text: 'Не удалось загрузить контент сообщения',
                attachment: [Messages.verify(nick, link)]
            }, callback);
        },
        reset: function(account, ipinfo, useragent, link, callback) {
            const browser = platform.parse(useragent)?.toString();
            const username = account.name == '' ? account.user : account.name;
            servers.accounts.send({
                from: 'Уведомление аккаунта <@scpsl.shop>',
                to: account.email,
                subject: 'Запрос на сброс пароля',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.reset(username, ipinfo, browser, link)
            }, callback);
        },
        changed: function(account, ipinfo, useragent) {
            const browser = platform.parse(useragent)?.toString();
            const username = account.name == '' ? account.user : account.name;
            servers.accounts.send({
                from: 'Уведомление аккаунта <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление об изменении пароля',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.changed(username, ipinfo, browser)
            });
        },
    },
    ips: function(account, ipinfo, useragent)
    {
        const browser = platform.parse(useragent)?.toString();
        const username = account.name == '' ? account.user : account.name;
        servers.ips.send({
            from: 'Система безопасности <@scpsl.shop>',
            to: account.email,
            subject: 'Уведомление о входе в аккаунт',
            text: 'Не удалось загрузить контент сообщения',
            attachment: Messages.ips(username, ipinfo, browser)
        });
    },
    donates:{
        balanceup: function(account, sum, method, sendHooks = true)
        {
            const username = account.name == '' ? account.user : account.name;
            servers.donates.send({
                from: 'Логгер баланса <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление о пополнении баланса',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.balanceup(username, account.balance, sum, method)
            }, () => {});
            if(sendHooks){
                WebHooks.balanceup({user:username, avatar:account.avatar, id:account.id, balance:account.balance}, sum, method);
                TgHook(`Пополнение баланса\n${username} пополнил баланс на ${sum}₽\nМетод: ${method}\nТекущий баланс: ${account.balance}₽`);
            }
        },
        role: function(account, name, color, sum, server)
        {
            const username = account.name == '' ? account.user : account.name;
            servers.donates.send({
                from: 'Логгер покупок <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление о покупке привилегии',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.donate(username, account.balance, 'Готовая роль', color, sum, name, server)
            });
            WebHooks.donate({user:username, avatar:account.avatar, id:account.id}, name, sum, server, color);
        },
        ra: function(account, donate, sum)
        {
            const username = account.name == '' ? account.user : account.name;
            const server = DonateServers.GetById(donate.server);
            servers.donates.send({
                from: 'Логгер покупок <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление о покупке привилегии',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.donate(username, account.balance, 'Сборка админки', donate.color, sum, donate.prefix, server)
            });
            WebHooks.donate({user:username, avatar:account.avatar, id:account.id}, donate.prefix, sum, server, donate.color);
        },
        customize: function(account, sum, expires)
        {
            if(sum < 1) return;
            const _expires = DateToString(new Date(expires));
            const username = account.name == '' ? account.user : account.name;
            servers.donates.send({
                from: 'Логгер покупок <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление о покупке кастомизации',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.visualDonate(username, account.balance, 'Кастомизация', 'кастомизации', sum, _expires)
            });
            WebHooks.visualDonate({user:username, avatar:account.avatar, id:account.id}, 'Кастомизация', sum, _expires, '#2283bf');
        },
        visual: function(account, sum, expires, type)
        {
            const _expires = DateToString(new Date(expires));
            console.log(_expires);
            const username = account.name == '' ? account.user : account.name;
            servers.donates.send({
                from: 'Логгер покупок <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление о покупке визуала',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.visualDonate(username, account.balance, 'Визуал', 'визуала', sum, _expires, type)
            });
            WebHooks.visualDonate({user:username, avatar:account.avatar, id:account.id}, `Визуал (${type})`, sum, _expires, '#d108ba');
        },
        unfreeze: function(account, name)
        {
            const username = account.name == '' ? account.user : account.name;
            servers.donates.send({
                from: 'Уведомления <@scpsl.shop>',
                to: account.email,
                subject: 'Уведомление о разморозке доната',
                text: 'Не удалось загрузить контент сообщения',
                attachment: Messages.unfreeze(username, name)
            });
        }
    },
    pays: {
        boostyTokenExpires: function(message)
        {
            WebHooks.systemMessage(message, '#ff0000');
            TgHook(message);
        },
    }
}
module.exports = sends;