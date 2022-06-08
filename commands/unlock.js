const {hasAnyOfRoles} = require('../utils/permsManager.js')
const {transformToId} = require('../utils/targets.js')

module.exports = {
    name: 'unlock',
    description: 'Unlocks the current or a specified channel',
    aliases: [],
    async execute(client, message, args, Discord, server) {
        if(!hasAnyOfRoles(message.member, [server.ROLES.STAFF])) return message.channel.send("You are not allowed to do this.")
        
        let channel;
        try {
            if(args[0]) channel = await message.guild.channels.fetch(transformToId(args[0]));
            else channel = message.channel;
        } catch (error) {
            return message.channel.send(args[0]+' is not a valid channel.')
        }

        channel.permissionOverwrites.edit(message.channel.guild.id, {
            SEND_MESSAGES: null
        })

        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription("<:cr_unlock:983546252413243413> **Channel unlocked.**");

        message.channel.send({embeds: [embed]})
    }
}