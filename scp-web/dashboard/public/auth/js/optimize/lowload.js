window.addEventListener('load', () => {
    const _linkList = document.querySelectorAll('link');
    for (let i = 0; i < _linkList.length; i++) {
        const _link = _linkList[i];
        const _atr = _link.getAttribute('lowhref');
        if(_atr == undefined || _atr == null) continue;
        _link.href = _atr;
        _link.setAttribute('lowhref', '');
    }
});
window.addEventListener('load', () => {
    const _linkList = document.querySelectorAll('script');
    for (let i = 0; i < _linkList.length; i++) {
        const _link = _linkList[i];
        const _atr = _link.getAttribute('lowsrc');
        if(_atr == undefined || _atr == null) continue;
        _link.src = _atr;
        _link.setAttribute('lowsrc', '');
    }
});