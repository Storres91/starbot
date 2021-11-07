const { MessageActionRow, MessageButton } = require('discord.js');
const confessionModel = require('../models/confessionSchema.js')

module.exports = {
    name: 'confess',
    description: 'make an annonymously confession',
    async execute(client, message, args, Discord) {
        
            var confessionMsgID = 0;
            const confessionStaffChannelID = '851078982945210409';
            const confessionTxt = args.join(" ");
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);

            //Post button
            const confessionRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("confessionPost")
                    .setLabel("Post")
                    .setStyle("SUCCESS")
            );

            //Embeded message creation
            const confessEmbed = new Discord.MessageEmbed()
                .setColor('#' + randomColor)
                .setDescription("Confession: " + confessionTxt)
                .setTitle(message.author.tag)
                .setThumbnail(message.author.avatarURL({ dynamic: true }));

            //Send confession
            if (confessionTxt !== "") {
                await client.channels.cache.get(confessionStaffChannelID).send({ embeds: [confessEmbed], components: [confessionRow] }).then(sent => {
                    confessionMsgID = sent.id;
                });
                setTimeout(function () {
                    message.delete();
                }, 500);

            } else {
                message.channel.send("You can't send an empty confession");
            }

            let confessionMod = await confessionModel.create({
                confessionID: confessionMsgID,
                confessionMsg: confessionTxt

            });
            confessionMod.save();

        }


    }
