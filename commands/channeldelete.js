module.exports = {
    name: 'channeldelete',
    description: 'Deletes a channel',
    aliases: ['chdelete', 'chdel', 'deletechannel', 'chdisappear', 'delete', 'nuke', 'demolish'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        const channelOwnerRoleID = '872345853841514536';
        const archivedChannelRoleID = '925188313986506773';
        const channelOwnersList = args.slice(0, -1);

        var targetChannel, deleteReason, mSent, cancelledDelete = false, invalidOwner, taggedOwnersMsg = "", fetchedOwnerList = [];

        const deletedLogEmbed = new Discord.MessageEmbed()
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
                .setLabel("Cancel delete")
                .setStyle("DANGER")
        );

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)) { }
        else return message.channel.send("You can't use this ");

        //if (args.lenght == 1) return message.channel.send("Missing arguments, at least 1 owner is needed. \nCorrect usage `sb chdel <Owner1> <Owner2> <OwnerX...> <Channel>`");
        message.react("<a:bg_catyes:927728342331949056>")
        //Get channelOwner users
        for (let owner of channelOwnersList) {
            let fetchedOwner;
            owner = (owner.match(/\d+/) || owner).toString();

            let user = await message.guild.members.fetch(owner).catch(() => false);
            if (user) {
                fetchedOwner = await message.guild.members.cache.get(owner);
                if (fetchedOwner == undefined) { message.channel.send(""); invalidOwner = true };
                if (!fetchedOwner.roles.cache.some(role => role.id == channelOwnerRoleID || role.id == archivedChannelRoleID)) { message.channel.send("<:starpurple:905582557989584926> <@" + fetchedOwner.id + "> (" + fetchedOwner.id + ") doesn't have the channel owner or archived channel role."); invalidOwner = true };
                fetchedOwnerList.push(fetchedOwner);
                taggedOwnersMsg += "<@" + fetchedOwner.id + "> ";
            }else{
                message.channel.send(`<:starpurple:905582557989584926> User with id **__${owner}__** was not found in the server. \nIf they left, try using \`sb ~~delete-invalidOwner~~(placeholder)\` command instead.`);
                invalidOwner = true;
            }
        }
        if (invalidOwner) return


        //Get channel to be deleted
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args.slice(-1)).catch(() => false);
        }
        if (!targetChannel) return message.channel.send(args.slice(-1) + " is not a valid channel id.");

        //Get reason for deleting channel
        message.channel.send({ content: `You are deleting <#${targetChannel.id}>, please select the reason for this.\n**Selected Owner(s)** → ${taggedOwnersMsg}`, components: [reasonsRow] }).then(sent => mSent = sent);
        const deletedReasonCollector = new Discord.InteractionCollector(client, {
            channel: message.channel,
            message: mSent
        });
        deletedReasonCollector.on('collect', async (i) => {
            i.deferUpdate();
            switch (i.customId) {
                case "reasonInactivity":
                    deleteReason = "Inactivity"
                    deletedReasonCollector.stop();
                    break;

                case "reasonRequest":
                    deleteReason = "Owner's request"
                    deletedReasonCollector.stop();
                    break;

                case "reasonOther":
                    message.channel.send("Please specify the reason: ").then(sent => rSent = sent);
                    const filter = (m) => m.author.id === message.author.id;
                    const otherCollector = new Discord.MessageCollector(message.channel, { filter, max: 1, time: 1000 * 120 })
                    await otherCollector.on('collect', (m) => {
                        deleteReason = m.content;
                    });
                    otherCollector.on('end', collected => {
                        if (collected.size <= 0) {
                            cancelledDelete = true;
                        }
                        rSent.delete();
                        deletedReasonCollector.stop();
                    });
                    break;




                case "reasonCancel":
                    cancelledDelete = true
                    deletedReasonCollector.stop();
                    break;
            }
        })

        deletedReasonCollector.on('end', () => {
            mSent.delete();
            let responsible = message.author.id;
            if (cancelledDelete) return message.channel.send("Successfully cancelled.");

            //Delete channel
            targetChannel.delete();

            //Remove owner/archived role from User
            fetchedOwnerList.forEach(owner => {
                let i = 1;
                setTimeout(() => {
                    let actualOwner = owner;
                    if (actualOwner.roles.cache.some(role => role.id == channelOwnerRoleID)) {
                        actualOwner.roles.remove(channelOwnerRoleID).catch(() => { return message.channel.send(":warning: I was not able to remove the owner/archived role") });
                    }
                    else if (actualOwner.roles.cache.some(role => role.id == archivedChannelRoleID)) {
                        actualOwner.roles.remove(archivedChannelRoleID).catch(() => { return message.channel.send(":warning: I was not able to remove the owner/archived role for ") });
                    }
                }, i * 500);
                i += 1;
            });


            deletedLogEmbed.setTitle("__:x: Successfully deleted channel :x:__").setDescription("**Reason →** " + deleteReason + "\n**Owner(s) →** " + taggedOwnersMsg + "\n**Channel →** #" + targetChannel.name + "\n**Responsible →** <@" + responsible + "> \n");

            client.channels.fetch("855243657396224010").then(channel => channel.send({ embeds: [deletedLogEmbed] })).catch(() => null);
            message.channel.send({ embeds: [deletedLogEmbed] }).catch(() => null);

        })
    }
}