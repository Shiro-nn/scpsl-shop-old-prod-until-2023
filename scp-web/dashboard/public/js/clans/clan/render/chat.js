class Chat{
    show(){
        if(this.active) return;
        this.parent.style.display = '';
        this.active = true;
        window.history.pushState('fydne', 'fydne', '/clans/'+tag+'/chat');
        for (let i = 0; i < this.iframeSCNotLoaded.length; i++) {try{
            const _iframe = this.iframeSCNotLoaded[i];
            if(_iframe.src.startsWith('https://w.soundcloud.com')) _iframe.src = _iframe.src;
        }catch{}}
        this.iframeSCNotLoaded = [];
        if(this.firstload){
            this.firstload = false;
            this.area.scrollTop = this.area.scrollHeight;
        }
    }
    hide(){
        this.active = false;
        this.parent.style.display = 'none';
    }
    constructor() {
        this.firstload = true;
        this.active = false;
        this.parent = document.getElementById('render.chat');
        this.textarea = document.getElementById('chat.textarea');
        this.preview = document.getElementById('chat.preview');
        this.area = document.getElementById('chat.area');
        this.noChatAnon = document.querySelector('.dmc666');
        this.editundo = document.getElementById('chat.edit.undo');
        this.context = new ChatContextMenu(this);
        this.cachedAccess = 0;
        
        this.iframeSCNotLoaded = [];
        const ths = this;
        let lastmsg = {date: 0, by: 0};
        let editingid = 0;
        let messages = [];

        autosize(this.textarea);

        setInterval(() => {
            if(this.cachedAccess == access) return;
            this.cachedAccess = access;
            if(access == 0){
                this.area.style.display = 'none';
                this.noChatAnon.style.display = '';
            }else{
                this.area.style.display = '';
                this.noChatAnon.style.display = 'none';
                this.area.scrollTop = this.area.scrollHeight;
            }
        }, 500);

        this.textarea.addEventListener('input', () => {
            if(editingid == 0) window.localStorage.setItem('clan.message.'+tag, this.textarea.value);
            if(this.textarea.value.length == 0) return this.preview.innerHTML = 'Предпросмотр';
            this.preview.innerHTML = MessageToMD(this.textarea.value, true);
            DoRenderMessage(this.preview);
            FixSoundCloudErrors(this.preview);
        });
        this.editundo.addEventListener('click', () => {
            editingid = 0;
            ths.editundo.style.display = 'none';
            let bdloc = window.localStorage.getItem('clan.message.'+tag);
            if(bdloc == undefined || bdloc == null) bdloc = '';
            ths.textarea.value = bdloc;
            ths.textarea.dispatchEvent(new Event('input'));
        });
        (()=>{
            const bdloc = window.localStorage.getItem('clan.message.'+tag);
            if(bdloc == undefined || bdloc == null) return;
            ths.textarea.value = bdloc;
            ths.textarea.dispatchEvent(new Event('input'));
        })();
        document.getElementById('chat.message.send').addEventListener('click', () => {
            if(editingid > 0){
                clanSocket.emit('message.edit', editingid, this.textarea.value.trim().substring(0, 1000));
                this.editundo.dispatchEvent(new Event('click'));
                return;
            }
            clanSocket.emit('message.send', this.textarea.value.trim().substring(0, 1000));
            this.textarea.value = '';
            this.textarea.dispatchEvent(new Event('input'));
        });
        

        clanSocket.on('message.edit', (success, arg) => {
            if(!success) return logger.warn(arg);
            const msg = document.getElementById('#'+arg.id);
            if(msg == null || msg == undefined) return;
            const _cont = msg.querySelector('.dmc19');
            _cont.innerHTML = MessageToMD(arg.msg, true);
            DoRenderMessage(_cont);
            FixSoundCloudErrors(_cont);
            const _edt = document.createElement('span');
            _edt.className = 'dmc25';
            _edt.innerHTML = '(изменено)';
            _cont.appendChild(_edt);
            try{messages.find(x => x.id == arg.id).data = arg;}catch{}
        });
        clanSocket.on('message.delete', (id) => {
            const _dd = CustomFind(messages);
            if(_dd == undefined){
                try{document.getElementById('#'+id).outerHTML = ''}catch{}
                return;
            }
            if(_dd[0].small){
                _dd[0].el.outerHTML = '';
                messages = removeItemAll(messages, _dd[0]);
                return;
            }
            const mpo = messages[_dd[1]+1];
            if(mpo != undefined && mpo != null && mpo.small){
                mpo.small = false;
                mpo.el.style = '';
                mpo.el.querySelector('.dmc15').style = '';
                mpo.el.querySelector('.dmc16').style = '';
                mpo.el.querySelector('.dmc26').style = 'display: none !important;';
            }
            _dd[0].el.outerHTML = '';
            messages = removeItemAll(messages, _dd[0]);
            function CustomFind(data) {
                try{for (let i = 0; i < data.length; i++) {
                    const _el = data[i];
                    if(_el.id == id) return [_el, i];
                }}catch{}
                return undefined;
            }
        });

        clanSocket.on('message.get.all', async(success, error, list) => {
            if(!success) return logger.warn(error);
            ths.area.innerHTML = '';
            for (let i = 0; i < list.length; i++) {
                await RenderMessage(list[i]);
            }
            ths.area.scrollTop = ths.area.scrollHeight;
        });
        clanSocket.emit('message.get.all');
        document.body.addEventListener('custom.load', () => clanSocket.emit('message.get.all'));
        clanSocket.on('message.get', (data) => RenderMessage(data, false));
        async function RenderMessage(data, bulk = true) {
            const _dt = GetStringFromDate(data.date);
            const _ath = await GetUserById(data.user);

            let smallmsg = false;
            try{
                if(lastmsg.by == data.user && Math.abs(data.date - lastmsg.date) < 1000 * 60 * 10 && new Date(data.date).getDate() == new Date(lastmsg.date).getDate()) smallmsg = true;
                else
                {
                    lastmsg.date = data.date;
                    lastmsg.by = data.user;
                }
            }catch{}

            const e1 = document.createElement('div');
            e1.className = 'dmc13';
            e1.id = '#'+data.id;
            if(smallmsg){
                e1.style.marginTop = '0';
                e1.style.minHeight = 'unset';
            }
            e1.oncontextmenu = (ev) => ths.context.show(data, ev);
            ths.area.appendChild(e1);
            
            const e2 = document.createElement('div');
            e2.className = 'dmc14';
            e1.appendChild(e2);
            const e3 = document.createElement('img');
            e3.className = 'dmc15';
            e3.onerror = () => e3.src = 'https://cdn.scpsl.shop/scpsl/users/avatars/unknow.png';
            e3.onclick = () => Render_Profile(_ath.id);
            e3.src = _ath.avatar;
            if(smallmsg) e3.style.display = 'none';
            e2.appendChild(e3);
            const e4 = document.createElement('h2');
            e4.className = 'dmc16';
            if(smallmsg) e4.style.display = 'none';
            e2.appendChild(e4);
            const e5 = document.createElement('span');
            e5.className = 'dmc18';
            e5.innerHTML = _ath.username;
            e5.onclick = () => Render_Profile(_ath.id);
            e4.appendChild(e5);
            const e6 = document.createElement('span');
            e6.className = 'dmc17';
            e6.innerHTML = _dt[0];
            e4.appendChild(e6);
            tippy(e6, {content: _dt[1], theme: 'translucent', animation: 'perspective'});
            const e7_1 = document.createElement('div');
            e7_1.className = 'dmc26';
            if(!smallmsg) e7_1.style = 'display: none !important;';
            e7_1.innerHTML = _dt[2];
            e2.appendChild(e7_1);
            const e7 = document.createElement('div');
            e7.className = 'dmc19';
            e7.innerHTML = MessageToMD(data.msg, true);
            DoRenderMessage(e7);
            FixSoundCloudErrors(e7);
            e7.querySelectorAll('iframe')
            e2.appendChild(e7);
            if(data.edited){
                const e8 = document.createElement('span');
                e8.className = 'dmc25';
                e8.innerHTML = '(изменено)';
                e7.appendChild(e8);
            }
            
            const e9 = document.createElement('div');
            e9.className = 'dmc20';
            e1.appendChild(e9);
            const e10 = document.createElement('div');
            e10.className = 'dmc21';
            e9.appendChild(e10);
            const e11 = document.createElement('div');
            e11.className = 'dmc22';
            e10.appendChild(e11);
            if(uid == data.user){
                const e12 = document.createElement('div');
                e12.className = 'dmc23';
                e11.appendChild(e12);
                const e13 = document.createElement('i');
                e13.className = 'fa-solid fa-pencil dmc24';
                e12.appendChild(e13);
                e12.addEventListener('click', () => {
                    editingid = data.id;
                    try{ths.textarea.value = messages.find(x => x.id == data.id).data.msg;}
                    catch{ths.textarea.value = data.msg;}
                    ths.textarea.dispatchEvent(new Event('input'));
                    ths.editundo.style.display = '';
                });
            }
            {
                const e12 = document.createElement('div');
                e12.className = 'dmc23';
                e11.appendChild(e12);
                const e13 = document.createElement('i');
                e13.className = 'fa-solid fa-trash-can dmc24';
                e12.appendChild(e13);
                e12.addEventListener('click', () => clanSocket.emit('message.delete', data.id));
            }
            messages.push({
                id: data.id,
                el: e1,
                data: data,
                small: smallmsg,
            })
            if(!bulk && ths.area.scrollTop + 1200 > ths.area.scrollHeight) ths.area.scrollTop = ths.area.scrollHeight;
        }
        function FixSoundCloudErrors(el){
            if(ths.active) return;
            const _list = el.querySelectorAll('iframe');
            for (let i = 0; i < _list.length; i++) {
                const _fr = _list[i];
                if(_fr.src.startsWith('https://w.soundcloud.com')) {
                    ths.iframeSCNotLoaded.push(_fr);
                }
            }
        }
    }
}
class ChatContextMenu{
    constructor(parent) {
        this.parent = parent;
        this.menu = document.getElementById('chat.menu').querySelector('.cm1');
        this.area = document.getElementById('chat.menu.area');
        this.message = {};
        this._hide = true;

        const ths = this;

        this.area.innerHTML = '';
        _renderButton('Ответить', () => {
            if(ths.message.user == null || ths.message.user == undefined) return;
            let bdloc = window.localStorage.getItem('clan.message.'+tag);
            if(bdloc == undefined || bdloc == null) bdloc = '';
            ths.parent.textarea.value = `> ${ths.message.msg}\n\n<@${ths.message.user}>, ${bdloc}`;
            ths.parent.textarea.dispatchEvent(new Event('input'));
        });
        _renderButton('Упомянуть', () => {
            if(ths.message.user == null || ths.message.user == undefined) return;
            ths.parent.textarea.value += `<@${ths.message.user}>`;
            ths.parent.textarea.dispatchEvent(new Event('input'));
        });
        _renderButton('Копировать ID', () => {
            if(ths.message.user == null || ths.message.user == undefined) return;
            navigator.clipboard.writeText(`<@${ths.message.user}>`);
        });

        document.addEventListener('click', () => {if(ths._hide) ths.menu.style = `display: none;`});

        function _renderButton(text, cb){
            const e1 = document.createElement('div');
            e1.className = 'cm5';
            e1.onclick = cb;
            ths.area.appendChild(e1);
            const e2 = document.createElement('div');
            e2.className = 'cm6';
            e2.innerHTML = text;
            e1.appendChild(e2);
        }
    }
    show(message, ev){
        this.message = message;
        this._hide = false;
        this.menu.style = `top: ${ev.y}px; left: ${ev.x}px;`;
        const ths = this;
        setTimeout(() => ths._hide = true, 100);
    }
}