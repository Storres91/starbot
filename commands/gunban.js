const gbanModel = require('../models/gbanSchema.js')
module.exports = {
    name: 'gunban',
    description: 'Unbans someone from giveaways',
    async execute(client, message, args, Discord) {
        const target = message.mentions.users.first();
        const staffRoleID = '857060867676831805';
        const gaManagerRoleID = '869250517791019088';
        const gBannedRole = '869251117844934706';
        const memberTarget = message.guild.members.cache.get(target.id);
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID) || message.member.roles.cache.some(role => role.id == gaManagerRoleID)) {
            let gbannedData;
            try {
                gbannedData = await gbanModel.findOne({ gbanUserID: target.id });

            } catch (err) {
                console.log(`Error getting gbannedData ${err}`)
            }
            
            if (memberTarget.roles.cache.some(role => role.id == gBannedRole)){
                memberTarget.roles.remove(gBannedRole)
                message.channel.send("Removed giveaway ban from <@"+target.id+">")
            }else{
                if(gbannedData.gbannedCounter==1) return message.channel.send("This user is not banned and their ban count is already at 0 :warning:");
                message.channel.send("This user is not currently banned from giveaways")
            }

            
            if(!gbannedData) return message.channel.send("Note: This user had never been banned by Starbot :warning:");
            if(gbannedData.gbannedCounter==1) return message.channel.send("This user's ban count is already at 0, can't go lower :warning:");
            
            gbannedData.gbannedCounter -= 1;
            gbannedData.save();
            mbanCount=gbannedData.gbannedCounter-1;
            message.channel.send("User's ban count set to: "+mbanCount+" times");
        } else {
            message.channel.send(":no_entry_sign: Missing permissions to run this command");
        }
    }
}