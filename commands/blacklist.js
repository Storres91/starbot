
const blacklistedModel = require('../models/blacklistedSchema.js')
module.exports = {
    name: 'blacklist',
    description: 'Blacklists someone from using the bot',
    async execute(client, message, args, Discord) {
        const staffRole ='857060867676831805';
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRole)) {
            const blacklistedTarget = message.mentions.users.first();
            if(blacklistedTarget.id=='313351494361677845') return message.channel.send("You can't blacklist a developer <:nyanana:906766582171181077>")
            if(blacklistedTarget.id==message.author.id) return message.channel.send("You can't blacklist yourself lol")
            if(blacklistedTarget.id=='902331574396284948') return message.channel.send("I am god <a:cr_wtf:856247028635664414> ")
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