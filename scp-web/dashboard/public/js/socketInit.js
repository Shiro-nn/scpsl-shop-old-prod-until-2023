const socket = io('https://socket.scpsl.shop', {
    auth: {
        cookie: document.cookie
    },
    path: '/main/',
    //transports: ['websocket', 'polling']
});