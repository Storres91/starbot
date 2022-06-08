const {isOwnerOfChannel} = require('../utils/permsManager.js')

module.exports = {
    name: 'unpin',
    description: 'Unpins a message',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, `Manage Channel` permission is required to hide/unhide a channel.")
        if(!message.reference) return message.channel.send('You didn\'t reply to any message');

        let reference = await message.channel.messages.fetch(message.reference.messageId);
        reference.unpin();

        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription("<:cr_trash:984236910660702208> **Removed this pin**");

        reference.reply({embeds: [embed]})
    }
}