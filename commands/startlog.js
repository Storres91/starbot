module.exports = {
    name: 'startlog',
    description: 'Sends a new log message in the current channel',
    aliases: ['newlog', 'createlog'],
    execute(client, message, args, Discord) {
        const STAFFROLE = '857060867676831805';

        const logEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTitle('Interactive Log')
            .setTimestamp();

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == STAFFROLE)) message.channel.send({embeds:[logEmbed]}).then((msg) => msg.pin());
        else return message.channel.send("You can't use this. ");

    }
}