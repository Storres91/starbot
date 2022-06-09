const {isOwnerOfChannel} = require('../utils/permsManager.js')

module.exports = {
    name: 'unhide',
    description: 'Unhide the current channel',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, you are not the owner of this channel.")

        message.channel.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: null
        })

        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription("<:cr_sun:984232735071666196> **Channel is now visible.**");

        message.channel.send({embeds: [embed]})
    }
}