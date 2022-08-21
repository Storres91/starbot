const { hasAnyOfRoles } = require("../utils/permsManager.js")
const templateDataModel = require("../models/templateSchema.js");
const mbManager = require("../utils/mbManager.js");

module.exports = {
    name: 'mb',
    description: 'Mb manager',
    aliases: [''],
    async execute(client, message, args, Discord, server) {
        //if(!hasAnyOfRoles(message.member, [server.ROLES.MB_HOST]) || message.channel.id != server.CHANNELS.MB_MANAGERS) return message.channel.send(`You must be a mb host and use this command in <#${server.CHANNELS.MB_MANAGERS}>`)
        if(message.author.id != '313351494361677845') return
        let templateData;
        try {
            templateData = await templateDataModel.findOne({ hostId: message.author.id });
        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }

        if(!templateData) return mbManager.createTemplate(message);
        
        switch (args[0]) {
            case 'start':
                //start mb method
                break;

            case 'edit':
                mbManager.editTemplate(message);
                break;
        
            default:
                mbManager.showTemplate(message, templateData);
                break;
        }
    }
}