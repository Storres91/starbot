const {isOwnerOfChannel, hasAnyOfRoles} = require('../utils/permsManager.js')
const {transformToId} = require('../utils/targets.js')

module.exports = {
    name: 'banish',
    description: 'Adds a person to the current channel',
    aliases: ['ban', 'kick'],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, `Manage Channel` permission is required to hide/unhide a channel.")
        const targetId = transformToId(args[0]);
        let target;

        try{
            target = await message.guild.members.fetch(targetId);

            if(hasAnyOfRoles(target, [server.ROLES.STAFF])) return message.channel.send("Do not try to misuse this command.")
            if(isOwnerOfChannel({channel:message.channel, member:target})) return message.channel.send("You can't change the perms of a co-owner.")
            if(target.id == message.author.id) return message.channel.send("You can't banish yourself.")

            message.channel.permissionOverwrites.edit(target.id, {
                VIEW_CHANNEL: false
            })
        } catch (error) {
            return message.channel.send(`${args[0]} is not a valid person.`)
        }

        message.channel.send(`__**${target.user.tag}** has been banished from **${message.channel.name}**.__`)
    }
}