document.getElementById('clan.button.join').addEventListener('click', () => clanSocket.emit('event.join'));
document.getElementById('clan.button.leave').addEventListener('click', () => clanSocket.emit('event.leave'));
document.getElementById('clan.button.make.public').addEventListener('click', () => clanSocket.emit('event.make.public'));
document.getElementById('clan.button.make.private').addEventListener('click', () => clanSocket.emit('event.make.private'));
document.getElementById('clan.button.make.main').addEventListener('click', () => clanSocket.emit('event.make.main'));
document.getElementById('clan.button.invite').addEventListener('click', () => clanSocket.emit('event.invite'));


clanSocket.on('event.join', async(success, arg) => {
    if(!success) return logger.warn(arg);
    document.getElementById('clan.button.join').style.display = 'none';
    document.getElementById('clan.button.leave').style.display = '';
    if(!arg) document.getElementById('clan.button.make.main').style.display = '';
    else document.getElementById('clan.button.make.main').style.display = 'none';
});
clanSocket.on('event.leave', async(success, arg) => {
    if(!success) return logger.warn(arg);
    document.getElementById('clan.button.join').style.display = '';
    document.getElementById('clan.button.leave').style.display = 'none';
    document.getElementById('clan.button.make.public').style.display = 'none';
    document.getElementById('clan.button.make.private').style.display = 'none';
    document.getElementById('clan.button.make.main').style.display = 'none';
    document.getElementById('clan.button.invite').style.display = 'none';
});
clanSocket.on('event.make.public', async(success, arg) => {
    if(!success) return logger.warn(arg);
    document.getElementById('clan.button.make.public').style.display = 'none';
    document.getElementById('clan.button.make.private').style.display = '';
});
clanSocket.on('event.make.private', async(success, arg) => {
    if(!success) return logger.warn(arg);
    document.getElementById('clan.button.make.public').style.display = '';
    document.getElementById('clan.button.make.private').style.display = 'none';
});
clanSocket.on('event.make.main', async(success, arg) => {
    if(!success) return logger.warn(arg);
    document.getElementById('clan.button.make.main').style.display = 'none';
});
clanSocket.on('event.invite', async(success, arg) => {
    if(!success) return logger.warn(arg);
    const msg = `<span>Ваше приглашение в клан:</span><br><a target="_blank" class="loglink" href="${arg}">${arg}</a><i class="fa-light fa-copy `+
    `loginvcopy" onclick="navigator.clipboard.writeText('${arg}'); this.style.color = '#71ff5e'; setTimeout(() => this.style.color = '', 1000);"></i>`;
    logger.create(msg, 1);
});