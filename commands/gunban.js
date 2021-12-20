const gbanModel = require('../models/gbanSchema.js')
module.exports = {
    name: 'gunban',
    description: 'Unbans someone from giveaways',
    async execute(client, message, args, Discord) {
        var target;

        if(message.mentions.users.first()){
            target = message.mentions.users.first();
        }
        else{
            target = await message.guild.members.fetch(args[0]).catch(() => null);
        }
        if (!target) return message.channel.send("User not found/missing!");
        
        const memberTarget = await message.guild.members.cache.get(target.id);

        const staffRoleID = '857060867676831805';
        const gaManagerRoleID = '869250517791019088';
        const gBannedRole = '869251117844934706';

        var unbanMessage="";
        

        if(args[1]){
            unbanMessage = "**Message**: "+args.slice(1).join(" ");
        }else{
            unbanMessage="";
        }

        const gunbannedEmbed = new Discord.MessageEmbed()
			.setColor('#08FF00')
			.setTitle(":white_check_mark: You are now unbanned from Celestial Realm giveaways <a:starpurplehover:905575054161641483>")
			.setDescription("Always remember to do the requirements and follow the rules. \n"+unbanMessage)
			.setFooter("Celestial Starbot")
			.setTimestamp();

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
                client.users.cache.get(memberTarget.user.id).send({ embeds: [gunbannedEmbed] }).catch(() => null);

            }else{
                if(gbannedData.gbannedCounter==1) return message.channel.send("This user is not banned and their ban count is already at 0 :warning:");
                message.channel.send("This user is not currently banned from giveaways")
            }

            
            if(!gbannedData) return message.channel.send("Note: This user had never been banned by Starbot :warning:");
            if(gbannedData.gbannedCounter==1) return message.channel.send("This user's ban count is already at 0, can't go lower :warning:");
            
            gbannedData.gbannedCounter -= 1;
            gbannedData.save();
            var mbanCount=gbannedData.gbannedCounter-1;
            message.channel.send("User's ban count set to: "+mbanCount+" times");
        } else {
            message.channel.send(":no_entry_sign: Missing permissions to run this command");
        }
    }
}