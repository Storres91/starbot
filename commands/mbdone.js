module.exports = {
    name: 'mbdone',
    description: 'Removes Mb winner role from winners',
    async execute(client, message, args, Discord) {
        const mbwinnerID = '885168106383745034';
        const mbhostID = '857285753213812766';
        const staffRoleID = '857060867676831805';
        var removedcounter=0;
        if (message.member.roles.cache.some(role => role.id == mbhostID) || message.member.roles.cache.some(role => role.id == staffRoleID)) {
            const Role = message.guild.roles.cache.get(mbwinnerID);
            try {
                Role.members.forEach((member, i) => { // Looping through the members of Role.
                    setTimeout(() => {
                        member.roles.remove(Role); // Removing the Role.
                        
                    }, i);
                    
                });
                removedcounter+=1;
                await message.channel.send('Removing MB Winner role from ' + String(removedcounter) + ' users')
                
            } catch (err) {
                message.channel.send('There was an error removing the Mb winner role, please try again')
            }
        } else return;
    }
}