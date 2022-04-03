module.exports = {
    name: 'roleicon',
    description: 'Changes the icon of the role from booster user',
    aliases: ['icon', 'iconchange'],
    async execute(client, message, args, Discord) {
        var userRole, userRoleId, iconUrl, emojiId, commandDone, aborted = false;

        if(message.attachments.size == 0 && !args[0]) return message.channel.send("You have to either attach the image for your icon or add it in the command:\n<a:bg_starrollwhite:929572216578924615> Correct usage: `sb icon <emoji/url>`")

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

        collector.on('end', async () => {
            if (aborted) return
            userRole = await message.guild.roles.fetch(userRoleId);

            try{
                await userRole.setIcon(iconUrl);
            }catch(err){
                console.log(`Couldn't change the role icon for ${message.author.id}, error: ${err}`);

                if(err.message.includes("ENOENT")) return message.channel.send(`Sorry, I was not able to change your icon, couldn't find \`"${args[0]}"\`\n<a:bg_starrollwhite:929572216578924615> Make sure the url is correct.`);
                if(err.message.includes("Invalid Form Body")) return message.channel.send(`Sorry, I was not able to change your icon, that is not a valid image.\n<a:bg_starrollwhite:929572216578924615> File cannot be larger than 256kb`);

                message.channel.send("Sorry, I was not able to change your icon (unknown error), please ask staff for help.");
                aborted = true;
            }

            if(!aborted) {
                message.channel.send("Successfully changed your role icon!")
            }
        });
        


    }
}