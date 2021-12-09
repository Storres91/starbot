const { channel } = require("diagnostics_channel");

module.exports = {
    name: 'channelcount',
    description: 'Counts the channels in each category',
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)){
            const guild = message.guild;
            var mensaje="";

            await message.channel.send("**Processing **")

            const allChannels = await guild.channels.fetch();
            const categoryChannels = allChannels.filter(channel => 
                channel.name == "╭━━━Nitro Realms━━━╮"
                || channel.name == "╭━━━━No Life━━━━╮"
                || channel.name == "╭━━Private Planets━━╮"
                || channel.name == "╭━━Private Moons━━╮"
            );
            
            
            categoryChannels.forEach(channel => {
                mensaje+=`\n\n${channel.name}\n ${channel.children.size}/50 channels.`;
            });
            message.channel.send("**Celestial realm's channel count:**");
            message.channel.send(mensaje);
        }
    }
}