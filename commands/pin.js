const {isOwnerOfChannel} = require('../utils/permsManager.js')

module.exports = {
    name: 'pin',
    description: 'Pins a message',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, you are not the owner of this channel.")
        if(!message.reference) return message.channel.send('You didn\'t reply to any message');

        let reference = await message.channel.messages.fetch(message.reference.messageId);
        
        try {
            reference.pin();
        } catch (error) {
            return message.channel.send('Error pinning the message, is there enough space?')
        }


        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription("<:cr_pin:984236848522076193> **Pinned this message**");

        reference.reply({embeds: [embed]})

    }
}