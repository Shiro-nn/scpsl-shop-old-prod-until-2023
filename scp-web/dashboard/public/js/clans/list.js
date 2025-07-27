(async() => {
const clanSocket = io('https://socket.scpsl.shop', {
    auth: {
        cookie: document.cookie
    },
    path: '/clans/',
    //transports: ['websocket', 'polling']
});
let allclans = [];
let myclans = [];
{
const el = document.querySelector('.clans-list-page .clans-list-page-search');
el.addEventListener('input', () => UpdateSearch(0, el.value));
}
{
const el = document.querySelector('.clans-list-user .clans-list-page-search');
el.addEventListener('input', () => UpdateSearch(1, el.value));
}
function UpdateSearch(id, value){
    let _clans = [];
    if(id == 0) _clans = allclans;
    else if(id == 1) _clans = myclans;
    else return;
    if(value.length == 0){
        for (let i = 0; i < _clans.length; i++) {
            try{_clans[i].el.style.display = '';}catch{}
        }
        return;
    }
    const tvl = value.toLowerCase();
    for (let i = 0; i < _clans.length; i++) {
        const clan = _clans[i];
        if(!clan.clan.name.toLowerCase().includes(tvl) && !clan.clan.tag.toLowerCase().includes(tvl)) try{clan.el.style.display = 'none';}catch{}
        else try{clan.el.style.display = '';}catch{}
    }
}
/*
clanSocket.on('get.all.clans', async(clans) => {
    const random = Math.min(Math.abs(Math.round((Math.random() + Math.random() - Math.random()) * 100)), 100);
    clans = clans.sort((a, b) => b.users - a.users);

    const notSetupClans = clans.filter(x => x.img.endsWith('unknow.png'));
    clans = clans.filter(x => !x.img.endsWith('unknow.png'));

    let arr = [];
    console.log(random)

    if(25 >= random){
        arr.push(...(clans.reverse()));
        clans = [];
    }

    let _big = true;
    while(clans.length > 0){
        if(_big){
            arr.push(clans[0]);
            clans = clans.slice(1);
        }else{
            arr.push(clans[clans.length - 1]);
            clans = clans.slice(0, clans.length - 1);
        }
        _big = !_big;
    }

    if(random >= 75){
        arr = arr.reverse();
    }

    arr.push(...notSetupClans);

    const _par = document.getElementById('list.all');
    _par.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        const clan = arr[i];
        const el = CreateClan(clan, _par);
        allclans.push({clan, el});
    }
});
*/
clanSocket.on('get.all.clans', async(clans) => {
    clans = clans.sort((a, b) => b.users - a.users);

    const notSetupClans = clans.filter(x => x.img.endsWith('unknow.png'));
    clans = clans.filter(x => !x.img.endsWith('unknow.png'));
    clans.push(...notSetupClans);

    const _par = document.getElementById('list.all');
    _par.innerHTML = '';
    for (let i = 0; i < clans.length; i++) {
        const clan = clans[i];
        const el = CreateClan(clan, _par);
        allclans.push({clan, el});
    }
});
clanSocket.on('get.my.clans', async(clans) => {
    clans = clans.sort((a, b) => b.users - a.users);
    const _par = document.getElementById('list.my');
    _par.innerHTML = '';
    for (let i = 0; i < clans.length; i++) {
        const clan = clans[i];
        const el = CreateClan(clan, _par);
        myclans.push({clan, el});
    }
});
function CreateClan(clan, parent){
    const e1 = document.createElement('div');
    e1.className = 'clan-page';
    parent.appendChild(e1);
    {
        const e2 = document.createElement('img');
        e2.className = 'clan-page-img';
        e2.src = clan.img;
        e1.appendChild(e2);
    }
    {
        const e2 = document.createElement('h4');
        e1.appendChild(e2);

        const e3 = document.createElement('span');
        e3.className = 'clan-name';
        e3.innerHTML = clan.name;
        e2.appendChild(e3);
        
        const e4 = document.createElement('a');
        e4.className = 'w8';
        e4.href = '/clans/'+clan.tag;
        e2.appendChild(e4);
        
        const e5 = document.createElement('span');
        e5.className = 'w9';
        e5.innerHTML = clan.tag;
        e4.appendChild(e5);
        
        const e6 = document.createElement('div');
        e6.className = 'w10';
        e6.style.backgroundColor = clan.color;
        e4.appendChild(e6);
    }
    {
        const e2 = document.createElement('p');
        e2.className = 'clan-desc';
        e2.innerHTML = clan.desc;
        e1.appendChild(e2);
    }
    {
        const e2 = document.createElement('p');
        e2.innerHTML = `В данном клане <b style="color: white;">${clan.users}</b> участников`;
        e1.appendChild(e2);
    }
    {
        const e2 = document.createElement('button');
        e2.className = 'go-clan-btn';
        e2.innerHTML = 'Перейти к клану';
        e2.onclick = () => window.location.href = '/clans/'+clan.tag;
        e1.appendChild(e2);
    }
    return e1;
}
clanSocket.emit('get.all.clans');
clanSocket.emit('get.my.clans');
})();