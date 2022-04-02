const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'removechannel',
    description: 'Removes a channel from the database',
    aliases: [''],
    async execute(client, message, args, Discord) {
        const STAFF_ROLE_ID = '857060867676831805';
        let targetChannel;

        if (!message.member.roles.cache.some(role => role.id == STAFF_ROLE_ID)) return
        if (args.length < 1) return message.channel.send("Incorrect syntax, you have to mention a #channel or write the id.")

        // Target channel
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args[0]).catch(() => false);
        }
        if (!targetChannel) return message.channel.send(args[0] + " is not a valid channel id.");

        //Check if channel is in db
        let channelDataPrev;
        try {
            channelDataPrev = await channelDataModel.findOne({ channelID: targetChannel.id });
        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }

        if (!channelDataPrev) return message.channel.send(`This channel was not found in the database, add it using \`sb addchannel\``)

        //Delete the register
        channelDataPrev.delete();
        message.channel.send(`<#${targetChannel.id}> has been successfully removed from the database.`);
    }
}