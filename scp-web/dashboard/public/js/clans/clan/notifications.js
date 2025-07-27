(async()=>{
let ntfs = [];
const _area = document.getElementById('clan.notifications.area');
clanSocket.on('get.notification', async(notify) => RenderNotification(notify, 0));
clanSocket.on('get.notifications', async(success, error, data) => {
    if(!success) return logger.warn(error);
    if(ntfs.length > 0 && data.length == 0){
        document.getElementById('clan.notifications.load').style.display = 'none';
        _area.style.padding = '0px';
        return;
    }
    for (let i = 0; i < data.length; i++) {
        RenderNotification(data[i], 1);
    }
});

document.body.addEventListener('custom.load', () => {
    clanSocket.emit('get.notifications', 0, 0);
});
document.getElementById('clan.notifications.load').addEventListener('click', () => {
    if(ntfs.length == 0) return clanSocket.emit('get.notifications', 0, 0);
    clanSocket.emit('get.notifications', ntfs[ntfs.length - 1].date, ntfs.length);
})

function RenderNotification(data, type){
    if(ntfs.some(x => x.date == data.date)) return;
    const _dt = GetStringFromDate(data.date);

    const e1 = document.createElement('div');
    e1.className = 'nf8';
    if(type == 0 && _area.children.length > 0) _area.insertBefore(e1, _area.children[0]);
    else _area.appendChild(e1);
    const e2 = document.createElement('div');
    e2.className = 'nf9';
    e1.appendChild(e2);

    const e3 = document.createElement('p');
    e3.innerHTML = MessageToMD(data.msg);
    {
        const _urs = e3.getElementsByClassName('render.user');
        for (let i = 0; i < _urs.length; i++) {
            const _ur = _urs[i];
            const uid = _ur.id.substring(1);
            _ur.onclick = () => Render_Profile(parseInt(uid));
            setTimeout(async() => {
                const _ath = await GetUserById(uid);
                _ur.innerHTML = '@' + _ath.username;
            }, 0);
        }
    }
    e2.appendChild(e3);
    const e4 = document.createElement('i');
    e4.className = 'fa-solid fa-calendar-day nf10';
    e2.appendChild(e4);
    const e5 = document.createElement('span');
    e5.className = 'nf11';
    e5.innerHTML = _dt[0];
    e2.appendChild(e5);
    tippy(e5, {content: _dt[1], theme: 'translucent', animation: 'perspective'});

    ntfs.push(data);
}


document.body.addEventListener('custom.load', () => {
    const _par = document.getElementById('notifications');
    const _el = _par.querySelector('.nf3');
    _el.onclick = () => {
        if(_par.className.includes('nfhidden')) _par.className = '';
        else _par.className = 'nfhidden';
    }
});

})();