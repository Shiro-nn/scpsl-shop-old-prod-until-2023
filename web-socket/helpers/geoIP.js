module.exports = {};
module.exports.getIpInfo = async(ip) => {
    const response = await fetch('http://api.fydne.dev/geoip?ip='+ip, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user-agent': 'Mozilla/5.0+(compatible; QurreBot/2.0; https://qurre.app/)',
            'referer': 'https://api.fydne.dev',
        }
    });
    return response.json();
}
module.exports.getInfLocation = (info) => {
    let str = info.city ?? '';
    if(info.region){
        if(str != '') str += ', ';
        str += info.region;
    }
    if(info.country){
        if(str != '') str += ', ';
        str += info.country;
    }
    if(str == '') str = 'Unknow';
    return str;
}