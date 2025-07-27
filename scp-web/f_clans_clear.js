
const ClearInactiveUsers = async () => {
    const deathsUsers = await accountsData.find({last_active: 0});
    let clansData = await require("./base/clans").find();
    clansData = clansData.sort((a, b) => b.users.length - a.users.length);

    for (let i = 0; i < clansData.length; i++) {
        const clanData = clansData[i];

        console.log('Чистка клана: ' + clanData.tag + ' (' + clanData.name + ')');
    
        let notify = 'Были кикнуты неактивные участники: ';
        let int = 0;
        let dels = [];
    
        for (let index = 0; index < clanData.users.length; index++) {
            const userId = clanData.users[index];
    
            if (deathsUsers.some(x => x.id == userId.user) && userId.access != 5) {
                notify += `<@${userId.user}>, `;
                int++;
                dels.push(userId);

                const account = await accountsData.findOne({id: userId.user});
                if (account.clan == clanData.tag) {
                    account.clan = '';
                    await account.save();
                }
            }
        }
    
        while (dels.length > 0) {
            const index = clanData.users.indexOf(dels[0]);
            if (index > -1) {
                clanData.users.splice(index, 1);
            }
    
            dels = dels.slice(1);
        }

        if (int == 0) {
            continue;
        }
    
        notify = notify.substring(0, notify.length - 2) + '.';
    
        clanData.notifications.push({
            msg: notify,
            date: Date.now()
        });
    
        clanData.markModified('users');
        clanData.markModified('notifications');
    
        await clanData.save();
    
        console.log('count: ' + int);
        console.log('users now: ' + clanData.users.length);
        console.log('------------------------------');
    }

};
const CheckInactiveUsers = async () => {
    console.log('------------------------------');
    const deathsUsers = await accountsData.find({last_active: 0});
    let clansData = await require("./base/clans").find();
    clansData = clansData.sort((a, b) => b.users.length - a.users.length);

    const deathClans = [];

    for (let i = 0; i < clansData.length; i++) {
        const clanData = clansData[i];
    
        console.log('Проверка клана: ' + clanData.tag + ' (' + clanData.name + ')');
    
        let int = 0;
        let ownerDeath = false;
    
        for (let index = 0; index < clanData.users.length; index++) {
            const userId = clanData.users[index];
    
            if (deathsUsers.some(x => x.id == userId.user)) {
                int++;
                if (userId.access == 5) {
                    console.log('Овнер умер');
                    ownerDeath = true;
                }
            }
        }
        console.log('count: ' + int);
        console.log('users now: ' + (clanData.users.length - int));
        console.log('------------------------------');

        if (ownerDeath) {
            deathClans.push({
                tag: clanData.tag,
                name: clanData.name,
                deathsUsers: int,
                aliveUsers: (clanData.users.length - int),
                totalUsers: clanData.users.length,
                isPublic: clanData.public
            })
        }
    }

    console.log('\n');
    console.log('Список мертвых кланов:');
    console.log('------------------------------');

    for (let i = 0; i < deathClans.length; i++) {
        const deathClan = deathClans[i];
        console.log(`${i + 1}. ${deathClan.name} (${deathClan.tag}); Публичный: ${deathClan.isPublic}`);
        console.log(`Всего участников: ${deathClan.totalUsers}`);
        console.log(`Живых участников: ${deathClan.aliveUsers}`);
        console.log(`Мертвых участников: ${deathClan.deathsUsers}`);
        console.log('------------------------------');
    }
}
const CheckInactiveUsersOfClan = async () => {
    const clanTag = "PHNK";
    const clanData = await require("./base/clans").findOne({tag:clanTag});

    if (!clanData) {
        console.log('clan not found');
        return;
    }

    console.log('Проверка клана: ' + clanTag + ' (' + clanData.name + ')');

    let int = 0;

    for (let index = 0; index < clanData.users.length; index++) {
        const userId = clanData.users[index];
        const account = await accountsData.findOne({id: userId.user});

        if (account.last_active == 0) {
            int++;
            if (userId.access == 5) {
                console.log('Овнер умер');
            }
        }
    }
    console.log('count: ' + int);
    console.log('users now: ' + (clanData.users.length - int));
}

const ClearInactiveUsersOfClan = async () => {
    const clanTag = "PRTS";
    const clanData = await require("./base/clans").findOne({tag:clanTag});

    if (!clanData) {
        console.log('clan not found');
        return;
    }

    console.log('Чистка клана: ' + clanTag + ' (' + clanData.name + ')');

    let notify = 'Были кикнуты неактивные участники: ';
    let int = 0;
    let dels = [];

    for (let index = 0; index < clanData.users.length; index++) {
        const userId = clanData.users[index];
        const account = await accountsData.findOne({id: userId.user});

        if (account.last_active == 0 && userId.access != 5) {
            notify += `<@${userId.user}>, `;
            int++;
            dels.push(userId);

            if (account.clan == clanTag) {
                account.clan = '';
                await account.save();
            }
        }
    }

    while (dels.length > 0) {
        const index = clanData.users.indexOf(dels[0]);
        if (index > -1) {
            clanData.users.splice(index, 1);
        }

        dels = dels.slice(1);
    }

    notify = notify.substring(0, notify.length - 2) + '.';

    clanData.notifications.push({
        msg: notify,
        date: Date.now()
    });

    clanData.markModified('users');
    clanData.markModified('notifications');

    await clanData.save();

    console.log('count: ' + int);
    console.log('users now: ' + clanData.users.length);
};


const ClearUsersTag = async () => {
    const clansData = await require("./base/clans").find();
    const accounts = await accountsData.find();
    
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        
        if (!clansData.some(x => x.tag == account.clan) || !clansData.some(x => x.tag == account.clan && x.users.some(x => x.user == account.id))) {
            account.clan = '';
            await account.save();
            console.log('unset clan of: ' + (account.name == '' ? account.user : account.name));
        }
    }
};

const ClearChats = async () => {
    const clansData = await require("./base/clans").find();
    const chatsData = await require("./base/chats").find();

    for (let i = 0; i < chatsData.length; i++) {
        const chatData = chatsData[i];
        if (!clansData.some(x => x.tag == chatData.clan)) {
            await chatData.deleteOne();
            console.log('Removed chat of: ' + chatData.clan);
        }
    }
};