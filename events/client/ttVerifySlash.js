const { ROLES } = require('../../server-config.json')
const { hasAnyOfRoles, hasAllOfRoles } = require('../../utils/permsManager.js')

const ALL_ROLES = [ROLES.TT1, ROLES.TT2_19, ROLES.TT20P, ROLES.MB500_1500, ROLES.MB1500P, ROLES.MB_GODLY]

module.exports = {
    name: 'ttVerifySlash',
    async execute(message, Discord) {
        if (message.interaction.commandName != "profile" || message.author.id != "555955826880413696") return 
        let authorUsername = (message.embeds[0].author.name.split(" "))[0]
        if(authorUsername != message.interaction.user.username) return message.reply("Do not attempt to use other people's profiles.");

        const ttEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d');

        const invalidProfileEmbed = new Discord.MessageEmbed()
            .setTitle("Different Background Detected")
            .setDescription("Hi, I can only read the **Default ERPG Background**.\nDo `<@555955826880413696> bg default` and `<@555955826880413696> p` again!\n")
            .setColor("#b5359d");
        
        let ttCount
            if (message.attachments.size != 0) {
                message.reply({embeds:[invalidProfileEmbed]})
                return;
            }
            try {
                ttCount = message.embeds[0].fields[0].value.split(' ').slice(-1).join();
                ttCount = parseInt(ttCount)

                if(message.embeds[0].fields[0].value.split(' ').length < 8) ttCount = 0
                
            } catch (error) {
                return message.channel.send("Unknown error please try again or inform a staff member.")
            }


            let actionSummary = `<a:cr_pinkrollingstar:865266644346863636> You have **${ttCount} Time Travels**. \n\n`;

            //Determine role to be given
            let rolesToGive;

            if (ttCount == 0) {
                actionSummary = "<a:cr_pinkrollingstar:865266644346863636> You don't have any Time Travels\n\nPlease come back when you have time traveled at least 1 time."
                ttEmbed.setDescription(actionSummary);
                message.reply({ embeds: [ttEmbed] });
                return;

            } else if (ttCount == 1) {
                rolesToGive = [ROLES.TT1]

            } else if (ttCount >= 2 && ttCount < 3) {
                rolesToGive = [ROLES.TT2_19, ROLES.MB500_1500, ROLES.MB1500P]

            }else if (ttCount >=3  && ttCount < 20) {
                rolesToGive = [ROLES.TT2_19, ROLES.MB500_1500, ROLES.MB1500P, ROLES.MB_GODLY]

            } else if (ttCount>= 20){
                rolesToGive = [ROLES.TT20P, ROLES.MB500_1500, ROLES.MB1500P, ROLES.MB_GODLY]

            } else{
                return message.channel.send("Unable to read, please contact staff.")
            }

            //Give roles
            actionSummary = actionSummary + '**Adding Roles:**\n';

            for (let role of rolesToGive){
                actionSummary = actionSummary + `**+** <@&${role}>\n`;
                
                if(hasAnyOfRoles(message.member, [role])) continue
                message.member.roles.add(role)
            }
            

            //Determine roles to remove
            const rolesToRemove = [];
            for(let role of ALL_ROLES) {
                if (rolesToGive.indexOf(role) == -1) rolesToRemove.push(role)
            }

            //Remove roles
            if(hasAnyOfRoles(message.member, rolesToRemove)){
                actionSummary = actionSummary + '\n**Removing roles:**\n';

                for (let role of rolesToRemove){
                    if(!hasAnyOfRoles(message.member, [role])) continue

                    message.member.roles.remove(role)
                    actionSummary = actionSummary + `**-** <@&${role}>\n`;
                }
            }


            actionSummary = actionSummary + `\nTo remove any of these roles react in <#811753198897332245>`

            ttEmbed.setDescription(actionSummary);
            message.reply({ embeds: [ttEmbed] })
    }
}