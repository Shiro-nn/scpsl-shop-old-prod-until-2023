socket.on('get.user.info.by.owner', async(user) => {
    document.title = `fydne | Пользователь ${user.username}`;
    document.getElementById('user.username').innerHTML = user.username;
    document.getElementById('user.avatar').style.backgroundImage = `url(${user.avatar})`;
    if(user.steam == ''){
        document.getElementById('user.steam.element').style.display = 'none';
        document.getElementById('user.steam.click').href = '';
    }else{
        document.getElementById('user.steam.element').style = '';
        document.getElementById('user.steam.click').href = `https://steamcommunity.com/profiles/${user.steam}`;
    }
    if (user.lastView) {
        const time = new Date(user.lastView);
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric'
        };
        const aria = time.toLocaleString("ru", options);
        document.querySelector('.create_date').innerHTML = 'Последний визит: ' + aria;
    }
    const achievements = document.getElementById('user.achievements');
    user.achievements.forEach(achievement => {
        if(achievement != null){
            const _e1 = document.createElement("div");
            _e1.className = 'u28';
            achievements.appendChild(_e1);
            const _e2 = document.createElement("div");
            _e2.className = 'achievement';
            _e1.appendChild(_e2);
            tippy(_e2, {content: achievement.desc, theme: 'translucent', animation: 'perspective', placement: 'bottom'});
            const _e3 = document.createElement("div");
            _e3.className = 'u29';
            _e3.style.backgroundImage = `url('${achievement.img}')`;
            _e2.appendChild(_e3);
        }
    });
});
socket.emit('get.user.info.by.owner', uid);