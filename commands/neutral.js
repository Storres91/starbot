const {isOwnerOfChannel, hasAnyOfRoles} = require('../utils/permsManager.js')
const {transformToId} = require('../utils/targets.js')

module.exports = {
    name: 'neutral',
    description: 'Adds a person to the current channel',
    aliases: ['reset', 'unban', 'unbanish'],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, `Manage Channel` permission is required to hide/unhide a channel.")
        if(!args[0]) return message.channel.send(`You have to mention or put the id of the person you are trying to ${this.name}. \`sb ${this.name} <@user/id>\``)
        const targetId = transformToId(args[0]);
        let target;

        try{
            target = await message.guild.members.fetch(targetId);

            if(isOwnerOfChannel({channel:message.channel, member:target})) return message.channel.send("You can't change the perms of a co-owner.")
            if(target.id == message.author.id) return message.channel.send("You can't reset yourself.")

            message.channel.permissionOverwrites.edit(target.id, {
                VIEW_CHANNEL: null
            })
        } catch (error) {
            return message.channel.send(`${args[0]} is not a valid person.`)
        }
        
        const embed = new Discord.MessageEmbed()
        .setColor('#b5359d')
        .setDescription(`<:cr_neutral:983543552401342474> **${target.user.tag}** perms have been reset in <#${message.channel.id}>`);
        
        message.channel.send({embeds: embed})
    }
}