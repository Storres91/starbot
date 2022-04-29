const {isAllowed} = require('../utils/permsManager.js')

module.exports = {
    name: 'changeicon',
    description: 'Changes the icon of the role',
    aliases: [],
    async execute(client, message, args, Discord, server) {
        const userRoleId = args[0];
        let userRole, iconUrl, emojiId;

        if (!isAllowed({member: message.member, roles:[server.ROLES.MOD, server.ROLES.ADMIN], users: ['535176301682622474'] })) return message.channel.send("You are not allowed to use this command.")

        //Get the icon
        if(message.attachments.size == 0 && !args[1]) return message.channel.send("You have to either attach the image for your icon or add it in the command:\n<a:bg_starrollwhite:929572216578924615> Correct usage: `sb changeicon <roleID> <emoji/url>`")

        if (message.attachments.size != 0) {
            iconUrl = message.attachments.first().url;

        } else if (message.content.match(/<a:.+:\d+>/) != null) {
            emojiId = ((message.content.match(/<a:.+:\d+>/)) + "").match(/\d+/) + "";
            iconUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;

        } else if(message.content.match(/<:.+:\d+>/) != null) {
            emojiId = ((message.content.match(/<:.+:\d+>/)) + "").match(/\d+/) + "";
            iconUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
        } else {
            iconUrl = args[1];
        }

        //Get role from id and change icon
        userRole = await message.guild.roles.fetch(userRoleId);
        try{
            await userRole.setIcon(iconUrl);
        }catch(err){
            console.log(`Couldn't change the role icon for ${message.author.id}, error: ${err}`);

            if(err.message.includes("ENOENT")) return message.channel.send(`Sorry, I was not able to change this icon, couldn't find \`"${args[0]}"\`\n<a:bg_starrollwhite:929572216578924615> Make sure the url is correct.`);
            if(err.message.includes("Invalid Form Body")) return message.channel.send(`Sorry, I was not able to change this icon, that is not a valid image.\n<a:bg_starrollwhite:929572216578924615> File cannot be larger than 256kb`);

            return message.channel.send("Sorry, I was not able to change this icon (unknown error), please ask staff for help.");
        }
        
        message.channel.send("Successfully changed this role's icon!")
        
    }
}