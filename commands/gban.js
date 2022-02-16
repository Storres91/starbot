const ms = require('ms');
const gbanModel = require('../models/gbanSchema.js')
const countersModel = require('../models/countersSchema.js')
module.exports = {
    name: 'gban',
    description: 'Bans someoneone from giveaways for a set amount of time',
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        const gaManagerRoleID = '869250517791019088';
        const gBannedRole = '869251117844934706';
        const times = ['1 day', '3 days', '7 days']
        var daysTime = times[0]
        var permaban = false;
        var reason=""
        var messageConfirm = "has been banned from giveaways for " + daysTime + " this is their first offense";
        var target;

        if(message.mentions.users.first()){
            target = message.mentions.users.first();
        }
        else{
            target = await message.guild.members.fetch(args[0]).catch(() => null);
        }
        
        if(args[1]){
            reason = args.slice(1).join(" ");
        }else{
            reason="Not completing the requirement on a giveaway.";
        }
        

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID) || message.member.roles.cache.some(role => role.id == gaManagerRoleID)) {
            
            
            if (!target) return message.channel.send("User not found/missing!");
            if (target.id == '313351494361677845') return message.channel.send("You can't gban a developer <:nyanana:906766582171181077>");
            if (target.id == '902331574396284948') return message.channel.send("I am god <a:cr_wtf:856247028635664414> ");
            

            let gbannedData;
            try {
                gbannedData = await gbanModel.findOne({ gbanUserID: target.id });

            } catch (err) {
                console.log(`Error getting gbannedData ${err}`)
            }

            try {
                var countersData2 = await countersModel.findOne({ counterID: 2 });
            } catch (err) {
                console.log(`Error getting countersData2 ${err}`)
            }


            if (gbannedData) {
                if (gbannedData.gbannedCounter == 5) return message.channel.send("<@" + gbannedData.gbanUserID + "> is already permanently banned from giveaways");
                switch (gbannedData.gbannedCounter) {
                    case 2:
                        daysTime = times[1]
                        messageConfirm = "has been banned from giveaways for " + daysTime + " this is their second offense";
                        break;

                    case 3:
                        daysTime = times[2]
                        messageConfirm = "has been banned from giveaways for " + daysTime + " this is their third offense";
                        break;

                    case 4:
                        permaban = true;
                        messageConfirm = "has been banned from giveaways **permanently**";
                        break;

                    default:
                        break;
                }
            }




            var msDate = ms(daysTime);
            var unbanDate = Date.now() + msDate;
            var unbanTimer = unbanDate - Date.now();

            var mReason = "\n**Reason:** " + reason;
            if (reason == "") {
                mReason = "";
            }



            var memberTarget = message.guild.members.cache.get(target.id);
            memberTarget.roles.add(gBannedRole);

            if (permaban) daysTime = "You've reached ur 4th ban from giveaways, this is a permanent ban";

            const gbannedEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle(":no_entry_sign: You have been banned from giveaways in Celestial Realm <a:starpurplehover:905575054161641483>")
                .setDescription("**Duration:** " + daysTime + mReason)
                .setFooter("Celestial Starbot")
                .setTimestamp();





            client.users.cache.get(memberTarget.user.id).send({ embeds: [gbannedEmbed] }).catch(() => message.channel.send(":warning: I was not able to inform this user via dm!"));
            message.channel.send("<@" + memberTarget.user.id + "> " + messageConfirm)



            if (!gbannedData) {
                let gbanMod = await gbanModel.create({
                    gbanUserID: target.id,
                    gbanID: countersData2.bansSeq,
                    gunbanDate: unbanDate
                });
                gbanMod.save();
                
                countersData2.bansSeq+=1;
                await countersData2.save();
            } else {
                gbannedData.gunbanDate = unbanDate;
                gbannedData.gbannedCounter += 1;
                gbannedData.save();
            }
            
            

            if (permaban) return;

            setTimeout(function () { gabantimeout(target.id) }, unbanTimer);
        } else {
            message.channel.send(":warning: Missing permissions to run this command");
        }
        
        function gabantimeout(userID) {            
            let memberTargetFunction = message.guild.members.cache.get(userID);
			if(!memberTargetFunction) return console.log("Was not able to remove the role from "+userID);
            const gunbannedEmbed = new Discord.MessageEmbed()
                .setColor('#08FF00')
                .setTitle("<a:starpurplehover:905575054161641483> You are now unbanned from Celestial Realm giveaways :white_check_mark:")
                .setDescription("Always remember to do the requirements and follow the rules.")
                .setFooter("Celestial Starbot")
                .setTimestamp();

            memberTargetFunction.roles.remove(gBannedRole).catch(() => null);
            client.users.cache.get(memberTargetFunction.user.id).send({ embeds: [gunbannedEmbed] }).catch(() => null);
            console.log("Unbanned user: " + userID);

        }
    }
}
