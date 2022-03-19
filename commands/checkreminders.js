const remindersModel = require('../models/remindersSchema.js')

module.exports = {
    name: 'checkreminders',
    description: 'Sample description',
    aliases: ['checkreminder', 'reminders', 'cr', 'paytime', 'mydebt'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        const gaManagerRoleID = '869250517791019088';
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID) || message.member.roles.cache.some(role => role.id == gaManagerRoleID)){}
        else return 

        let remindersData;
        try {
            remindersData = await remindersModel.find({ userID: message.author.id });
        } catch (err) {
            console.log(`Error getting donationData ${err}`)
        }
        if (remindersData.length == 0) return message.channel.send("Jei says you currently have no reminders. <a:cr_frogstick:887361981810626571>")

        message.channel.send(`<@${message.author.id}>, These are your active reminders (No, you can't delete/edit them <a:bg_catyes:927728342331949056>)`)

        for(let reminder of remindersData){
            let description = reminder.description.replaceAll('*','').split("\n\n")
            message.channel.send("\n\n<t:"+((reminder.date).toString()).slice(0,-3)+":f>\n```"+(description[0])+"```\n"+description[1]) 
        }

        
    }
}