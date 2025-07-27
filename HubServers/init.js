const express = require('express');
const { execSync } = require('child_process');
const http = require('http');

/* first boot
iptables -A INPUT -m set --match-set players6666.zone src -p udp --dport 6666 -j ACCEPT
iptables -A INPUT -p udp -m udp --dport 6666 -j DROP

iptables -A INPUT -m set --match-set players7667.zone src -p udp --dport 7667 -j ACCEPT
iptables -A INPUT -p udp -m udp --dport 7667 -j DROP
*/

const ports = {
    '1': 6666,
    '2': 7667,
};

for(var i in ports){
    try{execSync(`ipset -F players${ports[i]}.zone`);}catch{}
    try{execSync(`ipset -N players${ports[i]}.zone nethash`);}catch{}
}

const _web = express();
_web
.use('/verify', (req, res) => {
    if(!req.query.ip) return res.status(400).json({error: true, message: 'Ip not found', port: 0});
    if(!req.query.type) return res.status(400).json({error: true, message: 'Type not found', port: 0});
    const port = ports[req.query.type];
    if(!port) return res.status(400).json({error: true, message: `Port not found (${req.query.type})`, port: 0});
    try{execSync(`ipset -A players${port}.zone ${req.query.ip}`);}catch{}
    setTimeout(() => res.json({error: false, message: '', port: port}), 1000);
})
.use('/remove', (req, res) => {
    if(!req.query.ip) return res.status(400).json({error: true, message: 'Ip not found'});
    for(var i in ports){
        try{execSync(`ipset del players${ports[i]}.zone ${req.query.ip}`);}catch{}
    }
    res.send('yes');
})
.use('/remove/special', (req, res) => {
    if(!req.query.ip) return res.status(400).json({error: true, message: 'Ip not found'});
    if(!req.query.port) return res.status(400).json({error: true, message: 'Port not found'});
    try{execSync(`ipset del players${req.query.port}.zone ${req.query.ip}`);}catch{}
    res.send('yes');
})
.use('/clearAuths', (req, res) => {
    for(var i in ports){
        try{execSync(`ipset -F players${ports[i]}.zone`);}catch{}
        try{execSync(`ipset -N players${ports[i]}.zone nethash`);}catch{}
    }
    res.send('yes');
})
.use((req, res) => {
    res.status(404).json({error: true, message: 'not found', port: 0});
})

http.createServer(_web).listen(5231, '127.0.0.1');