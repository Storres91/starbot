const { transformToId } = require('../utils/targets.js');
const channelDataModel = require('../models/channelDataSchema.js');


module.exports = {
    name: 'removeowner',
    description: 'Removes a owner from database, channel, and changes perms/roles',
    aliases: [''],
    async execute(client, message, args, Discord, server, permsManager) {
        if(!permsManager.hasAnyOfRoles(message.member, [server.ROLES.STAFF])) return message.channel.send("You are not allowed to use this command.");
        if (!args[0]) return message.channel.send('You have to include the user to remove.')

        let removeRegister = false;
        const userId = transformToId(args[0])
        const user = await message.guild.members.fetch(userId);
        if (!user) return message.channel.send(`\`${args[0]}\` is not a valid user.`)
        if (!permsManager.hasAnyOfRoles(user, [server.ROLES.CHANNEL_OWNER])) return message.channel.send(`**${user.user.tag}** does not have channel owner role.`)

        //Check if user is already in db
        let channelData;
        try {
            channelData = await channelDataModel.findOne({ owners: user.id });
        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }
        if(!channelData) return message.channel.send('I did not find this user in the database.')
        if(channelData.owners.length == 1) removeRegister = true;


        
        user.roles.remove(server.ROLES.CHANNEL_OWNER);
        let channel;
        try {
            channel = await message.guild.channels.fetch(channelData.channelID);
            channel.permissionOverwrites.delete(user.id);
        } catch (error) {
            console.log('Tried to remove register but channel does not longer exist.')
            channel = false
        }
        
        if (removeRegister) channelData.delete();
        else {channelData.owners.splice(channelData.owners.indexOf(user.id), 1); channelData.save();}
        

        message.channel.send(`Successfully removed owner from **${user.user.tag}** and updated perms in channel.\n<a:bg_starrollwhite:929572216578924615> Don't forget to remove pinned message in ${channel?`<#${channel.id}>`:'**<:cr_ztshrug:854747210205364234> channel was deleted.**'}`)

        





    }
}