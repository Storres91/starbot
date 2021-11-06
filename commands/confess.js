
module.exports = {
    name: 'confess',
    description: 'make an annonymously confession',
    execute(client, message, args, Discord) {
        if (message.member.user.id == '313351494361677845') {
            const confessionStaffChannelID = '906645281662201876';
            const confessionTxt = args.join(" ");
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);

            const confessEmbed = new Discord.MessageEmbed()
                .setColor('#' + randomColor)
                .setDescription("Confession: " + confessionTxt)
                .setTitle(message.author.tag)
                .setThumbnail(message.author.avatarURL({ dynamic: true }));

            if (confessionTxt !== "") {
                setTimeout(function () {
                    client.channels.cache.get(confessionStaffChannelID).send({ embeds: [confessEmbed] });
                    message.delete();

                }, 700);

            } else {
                message.channel.send("You can't send an empty confession");
            }
        }


    }
}