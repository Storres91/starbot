const {hasAnyOfRoles, isUser} = require('../utils/permsManager.js')
const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'claimchannel',
    description: 'Claim a channel',
    aliases: ['channelclaim'],
    async execute(client, message, args, Discord, server) {
        const { ROLES } = server;
        if(isUser(message.member, ['745918918073253919'])) return
        if(!hasAnyOfRoles(message.member, [ROLES.METEOR, ROLES.SOLAR_FLARE, ROLES.COMET, ROLES.ECLIPSE, ROLES.SUPERNOVA, ROLES.TWILIGHT, ROLES.ZENITH, ROLES.ROGUE, ROLES.BLOOD_MOON, ROLES.ASCENDED_STAR, ROLES.THE_VOID])) return message.channel.send("Sorry, you can't claim a channel yet, channels become available at amari level 20+.\nCheck yours by writing `+r` in a play channel.")

        if(hasAnyOfRoles(message.member, [ROLES.CHANNEL_OWNER])) return message.channel.send("You already have a channel. <:cr_ztshrug:854747210205364234>")
        if(hasAnyOfRoles(message.member, [ROLES.ARCHIVED_CHANNEL])) return message.channel.send("You already have a channel but is currently archived.")

        //Determine the category where the channel should be created
        let category;
        if (hasAnyOfRoles(message.member, [ROLES.SERVER_BOOSTER])) {
            category = await findCategoryWithSpot(['855889626573045810', '866359829966487563', '923082998545514496'])
        }
        else {
            category = await findCategoryWithSpot(['851683880409759744', '887619539473424404', '923086668163059722'])
        }
        if (!category) return message.channel.send("Sorry I couldn't find any space to fit your channel, please contact staff.")


        let user = message.member;
        let channelName= args[0]?args.join(' '):user.user.username;

        let channel = await category.createChannel(channelName,{
            permissionOverwrites: [{id: user.id, allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS']}]

        });
        user.roles.add(ROLES.CHANNEL_OWNER);

        let channelData;
        try {
            channelData = await channelDataModel.create({
                channelID: channel.id,
                owners: [user.id],
            });
            channelData.save();
        } catch (error) {
            console.log('Error creating channel register'+error)
        }

        message.channel.send(`You have successfully claimed your channel <#${channel.id}> in **${category.name}**, congrats! <:cr_uwucheems:868012934067019806>`)


        async function findCategoryWithSpot(categories=[]){
            for (let categoryID of categories){
                let category = await message.guild.channels.fetch(categoryID);
                if (category.children.size < 50) return category
            }
            return false
        }
    }
}