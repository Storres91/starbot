const { MessageActionRow, MessageButton } = require('discord.js');
const donationModel = require('../models/donationSchema.js')

module.exports = {
    name: 'donate',
    description: "Sends a GA donation (Verification)",


    async execute(client, message, args, Discord) {
        const inputArray = args.join(" ").split(',').map(arg => arg.trim());
        inputArray[0] = inputArray[0].trim();
        const mDonation = inputArray;
        mDonation[5] = mDonation.slice(5).join(', ');
        mDonation.splice(6);


        var donorID = message.author.id;
        var donationMsgID = 0;
        var timetravel = '0';
        var gaTemp = 'c#';
        var footerTT = ' ';

        const gaDonationChannelID='869271499800985640';
        const gaManagerChannelID='869298472648597524';
        const tt0_1ID = '852314328405377074';
        const tt2_19ID = '852314511432220702';
        const tt20ID = '852314705196613653';



        if (message.channel.id === gaDonationChannelID || message.channel.id === gaManagerChannelID || message.member.user.id == '313351494361677845') {
            if (message.member.roles.cache.some(role => role.id == tt0_1ID)) {
                timetravel = tt0_1ID;
                gaTemp = 'c1';
                footerTT = 'TT0-1 '

            } else if (message.member.roles.cache.some(role => role.id == tt2_19ID)) {
                timetravel = tt2_19ID;
                gaTemp = 'c2';
                footerTT = 'TT2-19 '

            } else if (message.member.roles.cache.some(role => role.id == tt20ID)) {
                timetravel = tt20ID;
                gaTemp = 'c3';
                footerTT = 'TT20+ '
            }



            for (let k = 0; k <= 4; k++) {
                if (!mDonation[k]) return message.channel.send("<@" + donorID + "> Use the command properly!!"
                    + "\nCorrect Usage: `sb donate prize, requirement, winners, time, extra entries, message` "
                    + '\nExample: `sb donate 5B, write "congrats" in <#869271499800985640>, 2, 5h, no, Hello Everyone`'
                    + "\n(don't forget to use commas , and command in <#"+gaDonationChannelID+">)");
            }
            

            const confirmationRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("donationConfirm")
                    .setLabel("Confirm")
                    .setStyle("SUCCESS"),

                new MessageButton()
                    .setCustomId("donationCancel")
                    .setLabel("Cancel")
                    .setStyle("DANGER")
            );



            const donationEmbed = new Discord.MessageEmbed()
                .setColor('#F3360D')
                .setTitle('<a:staryellowhover:905582557972807730> Giveaway Details <a:staryellowhover:905582557972807730>')
                .setDescription(`Please review your giveaway:
<:starorange:906252078433845279> **Prize:** `+ mDonation[0] + `
<:starorange:906252078433845279> **Winners:** ${String(mDonation[2])}
<:starorange:906252078433845279> **Time:** ${String(mDonation[3])}
<:starorange:906252078433845279> **Extra entries:** ${String(mDonation[4])}

<:starorange:906252078433845279> **Requirement:** ${String(mDonation[1])}
<:starorange:906252078433845279> **Message:** ${String(mDonation[5])}
<:starorange:906252078433845279> **Sponsor:** <@`+ donorID + `>`)
                .setFooter(`pst! ${footerTT}Giveaway`)
                .setTimestamp();

            await message.channel.send({ content: '<@' + donorID + '> If this is correct, please **press Confirm** to notify Giveaway Managers ', embeds: [donationEmbed], components: [confirmationRow] }).then(sent => {
                donationMsgID = sent.id;
            })

            let donationMod = await donationModel.create({
                donationID: String(donationMsgID),
                prize: String(mDonation[0]),
                winners: String(mDonation[2]).replace(/\D/g,''),
                duration: String(mDonation[3]),
                extraEntry: String(mDonation[4]),

                requirement: String(mDonation[1]),
                message: String(mDonation[5]),
                host: String(donorID),

                tt: timetravel,
                template: gaTemp

            });
            donationMod.save();
        }
        else {
            message.channel.send(`<@${message.member.user.id}> Kindly use this command in <#${gaDonationChannelID}>`);
        }



    }

}




