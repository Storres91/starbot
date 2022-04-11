module.exports = {
    name: 'time',
    description: 'Gets the time from one or multiple messages',
    aliases: ['gettimes', 'gettime', 'timediff', 'times'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        var messageChannel, msg;
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)){}
        else return

        if (args.length < 2) return message.channel.send("You have to include at least 1 id and the channel the messages are in.")

        const timesEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTitle("⏰ Requested times ⏰")
            .setFooter("Celestial Starbot")
            .setTimestamp();

        if (message.mentions.channels.first()){
            messageChannel = message.mentions.channels.first();
        } else {
            messageChannel = await message.guild.channels.fetch(args.slice(-1)).catch(()=>false);
        }
        if (!messageChannel) return message.channel.send("`"+args.slice(-1)+"` is not a valid channel id.")
        const messageIds = args.slice(0,-1)
        var timestamps = [], timestampsRaw= [], differences = [], msgTimestamps = []


        for(let messageId of messageIds){
            msg = await messageChannel.messages.fetch(messageId).catch(()=>false)
            if(!msg) return message.channel.send(`\`${messageId}\` is not a valid message id or is not in the specified channel.`)
            timestamps.push((msg.createdTimestamp).toString().slice(0, -3))
            timestampsRaw.push((msg.createdTimestamp))

        }

        for (let i=0; i<timestamps.length; i++){
            msgTimestamps.push(`<t:${timestamps[i]}:T>`)
            differences.push(`${i==0 ? "**N/A**":(timestamps[i]-timestamps[i-1]).toString()+'s'} ${i==0 ? "0":(timestampsRaw[i]-timestampsRaw[i-1]).toString().slice(-3)}ms`)
        }

        timesEmbed.addFields(
            {name:'Message IDs', value: messageIds.join('\n'), inline:true},
            {name:'Timestamps', value: msgTimestamps.join('\n'), inline: true},
            {name:'Difference', value: differences.join('\n'), inline: true}
        )
        message.channel.send({embeds:[timesEmbed]})


    }
}