const {isOwnerOfChannel} = require('../utils/permsManager.js')

module.exports = {
    name: 'hide',
    description: 'Hides the current channel',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, you are not the owner of this channel.")

        message.channel.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: false
        })

        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription("<:cr_moon:984231415040340068> **Channel is now hidden.**");

        message.channel.send({embeds: [embed]})
    }
}