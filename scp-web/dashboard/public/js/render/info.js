
socket.on('get.stats', async(stats) => {
    const par = document.getElementById('info.stats');
    const e1 = document.createElement('div');
    e1.className = 'card-header';
    e1.innerHTML = 'Статистика';
    par.appendChild(e1);
    const e2 = document.createElement('div');
    e2.className = 'card-body';
    if(!stats.steam.found) e2.innerHTML = 'Steam не найден';
    else e2.innerHTML = `Steam:<br>${stats.steam.money} монет<br>${stats.steam.lvl} уровень, ${stats.steam.xp}/${stats.steam.to}xp`;
    par.appendChild(e2);
    const e3 = document.createElement('div');
    e3.className = 'card-body';
    if(!stats.discord.found) e3.innerHTML = 'Discord не найден';
    else e3.innerHTML = `Discord:<br>${stats.discord.money} монет<br>${stats.discord.lvl} уровень, ${stats.discord.xp}/${stats.discord.to}xp`;
    par.appendChild(e3);
    const e4 = document.createElement('div');
    e4.className = 'card-body';
    e4.innerHTML = 'На сервере с ';
    par.appendChild(e4);
    const e5 = document.createElement('b');
    e4.appendChild(e5);
    const sf = parseInt(stats.time);
    let str_fr = 'Нет данных';
    if(!isNaN(sf)){
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        str_fr = `${new Date(sf).toLocaleString("ru", options)} (${checkDays(sf)})`;
    }
    e5.innerHTML = str_fr;
    function checkDays(date) {
        let diff = Date.now() - date;
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? " день" : days == 2 || days == 3 || days == 4 || days == 4 ? " дня" : " дней");
    };
});
socket.emit('get.stats');