const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const donationModel = require('../../models/donationSchema.js')
const confessionModel = require('../../models/confessionSchema.js')

module.exports = {
    name: 'interactionCreate',
    description: "Creates interactions",

    async execute(interaction, client) {
        var ttid;
        const staffRoleID = '857060867676831805';
        const gaManagerRoleID = '869250517791019088';
        const gaManagerChannelID = '869298472648597524';
        const confessionPublicChannelID = '859527785738141716';

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
            .setColor('#e01818')
            .setTitle('Confession')
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

                //Confirm/Cancel buttons           
                if (interaction.customId == 'donationConfirm') {

                    //Check giveaway tt
                    ttid = donationData.tt;

                    if (donationData.tt == '0' || ttid == '0') {
                        ttid = 'TT';
                    }

                    //Only allow host/GA manager+ to confirm/cancel giveaway requests
                    if (interaction.member.user.id == donationData.host || interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                        setTimeout(function () {

                            interaction.editReply({
                                content: `Request from <@${donationData.host}>`,
                                components: [approvalRow]
                            });

                            interaction.message.reply('Giveaway confirmed please wait for <@&' + gaManagerRoleID + '> to accept your request, you can still decide to cancel this giveaway by pressing “Cancel my GA” ');

                        }, 1000);

                    }
                    interaction.deferUpdate();
                }


                if (interaction.customId === 'donationCancel') {
                    //Only allow host/GA manager+ to confirm/cancel giveaway requests
                    if (interaction.member.user.id == donationData.host || interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                        setTimeout(function () {
                            interaction.editReply({
                                content: ' ',
                                components: [],
                                embeds: [donationCancelEmbed.setFooter(`Giveaway cancelled by ${interaction.member.user.tag}`)]
                            });
                        }, 1000);

                    }
                    interaction.deferUpdate();
                }


                //Accept/Deny buttons
                if (interaction.customId == 'donationAccept') {
                    //Only allow GA manager+ to Accept/Deny giveaway requests
                    if (interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                        setTimeout(function () {

                            interaction.editReply({
                                content: `Donation from <@${donationData.host}>`,
                                components: []
                            });

                            interaction.message.reply(`<@${donationData.host}> your giveaway was accepted, please pass moni to <@${interaction.member.user.id}> and the giveaway will begin soon`);
                        }, 1000);

                        //Send command and details to the managers channel
                        setTimeout(function () {
                            client.channels.cache.get(gaManagerChannelID).send(
                                `<@${interaction.member.user.id}> has accepted giveaway from <@${donationData.host}>, here's the command to start it`);

                            client.channels.cache.get(gaManagerChannelID).send(
                                "\n`" + `g.gc using template ${donationData.template} -n ${donationData.prize} -d ${donationData.duration} -w ${donationData.winners} -h ${donationData.host}` + "`\n");

                            client.channels.cache.get(gaManagerChannelID).send(
                                "\n```" + `<@&${ttid}>\n` + `**Req:** ${donationData.requirement} \n**Message:** ${donationData.message} \n**Sponsored by:** <@${donationData.host}>` + "```");
                        }, 1000);



                    }
                    interaction.deferUpdate();

                }
                //Only allow GA manager+ to Accept/Deny giveaway requests
                if (interaction.customId == 'donationDeny') {
                    if (interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                        setTimeout(function () {
                            interaction.editReply({
                                content: ' ',
                                components: [],
                                embeds: [donationCancelEmbed.setFooter(`Giveaway denied by ${interaction.member.user.tag}`).setTitle(':no_entry_sign: Denied Giveaway :no_entry_sign:').setDescription(`This giveaway has been denied`).setTimestamp()]
                            });

                            interaction.message.reply(`<@${donationData.host}> your giveaway was rejected by <@${interaction.member.user.id}> please check that your giveaway follows the pinned guidelines`);
                        }, 1000);
                    }
                    interaction.deferUpdate();

                }

                if (interaction.customId == 'finalCancel') {
                    if (interaction.member.user.id == donationData.host) {
                        setTimeout(function () {
                            interaction.editReply({
                                content: ' ',
                                components: [],
                                embeds: [donationCancelEmbed.setFooter(`Giveaway cancelled by ${interaction.member.user.tag}`)]
                            });
                        }, 1000);
                    }
                    interaction.deferUpdate();

                }

                if (interaction.customId == 'confessionPost') {
                    
                    setTimeout(function () {
                        interaction.editReply({
                            content: ':white_check_mark: Confession sent :white_check_mark:',
                            components: []

                        });
                        client.channels.cache.get(confessionPublicChannelID).send({embeds: [publicConfessionEmbed.setDescription(confessionData.confessionMsg)]});
                    }, 600);

                    interaction.deferUpdate();

                }

            }

        } catch (err) {
            console.log(`Interaction error at interactionCreate.js ${err}`)
        }
    }
}