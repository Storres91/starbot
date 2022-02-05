module.exports = {
    name: 'archive',
    description: 'Archives a channel and replaces channel owner role with archived channel role',
    aliases: ['archives', 'bury', 'channelarchive', 'archivechannel'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        const channelOwnerRoleID = '872345853841514536';
        const archivedChannelRoleID = '925188313986506773';
        const channelOwnersList = args.slice(0, -1);
        const nitroCategoriesId = ['855889626573045810', '866359829966487563', '923082998545514496']

        var archiveCategory, rSent, targetChannel, archivalReason, mSent, cancelledArchival = false, fetchedOwnerList = [], taggedOwnersMsg="", invalidOwner = false;

        const archivedEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTimestamp();

        const archivedLogEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTimestamp();

        const reasonsRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("reasonInactivity")
                .setLabel("Inactivity")
                .setStyle("SECONDARY"),

            new Discord.MessageButton()
                .setCustomId("reasonRequest")
                .setLabel("Owner's request")
                .setStyle("SECONDARY"),

            new Discord.MessageButton()
                .setCustomId("reasonOther")
                .setLabel("Other")
                .setStyle("SECONDARY"),

            new Discord.MessageButton()
                .setCustomId("reasonCancel")
                .setLabel("Cancel archive")
                .setStyle("DANGER")
        );

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)) {}
        else return message.channel.send("You can't use this ");

        //if (!args[1]) return message.channel.send("Missing arguments, correct usage `sb archive <ChannelOwner> <Channel>`")
        message.react("<a:bg_catyes:927728342331949056>")

        //Get channelOwner users
        for (let owner of channelOwnersList) {
            let fetchedOwner;
            owner = (owner.match(/\d+/) || owner).toString();

            let user = await message.guild.members.fetch(owner).catch(() => false);
            if (user) {
                fetchedOwner = await message.guild.members.cache.get(owner);
                if (fetchedOwner == undefined) { message.channel.send(""); invalidOwner = true }
                if (!fetchedOwner.roles.cache.some(role => role.id == channelOwnerRoleID || role.id == archivedChannelRoleID)) { message.channel.send("<:starpurple:905582557989584926> <@" + fetchedOwner.id + "> (" + fetchedOwner.id + ") doesn't have the channel owner or archived channel role."); invalidOwner = true }
                fetchedOwnerList.push(fetchedOwner);
                taggedOwnersMsg += "<@" + fetchedOwner.id + "> ";
            }else{
                message.channel.send(`<:starpurple:905582557989584926> User with id **__${owner}__** was not found in the server. \nIf they left, try using \`sb userleft\` command instead.`);
                invalidOwner = true;
            }
        }
        if (invalidOwner) return

        //Get channel to be moved to archives
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args.slice(-1)).catch(() => false)
        }
        if (!targetChannel) return message.channel.send(args.slice(-1) + " is not a valid channel id.");

        //Check if channel is in nitro category
        if(nitroCategoriesId.indexOf(targetChannel.parentId) != -1){
            archiveCategory = '915994152825667684';
        }else {
            archiveCategory = '864544196575887380';
        }

        archiveCategory = message.guild.channels.cache.get(archiveCategory);
        if (archiveCategory.children.size == 50) return message.channel.send("Sorry, this archived channels category is full. Can't move the channel.")

        //Get reason for archiving
        message.channel.send({ content: `You are archiving channel <#${targetChannel.id}>, please select the reason for this.\n**Selected Owner(s)** → ${taggedOwnersMsg}`, components: [reasonsRow] }).then(sent => mSent = sent);
        const archivedReasonCollector = new Discord.InteractionCollector(client, {
            channel: message.channel,
            message: mSent
        });
        const filter = (m) => m.author.id === message.author.id;
        const otherCollector = new Discord.MessageCollector(message.channel, { filter, max: 1, time: 1000 * 120 })
        archivedReasonCollector.on('collect', async (i) => {
            i.deferUpdate();
            switch (i.customId) {
                case "reasonInactivity":
                    archivalReason = "Inactivity"
                    archivedReasonCollector.stop();
                    break;

                case "reasonRequest":
                    archivalReason = "Owner's request"
                    archivedReasonCollector.stop();
                    break;

                case "reasonOther":
                    message.channel.send("Please specify the reason: ").then(sent => rSent = sent);
                    
                    await otherCollector.on('collect', (m) => {
                        archivalReason = m.content;
                    });
                    otherCollector.on('end', collected => {
                        if (collected.size <= 0) {
                            cancelledArchival = true;
                        }
                        rSent.delete();
                        archivedReasonCollector.stop();
                    });
                    break;




                case "reasonCancel":
                    cancelledArchival = true
                    archivedReasonCollector.stop();
                    break;
            }
        })

        archivedReasonCollector.on('end', () => {
            mSent.delete();
            if (cancelledArchival) return message.channel.send("Successfully cancelled.");

            //Move to last position
            message.guild.channels.setPositions([{ channel: targetChannel.id, position: 499 }]);

            //Move channel to archives
            targetChannel.setParent(archiveCategory);
            
            //For each user change roles
            fetchedOwnerList.forEach(owner => {
                let i = 1;
                let channelOwner = owner, removedRole=true;
                channelOwner.roles.add(archivedChannelRoleID).catch(() => {message.channel.send(":warning: I was not able to add the archived channel role"); return removedRole = false;});
                if (removedRole){
                    setTimeout(() => { 
                        channelOwner.roles.remove(channelOwnerRoleID).catch(() => { message.channel.send(":warning: I was not able to remove the channel owner role")})
                    },i* 500);
                }
                i++
            });
           
            


            message.channel.send({ embeds: [archivedLogEmbed.setTitle("__:lock: Successfully archived channel :lock:__").setDescription("**Reason →** " + archivalReason + "\n**Owner(s) →** "+taggedOwnersMsg+"\n**Channel →** <#" + targetChannel.id + ">\n**Responsible →** <@" + message.author.id + "> \n")] });
            client.channels.fetch("855243657396224010").then(channel => channel.send({ embeds: [archivedLogEmbed] })).catch(() => null);
            targetChannel.send({ embeds: [archivedEmbed.setAuthor("Archived channel ", client.user.displayAvatarURL()).setDescription("**Reason →** " + archivalReason + "\n**Owner(s) →** "+taggedOwnersMsg+"\n**Responsible →** <@" + message.author.id + "> \n").setFooter("IDs: "+channelOwnersList)] });

        });


    }
}