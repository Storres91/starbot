const ms = require('ms');
module.exports = {
    name: 'slowmode',
    description: 'this is a ping command',
    aliases: ['slowmo', 'slow'],
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';

        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID) || message.channel.permissionsFor(message.member).has('MANAGE_CHANNELS')) {}
        else return message.channel.send("You can't use this here, `Manage Channel` permission is required to set slowmode.");

        if (message.channel.rateLimitPerUser > 0) {
            message.channel.setRateLimitPerUser(0);
            message.channel.send("Slowmode was already on, turned it off. <a:bg_catyes:927728342331949056>")
        }
        else {
            if (!args[0]) return message.channel.send(":x: You have to specify the duration.")

            let slowmoTime = args.slice(0, 2).join(' ');
            let slowmoMsg = slowmoTime;
            slowmoTime = ms(slowmoTime) / 1000;
            
            if (isNaN(slowmoTime)) return message.channel.send(":x: That's not a valid time format `Ex. 10s or 10 seconds`.")

            if (slowmoTime < 3 || slowmoTime > 30) return message.channel.send(":x: The limit to slowmode for this command is 3s to 30s.")
            message.channel.setRateLimitPerUser(slowmoTime);
            message.channel.send("Done! Set this channel slowmode to " + slowmoMsg + ". <a:bg_catyes:927728342331949056>");

        }

    }
}