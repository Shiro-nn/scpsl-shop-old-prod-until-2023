const { Webhook, MessageBuilder } = require('discord-webhook-node');
const _hookUrl = "https://discord.com/api/webhooks//";
module.exports = {
    balanceup: function(account, sum, method){
        const hook = new Webhook(_hookUrl);
        const embed = new MessageBuilder()
        .setTitle('Пополнение баланса')
        .setAuthor(account.user, account.avatar, `https://scpsl.shop/users/${account.id}`)
        .setURL('https://scpsl.shop')
        .addField('Сумма:', `${sum}₽`, true)
        .addField('Баланс:', `${account.balance}₽`, true)
        .addField('Метод:', method, true)
        .setColor('#15ff00')
        .setTimestamp();
        hook.send(embed);
    },
    donate: function(account, donate, sum, server, color){
        const hook = new Webhook(_hookUrl);
        const embed = new MessageBuilder()
        .setTitle('Новый Донат')
        .setAuthor(account.user, account.avatar, `https://scpsl.shop/users/${account.id}`)
        .setURL('https://scpsl.shop')
        .addField('Донат:', donate, true)
        .addField('Сумма:', `${sum}₽`, true)
        .addField('Сервер:', `${server}`, true)
        .setColor(color)
        .setTimestamp();
        hook.send(embed);
    },
    visualDonate: function(account, donate, sum, expires, color){
        const hook = new Webhook(_hookUrl);
        const embed = new MessageBuilder()
        .setTitle('Новый Донат')
        .setAuthor(account.user, account.avatar, `https://scpsl.shop/users/${account.id}`)
        .setURL('https://scpsl.shop')
        .addField('Донат:', donate, true)
        .addField('Сумма:', `${sum}₽`, true)
        .addField('Истекает:', expires)
        .setColor(color)
        .setTimestamp();
        hook.send(embed);
    },
    systemMessage: function(message, color) {
        const hook = new Webhook(_hookUrl);
        const embed = new MessageBuilder()
        .setText('@everyone')
        .setTitle('Системное сообщение')
        .setDescription(message)
        .setColor(color)
        .setTimestamp();
        hook.send(embed);
    }
}