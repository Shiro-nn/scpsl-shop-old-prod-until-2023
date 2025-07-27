const roles = require('./base/roles');
const DonateRoles = require('./dashboard/routes/modules/DonateRoles');
const mongoose = require("mongoose");
const config = require("./config");

(async () => {
    await mongoose.connect(config.mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

    const roleeees = await roles.find({freezed: true})
    roleeees.forEach(async role => {
        let mth = role.sum / DonateRoles.roles.find(x => x.id == role.id).sum;
        let inFreeze = Date.now() - role.freeze_start;
        let totalFreeze = (1000 * 60 * 60 * 24 * 30 * mth);
        role.freeze_available = parseInt(totalFreeze - inFreeze);
        await role.save();

        console.log(`Owner: ${role.owner}; inFreeze: ${inFreeze / 24 / 60 / 60 / 1000}; totalFreeze: ${totalFreeze / 24 / 60 / 60 / 1000}; mth: ${mth}; freeze_available: ${role.freeze_available / 24 / 60 / 60 / 1000}`);
    })
})();






































