const blacklistedModel = require('../../models/blacklistedSchema.js')
module.exports = {
    async execute(message, client, Discord) {
        const prefix = 'sb ';

        let blacklistedData;
        try {
            blacklistedData = await blacklistedModel.findOne({ blUserID: String(message.author.id) });
        } catch (err) {
            console.log(`Error getting blacklistedData ${err}`)
        }

        
        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
        if (message.channel.type == 'dm') return;
        
        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd);

        if (!command) return;
        if (blacklistedData){
            if (blacklistedData.blStatus) return message.channel.send('You are blacklisted from the bot');}
        try {
            if (command) command.execute(client, message, args, Discord);
        } catch (err) {
            console.log(err);
        }


    }
}