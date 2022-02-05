module.exports = {
    name: 'channelmove',
    description: 'Moves a channel',
    aliases: ['chmove', 'movechannel', 'warp', 'teleport', 'translocate', 'upgrade', 'downgrade', 'tp', 'move'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';

        var targetChannel, nochannel, mSent, cancelledMove = false, moveCategoryID, preHideRoleID, updHideRoleID,
            invalidCategory = false, archivedChannel = false;

        const movedChannelEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTimestamp();

        const categoryMenu = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Choose a category')
                .addOptions([
                    {
                        emoji: '🛰️',
                        value: '1',
                        label: 'Space HQ'
                    },
                    {
                        emoji: '✨',
                        value: '2',
                        label: 'Nitro Realms 1'
                    },
                    {
                        emoji: '💥',
                        value: '3',
                        label: 'Nitro Realms 2'
                    },
                    {
                        emoji: '💎',
                        value: '4',
                        label: 'Nitro Realms 3'
                    },
                    {
                        emoji: '👽',
                        value: '5',
                        label: 'No Life'
                    },
                    {
                        emoji: '🪐',
                        value: '6',
                        label: 'Private Planets'
                    },
                    {
                        emoji: '🌕',
                        value: '7',
                        label: 'Private Moons'
                    },
                    {
                        emoji: '🌟',
                        value: '8',
                        label: 'Private Stars'
                    },
                    {
                        emoji: '❌',
                        value: '9',
                        label: 'Cancel'
                    },
                ]),
        );

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)) { }
        else return message.channel.send("You can't use this ");

        if (!args[0]) return message.channel.send("You didn't specify a channel.");
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args[0]).catch(() => {
                message.channel.send(args[0] + " is not a valid channel id.");
                return nochannel = true
            })
        }
        if (nochannel) return

        //Get category and role id from the one it is in
        switch (targetChannel.parentId) {
            case '866852465231659018':
                preHideRoleID = '882352343339900988';
                break;

            case '855889626573045810':
                preHideRoleID = '882055814121156628';
                break;

            case '866359829966487563':
                preHideRoleID = '882081534100783174';
                break;

            case '923082998545514496':
                preHideRoleID = '923084089714671636';
                break;

            case '859489667283550248':
                preHideRoleID = '882081683589955674';
                break;

            case '851683880409759744':
                preHideRoleID = '882083138363338782';
                break;

            case '887619539473424404':
                preHideRoleID = '887433583168483350';
                break;

            case '923086668163059722':
                preHideRoleID = '923085477517602866';
                break;

            case '864544196575887380':
                archivedChannel = true;
                break;

            case '915994152825667684':
                archivedChannel = true;
                break;

            default:
                invalidCategory = true;
                break;
        }
        var targetChannelParent = await message.guild.channels.fetch(targetChannel.parentId);
        if (invalidCategory) return message.channel.send("This channel is not in a valid category.")
        //Get category and role id from the one to be moved
        message.channel.send({ content: "Moving <#" + targetChannel.id + ">, select where it's gonna be moved to.", components: [categoryMenu] }).then(sent => mSent = sent);
        const categoryMoveCollector = new Discord.InteractionCollector(client, {
            channel: message.channel,
            message: mSent,
            max: 1
        });
        categoryMoveCollector.on('collect', (i) => {
            i.deferUpdate();
            switch (i.values[0]) {
                case "1":
                    updHideRoleID = '882352343339900988';
                    moveCategoryID = '866852465231659018';
                    break;

                case "2":
                    updHideRoleID = '882055814121156628';
                    moveCategoryID = '855889626573045810';
                    break;

                case "3":
                    updHideRoleID = '882081534100783174';
                    moveCategoryID = '866359829966487563';
                    break;

                case "4":
                    updHideRoleID = '923084089714671636';
                    moveCategoryID = '923082998545514496';
                    break;

                case "5":
                    updHideRoleID = '882081683589955674';
                    moveCategoryID = '859489667283550248';
                    break;

                case "6":
                    updHideRoleID = '882083138363338782';
                    moveCategoryID = '851683880409759744';
                    break;

                case "7":
                    updHideRoleID = '887433583168483350';
                    moveCategoryID = '887619539473424404';
                    break;

                case "8":
                    updHideRoleID = '923085477517602866';
                    moveCategoryID = '923086668163059722';
                    break;

                case "9":
                    cancelledMove = true;
                    break;
            }
        });
        categoryMoveCollector.on('end', async () => {

            moveCategoryChannel = await message.guild.channels.fetch(moveCategoryID);
            mSent.delete();
            
            if (cancelledMove) return message.channel.send("Successfully cancelled.")
            if (moveCategoryChannel.children.size == 50) return message.channel.send("Sorry, I was not able to move the channel to "+moveCategoryChannel.name+" (Category full). \nCheck `sb channelcount` to know where we have any space.")
            
            //Move to last position
            message.guild.channels.setPositions([{channel: targetChannel.id, position:499}]);
            
            //Move channel to new category
                if (archivedChannel) {
                    targetChannel.setParent(moveCategoryID, { lockPermissions: true });
                    movedChannelEmbed.setTitle("__🌀 Channel travelled in space 🌀__").setDescription("**From →** " + targetChannelParent.name + "\n**To →** " + moveCategoryChannel.name + "\n**Channel →** <#" + targetChannel.id + ">\n**Responsible →** <@" + message.author.id + "> \n\n <a:starpurplehover:905575054161641483> Please re add the owner in the channel since this channel was archived");
                }
                else {
                    targetChannel.setParent(moveCategoryID, { lockPermissions: false });
                    movedChannelEmbed.setTitle("__🌀 Channel travelled in space 🌀__").setDescription("**From →** " + targetChannelParent.name + "\n**To →** " + moveCategoryChannel.name + "\n**Channel →** <#" + targetChannel.id + ">\n**Responsible →** <@" + message.author.id + ">");
                }
            
            //Remove old permission overwrite and add new one
            if (preHideRoleID && !archivedChannel) {
                setTimeout(() => {
                    targetChannel.permissionOverwrites.delete(preHideRoleID);
                }, 1000);
            }
            setTimeout(() => {
                targetChannel.permissionOverwrites.edit(updHideRoleID, {
                    VIEW_CHANNEL: false
                });
            }, 2000);

            //Send confirmation embed
            message.channel.send({ embeds: [movedChannelEmbed] });
            client.channels.fetch("855243657396224010").then(channel => channel.send({ embeds: [movedChannelEmbed] }));


        })

    }
}