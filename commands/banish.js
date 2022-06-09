const {isOwnerOfChannel, hasAnyOfRoles} = require('../utils/permsManager.js')
const {transformToId} = require('../utils/targets.js')

module.exports = {
    name: 'banish',
    description: 'Adds a person to the current channel',
    aliases: ['ban', 'kick', 'yeet'],
    async execute(client, message, args, Discord, server) {
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, you are not the owner of this channel.")
        if(!args[0]) return message.channel.send(`You have to mention or put the id of the person you are trying to ${this.name}. \`sb ${this.name} <@user/id>\``)
        const targetId = transformToId(args[0]);
        let target;

        try{
            target = await message.guild.members.fetch(targetId);

            if(hasAnyOfRoles(target, [server.ROLES.STAFF])) return message.channel.send("Do not try to misuse this command.")
            if(isOwnerOfChannel({channel:message.channel, member:target}) && !target.user.bot) return message.channel.send("You can't change the perms of this person.")
            if(target.id == message.author.id) return message.channel.send("You can't banish yourself.")

            message.channel.permissionOverwrites.edit(target.id, {
                VIEW_CHANNEL: false
            })
        } catch (error) {
            return message.channel.send(`${args[0]} is not a valid person.`)
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription(`<:checkno:983532674377449502> **${target.user.tag}** has been banished from <#${message.channel.id}>`);
            
        message.channel.send({embeds: [embed]})
    }
}