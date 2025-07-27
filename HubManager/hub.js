const express = require('express');
const http = require('http');

const userIps = [];

const _web = express();
_web
.use('/ips/add', (req, res) => {
    if(!req.query.userid) return res.status(400).json({error: true, message: 'UserID not found'});
    if(!req.query.ip) return res.status(400).json({error: true, message: 'Ip not found'});
    const index = userIps.findIndex(x => x.userId == req.query.userid);
    if(index > -1){
        userIps.splice(index, 1);
    }
    userIps.push({userId:req.query.userid, ip:req.query.ip});
    res.json({error: false, message: ''});
})
.use('/ips/get', (req, res) => {
    if(!req.query.userid) return res.status(400).json({error: true, message: 'UserID not found'});
    const data = userIps.find(x => x.userId == req.query.userid);
    if(!data) return res.status(404).json({error: true, message: 'User not found'});
    res.json({error: false, message: data.ip});
})
.use((req, res) => {
    res.status(404).json({error: true, message: 'not found'});
})

const server = http.createServer(_web);
server.listen(4536, '127.0.0.1');
server.listen(4536, '10.66.55.2');