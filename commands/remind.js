const remindersModel = require('../models/remindersSchema.js');
const { transformToId } = require('../utils/targets.js')
const { isAllowed } = require('../utils/permsManager.js')
const ms = require("ms");

module.exports = {
    name: 'remind',
    description: 'Gives a reminder to another person',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        const { ROLES } = server;
        if(!isAllowed({member: message.member, roles: [ROLES.STAFF, ROLES.GA_MANAGER], users: ['299015816572043265']})) return message.channel.send("You are not allowed to use this command")
        if(!args[2]) return message.channel.send('Use this command properly!!! `sb remind <@user/id> <time> <reminder description>`')

        const userId = transformToId(args[0]);
        const reminderDescription = args.slice(2).join(' ');
        const time = ms(args[1]);

        let user = await message.guild.members.fetch(userId);
        if (!user) return message.channel.send(`${args[0]} is not a valid user.`)
        if (isNaN(time)) return message.channel.send(`${args[1]} is not a valid time.`)

        const reminderEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setTitle("<a:starpurplehover:905575054161641483> Reminder gift! <a:starpurplehover:905575054161641483>")
            .setDescription(reminderDescription+`\n\n**From** ${message.member.user.tag}`)
            .setFooter("Celestial Starbot auto reminders")
            .setTimestamp();

        let remindersMod = await remindersModel.create({
            userID: userId,
            description: reminderEmbed.description,
            date: Date.now()+time+3000
        });
        remindersMod.save()

        setTimeout(()=>{reminder(userId, remindersMod)}, time+3000);

        function reminder (userID, reminderData) {
            let memberTargetFunction = message.guild.members.cache.get(userID);
            client.users.cache.get(memberTargetFunction.user.id).send({ embeds: [reminderEmbed] }).catch((err) => console.log("Reminder failed: "+err));
            reminderData.delete()
        }

        message.channel.send(`Will remind **${user.nickname?user.nickname:user.user.username}** in ${args[1]}.`)
    }
}