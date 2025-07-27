const express = require('express');
const { execSync } = require('child_process');
const http = require('http');

const ports = {
    '1': 6666,
    '2': 7667,
};

const gateIps = {
    '185.112.83.236': '10.66.55.2',
    '185.112.83.223': '10.66.66.2',
    '185.112.83.237': '10.66.77.2',
}

for(var i in ports){
    execSync(`iptables -A INPUT -j DROP -p udp --dport ${ports[i]}`);
}

const _web = express();
_web
.use('/verify', (req, res) => {
    if(!req.query.ip) return res.status(400).json({error: true, message: 'Ip not found', port: 0});
    if(!req.query.type) return res.status(400).json({error: true, message: 'Type not found', port: 0});
    const port = ports[req.query.type];
    if(!port) return res.status(400).json({error: true, message: `Port not found (${req.query.type})`, port: 0});
    //execSync(`iptables -t nat -A PREROUTING -s ${req.query.ip} -p udp --dport ${port} -j DNAT --to-destination 10.66.55.2`);
    for(var source in gateIps){
        execSync(`iptables -t nat -A PREROUTING -p udp -s ${req.query.ip} -d ${source} --dport ${port} -j DNAT --to-destination ${gateIps[source]}`);
    }
    //execSync(`iptables -I INPUT -s ${req.query.ip} -p udp --dport ${port} -j ACCEPT`);
    setTimeout(() => res.json({error: false, message: '', port: port}), 1000);
})
.use((req, res) => {
    res.status(404).json({error: true, message: 'not found', port: 0});
})

http.createServer(_web).listen(5231, '127.0.0.1');