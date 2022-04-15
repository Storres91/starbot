const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'checkdb',
    description: 'Checks the database for a certain channel or user',
    aliases: ['check', 'chcheck', 'search'],
    async execute(client, message, args, Discord) {
        const STAFF_ROLE_ID = '857060867676831805';
        let targetChannel, targetUser, fetchedOwners = [];
        var messageEmbed = new Discord.MessageEmbed()
            .setColor('#b5359d')
            .setFooter(`Requested by ${message.member.user.username}`)
            .setTimestamp();

        if (!message.member.roles.cache.some(role => role.id == STAFF_ROLE_ID)) return
        if (args.length < 1) return message.channel.send("Incorrect syntax, you have to mention or write the id of a channel or user.")

        // Target channel
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args[0]).catch(() => false);
        }

        //If not channel then target user
        if (!targetChannel){
            if(message.mentions.users.first()){
                targetUser = message.mentions.users.first();
            }
            else{
                targetUser = await message.guild.members.fetch(args[0]).catch(() => null);
            }
            if (!targetUser) return message.channel.send(`\`${args[0]}\` is not a valid user or channel id.`);
        }

        //Check if register is in db
        let channelData;
        try {
            channelData = await channelDataModel.findOne( targetChannel ? ({channelID:targetChannel.id}) : ({owners:targetUser.id})  );

        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }

        if(!channelData) {
            if(targetChannel) return message.channel.send(`Channel <#${targetChannel.id}> was not found in the database.`)
            else return message.channel.send(`User \`${targetUser.id}\` was not found in the database.`)

        }

        for (let user of channelData.owners){
            let owner;
            try {
                owner = await message.guild.members.fetch(user);
            } catch (error) {
                //If user not found, remove from register
                // let index = channelData.owners.indexOf(user);
                // channelData.owners.splice(index, 1);
                // channelData.save();

                //If user not found, skip
                message.channel.send(`I have skipped this ID from this register since I was not able to find that user in the server. \`${user}\``)
                continue
            }
            fetchedOwners.push(owner)
        }
        //Display data
        let channel = await message.guild.channels.fetch(channelData.channelID)


        messageEmbed.setTitle("Requested data")
            .setDescription(`**Channel**\n<#${channelData.channelID}>\nCreated at <t:${channel?channel.createdTimestamp.toString().slice(0, -3):null}:D>\n\n**Owners**\n${fetchedOwners.map(owner => `<@${owner.user.id}> (${owner.user.username}#${owner.user.discriminator}) ${owner.roles.cache.some(role => role.id == '855961500702736414')?'**ALT**':''}`).join('\n')}`)

        message.channel.send({embeds: [messageEmbed]})
        

    }
}