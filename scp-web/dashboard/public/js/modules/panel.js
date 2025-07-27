const pageUrl = window.location.href.split(/[?#]/)[0];
let Balance = 0;
socket.on('connect', () => SendInitPanel());
if(socket.connected) SendInitPanel();
socket.on('get.user.main.info', async(user) => {
    document.getElementById('panel.username').innerHTML = user.username;
    document.getElementById('avatar_panel').style.backgroundImage = `url(${user.avatar})`;
    window.localStorage.setItem('panel.username', user.username);
    window.localStorage.setItem('panel.avatar', user.avatar);
});
socket.on('get.balance', async(balance) => Balance = balance);
socket.on('get.panels', async(panels) => {
    RenderPanels(panels);
    window.localStorage.setItem('local.panels', JSON.stringify(panels));
});
window.addEventListener('load', () => {
    const strItems = window.localStorage.getItem('local.panels');
    if(!strItems) return;
    const panels = JSON.parse(strItems);
    RenderPanels(panels);
});
function RenderPanels(panels) {
    const panel = document.getElementById('side-menu');
    panel.innerHTML = '';
    panels.forEach(el => {
        const e1 = document.createElement('li');
        e1.className = 'menu-title';
        e1.innerHTML = el.name;
        panel.appendChild(e1);
        const e2 = document.createElement('li');
        panel.appendChild(e2);
        el.kids.forEach(kid => {
            const k1 = document.createElement('a');
            k1.href = kid.url;
            if(k1.href == pageUrl) k1.className = 'active';
            e2.appendChild(k1);
            const k2 = document.createElement('i');
            k2.className = `${kid.fa} ${kid.icon}`;
            k1.appendChild(k2);
            const k3 = document.createElement('span');
            k3.innerHTML = kid.name;
            k1.appendChild(k3);
        });
    });
    
}
function SendInitPanel(){
    socket.emit('get.panels');
    socket.emit('get.balance');
    socket.emit('get.user.main.info', 'this');
}
function SetLocalBDBalance(){
    const bdbal = window.localStorage.getItem('panel.balance');
    if(bdbal == undefined || bdbal == null) return;
    document.getElementById('panel.balance').innerHTML = bdbal;
    Balance = parseInt(bdbal);
    if(isNaN(Balance)) Balance = 0;
}
function SetLocalBDUserName(){
    const bdname = window.localStorage.getItem('panel.username');
    if(bdname == undefined || bdname == null) return;
    document.getElementById('panel.username').innerHTML = bdname;
}
function SetLocalBDAvatar(){
    const bdava = window.localStorage.getItem('panel.avatar');
    if(bdava == undefined || bdava == null) return;
    document.getElementById('avatar_panel').style.backgroundImage = `url(${bdava})`;
}
try{SetLocalBDBalance()}catch{}
try{SetLocalBDUserName()}catch{}
try{SetLocalBDAvatar()}catch{}
let BalanceUpdating = false;
setInterval(() => CheckBalance(), 500);
async function CheckBalance(){
    if(BalanceUpdating) return;
    const el = document.getElementById('panel.balance');
    let blnc = parseInt(el.innerHTML);
    if(isNaN(blnc)) blnc = 0;
    if(Balance == 0 && blnc == 0) return el.innerHTML = 0;
    if(blnc == Balance) return;
    BalanceUpdating = true;
    while(Balance - blnc != 0){
        let mb = Balance - blnc;
        if(mb > 0){
            let min = 1;
            if(mb > 1000) min = 100;
            else if(mb > 100) min = 10;
            blnc+=min;
            el.innerHTML = blnc;
        }else{
            let min = 1;
            if(mb < -1000) min = 100;
            else if(mb < -100) min = 10;
            blnc-=min;
            el.innerHTML = blnc;
        }
        await sleep(10);
    }
    BalanceUpdating = false;
    window.localStorage.setItem('panel.balance', Balance);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}