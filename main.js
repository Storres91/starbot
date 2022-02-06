const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_INTEGRATIONS"] })
require('dotenv').config();



client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler', 'dbLogin'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.discordTOKEN);
client.dbLogin();