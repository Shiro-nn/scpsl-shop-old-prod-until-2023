const mongo = {
    accounts: require('../base/accounts'),
    temps: require('../base/temps'),
    resets: require('../base/resets'),
    roles: require('../base/roles'),
}
const sessions = require('./better-sessions/mongo');
const doubtfuls = require('../base/doubtful');
const MailManager = require('../dashboard/routes/modules/mails/Manager');
const DonateRoles = require('../dashboard/routes/modules/DonateRoles');

module.exports = async() => {
    ClearTemp();
    ClearResets();
    ClearSessions();
    ClearDoubfuls();
    Unfreeze();
};

function ClearTemp() {
    const tempAlive = 1000 * 60 * 60 * 48;
    setInterval(() => func(), 1000 * 60 * 10);
    func();
    async function func() {try{
        const _temps = await mongo.temps.find({created: {$gte: Date.now() + tempAlive}});
        _temps.forEach(async temp => {
            if(Date.now() - temp.created > tempAlive) await temp.deleteOne();
        });
    }catch(e){console.error(e)}}
}
function ClearResets() {
    const resetAlive = 1000 * 60 * 60 * 24;
    setInterval(() => func(), 1000 * 60 * 10);
    func();
    async function func() {try{
        const _resets = await mongo.resets.find({created: {$gte: Date.now() + resetAlive}});
        _resets.forEach(async reset => {
            if(Date.now() - reset.created > resetAlive) await reset.deleteOne();
        });
    }catch(e){console.error(e)}}
}
function ClearSessions() {
    setInterval(() => func(), 1000 * 60);
    func();
    async function func() {try{
        const _sessions = await sessions.find({expires: {$lte: Date.now()}});
        _sessions.forEach(async session => {
            if(Date.now() > session.expires) await session.deleteOne();
        });
    }catch(e){console.error(e)}}
}
function ClearDoubfuls() {
    setInterval(async() => {
        await doubtfuls.deleteMany({expires: {$lte: Date.now()}})
    }, 1000 * 60);
}
function Unfreeze() {
    setInterval(async() => {
        const roles = await mongo.roles.find({freezed: true});
        roles.forEach(async role => {
            let inFreeze = Date.now() - role.freeze_start;

            if (inFreeze > role.freeze_available) {
                role.freezed = false;
                role.freeze_available = 0;
                role.expires += inFreeze;
                role.freeze_start = 0;
                role.freeze_last = Date.now();
                await role.save();

                const account = await mongo.accounts.findOne({id: role.owner});

                if (account) {
                    MailManager.donates.unfreeze(account, DonateRoles.roles.find(x => x.id === role.id)?.name);
                }
            }
        })
    }, 1000 * 60 * 5);
}