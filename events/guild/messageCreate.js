const blacklistedModel = require('../../models/blacklistedSchema.js')
const server = require('../../server-config.json')
const permsManager = require('../../utils/permsManager.js')

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
        if(message.author.id == '555955826880413696' && message.embeds[0]){
            if(message.embeds[0].fields[0]?.value.toLowerCase().startsWith('type') || message.embeds[0].fields[0]?.name.toLowerCase().startsWith('type') || message.embeds[0].fields[0]?.name.toLowerCase().startsWith('use')) return client.emit('erpgEvent', client, message, Discord)
        }
        
        
        if (message.author.bot) return;
        
        //---------Normal triggers---------//
        if (message.channel.id == '861324842561568768') return client.emit('ttVerify', message, Discord);
        if (message.content.toLowerCase().startsWith("?ban") && message.channel.id == '851078982945210409') return message.channel.send("<a:bg_starrollwhite:929572216578924615> Remember to check for any alts.");
        if (message.channel.id == '851685203281838081') return client.users.fetch('230120935804370944').then(user=>user.send(`Someone just sent a message in <#${message.channel.id}>`))
        
        if ((message.content.toLowerCase().startsWith("?ml") || 
            message.content.toLowerCase().startsWith("?modlog") || 
            message.content.toLowerCase().startsWith("?info") || 
            message.content.toLowerCase().startsWith("?i")) && 
            message.channel.id == '851078982945210409') return message.channel.send("<a:bg_starrollwhite:929572216578924615> Remember to check for `?notes`.")


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
            if (command) command.execute(client, message, args, Discord, server, permsManager);
        } catch (err) {
            console.log(err);
        }


    }
}