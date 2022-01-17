module.exports = {
    name: 'removeicon',
    description: 'Removes the icon from the specified role id',
    aliases: ['deleteicon', 'icondelete'],
    async execute(client, message, args, Discord) {
        const staffRoleId = '857060867676831805';
        let roleId = args[0], userRole;

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleId)) { }
        else return message.channel.send("You can't use this ");

        userRole = await message.guild.roles.fetch(roleId).catch(()=>false);
        if(userRole) userRole.setIcon('');
        else return message.channel.send("Sorry, I was not able to find a role with that id.")


    }
}