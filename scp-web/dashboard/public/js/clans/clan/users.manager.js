let _gtngdt = [];
let gettingusersids = [];
socket.on('get.user.main.info', async(data, uid) => {
    if(!_gtngdt.some(x => x.id == uid)) return;
    const retdata = {
        username: data.username,
        avatar: data.avatar,
        id: data.id,
        sync: Date.now()
    }
    window.localStorage.setItem('user.info.'+data.id, JSON.stringify(retdata));
    _gtngdt.find(x => x.id == uid).resolve(retdata);
    gettingusersids = gettingusersids.filter(x => x != data.id);
    _gtngdt = _gtngdt.filter(x => x != uid);
});
async function GetUserById(id){
    const bdloc = window.localStorage.getItem('user.info.'+id);
    if(bdloc == undefined || bdloc == null) return GetAsyncFromSocket();
    const _dta = _parse(bdloc);
    if(Date.now() - _dta.sync > 60000) return GetAsyncFromSocket();
    return _dta;
    function GetAsyncFromSocket(){
        if(gettingusersids.some(x => x == id)){
            return new Promise(resolve => {
                const _intrv = setInterval(() => {
                    const bdloc = window.localStorage.getItem('user.info.'+id);
                    if(bdloc == undefined || bdloc == null) return;
                    const _dta = JSON.parse(bdloc);
                    clearInterval(_intrv);
                    resolve(_dta);
                }, 100);
            });
        }
        gettingusersids.push(id);
        let rslv;
        const prm = new Promise(resolve => rslv = resolve);
        const uid = guid();
        _gtngdt.push({id: uid, resolve: rslv});
        socket.emit('get.user.main.info', id, uid);
        return prm;
    }
    function _parse(string) {
        try{return JSON.parse(string)}catch{return {sync: 0}}
    }
}