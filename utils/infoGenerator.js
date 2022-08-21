const Discord = require("discord.js")

module.exports = {
    name: 'infoGenerator',
    generateInfo(
        message,
        templateDetails={
        name:  (message.member.nickname != null? message.member.nickname : message.author.username)+"'s miniboss",
        hostId: message.author.id,
        message: 'Thanks for participating in my miniboss!',
        duration: '1 Minute',
        numberOfWinners: 9,
        autoPing: 'Yes',
        embedColor: '#826afc'
        }
    ){      
        const templateEmbed = new Discord.MessageEmbed()
            .setTitle("Mb template")
            .setDescription(`**Name:** ${templateDetails.name}\n`+
                            `**Message:** ${templateDetails.message}\n\n`+
                            `**Duration:** ${templateDetails.duration}\n`+
                            `**Winners:** ${templateDetails.numberOfWinners}\n`+
                            `**Auto ping:** ${templateDetails.autoPing==true || templateDetails.autoPing.toLowerCase() == 'yes'?'Yes':'No'}\n`+
                            `**Embed color:** ${templateDetails.embedColor}`)
            .setColor(templateDetails.embedColor)
            .setThumbnail('https://media.discordapp.net/attachments/857716865190068254/986058788614328390/FE115EAE-F9E4-46CE-997E-279AD6DD8BC4.png')
            .setFooter(`Host: ${message.author.id}`);
        
        const minibossRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId("minibossCancel")
                .setLabel("Cancel")
                .setStyle("DANGER"),
        
            new Discord.MessageButton()
                .setCustomId("minibossEdit")
                .setLabel("Edit")
                .setStyle("PRIMARY"),
        
            new Discord.MessageButton()
                .setCustomId("minibossStart")
                .setLabel("Start")
                .setStyle("SUCCESS")
        );
        
        const minibossInfo = {
            templateDetails,
            templateEmbed,
            minibossRow
        }

        return minibossInfo;
    },
    mbEditOptions(){
        const editOptions = new Discord.MessageActionRow().addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Select something to edit')
                .addOptions([
                    {
                        // emoji: '🛰️',
                        value: '1',
                        label: 'Name'
                    },
                    {
                        // emoji: '✨',
                        value: '2',
                        label: 'Message'
                    },
                    {
                        // emoji: '💥',
                        value: '3',
                        label: 'Duration'
                    },
                    {
                        // emoji: '💎',
                        value: '4',
                        label: 'Winners'
                    },
                    {
                        // emoji: '👽',
                        value: '5',
                        label: 'Auto Ping'
                    },
                    {
                        // emoji: '🪐',
                        value: '6',
                        label: 'Embed Color'
                    },
                    {
                        emoji: '❌',
                        value: '7',
                        label: 'Cancel'
                    },
                ]),
        );

        return editOptions;
    }
}