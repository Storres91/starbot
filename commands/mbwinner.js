module.exports = {
    name: 'mbwinner',
    description: 'Adds mb winner role to the mentioned user',
    execute(client, message){
        const mbwinnerID='885168106383745034';
        const mbhostID = '857285753213812766';
        const staffRoleID = '857060867676831805';

        if (message.member.roles.cache.some(role => role.id == mbhostID) || message.member.roles.cache.some(role => role.id == staffRoleID)){
        let mbwinnerRole = message.guild.roles.cache.get(mbwinnerID);
        let winner = message.mentions.members.first();
        if(!winner) return message.channel.send("You have to mention the person you want to assign the role to!")
        winner.roles.add(mbwinnerRole);
        message.channel.send("Successfully added MB Winner role")
    }else return message.channel.send("You don't have permission to run that command")
}
}