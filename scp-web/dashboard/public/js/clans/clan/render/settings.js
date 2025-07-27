class Settings{
    show(){
        if(this.active) return;
        this.parent.style.display = '';
        this.active = true;
        window.history.pushState('fydne', 'fydne', '/clans/'+tag+'/settings');
        this.desc.dispatchEvent(new Event('input'));
    }
    hide(){
        this.active = false;
        this.parent.style.display = 'none';
    }
    constructor() {
        this.active = false;
        this.parent = document.getElementById('render.settings');
        this.desc = null;
        this.name = null;
        this.color = null;
        this.fileinput = null;
        this.uploader = null;

        const ths = this;

        {
            this.parent.innerHTML = '';
            {
                const e1 = document.createElement('input');
                e1.accept = '.jpg,.jpeg,.png,.gif,.webp,.ico';
                e1.type = 'file';
                this.fileinput = e1;
            }
            this.uploader = new UploadManager(this.fileinput);
            {
                const e1 = document.createElement('div');
                e1.className = 'dms1';
                this.parent.appendChild(e1);
                {
                    const e2 = document.createElement('div');
                    e2.className = 'dms2';
                    e2.innerHTML = '<span>Изменить аватар</span>';
                    e2.onclick = () => this.fileinput.click();
                    e1.appendChild(e2);
    
                    const e3 = document.createElement('div');
                    e3.className = 'dms3';
                    e3.onclick = () => {};
                    e1.appendChild(e3);
                    const e4 = document.createElement('div');
                    e4.className = 'dms4';
                    e3.appendChild(e4);
                    try{tippy(e4, {content: 'Нажмите, чтобы изменить цвет клана', animation: 'perspective'});}catch{}
                    const _color = window.getComputedStyle(e4, null).getPropertyValue('background-color').match(/\d+/g).map(Number);
                    const e5 = document.createElement('input');
                    e5.type = 'color';
                    e5.value = rgbToHex(..._color);
                    e5.style.display = 'none';
                    e3.appendChild(e5);
                    const picker = new CP(e5);
                    picker.on('change', function(r, g, b) {
                        const _hex = this.color(r, g, b);
                        e4.style.backgroundColor = _hex;
                        e5.value = _hex;
                    });
                    function componentToHex(c) {
                        var hex = c.toString(16);
                        return hex.length == 1 ? "0" + hex : hex;
                    }
                    function rgbToHex(r, g, b) {
                        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                    }
                    e3.onclick = () => picker.enter(e3);
                    this.color = e5;
                    e5.addEventListener('data.update', () => e4.style.backgroundColor = '');
                }
            }
            {
                const e1 = document.createElement('div');
                e1.className = 'dms1 dms5';
                this.parent.appendChild(e1);
                {
                    const e2 = document.createElement('label');
                    e2.className = 'dms6';
                    e2.innerHTML = 'Название клана';
                    e1.appendChild(e2);
                    
                    const e3 = document.createElement('input');
                    e3.className = 'dms7';
                    e3.value = document.getElementById('clan.set.name').innerHTML;
                    e3.maxLength = '20';
                    e1.appendChild(e3);
                    this.name = e3;
                    
                    const e4 = document.createElement('label');
                    e4.className = 'dms6';
                    e4.innerHTML = 'Описание клана';
                    e1.appendChild(e4);
                    
                    const e5 = document.createElement('textarea');
                    e5.className = 'dms7 dms8';
                    e5.value = document.getElementById('clan.set.desc').innerHTML;
                    e5.maxLength = '200';
                    e1.appendChild(e5);
                    autosize(e5);
                    e5.addEventListener('input', () => {
                        e5.value = e5.value.replace(/\n/g, ' ').substring(0, 200);
                        this.parent.style.minHeight = e1.offsetHeight+'px';
                    });
                    this.desc = e5;
                }
            }
            {
                const e1 = document.createElement('div');
                e1.className = 'dms1 dms9';
                this.parent.appendChild(e1);
                {
                    const e2 = document.createElement('button');
                    e2.className = 'cs13';
                    e1.appendChild(e2);
                    const e3 = document.createElement('div');
                    e3.className = 'cs14';
                    e3.innerHTML = 'Изменить';
                    e2.appendChild(e3);
                    e2.onclick = () => clanSocket.emit('settings.update', ths.name.value, ths.desc.value, hexToRgb(ths.color.value));
                }
            }
        }

        this.fileinput.onchange = (e) => {
            if(access < 3) return logger.warn('Недостаточно прав');
            e.preventDefault();
            for (let i = 0; i < this.fileinput.files.length; i++) {
                const element = this.fileinput.files[i];
                if(typeof element != 'object') continue;
                if (element.type.match(/image.*/)) {
                    this.uploader.el.style.display = '';
                    this.uploader.crop.bind({
                        url: this.uploader.createObjectURL(element)
                    })
                }
            }
        };

        clanSocket.on('settings.update', (name, desc, color) => {
            ths.desc.value = desc;
            ths.desc.dispatchEvent(new Event('input'));
            ths.name.value = name;
            ths.color.value = color;
            ths.color.dispatchEvent(new Event('data.update'));
            document.getElementById('clan.set.name').innerHTML = name;
            document.getElementById('clan.set.desc').innerHTML = desc;
            document.getElementById('clan.style.color').innerHTML = `:root{--clan-color: ${color};}`;
        });

        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
    }
}