module.exports = {
    name: 'embedsay',
    description: 'creates a new embed in the channel',
    execute(client, message, args, Discord) {
        var staffRoleID = "857060867676831805";
        args = args.join(" ").split(',');
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)) {
            if (!args[1]) return message.channel.send("You must provide a valid title and description. \n Correct usage: `sb embedsay title, description`")
            message.delete().catch(() => null);

            var messageEmbed = new Discord.MessageEmbed()
                .setAuthor('Celestial Starbot', client.user.displayAvatarURL())
                .setColor('#b5359d')
                .setTitle(args[0])
                .setDescription(args[1])
                .setTimestamp();

            message.channel.send({ embeds: [messageEmbed] });
        }

    }
}