const {isAllowed} = require('../utils/CommandPermissions.js');
const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'mychannel',
    description: 'Displays your channel',
    aliases: ['mine'],
    async execute(client, message, args, Discord) {
        const PHRASES = ['Quick tp to your channel!', 'Were you looking for this?', 'I think this one belongs to you...', 'All yours!', 'Ummm...here it is?', 'FAST, GET OUT OF HERE! →'];
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