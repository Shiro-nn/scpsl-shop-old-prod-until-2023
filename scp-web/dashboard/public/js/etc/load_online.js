let _onlineData = [];
window.addEventListener('load', () => {
    UpdateOnline();
    setInterval(() => UpdateOnline(), 10000);
});
socket.on('onlines', async(servers) => {
    const _par = document.getElementById('load_online');
    servers.sort(function (a, b) {return ('' + a.name).localeCompare(b.name)}).forEach((server, i) => {
        const _sid = `${server.ip}:${server.port}`;
        if(!_onlineData.some(x => x.id == _sid)){
            const e1 = document.createElement('div');
            e1.className = 'server_m';
            if(_par.children > i) _par.insertBefore(e1, _par.children[i+1]);
            else _par.appendChild(e1);
            const e2 = document.createElement('div');
            e2.className = 'server';
            e1.appendChild(e2);
            const e3 = document.createElement('p');
            e3.className = 'name';
            e3.innerHTML = server.name;
            e2.appendChild(e3);
            const e4 = document.createElement('p');
            e4.className = 'ip';
            e4.innerHTML = _sid;
            e4.addEventListener('click', () => {navigator.clipboard.writeText(e4.textContent); e4.style.color = 'lime'; setTimeout(() => e4.style.color = '', 2000);})
            e2.appendChild(e4);
            const e5 = document.createElement('p');
            e5.className = 'online';
            e5.style.position = 'relative';
            e2.appendChild(e5);
            const e6 = document.createElement('span');
            e6.className = 'span';
            e6.innerHTML = `${server.online}/${server.max}`;
            e5.appendChild(e6);
            const e7 = document.createElement('span');
            e7.className = 'hr';
            e7.style.width = `${server.online/server.max*100}%`;
            e7.innerHTML = '⠀';
            e5.appendChild(e7);
            const e8 = document.createElement('br');
            e8.className = 'display';
            document.getElementById('load_online').appendChild(e8);
            const _els = {
                main:{
                    body: e1,
                    br: e8,
                },
                name: e3,
                slots: e6,
                hr: e7,
            }
            _onlineData.push({id:_sid, elements:_els, date: Date.now()});
            return;
        }
        const _slt = `${server.online}/${server.max}`;
        const _slp = `${server.online/server.max*100}%`;
        const _cache = _onlineData.find(x => x.id == _sid);
        if(_cache.elements.name.innerHTML != server.name) _cache.elements.name.innerHTML = server.name;
        if(_cache.elements.slots.innerHTML != _slt) _cache.elements.slots.innerHTML = _slt;
        if(_cache.elements.hr.style.width != _slp) _cache.elements.hr.style.width = _slp;
        _cache.date = Date.now();
    });
    const _outdated = _onlineData.filter(x => !(x.date > Date.now() - 60000));
    _outdated.forEach(_out => {
        _out.elements.main.body.remove();
        _out.elements.main.br.remove();
    });
    _onlineData = _onlineData.filter(x => x.date > Date.now() - 60000)
});
var UpdateOnline = () => socket.emit('onlines');