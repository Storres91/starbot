const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const requestModel = require('../../models/requestSchema.js')

module.exports = {
    name: 'interactionCreate',
    description: "Creates interactions",

    async execute(interaction, client) {
        //Accept/Deny button row
        const approvalRow = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("reqAccept")
                .setLabel("Accept")
                .setStyle("SUCCESS"),

            new MessageButton()
                .setCustomId("reqDeny")
                .setLabel("Deny")
                .setStyle("DANGER")
        );
        //Cancelled GA embed
        const reqCancelEmbed = new MessageEmbed()
            .setColor('#e01818')
            .setTitle(':x: Cancelled Giveaway :x:')
            .setDescription(`This giveaway has been cancelled`)
            .setTimestamp();

        var ttid;
        const staffRoleID='857060867676831805';
        const gaManagerRoleID='869250517791019088';
        const gaManagerChannelID='905500365875736666';

        //Buttons interaction    
        try {
            if (interaction.isButton()) {

                //Retrieve db data
                let requestData;
                try {
                    requestData = await requestModel.findOne({ requestID: interaction.message.id });
                } catch (err) {
                    console.log(`Error getting requestData ${err}`)
                }

                //Check giveaway tt
                ttid=requestData.tt;

                if (requestData.tt=='0' || ttid=='0'){
                    ttid='TT';
                }
                
                //Confirm/Cancel buttons           
                try {

                    if (interaction.customId == 'reqConfirm') {
                        //Only allow host/GA manager+ to confirm/cancel giveaway requests
                        if (interaction.member.user.id == requestData.host|| interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                            setTimeout(function () {

                                interaction.editReply({
                                    components: [approvalRow]
                                });

                                interaction.message.reply('Giveaway confirmed please wait for <@&'+gaManagerRoleID+'> to accept your request');
                            }, 500);

                        }
                        interaction.deferUpdate();
                    }


                    if (interaction.customId === 'reqCancel') {
                        //Only allow host/GA manager+ to confirm/cancel giveaway requests
                        if (interaction.member.user.id == requestData.host || interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                            setTimeout(function () {
                                interaction.editReply({
                                    content: ' ',
                                    components: [],
                                    embeds: [reqCancelEmbed.setFooter(`Giveaway cancelled by ${interaction.member.user.tag}`)]
                                });
                            }, 500);

                        }
                        interaction.deferUpdate();
                    }


                    //Accept/Deny buttons
                    if (interaction.customId == 'reqAccept') {
                        //Only allow GA manager+ to Accept/Deny giveaway requests
                        if (interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                            setTimeout(function () {

                                interaction.editReply({
                                    content: `Request from <@${requestData.host}>`,
                                    components: []
                                });

                                interaction.message.reply(`<@${requestData.host}> your giveaway was accepted, please pass moni to <@${interaction.member.user.id}> and the giveaway will begin soon`);
                            }, 500);

                            //Send command and details to the managers channel
                            client.channels.cache.get(gaManagerChannelID).send(
                                `<@${interaction.member.user.id}> has accepted giveaway from <@${requestData.host}>, here's the command to start it`);

                                client.channels.cache.get(gaManagerChannelID).send(
                                "\n``"+`g.gc using template ${requestData.template} -n ${requestData.prize} -d ${requestData.duration} -w ${requestData.winners} -h ${requestData.host}`+"``\n");

                                client.channels.cache.get(gaManagerChannelID).send(
                                "\n```"+`<@&${ttid}>\n`+`**Req:** ${requestData.requirement} \n**Message:** ${requestData.message} \n**Sponsored by:** <@${requestData.host}>`+"```");
                                
                                
                            
                            
                        }
                        interaction.deferUpdate();

                    }
                    //Only allow GA manager+ to Accept/Deny giveaway requests
                    if (interaction.customId == 'reqDeny') {
                        if (interaction.member.roles.cache.some(role => role.id == gaManagerRoleID) || interaction.member.roles.cache.some(role => role.id == staffRoleID)) {
                            setTimeout(function () {
                                interaction.editReply({
                                    content: ' ',
                                    components: [],
                                    embeds: [reqCancelEmbed.setFooter(`Giveaway denied by ${interaction.member.user.tag}`).setTitle(':no_entry_sign: Denied Giveaway :no_entry_sign:').setDescription(`This giveaway has been denied`).setTimestamp()]
                                });

                                interaction.message.reply(`<@${requestData.host}> your giveaway was rejected by <@${interaction.member.user.id}> please check that your giveaway follows the pinned guidelines`);
                            }, 500);
                        }
                        interaction.deferUpdate();

                    }
                } catch (err) {
                    console.log(`There was an error with the giveaway ${requestData.requestID} buttons ${err}`)
                }
            }

        } catch (err) {
            console.log(`Interaction error at interactionCreate.js ${err}`)
        }
    }
}