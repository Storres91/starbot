const channelDataModel = require('../models/channelDataSchema.js');
const eventsModel = require('../models/eventsSchema.js');

module.exports = {
    name: 'evtoggle',
    description: 'Toggle erpg event trigger',
    aliases: ['eventtoggle'],
    async execute(client, message, args, Discord, server) {
        let channelData;
        try {
            channelData = await channelDataModel.findOne({ owners: message.author.id });
        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }

        if(!channelData) return message.channel.send("You do not own a channel.")

        let eventData;
        try {
            eventData = await eventsModel.findOne({ channelID: channelData.channelID });
        } catch (err) {
            console.log(`Error getting eventsData ${err}`)
        }

        if(eventData)eventData.trigger = !eventData.trigger; 
        else{
            try {
                eventData = await eventsModel.create({
                    userID: message.author.id,
                    channelID: channelData.channelID,
                    trigger: false
                });
    
            } catch (error) {
                message.channel.send("Error toggling event trigger, report to Noxet (Noxxy).")
            }
        }
        eventData.save()
        message.channel.send(`Successfully set auto event trigger in <#${channelData.channelID}> to **${eventData.trigger}**`)
    }
}