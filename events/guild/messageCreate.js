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

        //---------Bot triggers-----------//
        //Giveaway reminders
        const reminderChannels = ['859527785738141716', '862321500471427072', '851104820336001084', '873745846150266900']
        if(reminderChannels.indexOf(message.channel.id) > -1 && message.author.id == '530082442967646230') return client.emit('reminderCreate', client, message, Discord)


        if (message.author.bot) return;
        //Add triggers below this line
        if (message.content.toLowerCase().startsWith("?ban") && message.channel.id == '851078982945210409') return message.channel.send("<a:bg_starrollwhite:929572216578924615> Remember to check for any alts.");


        if (!message.content.toLowerCase().startsWith(prefix)) return;
        if (message.channel.type == 'dm') return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

        if (!command) return;
        if (blacklistedData) {
            if (blacklistedData.blStatus) return message.channel.send('You are blacklisted from the bot');
        }
        try {
            if (command) command.execute(client, message, args, Discord);
        } catch (err) {
            console.log(err);
        }


    }
}