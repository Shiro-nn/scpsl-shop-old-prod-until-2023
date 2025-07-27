let _lofgefbd = [];
let gefdb = [];
clanSocket.on('get.emoji', async(data, uid) => {
    if(!_lofgefbd.some(x => x.id == uid)) return;
    const retdata = {
        id: data.id,
        name: data.name,
        url: data.url
    }
    window.localStorage.setItem('emoji.info.'+data.id, JSON.stringify(retdata));
    _lofgefbd.find(x => x.id == uid).resolve(retdata);
    gefdb = gefdb.filter(x => x != data.id);
    _lofgefbd = _lofgefbd.filter(x => x != uid);
});
async function GetEmojiById(id){
    const bdloc = window.localStorage.getItem('emoji.info.'+id);
    if(bdloc == undefined || bdloc == null) return GetAsyncFromSocket();
    const _dta = _parse(bdloc);
    if(_dta.error) return GetAsyncFromSocket();
    return _dta;
    function GetAsyncFromSocket(){
        if(gefdb.some(x => x == id)){
            return new Promise(resolve => {
                const _intrv = setInterval(() => {
                    const bdloc = window.localStorage.getItem('emoji.info.'+id);
                    if(bdloc == undefined || bdloc == null) return;
                    const _dta = JSON.parse(bdloc);
                    clearInterval(_intrv);
                    resolve(_dta);
                }, 100);
            });
        }
        gefdb.push(id);
        let rslv;
        const prm = new Promise(resolve => rslv = resolve);
        const uid = guid();
        _lofgefbd.push({id: uid, resolve: rslv});
        clanSocket.emit('get.emoji', id, uid);
        return prm;
    }
    function _parse(string) {
        try{return JSON.parse(string)}catch{return {error: true}}
    }
};
(async() => {
clanSocket.on('get.emojis', async(list) => {
    for (let i = 0; i < list.length; i++) {
        const data = list[i];
        const retdata = {
            id: data.id,
            name: data.name,
            url: data.url
        }
        window.localStorage.setItem('emoji.info.'+data.id, JSON.stringify(retdata));
    }
});
clanSocket.emit('get.emojis');
})();