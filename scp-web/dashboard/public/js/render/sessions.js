socket.on('auth.sessions.get', (error, sessions) => {
    if(error) return alert(sessions);
    sessions = sessions.sort(a => a.current ? -1 : 1);
    console.log(sessions);

    const parent = document.querySelector('.sessions');
    const spinner = document.querySelector('.spinner1');

    parent.innerHTML = '';
    try { spinner.style.display = 'none'; }catch { }

    sessions.forEach(session => {
        const e1 = document.createElement('div');
        e1.className = 'session';
        e1.id = session.hash;
        parent.appendChild(e1);
        
        const e2 = document.createElement('div');
        e2.className = 'preimg';
        e1.appendChild(e2);
        const e3 = document.createElement('img');
        e3.src = '/img/sessions/unknow.svg';
        e2.appendChild(e3);
        if(session.browser == 'Desktop App') e3.src = '/img/sessions/desktop.svg';
        else if(session.os.includes('Windows')) e3.src = '/img/sessions/windows.svg';
        else if(session.os == 'OS X') e3.src = '/img/sessions/macos.svg';
        else if(session.os == 'Linux') e3.src = '/img/sessions/linux.svg';
        else if(session.os == 'Ubuntu') e3.src = '/img/sessions/ubuntu.svg';
        else if(session.os == 'Debian') e3.src = '/img/sessions/debian.svg';
        else if(session.os == 'Fedora' || session.os == 'Red Hat') e3.src = '/img/sessions/fedora.svg';
        else if(session.os == 'Android') e3.src = '/img/sessions/android.svg';
        else if(session.os == 'iOS') e3.src = '/img/sessions/ios.svg';
        
        const e4 = document.createElement('span');
        e4.className = 'system';
        e4.innerHTML = session.browser + ' ● ' + session.os;
        e1.appendChild(e4);
        
        const e5 = document.createElement('span');
        e5.className = 'text';
        e5.innerHTML = session.loc;
        e1.appendChild(e5);
        
        const e6 = document.createElement('span');
        e6.className = 'text';
        e6.innerHTML = 'Истекает: ';
        e1.appendChild(e6);
        
        const date = GetStringFromDate(session.expires);
        const e7 = document.createElement('help');
        e7.className = 'text';
        e7.style.marginTop = '0';
        e7.innerHTML = date[1];
        e1.appendChild(e7);
        tippy(e7, {content: date[0], animation: 'perspective', allowHTML: true});
        
        const e9 = document.createElement('span');
        e9.className = 'text';
        e9.innerHTML = 'Последняя активность: ';
        e1.appendChild(e9);
        
        const dateLast = GetStringFromDate(session.last);
        const e10 = document.createElement('help');
        e10.className = 'text';
        e10.style.marginTop = '0';
        e10.innerHTML = dateLast[1];
        e1.appendChild(e10);
        tippy(e10, {content: dateLast[0], animation: 'perspective', allowHTML: true});
        
        const e8 = document.createElement('button');
        e8.className = 'sclose';
        if(session.current){
            e8.style.backgroundColor = '#418dff';
            e8.style.cursor = 'url(/cursors/red/standart.cur), default';
            e8.innerHTML = 'Текущая сессия';
        }else{
            e8.innerHTML = 'Завершить сессию';
            e8.onclick = () => socket.emit('auth.sessions.close', session.hash);
        }
        e1.appendChild(e8);
    });
});
socket.emit('auth.sessions.get');

socket.on('auth.sessions.close', (error, arg) => {
    if(error) return alert(arg);
    document.getElementById(arg).outerHTML = '';
});

function GetStringFromDate(date) {
    const time = new Date(parseInt(date));
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    let str = dateTimePad(day, 2) + "." + dateTimePad(month, 2) + "." + dateTimePad(year, 2);
    const _hm2 = `${dateTimePad(hour, 2)}:${dateTimePad(minute, 2)}`;
    let _ret4 = str + ' ' + _hm2;
    {
        const _dn = new Date(Date.now());
        const now_day = _dn.getDate();
        const now_month = _dn.getMonth() + 1;
        const now_year = _dn.getFullYear();

        const nowDay = new Date(`${now_month}.${now_day}.${now_year}`);
        const dateDay = new Date(`${month}.${day}.${year}`);

        if(nowDay - dateDay == 0) _ret4 = str = `Сегодня, в ${_hm2}`;
        else if(nowDay - dateDay == 86400000) _ret4 = str = `Вчера, в ${_hm2}`;
        else if(nowDay - dateDay == -86400000) _ret4 = str = `Завтра, в ${_hm2}`;
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
    };
    const aria = time.toLocaleString("ru", options);
    return [aria, _ret4];
}
function dateTimePad(value, digits){
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}