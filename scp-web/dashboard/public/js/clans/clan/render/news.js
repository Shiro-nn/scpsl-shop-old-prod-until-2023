class News{
    show(){
        if(this.active) return;
        this.parent.style.display = '';
        this.active = true;
        window.history.pushState('fydne', 'fydne', '/clans/'+tag);
    }
    hide(){
        this.active = false;
        this.parent.style.display = 'none';
    }
    constructor() {
        this.active = false;
        this.parent = document.getElementById('render.news');
        this.news = [];
        const ths = this;
        document.getElementById('clan.news.send').addEventListener('click', () => {
            if(access < 3) return logger.warn('Недостаточно прав');
            const txtarea = document.getElementById('clan.news.textarea');
            const _txt = txtarea.value.trim().substring(0, 200).replace(/\n/g, '\\n').replace(/\\n/g, '\n').trim();
            if(2 > _txt.length) return logger.warn('Ваша новость слишком короткая');
            txtarea.value = '';
            clanSocket.emit('create.news', _txt);
        });
        clanSocket.on('create.news', (success, arg) => {
            if(!success) return logger.warn(arg);
            RenderOneNews(arg, document.getElementById('clan.news.area'));
        });
        clanSocket.on('get.news', async(success, error, data) => {
            if(!success) return logger.warn(error);
            const _area = document.getElementById('clan.news.area');
            while (_area.children.length > 1) {
                _area.children[1].outerHTML = '';
            }
            ths.news = [];
            for (let i = 0; i < data.length; i++) {
                await RenderOneNews(data[i], _area);
            }
        });
        clanSocket.on('remove.news', (success, arg) => {
            if(!success) return logger.warn(arg);
            const nwslst = ths.news.filter(x => x.id == arg);
            nwslst.forEach(nmsel => nmsel.el.outerHTML = '');
            ths.news = ths.news.filter(x => x.id != arg);
        });

        document.body.addEventListener('custom.load', () => clanSocket.emit('get.news'));
        clanSocket.emit('get.news');

        async function RenderOneNews(_nws, _area){
            const _dt = GetStringFromDate(_nws.date);
            const _ath = await GetUserById(_nws.user);

            const e1 = document.createElement('div');
            e1.className = 'dm4';
            if(_area.children.length > 1) _area.insertBefore(e1, _area.children[1]);
            else _area.appendChild(e1);
            const e2 = document.createElement('div');
            e2.className = 'dm5';
            e1.appendChild(e2);
            
            const e3 = document.createElement('div');
            e3.className = 'dm10';
            e2.appendChild(e3);
            const e4 = document.createElement('img');
            e4.className = 'dm11';
            e4.src = _ath.avatar;
            e3.appendChild(e4);
            const e5 = document.createElement('span');
            e5.className = 'dm12';
            e5.innerHTML = _ath.username;
            e3.appendChild(e5);
            const e6 = document.createElement('p');
            e6.className = 'dm13';
            e6.innerHTML = _dt[0];
            e3.appendChild(e6);
            tippy(e6, {content: _dt[1], theme: 'translucent', animation: 'perspective'});
            e4.addEventListener('click', () => Render_Profile(_nws.user));
            e5.addEventListener('click', () => Render_Profile(_nws.user));
            
            const e7 = document.createElement('div');
            e7.className = 'dm14';
            e2.appendChild(e7);
            const e8 = document.createElement('div');
            e8.className = 'dm15';
            e7.appendChild(e8);
            const e9 = document.createElement('p');
            e9.innerHTML = MessageToMD(_nws.msg);
            DoRenderMessage(e9);
            e8.appendChild(e9);
            
            const e10 = document.createElement('i');
            e10.className = 'fa-solid fa-trash dm16';
            if(3 > access) e10.style.display = 'none';
            e2.appendChild(e10);
            tippy(e10, {content: 'Удалить новость', theme: 'translucent', animation: 'perspective'});
            let _deleting = false;
            e10.addEventListener('click', () => {
                if(_deleting) return;
                clanSocket.emit('remove.news', _nws.date);
                _deleting = true;
            });

            ths.news.push({id:_nws.date, el:e1});
        }
    }
}