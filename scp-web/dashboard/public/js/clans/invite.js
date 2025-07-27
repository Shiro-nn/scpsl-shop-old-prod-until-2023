const clanSocket = io('https://socket.scpsl.shop', {
    auth: {
        cookie: document.cookie
    },
    path: '/clans/',
    //transports: ['websocket', 'polling']
});
clanSocket.on('join.by.inv', async(suc, arg) => {
    if(!suc){
        alert(arg);
        location.href = '/clans/list';
        return;
    }
    location.href = '/clans/'+arg;
});
clanSocket.emit('join.by.inv', code);