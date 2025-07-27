const updater = {
    balance: {
        real: 0,
        now: 0,
        el: document.getElementById('clan.set.balance')
    },
    money: {
        real: 0,
        now: 0,
        el: document.getElementById('clan.set.money')
    }
};
(async()=>{
clanSocket.on('update.balance', async(value) => {
    updater.balance.real = value;
    while(updater.balance.real - updater.balance.now != 0){
        const diff = updater.balance.real - updater.balance.now;
        if(diff > 0){
            let min = 1;
            if(diff > 1000) min = 100;
            else if(diff > 100) min = 10;
            updater.balance.now+=min;
            updater.balance.el.innerHTML = updater.balance.now;
        }else{
            let min = 1;
            if(diff < -1000) min = 100;
            else if(diff < -100) min = 10;
            updater.balance.now-=min;
            updater.balance.el.innerHTML = updater.balance.now;
        }
        await sleep(10);
    }
});
clanSocket.on('update.money', async(value) => {
    updater.money.real = value;
    while(updater.money.real - updater.money.now != 0){
        const diff = updater.money.real - updater.money.now;
        if(diff > 0){
            let min = 1;
            if(diff > 1000) min = 100;
            else if(diff > 100) min = 10;
            updater.money.now+=min;
            updater.money.el.innerHTML = updater.money.now;
        }else{
            let min = 1;
            if(diff < -1000) min = 100;
            else if(diff < -100) min = 10;
            updater.money.now-=min;
            updater.money.el.innerHTML = updater.money.now;
        }
        await sleep(10);
    }
});
})();