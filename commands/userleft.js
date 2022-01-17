module.exports = {
    name: 'userleft',
    description: 'Archives the channel from a person that left',
    aliases: ['abandoned', 'abandon'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        const channelOwnerRoleID = '872345853841514536';
        const archivedChannelRoleID = '925188313986506773';

        var archiveCategory, channelOwner, targetChannel, mArchSent, archivalReason, mSent, cancelledArchival = false;

        const archivedEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTimestamp();

        const archivedLogEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTimestamp();

        const reasonsRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("reasonLeft")
                .setLabel("User Left")
                .setStyle("SECONDARY"),

            new Discord.MessageButton()
                .setCustomId("reasonBanned")
                .setLabel("User Banned")
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

        const archivesCatRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("normalCat")
                .setLabel("Normal")
                .setStyle("SECONDARY"),

            new Discord.MessageButton()
                .setCustomId("boosterCat")
                .setLabel("Booster")
                .setStyle("PRIMARY"),

                new Discord.MessageButton()
                .setCustomId("cancelCat")
                .setLabel("Cancel archive")
                .setStyle("DANGER")
        );

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)) { }
        else return message.channel.send("You can't use this ");
        if (!args[1]) return message.channel.send("Missing arguments, correct usage `sb userleft <ChannelOwner> <Channel>`")

        //Get channelOwner user
        if (message.mentions.users.first()) {
            channelOwner = message.mentions.users.first();
        }
        else {
            channelOwner = await message.guild.members.fetch(args[0]).catch(() => false);
        }
        if (channelOwner) return message.channel.send("This user is in the server, wrong command. Use `sb archive` instead");
        channelOwner = args[0];

        //Get channel to be moved to archives
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args[1]).catch(() => false)
        }
        if (!targetChannel) return message.channel.send(args[1] + " is not a valid channel id.");

        message.channel.send({ content: `You are archiving ${channelOwner}'s channel <#${targetChannel.id}>, please select the category it should be moved to.`, components: [archivesCatRow] }).then(sent => mArchSent = sent);
        const categoryCollector = new Discord.InteractionCollector(client, {
            channel: message.channel,
            message: mArchSent
        });
        categoryCollector.on('collect', async (i) => {
            i.deferUpdate();
            switch (i.customId) {
                case "normalCat":
                    archiveCategory = '864544196575887380';
                    categoryCollector.stop();
                    break;

                case "boosterCat":
                    archiveCategory = '915994152825667684';
                    categoryCollector.stop();
                    break;

                case "cancelCat":
                    archiveCategory = '0';
                    categoryCollector.stop();
                    break;
            }
        });
        categoryCollector.on('end', () => {
            mArchSent.delete();
            if(archiveCategory=='0') return message.channel.send("Successfully cancelled.")
            archiveCategory = message.guild.channels.cache.get(archiveCategory);

            //Get reason for archiving
            message.channel.send({ content: `Select the reason for this`, components: [reasonsRow] }).then(sent => mSent = sent);
            const archivedReasonCollector = new Discord.InteractionCollector(client, {
                channel: message.channel,
                message: mSent
            });
            archivedReasonCollector.on('collect', async (i) => {
                i.deferUpdate();
                switch (i.customId) {
                    case "reasonLeft":
                        archivalReason = "User Left"
                        archivedReasonCollector.stop();
                        break;

                    case "reasonBanned":
                        archivalReason = "User Banned"
                        archivedReasonCollector.stop();
                        break;

                    case "reasonOther":
                        message.channel.send("Please specify the reason: ").then(sent => rSent = sent);
                        const filter = (m) => m.author.id === message.author.id;
                        const otherCollector = new Discord.MessageCollector(message.channel, { filter, max: 1, time: 1000 * 120 })
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

                message.channel.send({ embeds: [archivedLogEmbed.setTitle("__:lock: Successfully archived channel :lock:__").setDescription("**Reason →** " + archivalReason + "\n**Owner →** " + channelOwner + "\n**Channel →** <#" + targetChannel.id + ">\n**Responsible →** <@" + message.author.id + "> \n")] });
                client.channels.fetch("855243657396224010").then(channel => channel.send({ embeds: [archivedLogEmbed] })).catch(() => null);
                targetChannel.send({ embeds: [archivedEmbed.setAuthor(channelOwner + "'s archived channel ", client.user.displayAvatarURL()).setDescription("**Reason →** " + archivalReason + "\n**Owner →** " + channelOwner + "\n**Responsible →** <@" + message.author.id + "> \n").setFooter("ID: " + channelOwner)] });

            });

        });
    }
}
