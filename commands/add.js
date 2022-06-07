const {isOwnerOfChannel} = require('../utils/permsManager.js')
const {transformToId} = require('../utils/targets.js')

module.exports = {
    name: 'add',
    description: 'Adds a person to the current channel',
    aliases: ['invite'],
    async execute(client, message, args, Discord, server) {

        
        
        if(!isOwnerOfChannel({channel:message.channel, member:message.member})) return message.channel.send("You can't use this here, `Manage Channel` permission is required to hide/unhide a channel.")
        if(!args[0]) return message.channel.send(`You have to mention or put the id of the person you are trying to ${this.name}. \`sb ${this.name} <@user/id>\``)
        const targetId = transformToId(args[0]);
        let target;
        
        try{
            target = await message.guild.members.fetch(targetId);

            if(isOwnerOfChannel({channel:message.channel, member:target})) return message.channel.send("They are already added here.")
            if(target.id == message.author.id) return message.channel.send("You are already added here.")
            
            message.channel.permissionOverwrites.edit(target.id, {
                VIEW_CHANNEL: true
            })
        } catch (error) {
            return message.channel.send(`${args[0]} is not a valid person.`)
        }
        
        const embed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setDescription(`<:checkyes:983532639501844551> **${target.user.tag}** has been invited to <#${message.channel.id}>`);

        message.channel.send({embeds: [embed]})
    }
}