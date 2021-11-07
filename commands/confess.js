const { MessageActionRow, MessageButton } = require('discord.js');
const confessionModel = require('../models/confessionSchema.js')

module.exports = {
    name: 'confess',
    description: 'make an annonymously confession',
    aliases: ['confession'],
    async execute(client, message, args, Discord) {
        const confessionStaffChannelID = '907010075804196974';
        const confessionTxt = args.join(" ");

        //Post button
        const confessionRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("confessionPost")
                .setLabel("Post")
                .setStyle("SUCCESS"),

            new MessageButton()
                .setCustomId("confessionDeny")
                .setLabel("Deny")
                .setStyle("DANGER")
        );

        //Embeded message creation
        const confessEmbed = new Discord.MessageEmbed()
            .setColor('black')
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
            confessionUserID: String(message.author.id),
            confessionMsg: confessionTxt,
            confessionTag: message.author.tag,
            confessionAvatar: message.author.avatarURL(),

        });
        confessionMod.save();

    }


}