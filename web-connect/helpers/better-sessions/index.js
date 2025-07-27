const mongo = require('./mongo');
const geoIP = require('../geoIP');
const userAgent = require('../userAgent');
const crypt = require('../cryptoData');
module.exports = function(config = {
    name: 'sid',
    expires: new Date(Date.now() + 86400000),//1000 * 60 * 60 * 24
    httpOnly: false,
    domain: '.scpsl.shop',
    path: '/',
    secure: true
}) {
    let cache = [];
    return {
        config:config,
        get: async(id, latest = false) => {
            if(!latest && cache.some(x => x.uid == id && Date.now() - x.lastSyns < 100000 && x.expires - Date.now() > 0)){
                const _exist = await mongo.exists({id:crypt.sha256(id)});
                if(!_exist) return {};
                return cache.find(x => x.uid == id).data;
            }
            const _data = await mongo.findOne({id:crypt.sha256(id)});
            if(_data == null || _data == undefined) return {};
            cache = cache.filter(x => x.uid != id);
            cache.push({uid:id, data:JSON.parse(_data.data), lastSyns: Date.now(), expires: _data.expires});
            return JSON.parse(_data.data);
        },
        init: async(req, res, next) => {
            const ck = req.cookies[config.name];
            req.bs = {
                data: {},
                save: async function(expires = config.expires) {
                    let uid = ck;
                    if(uid == null || uid == undefined){
                        uid = crypt.guid(100);
                        res.cookie(config.name, uid, {expires, httpOnly:config.httpOnly, domain:config.domain, path:config.path, secure:config.secure});
                    }
                    if(!cache.some(x => x.uid == uid)) cache.push({uid, data:req.bs.data, lastSyns: Date.now(), expires: expires.getTime()});
                    else{
                        const _chc = cache.find(x => x.uid == uid);
                        _chc.data = req.bs.data;
                        _chc.lastSyns = Date.now();
                    }
                    await MongoUpdate();
                    async function MongoUpdate() {
                        const _data = await mongo.findOne({id:crypt.sha256(uid)});
                        const ipinf = await geoIP.getIpInfo((req.headers['x-forwarded-for'] || req.socket.remoteAddress).replace('::ffff:', '').replace('::1', '127.0.0.1'));
                        const urag = userAgent.parse(req.headers['user-agent']);
                        if(_data == null || _data == undefined) await new mongo({id:crypt.sha256(uid), account: req.bs.data.id, data:JSON.stringify(req.bs.data), expires: expires.getTime(),
                            loc: geoIP.getInfLocation(ipinf), browser: userAgent.getBrowser(urag), os: userAgent.getOS(urag)}).save();
                        else{_data.data = JSON.stringify(req.bs.data); await _data.save();}
                    }
                },
                destroy: async function(){
                    if(ck == null || ck == undefined) return;
                    res.clearCookie(config.name, {httpOnly:config.httpOnly, domain:config.domain, path:config.path, secure:config.secure});
                    cache = cache.filter(x => x.uid != ck);
                    await mongo.deleteMany({id:crypt.sha256(ck)});
                },
                clearAll: async(params) => {
                    try{cache = cache.filter(x => !x.data.includes(params));}catch{}
                    const _data = await mongo.find();
                    _data.forEach(async(data) => {
                        try{if(data.data.includes(params)) await data.deleteOne();}catch{}
                    });
                }
            }
            if(ck == null || ck == undefined) return next();
            if(cache.some(x => x.uid == ck && Date.now() - x.lastSyns < 100000 && x.expires - Date.now() > 0)){
                const _exist = await mongo.exists({id:crypt.sha256(ck)});
                if(!_exist) req.bs.data = {};
                else req.bs.data = cache.find(x => x.uid == ck).data;
            }
            else{
                const _data = await mongo.findOne({id:crypt.sha256(ck)});
                if(_data == null || _data == undefined) return next();
                req.bs.data = JSON.parse(_data.data);
                cache = cache.filter(x => x.uid != ck);
                cache.push({uid:ck, data:req.bs.data, lastSyns: Date.now(), expires: _data.expires});
            }
            next();
        }
    }
}