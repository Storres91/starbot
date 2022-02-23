// const { MessageActionRow, MessageButton } = require('discord.js');

// module.exports = {
//     name: 'prom',
//     description: 'Submits an application for celestial valentine event',
//     aliases: ['val', 'valentine', 'valentines'],
//     async execute(client, message, args, Discord) {
//         var cancelledApp = false, answers = [], attachmentUrl;
//         const postChannel = await message.guild.channels.fetch('941143944262221824');
//         const postRow = new MessageActionRow().addComponents(
//             new MessageButton()
//                 .setCustomId("postApp")
//                 .setLabel("Post")
//                 .setStyle("SUCCESS"));

//         var promEmbed = new Discord.MessageEmbed()
//                 .setAuthor('Celestial Realm\'s prom application', 'https://cdn.discordapp.com/attachments/851078982945210409/941487754645213245/Untitled106_20220210171045.png')
//                 .setColor('#b5359d')
//                 .setFooter(`Valentine's day`)
//                 .setTimestamp();

//         let applicationEmbed = new Discord.MessageEmbed()
//                 .setTitle("Valentine's app <:bg_pixelheart:941480005542768641>")
//                 .setColor('#b5359d')
//                 .setFooter('Valentine\'s day')
//                 .setTimestamp();

//         const questions = [
//             "**What is the name of the couple? (Make it memorable and creative)**",
//             '**Please @mention your partner**',
//             '**Write a message for anyone seeing this application** (_Vote for us for example_ <:uwu_cat:939900525359550524>)\n<a:starpinkhover:905574950025449482> You can use all the decorations needed. (External emojis won\'t work <:cr_saddistorted:858847642724728862>)',
//             '**Show us your talents!** \n<a:starpinkhover:905574950025449482> Attach an image/video, send a link, write something if that\'s what you do, everything works!',
//         ];

//         var counter = 0;

//         const filter = (m) => m.author.id === message.author.id;

//         const collector = new Discord.MessageCollector(message.channel, {
//             filter,
//             time: 1000 * 120
//         });
//         message.channel.send({ embeds: [promEmbed.setDescription(questions[counter++] + '\n\n Type `cancel` to stop this process')] }).then(sent => { promMsg = sent });
//         collector.on('collect', (m) => {
//             if (m.content.toLowerCase() == 'cancel') {
//                 cancelledApp = true
//                 collector.stop()
//                 return
//             }
//             if (counter != questions.length){
//                 setTimeout(() => {
//                     m.delete().catch(() => null);
//                 }, 1000);
//             }
            

//             if (counter < questions.length) {
//                 promMsg.edit({ embeds: [promEmbed.setDescription(questions[counter++] + "\n\n Type `cancel` to stop this process")] });
//             }
//             else {
//                 promMsg.edit({ embeds: [promEmbed.setDescription('<a:starpinkhover:905574950025449482> All done, your application has been submitted.')] });
//                 collector.stop();
//             }
//         });

//         collector.on('end', async collected => {
//             if (cancelledApp) return promMsg.edit({ embeds: [promEmbed.setDescription(" Successfully cancelled the application. :white_check_mark:")] });
//             if (collected.size < questions.length) return promMsg.edit({ embeds: [promEmbed.setDescription("Time run out, you didn't answer the questions in time, try again later :x:")] });
            
//             counter = 0;
//             collected.forEach((answer) => {
//                 if (answer.attachments.size != 0) attachmentUrl = answer.attachments.first().url
//                 answers[counter++] = answer.content;
//             });

//             applicationEmbed.setDescription(`**Couple name:** ${answers[0]}\n`+
//                                             `**Couple members:** <@${message.author.id}> ${answers[1]}\n`+
//                                             `**Message:** ${answers[2]}\n`+
//                                             `**Show your talents:** ${answers[3]}\n`)
//             postChannel.send({embeds: [applicationEmbed], components: [postRow]});
//             if (attachmentUrl) postChannel.send({content: attachmentUrl, components:[postRow]});
//         });
//     }  
// }
