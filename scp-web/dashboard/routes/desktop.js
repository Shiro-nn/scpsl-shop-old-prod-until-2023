const express = require('express');
const router = express.Router();
const config = require('../../config');
const tokens = require('../../helpers/better-sessions/mongo');
const crypt = require('./modules/auth/cryptoData');
const geoIP = require('./modules/auth/geoIP');
const userAgent = require('./modules/auth/userAgent');

router.get('/auth/desktop', async(req, res) => {
    res.render('desktop/token.ejs', {cdn:config.dashboard.cdn+'/scpsl'});
});
router.post('/auth/desktop', async(req, res) => {
	if(req.bs.data.user == null) return res.status(400).json({error: true, message: 'Вы неавторизованы'});
    if(isNaN(req.bs.data.user.id)) return res.status(400).json({error: true, message: 'Неверный конструктор данных авторизации<br>Попробуйте выйти из аккаунта'});
    const ipinf = await geoIP.getIpInfo(req._ip);
    const urag = userAgent.parse(req.headers['user-agent']);
    const uid = crypt.guid(100);
    const tokenData = new tokens({id: crypt.sha256(crypt.sha256(uid)), account: req.bs.data.user.id, data: JSON.stringify(req.bs.data), last: Date.now(),
        browser: 'Desktop App', loc: geoIP.getInfLocation(ipinf), os: userAgent.getOS(urag), last: Date.now(), expires: Date.now() + 5184000000}); // 1000 * 60 * 60 * 24 * 60
    await tokenData.save();
    res.status(400).json({error: false, token: uid});
});

module.exports = router;