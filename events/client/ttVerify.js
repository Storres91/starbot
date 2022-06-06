const { ROLES } = require('../../server-config.json')
const { hasAnyOfRoles, hasAllOfRoles } = require('../../utils/permsManager.js')

const ALL_ROLES = [ROLES.TT1, ROLES.TT2_19, ROLES.TT20P, ROLES.MB500_1500, ROLES.MB1500P, ROLES.MB_GODLY]

module.exports = {
    name: 'ttVerify',
    async execute(message, Discord) {
        const args = message.content.split()
        if (!(message.content.toLowerCase().startsWith('rpg p') || message.content.toLowerCase().startsWith('rpg progress'))) return 
        if (args[2] && args[2]!='s') return message.channel.send("Do not try to check other people profiles.")

        const ttEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d');

        const invalidProfileEmbed = new Discord.MessageEmbed()
            .setTitle("Different Background Detected")
            .setDescription("Hi, I can only read the **Default ERPG Background**.\nDo `rpg bg default` and `rpg p` again!\n")
            .setColor("#b5359d");
        

        const filter = (m) => m.author.id === '555955826880413696';
        const collector = new Discord.MessageCollector(message.channel, { filter, time: 30000 });
        let ttCount
        collector.on('collect', m => {
            if (m.attachments.size != 0) {
                m.reply({embeds:[invalidProfileEmbed]})
                collector.stop();
                return;
            }
            try {
                ttCount = m.embeds[0].fields[0].value.split(' ').slice(-1).join();
                ttCount = parseInt(ttCount)
                
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

            } else if (ttCount > 2 && ttCount < 3) {
                rolesToGive = [ROLES.TT2_19, ROLES.MB500_1500, ROLES.MB1500P]

            }else if (ttCount >=3  && ttCount < 20) {
                rolesToGive = [ROLES.TT2_19, ROLES.MB500_1500, ROLES.MB1500P, ROLES.MB_GODLY]

            } else {
                rolesToGive = [ROLES.TT20P, ROLES.MB500_1500, ROLES.MB1500P, ROLES.MB_GODLY]

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

            collector.stop();
        });
    }
}