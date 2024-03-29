const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const donationModel = require('../../models/donationSchema.js')
const confessionModel = require('../../models/confessionSchema.js')
const countersModel = require('../../models/countersSchema.js')
const mbManager = require("../../utils/mbManager.js");


module.exports = {
    name: 'interactionCreate',
    description: "Creates interactions",

    async execute(interaction, client, Discord) {
        var ttid = '0';
        const staffRoleID = '857060867676831805';
        const gaManagerRoleID = '869250517791019088';
        const gaManagerChannelID = '869298472648597524';
        const confessionPublicChannelID = '867539163883634719';

        var randomColor = Math.floor(Math.random() * 16777215).toString(16);


        //Accept/Deny button row
        const approvalRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("donationAccept")
                .setLabel("Accept")
                .setStyle("SUCCESS"),

            new MessageButton()
                .setCustomId("donationDeny")
                .setLabel("Deny")
                .setStyle("DANGER"),

            new MessageButton()
                .setCustomId("finalCancel")
                .setLabel("Cancel my GA")
                .setStyle("SECONDARY")
        );
        //Cancelled GA embed
        const donationCancelEmbed = new MessageEmbed()
            .setColor('#e01818')
            .setTitle(':x: Cancelled Giveaway :x:')
            .setDescription(`This giveaway has been cancelled`)
            .setTimestamp();

        //Cancelled GA embed
        const publicConfessionEmbed = new MessageEmbed()
            .setColor('#' + randomColor)
            .setTitle('tets')
            .setTimestamp();

        //Confession confirmed embed
        const confessEmbedConfirm = new MessageEmbed()
            .setColor('#89f170')
            .setTimestamp();



        //Buttons interaction    
        try {
            if (interaction.isButton()) {

                //Retrieve confession db data
                let confessionData;
                try {
                    confessionData = await confessionModel.findOne({ confessionID: interaction.message.id });
                } catch (err) {
                    console.log(`Error getting donationData ${err}`)
                }

                //Retrieve donation db data
                let donationData;
                try {
                    donationData = await donationModel.findOne({ donationID: interaction.message.id });

                } catch (err) {
                    console.log(`Error getting donationData ${err}`)
                }

                //Retrieve counters data
                let countersData;
                try {
                    countersData = await countersModel.findOne({ counterId: "firstCounter" });
                } catch (err) {
                    console.log(`Error getting countersData ${err}`)
                }

                if (donationData) {
                    //Check giveaway tt
                    ttid = donationData.tt;

                    if (donationData.tt == '0' || ttid == '0') {
                        ttid = 'TT';
                    }
                }





                //Confirm/Cancel buttons           
                if (interaction.customId == 'donationConfirm') {
                    //Only allow host confirm/cancel giveaway requests
                    if (interaction.member.user.id == donationData.host || interaction.member.user.id == '313351494361677845') {
                        await interaction.deferUpdate();
                        interaction.editReply({
                            content: `Request from <@${donationData.host}>`,
                            components: [approvalRow]
                        });

                        interaction.message.reply('Giveaway confirmed please wait for <@&' + gaManagerRoleID + '> to accept your request, you can still decide to cancel this giveaway by pressing “Cancel my GA” ');
                    }
                }


                if (interaction.customId === 'donationCancel') {
                    //Only allow host confirm/cancel giveaway requests
                    if (interaction.member.user.id == donationData.host || interaction.member.user.id == '313351494361677845') {
                        await interaction.deferUpdate();
                        interaction.editReply({
                            content: ' ',
                            components: [],
                            embeds: [donationCancelEmbed.setFooter(`Giveaway cancelled by ${interaction.member.user.tag}`)]
                        });
                    }

                }

                if (interaction.customId === 'donationEdit') {
                    let extraEntries = getExtraEntries(interaction);

                    if (interaction.member.user.id == donationData.host || interaction.member.user.id == '313351494361677845') {
                        await interaction.deferUpdate();
                        let { prize, requirement, winners, duration, message } = donationData;
                        interaction.editReply({ components: [] });
                        interaction.channel.send(`Replace what you want to edit and send the command:\n\`sb donate ${prize}, ${requirement}, ${winners}, ${duration}, ${extraEntries}, ${message}\``);
                    }
                }


                //Accept/Deny buttons
                if (interaction.customId == 'donationAccept') {
                    //Only allow GA manager+ to Accept/Deny giveaway requests
                    if (interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID) || interaction.member.user.id == '313351494361677845') {
                        await interaction.deferUpdate();
                        interaction.editReply({
                            content: `Donation from <@${donationData.host}>`,
                            components: []
                        });

                        interaction.message.reply(`<@${donationData.host}> your giveaway was accepted, please pass moni to <@${interaction.member.user.id}> and the giveaway will begin soon`);

                        //Send command and details to the managers channel
                        client.channels.cache.get(gaManagerChannelID).send(
                            `<@${interaction.member.user.id}> has accepted giveaway from <@${donationData.host}>, here's the command to start it`);

                        client.channels.cache.get(gaManagerChannelID).send(
                            "\n`" + `g.gc using template ${donationData.template} -n ${donationData.prize} -d ${donationData.duration} -w ${donationData.winners} -h ${donationData.host}` + "`\n");

                        client.channels.cache.get(gaManagerChannelID).send(
                            "\n```" + `<@&${ttid}>\n` + `**Prize:** ${donationData.prize} \n**Req:** ${donationData.requirement} \n**Message:** ${donationData.message} \n**Sponsored by:** <@${donationData.host}>` + "```");
                    }
                }
                //Only allow GA manager+ to Accept/Deny giveaway requests
                if (interaction.customId == 'donationDeny') {
                    if (interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID) || interaction.member.user.id == '313351494361677845') {
                        await interaction.deferUpdate();
                        interaction.editReply({
                            content: ' ',
                            components: [],
                            embeds: [donationCancelEmbed.setFooter(`Giveaway denied by ${interaction.member.user.tag}`).setTitle(':no_entry_sign: Denied Giveaway :no_entry_sign:').setDescription(`This giveaway has been denied`).setTimestamp()]
                        });

                        interaction.message.reply(`<@${donationData.host}> your giveaway was rejected by <@${interaction.member.user.id}> please check that your giveaway follows the pinned guidelines`);
                    }


                }

                if (interaction.customId == 'finalCancel') {
                    if (interaction.member.user.id == donationData.host || interaction.member.user.id == '313351494361677845') {
                        await interaction.deferUpdate();
                        interaction.editReply({
                            content: ' ',
                            components: [],
                            embeds: [donationCancelEmbed.setFooter(`Giveaway cancelled by ${interaction.member.user.tag}`)]
                        });


                    }


                }

                //Confession buttons
                if (interaction.customId == 'confessionPost') {
                    await interaction.deferUpdate();
                    interaction.editReply({
                        content: 'Confession sent :white_check_mark:',
                        components: [],
                        embeds: [confessEmbedConfirm.setDescription('Confession: ' + confessionData.confessionMsg).setFooter(`Confession approved by ${interaction.member.user.tag}`).setTitle(confessionData.confessionTag).setThumbnail(confessionData.confessionAvatar)]
                    });


                    client.channels.cache.get(confessionPublicChannelID).send({ embeds: [publicConfessionEmbed.setDescription(confessionData.confessionMsg).setTitle(':pencil: Confession #' + String(countersData.confessionSeq))] });

                    countersData.confessionSeq += 1;
                    countersData.save();


                }

                if (interaction.customId == 'confessionDeny') {

                    await interaction.deferUpdate();
                    const filter = (i) => i.author.id === interaction.member.user.id;
                    var confessionDenyReason = " ";
                    var askReason;
                    interaction.editReply({ components: [] });
                    interaction.channel.send("Please write the reason below or `noreason`: ").then(sent => { askReason = sent });

                    var confessionReasonCollector = new Discord.MessageCollector(interaction.channel, {
                        filter,
                        time: 1000 * 120,
                        max: 1
                    });

                    confessionReasonCollector.on('collect', async (i) => {
                        setTimeout(() => {
                            i.delete();
                        }, 1000);
                        if (i.content.toLowerCase() == "noreason") {
                            confessionReasonCollector.stop();
                        }
                        confessionDenyReason = "**Reason:** " + i.content;

                    });

                    confessionReasonCollector.on('end', () => {
                        askReason.delete();
                        interaction.editReply({
                            content: 'Confession Denied :no_entry_sign: ',
                            components: [],
                            embeds: [donationCancelEmbed.setFooter(`Confession denied by ${interaction.member.user.tag}`).setDescription('**Confession:** ' + confessionData.confessionMsg + "\n\n " + confessionDenyReason).setTimestamp().setTitle(confessionData.confessionTag).setThumbnail(confessionData.confessionAvatar)]

                        });

                        client.users.cache.get(confessionData.confessionUserID).send({ embeds: [donationCancelEmbed.setFooter(`Celestial realm`).setDescription('**Confession:** ' + confessionData.confessionMsg + "\n\n " + confessionDenyReason).setTimestamp().setTitle("Denied confession")] });
                    });
                }

                if(interaction.customId == 'postApp'){
                    await interaction.deferUpdate();
                    let postChannel = await interaction.guild.channels.fetch('941144300308283442')
    
                    if (interaction.message.content == '') interaction.editReply({components:[], embeds: [interaction.message.embeds[0]]});
                    else interaction.editReply({components:[], content: interaction.message.content});
    
                    if (interaction.message.content == '') postChannel.send({content: ' ', embeds: [interaction.message.embeds[0]]})
                    else postChannel.send({content: interaction.message.content})
                }

                if(interaction.message.embeds[0]?.title == 'Mb template' && interaction.message.embeds[0]?.footer?.text.match(/\d+/)+"" == interaction.member.id){

                    if(interaction.customId == 'minibossCancel'){
                        const embed = new Discord.MessageEmbed()
                            .setColor('#826afc')
                            .setDescription('<:cr_checkno:983546312639258634> **Cancelled this mb.**');
    
                        await interaction.deferUpdate();
                        interaction.editReply({embeds: [embed], components:[]})
                    }
    
                    if(interaction.customId == 'minibossEdit'){
                        await interaction.deferUpdate();
                        interaction.editReply({components:[]})
                        mbManager.editTemplate(interaction.message);
                    }
                    
                }else if(interaction.message.embeds[0]?.title == 'Mb template' && interaction.message.embeds[0]?.footer?.text.match(/\d+/)+"" != interaction.member.id){
                    interaction.reply({content:'**This is not your template!**', ephemeral:true})
                }

            }

        } catch (err) {
            console.log(`Interaction error at interactionCreate.js ${err}`)
        }
        function getExtraEntries(interaction) {
            interaction.message = interaction.message.embeds[0].description;
            interaction.message = interaction.message.match(/entries:\*\*\D+\n/) + "";
            interaction.message = interaction.message.match(/\*\D+\n/) + "";
            interaction.message = interaction.message.replaceAll("*", "");
            interaction.message = interaction.message.replaceAll("\n", "");
            interaction.message = interaction.message.trim();

            return interaction.message
        }
    }
}