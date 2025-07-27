class Users{
    show(){
        if(this.active) return;
        this.parent.style.display = '';
        this.active = true;
        window.history.pushState('fydne', 'fydne', '/clans/'+tag+'/users');
    }
    hide(){
        this.active = false;
        this.parent.style.display = 'none';
    }
    constructor() {
        this.active = false;
        this.parent = document.getElementById('render.users');
        this.areas = {lvl5: null, lvl4: null, lvl3: null, lvl2: null, lvl1: null};
        this.users = {lvl5: [], lvl4: [], lvl3: [], lvl2: [], lvl1: []};
        this.menu = new UsersMenu(this);

        const ths = this;

        {
            this.parent.innerHTML = '';
            {
                const e1 = document.createElement('div');
                e1.className = 'dmu1';
                this.parent.appendChild(e1);
                CreateType(5, e1);
                CreateType(4, e1);
                CreateType(3, e1);

            }
            {
                const e1 = document.createElement('div');
                e1.className = 'dmu1 dmu4';
                this.parent.appendChild(e1);
                CreateType(2, e1);
                CreateType(1, e1);
            }
            function CreateType(id, _parent){
                let name, icon;
                let prava = {
                    war: 'Начинать клановую войну',
                    vis: 'Изменять приватность клана',
                    up: 'Повышать участников',
                    boosts: 'Покупать бусты',
                    kick: 'Кикать участников клана',
                    moder: 'Удалять сообщения в чате',
                    settings: 'Изменять настройки клана',
                    news: 'Писать на стене клана',
                    down: 'Понижать участников',
                    inv: 'Приглашать в клан',
                }
                switch (id) {
                    case 5: name = 'Глава'; icon = 'crown'; break;
                    case 4: name = 'Заместители'; icon = 'handshake'; break;
                    case 3: name = 'Старейшины'; icon = 'user-secret'; break;
                    case 2: name = 'Проверенные'; icon = 'user-check'; break;
                    case 1: name = 'Участники'; icon = 'user'; break;
                    default: return;
                }
                const e2 = document.createElement('div');
                e2.className = 'dmu2';
                _parent.appendChild(e2);
                let _showel;
                {
                    const e3 = document.createElement('div');
                    e3.className = 'dmu3';
                    e2.appendChild(e3);
                    
                    const e4 = document.createElement('i');
                    e4.className = 'fa-duotone fa-'+icon;
                    e3.appendChild(e4);

                    e3.innerHTML += ' ' + name;

                    e3.onclick = () => {
                        if(_showel == null || _showel == undefined) return;
                        if(_showel.style.display != 'none') _showel.style.display = 'none';
                        else _showel.style.display = '';
                    }
                }
                {
                    const e3 = document.createElement('i');
                    e3.className = 'fa-duotone fa-info dmu10';
                    e2.appendChild(e3);
                    setTimeout(() => {
                        let _txt = '';
                        switch (id) {
                            case 5:
                                _txt += AddText(prava.war, 'check');
                                _txt += AddText(prava.vis, 'check');
                                _txt += AddText(prava.up, 'check');
                                _txt += AddText(prava.boosts, 'check');
                                _txt += AddText(prava.kick, 'check');
                                _txt += AddText(prava.moder, 'check');
                                _txt += AddText(prava.settings, 'check');
                                _txt += AddText(prava.news, 'check');
                                _txt += AddText(prava.down, 'check');
                                _txt += AddText(prava.inv, 'check');
                                break;
                            case 4:
                                _txt += AddText(prava.war, 'check');
                                _txt += AddText(prava.vis, 'check');
                                _txt += AddText(prava.up, 'check');
                                _txt += AddText(prava.boosts, 'check');
                                _txt += AddText(prava.kick, 'check');
                                _txt += AddText(prava.moder, 'check');
                                _txt += AddText(prava.settings, 'check');
                                _txt += AddText(prava.news, 'check');
                                _txt += AddText(prava.down, 'check');
                                _txt += AddText(prava.inv, 'check');
                                break;
                            case 3:
                                _txt += AddText(prava.war, 'xmark');
                                _txt += AddText(prava.vis, 'xmark');
                                _txt += AddText(prava.up, 'xmark');
                                _txt += AddText(prava.boosts, 'xmark');
                                _txt += AddText(prava.kick, 'xmark');
                                _txt += AddText(prava.moder, 'check');
                                _txt += AddText(prava.settings, 'check');
                                _txt += AddText(prava.news, 'check');
                                _txt += AddText(prava.down, 'check');
                                _txt += AddText(prava.inv, 'check');
                                break;
                            case 2:
                                _txt += AddText(prava.war, 'xmark');
                                _txt += AddText(prava.vis, 'xmark');
                                _txt += AddText(prava.up, 'xmark');
                                _txt += AddText(prava.boosts, 'xmark');
                                _txt += AddText(prava.kick, 'xmark');
                                _txt += AddText(prava.moder, 'xmark');
                                _txt += AddText(prava.settings, 'xmark');
                                _txt += AddText(prava.news, 'xmark');
                                _txt += AddText(prava.down, 'xmark');
                                _txt += AddText(prava.inv, 'check');
                                break;
                            case 1:
                                _txt += AddText(prava.war, 'xmark');
                                _txt += AddText(prava.vis, 'xmark');
                                _txt += AddText(prava.up, 'xmark');
                                _txt += AddText(prava.boosts, 'xmark');
                                _txt += AddText(prava.kick, 'xmark');
                                _txt += AddText(prava.moder, 'xmark');
                                _txt += AddText(prava.settings, 'xmark');
                                _txt += AddText(prava.news, 'xmark');
                                _txt += AddText(prava.down, 'xmark');
                                _txt += AddText(prava.inv, 'xmark');
                                break;
                            default: return;
                        }
                        tippy(e3, {content: _txt, animation: 'perspective', allowHTML: true});
                        function AddText(text, icon){
                            return `<li class="dmu11"><i class="fa-solid fa-${icon}"></i><span>${text}</span></li>`;
                        }
                    }, 100);
                }
                {
                    const e3 = document.createElement('div');
                    e3.style.display = 'none';
                    e2.appendChild(e3);
                    _showel = e3;
                    
                    const e4 = document.createElement('hr');
                    e4.className = 'dmu5';
                    e3.appendChild(e4);
                    const e5 = document.createElement('div');
                    e5.className = 'dmu6';
                    e3.appendChild(e5);
                
                    switch (id) {
                        case 5: ths.areas.lvl5 = e5; break;
                        case 4: ths.areas.lvl4 = e5; break;
                        case 3: ths.areas.lvl3 = e5; break;
                        case 2: ths.areas.lvl2 = e5; break;
                        case 1: ths.areas.lvl1 = e5; break;
                        default: break;
                    }
                }
            }
        }

        clanSocket.on('change.user', (user) => {
            try{
                if(user.user == uid){
                    access = user.access;
                    const _nt = document.getElementById('clan.news.textarea');
                    if(access >= 2) document.getElementById('clan.button.invite').style.display = '';
                    else document.getElementById('clan.button.invite').style.display = 'none';
                    if(access >= 3){
                        _nt.disabled = false;
                        _nt.placeholder = `Напишите в новости '${data.name}'`;
                    }else{
                        _nt.disabled = true;
                        _nt.placeholder = 'Вам не разрешается публиковать новости';
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl5.length; i++) {
                    const el = ths.users.lvl5[i];
                    if(el.user == user.user){
                        el.element.outerHTML = '';
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl5.children.length; i++) {
                                const child = ths.areas.lvl5.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl4.length; i++) {
                    const el = ths.users.lvl4[i];
                    if(el.user == user.user){
                        el.element.outerHTML = '';
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl4.children.length; i++) {
                                const child = ths.areas.lvl4.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl3.length; i++) {
                    const el = ths.users.lvl3[i];
                    if(el.user == user.user){
                        el.element.outerHTML = '';
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl3.children.length; i++) {
                                const child = ths.areas.lvl3.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl2.length; i++) {
                    const el = ths.users.lvl2[i];
                    if(el.user == user.user){
                        el.element.outerHTML = '';
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl2.children.length; i++) {
                                const child = ths.areas.lvl2.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl1.length; i++) {
                    const el = ths.users.lvl1[i];
                    if(el.user == user.user){
                        el.element.outerHTML = '';
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl1.children.length; i++) {
                                const child = ths.areas.lvl1.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            ths.users.lvl5 = ths.users.lvl5.filter(x => x.user != user.user);
            ths.users.lvl4 = ths.users.lvl4.filter(x => x.user != user.user);
            ths.users.lvl3 = ths.users.lvl3.filter(x => x.user != user.user);
            ths.users.lvl2 = ths.users.lvl2.filter(x => x.user != user.user);
            ths.users.lvl1 = ths.users.lvl1.filter(x => x.user != user.user);
            if(user.money == undefined || user.money == null) user.money = 0;
            if(user.balance == undefined || user.balance == null) user.balance = 0;
            user.element = null;
            switch (user.access) {
                case 5:{
                    ths.users.lvl5.push(user);
                    ths.users.lvl5 = ths.users.lvl5.sort(SortUsers);
                    const _pos = ths.users.lvl5.indexOf(user);
                    RenderUser(user, _pos, ths.areas.lvl5, false);
                    break;
                }
                case 4:{
                    ths.users.lvl4.push(user);
                    ths.users.lvl4 = ths.users.lvl4.sort(SortUsers);
                    const _pos = ths.users.lvl4.indexOf(user);
                    RenderUser(user, _pos, ths.areas.lvl4, false);
                    break;
                }
                case 3:{
                    ths.users.lvl3.push(user);
                    ths.users.lvl3 = ths.users.lvl3.sort(SortUsers);
                    const _pos = ths.users.lvl3.indexOf(user);
                    RenderUser(user, _pos, ths.areas.lvl3, false);
                    break;
                }
                case 2:{
                    ths.users.lvl2.push(user);
                    ths.users.lvl2 = ths.users.lvl2.sort(SortUsers);
                    const _pos = ths.users.lvl2.indexOf(user);
                    RenderUser(user, _pos, ths.areas.lvl2, false);
                    break;
                }
                case 1:{
                    ths.users.lvl1.push(user);
                    ths.users.lvl1 = ths.users.lvl1.sort(SortUsers);
                    const _pos = ths.users.lvl1.indexOf(user);
                    RenderUser(user, _pos, ths.areas.lvl1, false);
                    console.log(_pos);
                    break;
                }
                default: break;
            }
        });

        clanSocket.on('get.users', (users) => {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if(user.money == undefined || user.money == null) user.money = 0;
                if(user.balance == undefined || user.balance == null) user.balance = 0;
                user.element = null;
                switch (user.access) {
                    case 5: ths.users.lvl5.push(user); break;
                    case 4: ths.users.lvl4.push(user); break;
                    case 3: ths.users.lvl3.push(user); break;
                    case 2: ths.users.lvl2.push(user); break;
                    case 1: ths.users.lvl1.push(user); break;
                    default: break;
                }
            }
            ths.users.lvl5 = ths.users.lvl5.sort(SortUsers);
            ths.users.lvl4 = ths.users.lvl4.sort(SortUsers);
            ths.users.lvl3 = ths.users.lvl3.sort(SortUsers);
            ths.users.lvl2 = ths.users.lvl2.sort(SortUsers);
            ths.users.lvl1 = ths.users.lvl1.sort(SortUsers);
            
            for (let i = 0; i < ths.users.lvl5.length; i++) {
                RenderUser(ths.users.lvl5[i], i, ths.areas.lvl5, false);
            }
            for (let i = 0; i < ths.users.lvl4.length; i++) {
                RenderUser(ths.users.lvl4[i], i, ths.areas.lvl4, false);
            }
            for (let i = 0; i < ths.users.lvl3.length; i++) {
                RenderUser(ths.users.lvl3[i], i, ths.areas.lvl3, false);
            }
            for (let i = 0; i < ths.users.lvl2.length; i++) {
                RenderUser(ths.users.lvl2[i], i, ths.areas.lvl2, false);
            }
            for (let i = 0; i < ths.users.lvl1.length; i++) {
                RenderUser(ths.users.lvl1[i], i, ths.areas.lvl1, false);
            }
        });
        clanSocket.emit('get.users');
        
        clanSocket.on('clan.leave', (userID) => {
            try{
                for (let i = 0; i < ths.users.lvl5.length; i++) {
                    const el = ths.users.lvl5[i];
                    if(el.user == userID){
                        el.element.outerHTML = '';
                        ths.users.lvl5 = ths.users.lvl5.filter(x => x.user != userID);
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl5.children.length; i++) {
                                const child = ths.areas.lvl5.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl4.length; i++) {
                    const el = ths.users.lvl4[i];
                    if(el.user == userID){
                        el.element.outerHTML = '';
                        ths.users.lvl4 = ths.users.lvl4.filter(x => x.user != userID);
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl4.children.length; i++) {
                                const child = ths.areas.lvl4.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl3.length; i++) {
                    const el = ths.users.lvl3[i];
                    if(el.user == userID){
                        el.element.outerHTML = '';
                        ths.users.lvl3 = ths.users.lvl3.filter(x => x.user != userID);
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl3.children.length; i++) {
                                const child = ths.areas.lvl3.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl2.length; i++) {
                    const el = ths.users.lvl2[i];
                    if(el.user == userID){
                        el.element.outerHTML = '';
                        ths.users.lvl2 = ths.users.lvl2.filter(x => x.user != userID);
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl2.children.length; i++) {
                                const child = ths.areas.lvl2.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            try{
                for (let i = 0; i < ths.users.lvl1.length; i++) {
                    const el = ths.users.lvl1[i];
                    if(el.user == userID){
                        el.element.outerHTML = '';
                        ths.users.lvl1 = ths.users.lvl1.filter(x => x.user != userID);
                        if(i < 4){
                            for (let i = 0; i < ths.areas.lvl1.children.length; i++) {
                                const child = ths.areas.lvl1.children[i];
                                child.style.borderBottom = '';
                                switch (i) {
                                    case 0: child.style.borderBottom = '2px solid #ff0'; break;
                                    case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                                    case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                                }
                            }
                        }
                    }
                }
            }catch{}
            
        });
        clanSocket.on('clan.join', (userID) => {
            let user = {
                user: userID,
                money: 0,
                balance: 0,
                access: 0,
                element: null,
            }
            ths.users.lvl1.push(user);
            const _pos = ths.users.lvl1.indexOf(user);
            RenderUser(user, _pos, ths.areas.lvl1, false);
        });
        
        function SortUsers(a, b) {
            return (b.money + b.balance * 10) - (a.money + a.balance * 10);
        }

        async function RenderUser(user, loc, parent, small = true){
            if(user.element != null) user.element.outerHTML = '';

            const e1 = document.createElement('div');
            e1.className = 'dmu7';

            if(parent.children.length > loc) _par.insertBefore(e1, parent.children[loc+1]);
            else parent.appendChild(e1);
            user.element = e1;
            
            const e2 = document.createElement('img');
            e2.className = 'dmu8';
            e2.src = '';
            e1.appendChild(e2);
            
            const e3 = document.createElement('h2');
            e3.className = 'dmu9';
            e1.appendChild(e3);
            const e4 = document.createElement('span');
            e4.innerHTML = 'Получение данных..';
            e3.appendChild(e4);
            
            if(user.access != 5){{
                const e5 = document.createElement('i');
                e5.className = 'fa-duotone fa-user-gear';
                e1.appendChild(e5);
                try{tippy(e5, {content: 'Изменить роли участника', animation: 'perspective'});}catch{}
                e5.onclick = (ev) => ths.menu.show(user, ev);
            }{
                const e5 = document.createElement('i');
                e5.className = 'fa-duotone fa-user-minus';
                e1.appendChild(e5);
                try{tippy(e5, {content: 'Кикнуть участника', animation: 'perspective'});}catch{}
                e5.onclick = () => clanSocket.emit('kick.user', user.user);
            }}

            setTimeout(() => {
                if(small){
                    for (let i = 0; i < parent.children.length; i++) {
                        const child = parent.children[i];
                        child.style.borderBottom = '';
                        switch (i) {
                            case 0: child.style.borderBottom = '2px solid #ff0'; break;
                            case 1: child.style.borderBottom = '2px solid #c0c0c0'; break;
                            case 2: child.style.borderBottom = '2px solid #cd7f32'; break;
                        }
                    }
                }
                switch (loc) {
                    case 0: e1.style.borderBottom = '2px solid #ff0'; break;
                    case 1: e1.style.borderBottom = '2px solid #c0c0c0'; break;
                    case 2: e1.style.borderBottom = '2px solid #cd7f32'; break;
                }
            }, 0);

            e2.onclick = () => Render_Profile(user.user);

            const userinfo = await GetUserById(user.user);
            e2.src = userinfo.avatar;
            e4.innerHTML = userinfo.username;
        }
    }
}
class UsersMenu{
    constructor(parent) {
        this.parent = parent;
        this.menu = document.getElementById('users.menu').querySelector('.um1');
        this.area = this.menu.querySelector('._area');
        this.nick = this.menu.querySelector('._nick');
        this.user = 0;
        this._hide = true;

        const ths = this;

        this.area.innerHTML = '';
        _renderButton('Заместитель', () => SendUpdate(4));
        _renderButton('Старейшина', () => SendUpdate(3));
        _renderButton('Проверенный', () => SendUpdate(2));
        _renderButton('Участник', () => SendUpdate(1));

        function SendUpdate(id){
            if(ths.user == 0) return;
            clanSocket.emit('change.user', ths.user, id);
        }

        document.addEventListener('click', () => {if(ths._hide) ths.menu.style = `display: none;`});

        function _renderButton(text, cb){
            const e1 = document.createElement('div');
            e1.className = 'um5';
            e1.onclick = cb;
            ths.area.appendChild(e1);
            const e2 = document.createElement('div');
            e2.className = 'um6';
            e2.innerHTML = text;
            e1.appendChild(e2);
        }
    }
    show(user, ev){
        this.user = user.user;
        this._hide = false;
        let _y = ev.y;
        if(_y > (window.innerHeight - 190)) _y = window.innerHeight - 190;
        this.menu.style = `top: ${_y}px; left: ${ev.x}px;`;
        const ths = this;
        setTimeout(() => ths._hide = true, 100);
        setTimeout(async() => {
            ths.nick.innerHTML = '';
            const userinfo = await GetUserById(user.user);
            if(ths.user != user.user) return;
            ths.nick.innerHTML = userinfo.username;
        }, 0);
    }
}