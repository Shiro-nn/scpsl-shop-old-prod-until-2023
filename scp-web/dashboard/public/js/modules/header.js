const HeaderElements = {
    menu: null,
    button: null,
    username: null,
    nickname: 'unknow',
};
function SetLocalBDUserNameHeader(){
    const bdname = window.localStorage.getItem('panel.username');
    if(bdname == undefined || bdname == null) return;
    HeaderElements.nickname = bdname;
}
try{SetLocalBDUserNameHeader()}catch{}
const headerUserNameUid = 'header.username.uid';
socket.on('username', (username, uid) => {
    if(uid != headerUserNameUid) return;
    HeaderElements.nickname = username;
    if(HeaderElements.username != null) HeaderElements.username.innerHTML = username;
});
socket.on('my.balance', (balance) => {
    document.querySelector('#balanceup .balance').innerHTML = `${balance} ₽`;
});
socket.on('info.auth', async(auth) => {
    const evmenu = document.getElementById('header.evmenu');
    evmenu.innerHTML = '';
    const e1 = document.createElement('li');
    e1.className = 'dropdown notification-list';
    evmenu.appendChild(e1);
    if(auth){
        const e2 = document.createElement('a');
        e2.className = 'nav-link dropdown-toggle nav-user mr-0 waves-effect';
        e1.appendChild(e2);
        const e3 = document.createElement('span');
        e3.innerHTML = HeaderElements.nickname;
        e2.appendChild(e3);
        const e4 = document.createElement('div');
        e4.className = 'dropdown-menu dropdown-menu-right profile-dropdown';
        e1.appendChild(e4);
        HeaderElements.button = e2;
        HeaderElements.menu = e4;
        HeaderElements.username = e3;
        e2.addEventListener("click", () => {
            if(e4.className.includes(' show')) e4.className = e4.className.replace(' show', '');
            else e4.className += ' show';
        });
        {
            const e5 = document.createElement('a');
            e5.className = 'dropdown-item notify-item red';
            e5.href = '/info';
            e4.appendChild(e5);
            const e7 = document.createElement('img');
            e7.src = _header_cdn+'/scpsl/img/panel/user-solid.svg';
            e5.appendChild(e7);
            const e8 = document.createElement('span');
            e8.innerHTML = 'Настройки';
            e5.appendChild(e8);
            const e6 = document.createElement('div');
            e6.className = 'dropdown-divider';
            e4.appendChild(e6);
        }
        {
            const e5 = document.createElement('a');
            e5.className = 'dropdown-item notify-item';
            e5.href = '/donate';
            e4.appendChild(e5);
            const e7 = document.createElement('img');
            e7.src = _header_cdn+'/scpsl/img/panel/dollar-sign-solid.svg';
            e5.appendChild(e7);
            const e8 = document.createElement('span');
            e8.innerHTML = 'Донат';
            e5.appendChild(e8);
            const e6 = document.createElement('div');
            e6.className = 'dropdown-divider';
            e4.appendChild(e6);
        }
        {
            const e5 = document.createElement('a');
            e5.className = 'dropdown-item notify-item';
            e5.href = '/donate/customize';
            e4.appendChild(e5);
            const e7 = document.createElement('img');
            e7.src = _header_cdn+'/scpsl/img/panel/dna-solid.svg';
            e5.appendChild(e7);
            const e8 = document.createElement('span');
            e8.innerHTML = 'Кастомизация';
            e5.appendChild(e8);
            const e6 = document.createElement('div');
            e6.className = 'dropdown-divider';
            e4.appendChild(e6);
        }
        {
            const e5 = document.createElement('a');
            e5.className = 'dropdown-item notify-item';
            e5.onclick = () => fetch('/auth/logout', {method:'POST'}).then(() => location.reload());
            e4.appendChild(e5);
            const e7 = document.createElement('img');
            e7.src = _header_cdn+'/scpsl/img/panel/right-from-bracket-solid.svg';
            e5.appendChild(e7);
            const e8 = document.createElement('span');
            e8.innerHTML = 'Выйти';
            e5.appendChild(e8);
        }
        document.getElementById('balanceup').style.display = '';
    }else{
        const e2 = document.createElement('a');
        e2.className = 'nav-link dropdown-toggle nav-user mr-0 waves-effect';
        let redirect = '';
        if(window.location.pathname != '/') redirect = `?redirect=${window.location.pathname.substring(1)}`;
        e2.href = `/authorization${redirect}`;
        e1.appendChild(e2);
        const e3 = document.createElement('span');
        e3.innerHTML = 'Войти';
        e2.appendChild(e3);
        document.getElementById('balanceup').style.display = 'none';
    }
})
socket.on('connect', () => SendInitHeader());
if(socket.connected) SendInitHeader();
function SendInitHeader(){
    socket.emit('info.auth');
    socket.emit('username', 'this', headerUserNameUid);
    socket.emit('my.balance');
}
document.addEventListener("click", (ev)=> {
    const path = ev.path || (ev.composedPath && ev.composedPath());
    if(!path) return;
    try{
        if(path.filter(x => x == HeaderElements.button || x == HeaderElements.menu).length < 1 && HeaderElements.menu.className.includes(' show')){
            HeaderElements.menu.className = HeaderElements.menu.className.replace(' show', '');
        }
    }catch{}
    try{
        const el = document.getElementById('show_mobile');
        if(path.filter(x => x.id == 'show_mobile' || x.id == 'show_mobile_click').length < 1 && el.className.includes(' show')){
            el.className = el.className.replace(' show', '');
        }
    }catch{}
});
document.getElementById('show_mobile_click').addEventListener("click", ()=> {
    const el = document.getElementById('show_mobile');
    if(el.className.includes(' show')) el.className = el.className.replace(' show', '');
    else el.className += ' show';
});