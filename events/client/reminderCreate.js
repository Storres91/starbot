const remindersModel = require('../../models/remindersSchema.js')
const ms = require("ms");

module.exports = {
    name: 'reminderCreate',
    description: 'Creates a new reminder (event)',
    aliases: [''],
    async execute(client, message, Discord) {
        if (message.embeds.length == 0) return
        if(!message.embeds[0].footer) return
        if (!(message.embeds[0].footer.text.toLowerCase()).includes("ends at")) return
        
        const giveawayUrl = message.url;
        const prize = message.embeds[0].title;
        const winners = parseInt((message.embeds[0].description.match(/Winners: \*\*\d+\*\*/) + "").match(/\d+/) + "")
        const duration = ((message.embeds[0].description.split('\n').slice(-1)).join()).split('**')[1]

        const reminderEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTitle("<a:bg_giveaway:940743393208844329> <a:starpurplehover:905575054161641483> Time to pay! <a:starpurplehover:905575054161641483> <a:bg_giveaway:940743393208844329>")
            .setFooter("Celestial Starbot auto reminders")
            .setTimestamp();


        const filter = (m)=>!m.author.bot && ((m.content).includes("<@&852314328405377074>") || (m.content).includes("<@&852314511432220702>") || (m.content).includes("<@&852314705196613653>") || (m.content).includes("@role"));
        const collector = new Discord.MessageCollector(message.channel, {filter, time:1000*60*60})

        collector.on('collect', ()=>{
            collector.stop()
            return
            
        });

        collector.on('end', async collected =>{
            if (!message.pinnable) return
            if (collected.size == 0) return
            if (!(message.embeds[0].footer.text.toLowerCase()).includes("ends at")) return

            let userId = collected.first().author.id
            let member = await message.guild.members.fetch(userId)
            var username = member.nickname!=null?member.nickname:member.user.username;

            reminderEmbed.setDescription(`**Prize:** ${prize}\n**Winners:** ${winners}\n\n**Jump to the giveaway:** ${giveawayUrl}`);

            let remindersMod = await remindersModel.create({
                userID: userId,
                description: reminderEmbed.description,
                date: Date.now()+ms(duration)+3000
            });
            remindersMod.save()

            client.channels.fetch('869298472648597524').then(ch => ch.send(`${username}, Successfully set the reminder for <t:${((Date.now()+ms(duration)+3000).toString()).slice(0,-3)}:T>.`))
            if (collected.first().author.id == '230120935804370944') client.channels.fetch('869298472648597524').then(ch => ch.send(`<a:bg_starrollpink:922013790810284072> Remember to write \`?howtodonate\` in <#869271499800985640>`))

            setTimeout(()=>{reminder(userId, remindersMod)}, ms(duration)+3000);
            
        })

        function reminder (userID, reminderData) {
            let memberTargetFunction = message.guild.members.cache.get(userID);
            client.users.cache.get(memberTargetFunction.user.id).send({ embeds: [reminderEmbed] }).catch((err) => console.log("Reminder failed: "+err));
            reminderData.delete()
        }
    }
    
}