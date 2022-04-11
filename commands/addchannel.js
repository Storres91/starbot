const channelDataModel = require('../models/channelDataSchema.js');

module.exports = {
    name: 'addchannel',
    description: 'Adds a channel to the database',
    aliases: [''],
    async execute(client, message, args, Discord) {
        const STAFF_ROLE_ID = '857060867676831805';
        let targetChannel;
        const channelOwnersList = args.slice(0, -1).map(owner=>owner.replace(/[^0-9]/g,''));

        if (!message.member.roles.cache.some(role => role.id == STAFF_ROLE_ID)) return
        if (args.length < 2) return message.channel.send("Incorrect syntax, do sb addchannel <owner1_Id> <owner2_Id> <ownerX_Id> <channel_Id>")
        
        //Check owners
        for(let owner of channelOwnersList) {
            let user = await message.guild.members.fetch(owner).catch(() => false);
            if (!user) return message.channel.send(`${owner} is not a valid user id or wasn't found in the server.`)

            //Check if any of users is already in db
            let channelDataPrev;
            try {
                channelDataPrev = await channelDataModel.findOne({ owners: user.id });
            } catch (err) {
                console.log(`Error getting channelData ${err}`)
            }

            if(channelDataPrev) return message.channel.send(`${user.id} is already in the database added in <#${channelDataPrev.channelID}>`)
        }

        // Target channel
        if (message.mentions.channels.first()) {
            targetChannel = message.mentions.channels.first();
        }
        else {
            targetChannel = await message.guild.channels.fetch(args.slice(-1)).catch(() => false);
        }
        if (!targetChannel) return message.channel.send(args.slice(-1) + " is not a valid channel id.");

        //Check if channel is already in db
        let channelDataPrev;
        try {
            channelDataPrev = await channelDataModel.findOne({ channelID: targetChannel.id });
        } catch (err) {
            console.log(`Error getting channelData ${err}`)
        }

        if(channelDataPrev) return message.channel.send(`This channel is already in the database with these owners: ${channelDataPrev.owners}`)

        
        //Add to db
        try {
            let channelDataMod = await channelDataModel.create({
                channelID: targetChannel.id,
                owners: channelOwnersList,
            });
            channelDataMod.save();

        } catch (error) {
            message.channel.send("Error adding to database, report to nox.")
        }

        message.channel.send(`Successfully added <#${targetChannel.id}> to the database. \nOwners: ${channelOwnersList}`)
        
    }
}