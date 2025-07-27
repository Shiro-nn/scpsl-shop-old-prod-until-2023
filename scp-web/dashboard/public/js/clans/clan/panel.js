document.body.addEventListener('custom.load', () => {
    const _el = document.getElementById('scripts.width-to-height');
    _el.style.width = _el.offsetHeight + 'px';
    _el.style.fontSize = _el.offsetHeight + 'px';
});
document.body.addEventListener('custom.load', () => {
    setInterval(() => UpdateWidth(), 1000);
    UpdateWidth();
    function UpdateWidth() {
        const _el = document.querySelector('#selector .pn7');
        const _target = document.querySelector('#selector .pn5');
        _target.style.width = _el.offsetWidth + 'px';
    }
});
document.body.addEventListener('custom.load', () => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    //setInterval(() => UpdateStyleData(), 1000);
    UpdateStyleData();
    function UpdateStyleData() {
        const _el = document.querySelector('#selector .pn7');
        style.innerHTML = `:root {--selector-panel-scale: ${_el.offsetWidth}px;}`;
    }
});
document.body.addEventListener('custom.load', () => {
    const _el = document.querySelector('#selector .pn7');
    const _par = document.getElementById('selector');
    _el.onclick = () => {
        if(_par.className.includes('pnhidden')) _par.className = '';
        else _par.className = 'pnhidden';
    }
});
(async()=>{
    let _firstchat = true;

    const parent = document.getElementById('selector').querySelector('.pn2');
    parent.innerHTML = '';
    CreateButton('Новости', 'newspaper', () => CallClick(0));
    CreateButton('Участники', 'users', () => CallClick(1));
    CreateButton('Бусты', 'angles-up', () => CallClick(2));
    CreateButton('Чат', 'comments', () => CallClick(3));
    CreateButton('Настройки', 'gears', () => CallClick(4));
    document.body.addEventListener('custom.rendered', () => CallClick(render - 1));
    function CreateButton(name, icon, onclick){
        const e1 = document.createElement('div');
        e1.className = 'pn3';
        try{e1.onclick = onclick;}catch{}
        parent.appendChild(e1);
        const e2 = document.createElement('i');
        e2.className = 'pn4 fa-duotone fa-'+icon;
        e1.appendChild(e2);
        const e3 = document.createElement('span');
        e3.innerHTML = name;
        e1.appendChild(e3);
    }
    function CallClick(button){
        switch (button) {
            case 0:
                RenderElements.news.show();
                RenderElements.users.hide();
                RenderElements.boosts.hide();
                RenderElements.chat.hide();
                RenderElements.settings.hide();
                break;
            case 1:
                RenderElements.news.hide();
                RenderElements.users.show();
                RenderElements.boosts.hide();
                RenderElements.chat.hide();
                RenderElements.settings.hide();
                break;
            case 2:
                RenderElements.news.hide();
                RenderElements.users.hide();
                RenderElements.boosts.show();
                RenderElements.chat.hide();
                RenderElements.settings.hide();
                break;
            case 3:
                RenderElements.news.hide();
                RenderElements.users.hide();
                RenderElements.boosts.hide();
                RenderElements.chat.show();
                RenderElements.settings.hide();
                break;
            case 4:
                RenderElements.news.hide();
                RenderElements.users.hide();
                RenderElements.boosts.hide();
                RenderElements.chat.hide();
                RenderElements.settings.show();
                break;
            default: break;
        }

        const _kids = parent.querySelectorAll('.pn3');
        for (let i = 0; i < _kids.length; i++){
            const _kid = _kids[i];
            if(_kid.className.includes('activebutton')) _kid.className = 'pn3';
        }
        _kids[button].className += ' activebutton';
    }
})();