class Boosts{
    show(){
        if(this.active) return;
        this.parent.style.display = '';
        this.active = true;
        if(window.location.href) window.history.pushState('fydne', 'fydne', '/clans/'+tag+'/boosts');
    }
    hide(){
        this.active = false;
        this.parent.style.display = 'none';
    }
    constructor() {
        this.active = false;
        this.parent = document.getElementById('render.boosts');
        this.elements = {
            bought: null,
            available: null,
        }
        this.boosts = {
            bought: [],
            available: [],
        }
        this.els = {
            bought: [],
            available: [],
        }

        const ths = this;

        {
            this.parent.innerHTML = '';
            const e1 = document.createElement('div');
            e1.className = 'dmb1';
            this.parent.appendChild(e1);
            {
                const e2 = document.createElement('div');
                e2.className = 'dmb2';
                e2.style.marginTop = '0';
                e1.appendChild(e2);

                const e3 = document.createElement('label');
                e3.className = 'dmb3';
                e3.innerHTML = 'Бусты клана';
                e2.appendChild(e3);
                const e4 = document.createElement('i');
                e4.className = 'fa-solid fa-info-circle dmb4';
                e2.appendChild(e4);
                tippy(e4, {content: 'Клан должен быть главным', theme: 'translucent', animation: 'perspective'});
            }
            {
                const e2 = document.createElement('div');
                e2.className = 'dmb5 using';
                e1.appendChild(e2);
                this.elements.bought = e2;
            }
            {
                const e2 = document.createElement('div');
                e2.className = 'dmb2';
                e1.appendChild(e2);
                const e3 = document.createElement('label');
                e3.className = 'dmb3';
                e3.innerHTML = 'Доступные бусты клана';
                e2.appendChild(e3);
            }
            {
                const e2 = document.createElement('div');
                e2.className = 'dmb5';
                e1.appendChild(e2);
                this.elements.available = e2;
            }
        }

        clanSocket.on('boosts.get', async(data) => {
            ths.boosts.available = data;
            ths.elements.available.innerHTML = '';
            ths.elements.bought.innerHTML = '';
            ths.els.available = [];
            ths.els.bought = [];
            for (let i = 0; i < data.length; i++) {
                RenderBoost(0, data[i]);
                RenderBoost(1, data[i]);
            }
        });
        clanSocket.emit('boosts.get');
        clanSocket.on('boosts.get.clan', async(data) => {
            while(ths.boosts.available.length == 0) await sleep(100);
            ths.boosts.bought = data;
            try{for (let i = 0; i < ths.elements.available.children.length; i++) {
                try{ths.elements.available.children[i].style.display = '';}catch{}
            }}catch{}
            try{for (let i = 0; i < ths.elements.bought.children.length; i++) {
                try{ths.elements.bought.children[i].style.display = 'none';}catch{}
            }}catch{}
            for (let i = 0; i < data.length; i++) {
                const _cur = data[i];
                const _el = ths.els.bought.find(x => x.id == _cur.id);
                if(_el != null && _el != undefined){
                    _el.el.style.display = '';
                    _el.tippy.setContent('Истекает: '+GetStringFromDate(_cur.to)[3]);
                }
                const _el2 = ths.els.available.find(x => x.id == _cur.id);
                if(_el2 != null && _el2 != undefined) _el2.el.style.display = 'none';
            }
        });
        clanSocket.emit('boosts.get.clan');
        clanSocket.on('boosts.bought.clan', async(boost) => {
            const _el = ths.els.bought.find(x => x.id == boost.id);
            if(_el != null && _el != undefined){
                _el.el.style.display = '';
                _el.tippy.setContent('Истекает: '+GetStringFromDate(boost.to)[3]);
            }
            const _el2 = ths.els.available.find(x => x.id == boost.id);
            if(_el2 != null && _el2 != undefined) _el2.el.style.display = 'none';
        });
        setInterval(() => {
            for (let i = 0; i < ths.boosts.bought.length; i++) {
                const _bdata = ths.boosts.bought[i];
                if(Date.now() > _bdata.to){
                    const _el = ths.els.bought.find(x => x.id == _bdata.id);
                    if(_el != null && _el != undefined) _el.el.style.display = 'none';
                    const _el2 = ths.els.available.find(x => x.id == _bdata.id);
                    if(_el2 != null && _el2 != undefined) _el2.el.style.display = '';
                    ths.boosts.bought = removeItemAll(ths.boosts.bought, _bdata);
                }
            }
        }, 1000);

        function RenderBoost(mode, data){
            const e1 = document.createElement('div');
            e1.className = 'dmb6';
            if(mode == 0){
                e1.style.display = 'none';
                ths.elements.bought.appendChild(e1);
            }
            else if(mode == 1) ths.elements.available.appendChild(e1);
            else return e1.outerHTML = '';
            
            const e2 = document.createElement('img');
            e2.className = 'dmb7';
            e2.src = data.img;
            e1.appendChild(e2);
            const e3 = document.createElement('hr');
            e3.className = 'dmb8';
            e1.appendChild(e3);
            const e4 = document.createElement('span');
            e4.className = 'dmb9';
            e4.innerHTML = data.name;
            e1.appendChild(e4);
            if(mode == 1){
                const e5 = document.createElement('span');
                e5.className = 'dmb10';
                e5.innerHTML = data.sum+'₽/мес';
                e1.appendChild(e5);
                const e6 = document.createElement('i');
                e6.className = 'fa-solid fa-plus dmb11';
                e6.onclick = () => clanSocket.emit('boosts.buy.clan', data.id);
                e1.appendChild(e6);
                ths.els.available.push({id:data.id, el:e1});
            }else{
                const e5 = document.createElement('i');
                e5.className = 'fa-solid fa-hourglass-clock dmb12';
                e1.appendChild(e5);
                ths.els.bought.push({id:data.id, el:e1,
                    tippy: tippy(e5, {content: 'Истекает: [data breached]', theme: 'translucent', animation: 'perspective'})
                });
            }
        }
    }
}