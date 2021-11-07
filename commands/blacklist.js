
const blacklistedModel = require('../models/blacklistedSchema.js')
module.exports = {
    name: 'blacklist',
    description: 'Blacklists someone from using the bot',
    async execute(client, message, args, Discord) {
        if (message.member.user.id == '313351494361677845') {
            const blacklistedTarget = message.mentions.users.first();

            if (blacklistedTarget) {
            try{
                let blacklistedMod = await blacklistedModel.create({
                    blUserID: String(blacklistedTarget.id),
                    blStatus: true
        
                });
                blacklistedMod.save();
                message.channel.send(`<@${blacklistedTarget.id}> succesfully blacklisted from the bot`)
            }
            catch(err){
                console.log("Error blacklisting member "+err)
                message.channel.send("Member was already blacklisted (Error)")
            }
            
        }
            if (!blacklistedTarget) return message.channel.send("User not found/missing!");
        }
    }
}