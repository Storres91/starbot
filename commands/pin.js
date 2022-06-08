const {isOwnerOfChannel} = require('../utils/permsManager.js')

module.exports = {
    name: 'hide',
    description: 'Hides the current channel',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, `Manage Channel` permission is required to hide/unhide a channel.")
        if(!message.reference) return message.channel.send('You didn\'t reply to any message');

        await message.reference.pin();
    }
}