const remindersModel = require('../../models/remindersSchema.js')

module.exports = {
    name: 'restartReminders',
    description: 'Restarts the reminders on bot start',
    once: true,
    aliases: [''],
    async execute(client, Discord) {
        
        const guild = (await client.channels.fetch("852588316363980860")).guild;
        const gaManagerRole = await guild.roles.cache.get("869250517791019088");
        const gaManagers = gaManagerRole.members.map(m=>m.user.id);
        const staffMembers = (await guild.roles.cache.get("857060867676831805")).members.map(m=>m.user.id);
        const allMembers = new Set(gaManagers.concat(staffMembers));

        for (let userId of allMembers){
            
            let remindersData;
            try{
                remindersData = await remindersModel.find({userID:userId})
            } catch(err){
                console.log(`Error getting remindersData at restartReminders.js ${err}`)
            }
            if(remindersData.length == 0) continue

            for(let reminder of remindersData){
                setTimeout(()=>{
                    let reminderEmbed = new Discord.MessageEmbed()
                        .setColor('#b5359d')
                        .setTitle("<a:bg_giveaway:940743393208844329> <a:starpurplehover:905575054161641483> Time to pay! <a:starpurplehover:905575054161641483> <a:bg_giveaway:940743393208844329>")
                        .setDescription(reminder.description)
                        .setFooter("Celestial Starbot auto reminders")
                        .setTimestamp();

                    client.users.cache.get(reminder.userID).send({ embeds: [reminderEmbed] }).catch((err) => console.log("Reminder failed: "+err));
                    reminder.delete()
                }, (reminder.date - Date.now())<1 ? 0:(reminder.date - Date.now()))
            }
        }
        client.channels.fetch("902377203801661470").then(ch=>ch.send("<a:bg_starrollpink:922013790810284072> Successfully restarted the reminders."))

        
    }
}