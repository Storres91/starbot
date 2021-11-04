const { MessageActionRow, MessageButton } = require('discord.js');
const requestModel = require('../models/requestSchema.js')

module.exports = {
    name: 'donate',
    description: "Sends a GA request (Verification)",


    async execute(client, message, args, Discord) {
        const inputArray = args.join(" ").split(',').map(arg => arg.trim());
        inputArray[0] = inputArray[0].trim();
        const mRequest = inputArray;
        mRequest[5] = mRequest.slice(5).join(', ');
        mRequest.splice(6);


        var donorID = message.author.id;
        var reqMsgID = 0;
        var timetravel = '0';
        var gaTemp = 'c#';
        var footerTT = ' ';

        const gaDonationChannelID='869271499800985640';
        const tt0_1ID = '852314328405377074';
        const tt2_19ID = '852314511432220702';
        const tt20ID = '852314705196613653';



        if (message.channel.id === gaDonationChannelID) {
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
                if (!mRequest[k]) return message.channel.send("<@" + donorID + "> Use the command properly!!"
                    + "\nCorrect Usage: ``sb request prize, requirement, winners, time, extra entries, message`` "
                    + "\nExample: ``sb request 5B, tt2-19, 2, 5 hour, no, Hello Everyone`` "
                    + "\n(don't forget to use commas , and command in <#"+gaDonationChannelID+">)");
            }
            

            const confirmationRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("reqConfirm")
                    .setLabel("Confirm")
                    .setStyle("SUCCESS"),

                new MessageButton()
                    .setCustomId("reqCancel")
                    .setLabel("Cancel")
                    .setStyle("DANGER")
            );

            var winFix = String(mRequest[2]).replace(/\D/g,'');

            const reqEmbed = new Discord.MessageEmbed()
                .setColor('#3437eb')
                .setTitle('<a:staryellowhover:905582557972807730> Giveaway Details <a:staryellowhover:905582557972807730>')
                .setDescription(`Please review your giveaway:
<:starpurple:905582557989584926> **Prize:** `+ mRequest[0] + `
<:starpurple:905582557989584926> **Winners:** ${winFix}
<:starpurple:905582557989584926> **Time:** ${String(mRequest[3])}
<:starpurple:905582557989584926> **Extra entries:** ${String(mRequest[4])}

<:starpurple:905582557989584926> **Requirement:** ${String(mRequest[1])}
<:starpurple:905582557989584926> **Message:** ${String(mRequest[5])}
<:starpurple:905582557989584926> **Sponsor:** <@`+ donorID + `>`)
                .setFooter(`pst! ${footerTT}Giveaway`)
                .setTimestamp();

            await message.channel.send({ content: '<@' + donorID + '> If this is correct please press Confirm', embeds: [reqEmbed], components: [confirmationRow] }).then(sent => {
                reqMsgID = sent.id;
            })

            let reqMod = await requestModel.create({
                requestID: String(reqMsgID),
                prize: String(mRequest[0]),
                winners: String(mRequest[2]),
                duration: String(mRequest[3]),
                extraEntry: String(mRequest[4]),

                requirement: String(mRequest[1]),
                message: String(mRequest[5]),
                host: String(donorID),

                tt: timetravel,
                template: gaTemp

            });
            reqMod.save();
        }
        else {
            message.channel.send(`<@${message.member.user.id}> Kindly use this command in <#${gaDonationChannelID}>`);
        }



    }

}




