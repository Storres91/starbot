const {hasAnyOfRoles, isUser} = require('../utils/permsManager.js')
const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'claimchannel',
    description: 'Claim a channel',
    aliases: ['channelclaim', 'createch', 'cc', 'crch'],
    async execute(client, message, args, Discord, server) {
        const { ROLES } = server;
        let confirmation = false;
        if(isUser(message.member, ['745918918073253919'])) return
        if(!hasAnyOfRoles(message.member, [ROLES.METEOR, ROLES.SOLAR_FLARE, ROLES.COMET, ROLES.ECLIPSE, ROLES.SUPERNOVA, ROLES.TWILIGHT, ROLES.ZENITH, ROLES.ROGUE, ROLES.BLOOD_MOON, ROLES.ASCENDED_STAR, ROLES.THE_VOID])) return message.channel.send("Sorry, you can't claim a channel yet, channels become available at amari level 20+.\nCheck yours by writing `+r` in a play channel.")

        if(hasAnyOfRoles(message.member, [ROLES.CHANNEL_OWNER])) return message.channel.send("You already have a channel. <:cr_ztshrug:854747210205364234>")
        if(hasAnyOfRoles(message.member, [ROLES.ARCHIVED_CHANNEL])) return message.channel.send("You already have a channel but is currently archived.")

        if (args.join('').length > 99) return message.channel.send('🔴 Your channel name must contain less than 100 characters.')

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

        const filter = (m) => m.author.id === message.author.id;
        const collector = new Discord.MessageCollector(message.channel, {
            filter,
            time: 1000 * 240
        });

        message.channel.send(`Your channel "**${channelName}**" will be created in **${category.name}**\n\n<a:bg_starrollwhite:929572216578924615> Say **'yes' to confirm** or 'no' to abort.`);
        collector.on('collect', (m)=>{
            if (m.content.toLowerCase() == 'y' || m.content.toLowerCase() == 'yes'){
                confirmation = true;
                collector.stop();
            } else {
                collector.stop()
            }
        });

        collector.on('end', async ()=>{
            if(!confirmation) return message.channel.send('Successfully cancelled your channel creation.')

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
    
            message.channel.send(`You have successfully claimed your channel <#${channel.id}> in **${category.name}** congrats! <:cr_uwucheems:868012934067019806>`)
    
            const welcomeEmbed = new Discord.MessageEmbed({
                "footer":{
                    "text":"Please keep this message pinned :)",
                    "icon_url":"https://cdn.discordapp.com/attachments/857716865190068254/865437067923292200/image0.gif",
                    "proxy_icon_url":"https://media.discordapp.net/attachments/857716865190068254/865437067923292200/image0.gif"
                },
                "thumbnail":{
                    "url":message.author.avatarURL({ dynamic: true }),
                    "width":861,
                    "height":861
                },
                "color":9371903,
                "type":"rich",
                "description":"<a:sparkle:865266644048543784>__**Congrats on becoming a Channel Owner!**__<a:sparkle:865266644048543784>\n\n<a:cr_bluearrow:926896142262865950>**Step 1:** Use `?channelrules` to view our channel rules. \n\n<a:cr_bluearrow:926896142262865950>**Step 2:** Check `?channelhelp` for a list of super useful channel owner commands to customize who can view your channel!\n\n<a:cr_bluearrow:926896142262865950>**Step 3:** Enjoy!! <a:cr_peachspin:926897487296462868>",
                "title":"<a:rainbowplanet:865266644170965003> __**Welcome "+user.user.username+" **__ <a:rainbowplanet:865266644170965003>"
            });
    
            channel.send({embeds: [welcomeEmbed]}).then(msg=>msg.pin())

            client.channels.fetch('855243657396224010').then(ch=>ch.send(`**${message.member.user.tag}** just claimed a channel in **${category.name}** → <#${channel.id}>`))
        });
        

        async function findCategoryWithSpot(categories=[]){
            for (let categoryID of categories){
                let category = await message.guild.channels.fetch(categoryID);
                if (category.id == '923086668163059722' && category.children.size >= 40) continue
                if (category.children.size < 50) return category
            }
            return false
        }
    }
}