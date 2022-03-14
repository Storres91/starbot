const { MessageActionRow, MessageButton } = require('discord.js');
const donationModel = require('../models/donationSchema.js')

module.exports = {
    name: 'donate',
    description: "Sends a GA donation (Verification)",


    async execute(client, message, args, Discord) {
        //Global variables
        var inputArray, mDonation = [];
        var donorID = message.author.id;
        var donationMsgID = 0;
        var timetravel = '0';
        var gaTemp = 'c#';
        var footerTT = ' ';
        var donationMinimum = "__**Minimum donations for normal giveaways**__\n" +
            "<a:bg_starrollpink:922013790810284072> **TT0-1:**\n" +
            "1 winner <:bg_arrow:922013968556515378> 50m\n" +
            "2+ winners <:bg_arrow:922013968556515378> 25m each\n\n" +

            "<a:bg_starrollpink:922013790810284072> **TT2-19:**\n" +
            "1 winner <:bg_arrow:922013968556515378> 200m\n" +
            "2+ winners <:bg_arrow:922013968556515378> 100m each\n\n" +

            "<a:bg_starrollpink:922013790810284072> **TT20+:**\n" +
            "1 winner <:bg_arrow:922013968556515378> 1b\n" +
            "2+ winners <:bg_arrow:922013968556515378> 500m each\n\n" +

            "__**Minimum donations for epic item drop req**__\n" +
            "<a:bg_starrollpink:922013790810284072> **TT0-1:**\n" +
            "1 winner <:bg_arrow:922013968556515378> 500m \n" +
            "2+ winners <:bg_arrow:922013968556515378> 250m each\n\n" +

            "<a:bg_starrollpink:922013790810284072> **TT2-19:**\n" +
            "1 winner <:bg_arrow:922013968556515378> 2b\n" +
            "2+ winners <:bg_arrow:922013968556515378> 1b each\n\n" +

            "<a:bg_starrollpink:922013790810284072> **TT20+:**\n" +
            "1 winner <:bg_arrow:922013968556515378> 10b\n" +
            "2+ winners <:bg_arrow:922013968556515378> 5b each";

        const gaDonationChannelID = '869271499800985640';
        const gaManagerChannelID = '869298472648597524';
        const tt0_1ID = '852314328405377074';
        const tt2_19ID = '852314511432220702';
        const tt20ID = '852314705196613653';

        if (message.channel.id === gaDonationChannelID || message.channel.id === gaManagerChannelID || message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == '857060867676831805')) {
            //Embed variables 
            if (message.member.roles.cache.some(role => role.id == tt0_1ID)) {
                timetravel = tt0_1ID;
                gaTemp = 'c1';
                footerTT = 'TT0-1 ';
                donationMinimum = "\n__**Minimum donations for normal giveaways**__\n<a:bg_starrollpink:922013790810284072> **TT0-1:**\n1 winner <:bg_arrow:922013968556515378> 50m\n2+ winners <:bg_arrow:922013968556515378> 25m each" +
                    "\n\n__**Minimum donations for epic item drop req**__\n<a:bg_starrollpink:922013790810284072> **TT0-1:**\n1 winner <:bg_arrow:922013968556515378> 500m \n2+ winners <:bg_arrow:922013968556515378> 250m each";

            } else if (message.member.roles.cache.some(role => role.id == tt2_19ID)) {
                timetravel = tt2_19ID;
                gaTemp = 'c2';
                footerTT = 'TT2-19 ';
                donationMinimum = "\n__**Minimum donations for normal giveaways**__\n<a:bg_starrollpink:922013790810284072> **TT2-19:**\n1 winner <:bg_arrow:922013968556515378> 200m\n2+ winners <:bg_arrow:922013968556515378> 100m each" +
                    "\n\n__**Minimum donations for epic item drop req**__\n<a:bg_starrollpink:922013790810284072> **TT2-19:**\n1 winner <:bg_arrow:922013968556515378> 2b \n2+ winners <:bg_arrow:922013968556515378> 1b each";

            } else if (message.member.roles.cache.some(role => role.id == tt20ID)) {
                timetravel = tt20ID;
                gaTemp = 'c3';
                footerTT = 'TT20+ '
                donationMinimum = "\n__**Minimum donations for normal giveaways**__\n<a:bg_starrollpink:922013790810284072> **TT20+:**\n1 winner <:bg_arrow:922013968556515378> 1b\n2+ winners <:bg_arrow:922013968556515378> 500m each" +
                    "\n\n__**Minimum donations for epic item drop req**__\n<a:bg_starrollpink:922013790810284072> **TT20+:**\n1 winner <:bg_arrow:922013968556515378> 10b \n2+ winners <:bg_arrow:922013968556515378> 5b each";
            }

            //Embeds and buttons
            var donationEmbed = new Discord.MessageEmbed()
                .setColor('#b5359d')
                .setTitle('<a:starpurplehover:905575054161641483> Giveaway Details <a:starpurplehover:905575054161641483>')
                .setFooter(`pst! ${footerTT}Giveaway`)
                .setTimestamp();

            var donationInteractiveEmbed = new Discord.MessageEmbed()
                .setAuthor('Interactive giveaway creation', client.user.displayAvatarURL())
                .setColor('#b5359d')
                .setFooter(`Starbot`)
                .setTimestamp();

            const confirmationRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("donationConfirm")
                    .setLabel("Confirm")
                    .setStyle("SUCCESS"),

                new MessageButton()
                    .setCustomId("donationCancel")
                    .setLabel("Cancel")
                    .setStyle("DANGER"),

                new MessageButton()
                    .setCustomId("donationEdit")
                    .setLabel("Edit")
                    .setStyle("SECONDARY")

            );

            //If the command is done in one line (normal)
            if (args[0]) {
                inputArray = args.join(" ").split(',').map(arg => arg.trim());
                inputArray[0] = inputArray[0].trim();
                mDonation = inputArray;
                mDonation[5] = mDonation.slice(5).join(', ');
                mDonation.splice(6);

                for (let k = 0; k <= 4; k++) {
                    if (!mDonation[k]) return message.channel.send("<@" + donorID + "> Use the command properly!!"
                        + "\nCorrect Usage: `sb donate prize, requirement, winners, time, extra entries, message` "
                        + '\nExample: `sb donate 5B, write "congrats" in <#869271499800985640>, 2, 5h, no, Hello Everyone`'
                        + "\n(don't forget to use commas , and command in <#" + gaDonationChannelID + ">)\n\n**__New:__** Interactive creation, write `sb donate` to get started.");
                }

                donationEmbed.setDescription(`Please review your giveaway:
<:starpurple:905582557989584926> **Prize:** `+ mDonation[0] + `
<:starpurple:905582557989584926> **Winners:** ${String(mDonation[2])}
<:starpurple:905582557989584926> **Time:** ${String(mDonation[3])}
<:starpurple:905582557989584926> **Extra entries:** ${String(mDonation[4])}
        
<:starpurple:905582557989584926> **Requirement:** ${String(mDonation[1])}
<:starpurple:905582557989584926> **Message:** ${String(mDonation[5])}
<:starpurple:905582557989584926> **Sponsor:** <@`+ donorID + `>`);

                await message.channel.send({ content: '<@' + donorID + '> If this is correct, please **press Confirm** to notify Giveaway Managers ', embeds: [donationEmbed], components: [confirmationRow] }).then(sent => {
                    donationMsgID = sent.id;
                });

                let donationMod = await donationModel.create({
                    donationID: String(donationMsgID),
                    prize: String(mDonation[0]),
                    winners: String(mDonation[2]).replace(/\D/g, ''),
                    duration: String(mDonation[3]),
                    extraEntry: String(mDonation[4]),

                    requirement: String(mDonation[1]),
                    message: String(mDonation[5]),
                    host: String(donorID),

                    tt: timetravel,
                    template: gaTemp

                });
                donationMod.save();


                //Interactive command
            } else {
                let paramMsg, cancelledGA;
                const parameters = [
                    "**How many ERPG coins would you like to donate?**" + donationMinimum,
                    '**How many winners should we set for this GA?** \n25 winners maximum',
                    '**What should the duration be?**\n (Minimum 10 mins and maximum 24h)',
                    '**Do you want to add extra entries?** \n(If so, write the role and the amount of extra 2-3)',

                    '**What is the requirement to join this giveaway?**',
                    '**Finally, any message you want to include?**'
                ];

                var counter = 0;

                const filter = (m) => m.author.id === message.author.id;

                const donationsCollector = new Discord.MessageCollector(message.channel, {
                    filter,
                    time: 1000 * 240
                });
                message.channel.send({ embeds: [donationInteractiveEmbed.setDescription(parameters[counter++] + '\n\n Type `cancel` to stop this process')] }).then(sent => { paramMsg = sent });
                donationsCollector.on('collect', (m) => {
                    if (m.content.toLowerCase() == 'cancel') {
                        cancelledGA = true
                        donationsCollector.stop()
                        return
                    }
                    setTimeout(() => {
                        m.delete().catch(() => null);
                    }, 700);

                    if (counter < parameters.length) {
                        paramMsg.edit({ embeds: [donationInteractiveEmbed.setDescription(parameters[counter++] + "\n\n Type `cancel` to stop this process")] });
                    }
                    else {
                        paramMsg.edit({ embeds: [donationInteractiveEmbed.setDescription('<a:starpurplehover:905575054161641483> All set, please review it \nWrite `?howtodonate` for more info')] });
                        donationsCollector.stop();
                    }
                });

                donationsCollector.on('end', async collected => {
                    if (cancelledGA) return paramMsg.edit({ embeds: [donationInteractiveEmbed.setDescription(" Successfully cancelled this giveaway creation :white_check_mark:")] });
                    if (collected.size < 6) return paramMsg.edit({ embeds: [donationInteractiveEmbed.setDescription("Time run out, you didn't answer the questions in time, try again later :x:")] });

                    counter = 0;
                    collected.forEach((answer) => {
                        mDonation[counter++] = answer.content;
                    });

                    donationEmbed.setDescription(`Please review your giveaway:
<:starpurple:905582557989584926> **Prize:** `+ mDonation[0] + `
<:starpurple:905582557989584926> **Winners:** ${String(mDonation[1])}
<:starpurple:905582557989584926> **Time:** ${String(mDonation[2])}
<:starpurple:905582557989584926> **Extra entries:** ${String(mDonation[3])}
        
<:starpurple:905582557989584926> **Requirement:** ${String(mDonation[4])}
<:starpurple:905582557989584926> **Message:** ${String(mDonation[5])}
<:starpurple:905582557989584926> **Sponsor:** <@`+ donorID + `>`);

                    await message.channel.send({ content: '<@' + donorID + '> If this is correct, please **press Confirm** to notify Giveaway Managers ', embeds: [donationEmbed], components: [confirmationRow] }).then(sent => {
                        donationMsgID = sent.id;
                    });

                    let donationMod = await donationModel.create({
                        donationID: String(donationMsgID),
                        prize: String(mDonation[0]),
                        winners: String(mDonation[1]).replace(/\D/g, ''),
                        duration: String(mDonation[2]),
                        extraEntry: String(mDonation[3]),

                        requirement: String(mDonation[4]),
                        message: String(mDonation[5]),
                        host: String(donorID),

                        tt: timetravel,
                        template: gaTemp

                    });
                    donationMod.save();

                });
            }


        }
        else {
            message.channel.send(`<@${message.member.user.id}> Kindly use this command in <#${gaDonationChannelID}>`);
        }

    }
}





