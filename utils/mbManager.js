const { generateInfo, mbEditOptions } = require("./infoGenerator.js");
const templateDataModel = require("../models/templateSchema.js");
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_INTEGRATIONS", "GUILD_PRESENCES", "GUILD_MEMBERS", "DIRECT_MESSAGES",] })

module.exports = {
    name: 'mbManager',
    showTemplate(message, templateDetails){
        const minibossInfo = generateInfo(message, templateDetails);
        const {templateEmbed, minibossRow} = minibossInfo;
        message.channel.send({embeds:[templateEmbed], components: [minibossRow]})
    },

    async createTemplate(message){
        const minibossInfo = generateInfo(message);
        const {templateDetails, templateEmbed, minibossRow} = minibossInfo;

        message.reply(`Welcome **${message.member.nickname != null? message.member.nickname : message.author.username}**! \nI've created a basic template for your minibosses.`)
        message.channel.send({embeds:[templateEmbed], components: [minibossRow]})

        let templateMod = await templateDataModel.create({
            hostId: templateDetails.hostId,
            name: templateDetails.name,
            duration: templateDetails.duration,
            numberOfWinners: templateDetails.numberOfWinners,
            autoPing: templateDetails.autoPing.toLowerCase() == 'yes'?true:false,
            message: templateDetails.message,
            embedColor: templateDetails.embedColor

        });
        templateMod.save();
    },

    editTemplate(message){
        const mbEditMenu = mbEditOptions();
        let menuMessage;
        message.channel.send({content:'Select what you want to edit:', components:[mbEditMenu]}).then(msg => menuMessage=msg);

        const editOptionCollector = new Discord.InteractionCollector(client, {
            channel: message.channel,
            message: menuMessage
        });
        editOptionCollector.on('collect', (i) => {
            i.deferUpdate();
            if(i.member.id != message.author.id) return i.reply({content:'**This is not your template.**',ephemeral:true})
            switch (i.values[0]) {
                case "1":
                    message.channel.send('Write the name for your miniboss:')
                    break;
                
                case "2":
                    message.channel.send('Write the message for your miniboss:')
                    break;
                
                case "3":
                    message.channel.send('Choose the duration for your miniboss:')
                    break;
                
                case "4":
                    message.channel.send('Write the amount of winners for your miniboss:')
                    break;
                
                case "5":
                    message.channel.send('Choose if you want the bot to ping the roles for you:')
                    break;
                
                case "6":
                    message.channel.send('Write the color for the embed:')
                    break;
                
                case "7":
                    message.channel.send('Cancelled.')
                    return;
            
            }
        });
    }
}