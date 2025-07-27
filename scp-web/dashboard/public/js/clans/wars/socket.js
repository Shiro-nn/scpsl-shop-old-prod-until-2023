const clanSocket = io('https://socket.scpsl.shop', {
    auth: {
        cookie: document.cookie
    },
    path: '/clans-wars/',
});