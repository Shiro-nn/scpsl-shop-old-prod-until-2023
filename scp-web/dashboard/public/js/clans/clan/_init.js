const clanSocket = io('https://socket.scpsl.shop', {
    auth: {
        cookie: document.cookie
    },
    path: '/clans/',
    //transports: ['websocket', 'polling']
});

const logger = new Logger();

(async() => {
await LoadScript('panel');
await LoadScript('convers');
await LoadScript('static.buttons');
await LoadScript('uploader.manager');
await LoadScript('users.manager');
await LoadScript('emoji.manager');
await LoadScript('notifications');
await LoadScript('render/news');
await LoadScript('render/users');
await LoadScript('render/boosts');
await LoadScript('render/chat');
await LoadScript('render/settings');
await LoadScript('render/_main');
await LoadScript('updater/exchequer');
await LoadScript('updater/exchequer.menu');
})();

let winLoaded = false;
window.addEventListener('load', () => winLoaded = true);
window.addEventListener('load', () => {
    const _linkList = document.querySelectorAll('link');
    for (let i = 0; i < _linkList.length; i++) {
        const _link = _linkList[i];
        const _atr = _link.getAttribute('lowhref');
        if(_atr == undefined || _atr == null) continue;
        _link.href = _atr;
        _link.setAttribute('lowhref', '');
    }
});
window.addEventListener('load', () => {
    const _linkList = document.querySelectorAll('script');
    for (let i = 0; i < _linkList.length; i++) {
        const _link = _linkList[i];
        const _atr = _link.getAttribute('lowsrc');
        if(_atr == undefined || _atr == null) continue;
        _link.src = _atr;
        _link.setAttribute('lowsrc', '');
    }
});

function LoadScript(name) {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.onload = () => resolve();
        script.src = `/js/clans/clan/${name}.js`;
        document.getElementById('scripts').appendChild(script);
    });
}

let uid = 0;
let access = 0;
clanSocket.on('clan.not.found', () => window.location.href = '/clans/list');
clanSocket.on('login', (_uid) => StaticDataRender(_uid));
async function StaticDataRender(_uid){
    uid = _uid;
    clanSocket.on('get.first.info', (data) => {
        access = data.access;
        document.getElementById('clan.set.name').innerHTML = data.name;
        {
            const _desc = document.getElementById('clan.set.desc');
            _desc.innerHTML = data.desc;
            const lngth = data.desc.length;
            if(lngth > 160) _desc.style.fontSize = '12px';
            else if(lngth > 85) _desc.style.fontSize = '15px';
        }
        try{
            updater.balance.real = data.balance;
            updater.balance.now = data.balance;
            updater.money.real = data.money;
            updater.money.now = data.money;
        }catch{}
        document.getElementById('clan.set.balance').innerHTML = data.balance + '₽';
        document.getElementById('clan.set.money').innerHTML = data.money;
        document.getElementById('clan.set.avatar').style.backgroundImage = `url(${data.img})`;
        document.getElementById('clan.style.color').innerHTML = `:root{--clan-color: ${data.color};}`;
        document.title = `fydne | Клан '${data.name}'`;
        if(data.access == 0){
            document.getElementById('clan.button.join').style.display = '';
            document.getElementById('clan.button.leave').style.display = 'none';
            document.getElementById('clan.button.make.public').style.display = 'none';
            document.getElementById('clan.button.make.private').style.display = 'none';
            document.getElementById('clan.button.make.main').style.display = 'none';
            document.getElementById('clan.button.invite').style.display = 'none';
        }else{
            document.getElementById('clan.button.join').style.display = 'none';
            document.getElementById('clan.button.leave').style.display = '';
            if(data.access >= 3){
                if(data.public){
                    document.getElementById('clan.button.make.public').style.display = 'none';
                    document.getElementById('clan.button.make.private').style.display = '';
                }else{
                    document.getElementById('clan.button.make.public').style.display = '';
                    document.getElementById('clan.button.make.private').style.display = 'none';
                }
            }else{
                document.getElementById('clan.button.make.public').style.display = 'none';
                document.getElementById('clan.button.make.private').style.display = 'none';
            }
            if(data.userClan != data.tag) document.getElementById('clan.button.make.main').style.display = '';
            else document.getElementById('clan.button.make.main').style.display = 'none';
            if(data.access >= 2) document.getElementById('clan.button.invite').style.display = '';
            else document.getElementById('clan.button.invite').style.display = 'none';
        }
        if(data.access >= 3){
            const _nt = document.getElementById('clan.news.textarea');
            _nt.disabled = false;
            _nt.placeholder = `Напишите в новости '${data.name}'`;
        }else{
            const _nt = document.getElementById('clan.news.textarea');
            _nt.disabled = true;
            _nt.placeholder = 'Вам не разрешается публиковать новости';
        }
        try{
            if(winLoaded) CallReady();
            else{
                var _cinv = setInterval(() => {
                    if(!winLoaded) return;
                    CallReady();
                    clearInterval(_cinv);
                }, 100);
            }
            function CallReady(){
                document.getElementById('window.loader').outerHTML = '';
                document.body.dispatchEvent(new Event('custom.load'));
            }
        }catch{}
    });
    clanSocket.emit('get.first.info');
}
clanSocket.on('connect', () => clanSocket.emit('login', tag));
if(clanSocket.connected) clanSocket.emit('login', tag);

clanSocket.on('error.handler', (err) => logger.warn(err));

const guid = function(){return 'xxxxxxxyxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*32|0,v=c=='x'?r:r&0x3|0x8;return v.toString(32);});}