const favoritesModel = require('../models/favoritesSchema.js');
const { transformToId } = require('../utils/targets.js');

module.exports = {
    name: 'favorites',
    description: 'List of favorite channels',
    aliases: ['fav','favorite',],
    async execute(client, message, args, Discord, server) {
        let favoritesData;
        try {
            favoritesData = await favoritesModel.findOne({ userID: message.author.id });
        } catch (err) {
            console.log(`Error getting favoritesData at fav command ${err}`)
        }

        if (!args[0]) args[0] = 'show';
        if (args[0].toLowerCase() != 'add' && !favoritesData) return message.channel.send('You haven\'t added any channels to your favorite list.\n<a:bg_starrollwhite:929572216578924615> Add one with `sb fav add <#channel/ID>`')

        let chnID; 
        

        switch (args[0].toLowerCase()) {
            case 'add':
                if (!args[1]) return message.channel.send('You must include the channel or id to add. `sb fav add <#channel/ID>`') 
                
                chnID = transformToId(args[1])
                if (isNaN(chnID)) return message.channel.send(args[1]+' is not a valid channel.')

                if (!favoritesData){
                    createRegister(chnID);
                    showList();
                } else {
                    addChannel(chnID); 
                    showList();
                } 
                
                

                break;

            case 'remove':
                if (!args[1]) return message.channel.send('You must include the channel or id to remove. `sb fav remove <#channel/ID>`')
                chnID = transformToId(args[1])
                if (isNaN(chnID)) return message.channel.send(args[1]+' is not a valid channel.')
                
                removeChannel(chnID)
                showList()
                
                break;
            
            default:
                showList();

                break;
        }

        async function createRegister(channelID){
            try {
                let favoritesMod = await favoritesModel.create({
                    userID: message.author.id,
                    channels: [channelID]
                });
                favoritesMod.save();
    
            } catch (error) {
                message.channel.send("Error adding to database, report to Noxet (Noxxy).")
            }
            message.channel.send(`Successfully created your favorites list and added <#${channelID}>`)
        }

        function addChannel(channelID){
            if(favoritesData.channels.length > 14) return message.channel.send('<a:bg_starrollwhite:929572216578924615> Sorry, you are only allowed to add a maximum of 15 channels to your favorite list.')
            if (favoritesData.channels.indexOf(channelID) > -1) return message.channel.send(`<#${channelID}> is already in your favorites list.`)
            favoritesData.channels.push(channelID);
            favoritesData.save();
            message.channel.send(`Successfully added <#${channelID}> to your favorites.`)
        }

        function removeChannel(channelID){
            let index = favoritesData.channels.indexOf(channelID);
            if (index == -1) return message.channel.send(`I did not find this channel in your favorites list.`)
            favoritesData.channels.splice(index, 1);
            favoritesData.save();
            message.channel.send(`Successfully removed <#${channelID}> from your favorites.`)
        }

        function showList(){
            const listEmbed = new Discord.MessageEmbed()
                .setTitle(`${message.member.nickname?message.member.nickname:message.member.user.username}'s favorites list`)
                .setDescription(favoritesData.channels.map(ch => `<#${ch}>`).join('\n '))
                .setColor('#b5359d')
                .setFooter('Celestial Realm\'s favorites list')
                .setTimestamp()

            message.channel.send({embeds:[listEmbed]})
        }


    }
}