module.exports = {
    name: 'roleicon',
    description: 'Changes the icon of the role from booster user',
    aliases: ['icon', 'changeicon', 'iconchange'],
    async execute(client, message, args, Discord) {
        var userRole, userRoleId, iconUrl, emojiId, commandDone, aborted = false;

        if (message.attachments.size != 0) {
            iconUrl = message.attachments.first().url;

        } else if (message.content.match(/<a:.+:\d+>/) != null) {
            emojiId = ((message.content.match(/<a:.+:\d+>/)) + "").match(/\d+/) + "";
            iconUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;

        } else if(message.content.match(/<:.+:\d+>/) != null) {
            emojiId = ((message.content.match(/<:.+:\d+>/)) + "").match(/\d+/) + "";
            iconUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
        } else {
            iconUrl = args[0];
        }

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

        collector.on('end', async collected => {
            if (aborted) return
            userRole = await message.guild.roles.fetch(userRoleId);
            userRole.setIcon(iconUrl).catch(
                err => {
                console.log(`Couldn't change the role icon, error: ${err}`);
                message.channel.send("Sorry, I was not able to change ur icon (maybe the image is too big? 256kb max), or ask staff for help.");
                aborted = true
            });
            if(!aborted) message.channel.send("Successfully changed your role icon!")
        })
        


    }
}