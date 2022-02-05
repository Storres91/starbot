module.exports = {
    name: 'removeicon',
    description: 'Removes the icon from the specified role id',
    aliases: ['deleteicon', 'icondelete'],
    async execute(client, message, args, Discord) {
        const staffRoleId = '857060867676831805';
        var userRole, userRoleId, aborted, commandDone;

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleId)) {
            if(!args[0]) return message.channel.send("You have to specify the role Id, `sb removeicon <roleID>`.")
            let roleId = args[0];
            userRole = await message.guild.roles.fetch(roleId).catch(() => false);
            if (userRole) {
                userRole.setIcon(null);
                message.channel.send("Successfully removed this role's icon.")
            }
            else return message.channel.send("Sorry, I was not able to find a role with that id.")

        }
        else{
            message.channel.send("Please write `bb role` so I can verify your role, or \"Abort\" to cancel.\n_(Inappropiate icons will have consequences)_");

            const filter = (m) => m.author.id === message.author.id || m.author.id == '797339074146205706';
            const collector = new Discord.MessageCollector(message.channel, { filter, time: 30000 });
    
            collector.on('collect',  m => {
                if (m.author.id === message.author.id && (m.content.toLowerCase().startsWith("bb role") && !m.mentions.users.first())) {
                    commandDone = true
    
                } else if (m.author.id == message.author.id && m.content.toLowerCase() != "abort") {
                    message.channel.send("Invalid input, aborting...")
                    aborted = true;
                    collector.stop()
                }
    
                if (m.content.toLowerCase() == "abort") {
                    message.channel.send("Aborting...")
                    aborted = true;
                    collector.stop()
                }
    
                if (m.author.id == "797339074146205706" && commandDone == true) {
                    try{
                        userRoleId = (m.embeds[0].footer.text).match(/\d+/)+"";
                    }catch(err){
                        message.channel.send("Invalid request, aborting...")
                        aborted = true;
                        collector.stop()
                    }
                    collector.stop()
                }
            });
    
            collector.on('end', async () => {
                if (aborted) return
                userRole = await message.guild.roles.fetch(userRoleId);
                aborted = await userRole.setIcon(null).then(()=>false).catch(
                    err => {
                    console.log(`Couldn't change the role icon, error: ${err}`);
                    message.channel.send("Sorry, I was not able to remove your icon, ask staff for help.");
                    return true;
                });
                if(!aborted) {
                    message.channel.send("Successfully removed your role icon!")
                }
            })
            
    
        }
    }
}