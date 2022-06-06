const {isOwnerOfChannel} = require('../utils/permsManager.js')

module.exports = {
    name: 'hide',
    description: 'Hides the current channel',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, `Manage Channel` permission is required to hide/unhide a channel.")

        message.channel.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: false
        })

        message.channel.send(`**${message.channel.name}** is now hidden.`)
    }
}