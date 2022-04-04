const {isAllowed} = require('../utils/CommandPermissions.js');
const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'mychannel',
    description: 'Displays your channel',
    aliases: ['mine', 'mych'],
    async execute(client, message, args, Discord) {
        const PHRASES = [
            'Quick tp to your channel! <:cr_mmblush:874865113071513620>', 
            'Were you looking for this? <:cr_kannamagnify:853385258355654687>', 
            'I think this one belongs to you... <:cr_pikathink:856247027854999583>', 
            'All yours! <:cr_pikacool:859169809202675762>', 
            'Ummm...here it is? <:cr_ummthinking:889681511639568454>', 
            'FAST, GET OUT OF HERE! <:cr_nervge:856683391214157824> →', 
            'Let\'s get on your spaceship! <:cr_ummyayy:889681652589137920>', 
            'Lieutenant, welcome onboard! <:cr_salutepepe:886140835329110027>', 
            'Oops, you dropped your channel here... <:cr_dumdum:890502413956562945>'
                    ];
        const random = Math.floor(Math.random() * PHRASES.length);

        if (!isAllowed({message, roles: ['CHANNEL_OWNER']})) return message.channel.send("You don't have a channel here <:cr_pepesweetsadness:851548493264322580>")

        let channelData;
        try {
            channelData = await channelDataModel.findOne({owners:message.author.id});

        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }

        if(!channelData) return message.channel.send("Sorry, you channel hasn't been added to the database <:cr_pepesweetsadness:851548493264322580>\nPlease inform a staff member and we will happily add it *ASAP*.")
        message.channel.send(`${PHRASES[random]} <#${channelData.channelID}>`)
    }
}